import { finalize } from 'rxjs';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JGlobalPermissionGroup } from '@models/global-permission-group.model';
import { ResponseWrapper } from '@models/response.model';
import { JUser } from '@models/user.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { DEFAULT_FIELD_MAPPING, USER_AGP_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { uiDatePipe } from '@src/app/core/_pipes/date.pipe';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';
import {
  EditUserForm,
  UpdatePassForm,
  getEditUserForm,
  getUpdatePassForm
} from '@src/app/users/edit-users/edit-user.form';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  providers: [uiDatePipe],
  standalone: false
})
export class EditUsersComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for edit User. */
  updateForm: FormGroup<EditUserForm>;
  updatePassForm: FormGroup<UpdatePassForm>;

  /** On form update show a spinner loading */
  isUpdatingLoading = false;

  /** Select List of Global Permission Groups. */
  selectGlobalPermissionGroups: SelectOption[];

  /** User Access Group Permissions. */
  selectUserAgps: SelectOption[];

  // Edit Configuration
  editedUserIndex: number;
  editedUserName: string;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private datePipe: uiDatePipe,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private confirmDialog: ConfirmDialogService
  ) {
    this.onInitialize();
    this.buildForm();
    this.titleService.set(['Edit User']);
  }

  /**
   * Initializes the component by extracting and setting the user ID,
   */
  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedUserIndex = +params['id'];
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Builds the forms for editing a user.
   */
  buildForm(): void {
    this.updateForm = getEditUserForm();
    this.updatePassForm = getUpdatePassForm();
  }

  /**
   * Loads data, user data and select options for the component.
   */
  loadData(): void {
    const params = new RequestParamBuilder().addInclude('accessGroups').create();
    const loaduserAGPSubscription$ = this.gs
      .get(SERV.USERS, this.editedUserIndex, params)
      .subscribe((response: ResponseWrapper) => {
        const user = new JsonAPISerializer().deserialize<JUser>({ data: response.data, included: response.included });
        this.selectUserAgps = transformSelectOptions(user.accessGroups, USER_AGP_FIELD_MAPPING);
        this.editedUserName = user.name;
      });

    this.unsubscribeService.add(loaduserAGPSubscription$);

    const loadAGPSubscription$ = this.gs
      .getAll(SERV.ACCESS_PERMISSIONS_GROUPS)
      .subscribe((response: ResponseWrapper) => {
        const globalPermissionGroups = new JsonAPISerializer().deserialize<JGlobalPermissionGroup[]>({
          data: response.data,
          included: response.included
        });
        this.selectGlobalPermissionGroups = transformSelectOptions(globalPermissionGroups, DEFAULT_FIELD_MAPPING);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
    this.unsubscribeService.add(loadAGPSubscription$);

    this.initForm();
  }

  /**
   * Initializes the form with user data retrieved from the server.
   */
  initForm() {
    const params = new RequestParamBuilder().addInclude('globalPermissionGroup').create();
    const loadSubscription$ = this.gs
      .get(SERV.USERS, this.editedUserIndex, params)
      .subscribe((response: ResponseWrapper) => {
        const user = new JsonAPISerializer().deserialize<JUser>({ data: response.data, included: response.included });

        this.updateForm.setValue({
          id: user.id,
          name: user.name,
          email: user.email,
          registered: this.datePipe.transform(user.registeredSince),
          lastLogin: this.datePipe.transform(user.lastLoginDate),
          globalPermissionGroup: user.globalPermissionGroup,
          updateData: {
            globalPermissionGroupId: user.globalPermissionGroupId,
            isValid: user.isValid
          }
        });
      });
    this.unsubscribeService.add(loadSubscription$);
  }

  /**
   * Handles the form submission for updating user data.
   * If the form is valid, it triggers the update process and navigates to the user list.
   */
  onSubmit() {
    if (this.updateForm.valid) {
      this.isUpdatingLoading = true;
      this.onUpdatePass(this.updatePassForm.value);

      const onSubmitSubscription$ = this.gs
        .update(SERV.USERS, this.editedUserIndex, this.updateForm.value.updateData)
        .pipe(finalize(() => (this.isUpdatingLoading = false)))
        .subscribe(() => {
          this.updateForm.reset(); // success, we reset form
          this.updatePassForm.reset();
          this.router
            .navigate(['users/all-users'])
            .then(() => this.alert.showSuccessMessage(`User ${this.editedUserName} successfully updated`));
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }

  /**
   * Handles the deletion of a user.
   * Displays a confirmation dialog and, if confirmed, triggers the deletion process.
   * If the deletion is successful, it navigates to the user list.
   */
  onDelete() {
    this.confirmDialog.confirmDeletion('user', this.editedUserName).subscribe((confirmed) => {
      if (confirmed) {
        this.unsubscribeService.add(
          this.gs.delete(SERV.USERS, this.editedUserIndex).subscribe(() => {
            this.router
              .navigate(['/users/all-users'])
              .then(() => this.alert.showSuccessMessage(`Successfully deleted the user: ${this.editedUserName}`));
          })
        );
      }
    });
  }

  /**
   * Updates the user's password.
   * If a new password is provided, it sends a request to change the password for the user identified by `editedUserIndex`.
   * The password must be at least one character long.
   *
   * @param val - An object containing the new password information.
   */
  onUpdatePass(val: FormGroup<UpdatePassForm>['value']) {
    if (val['password']) {
      const payload = {
        password: val['password'],
        userId: this.editedUserIndex
      };
      const onUpdatePasswordSubscription$ = this.gs.chelper(SERV.HELPER, 'setUserPassword', payload).subscribe();
      this.unsubscribeService.add(onUpdatePasswordSubscription$);
    }
  }
}
