import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { JAccessGroup } from '@src/app/core/_models/access-group.model';
import { JGlobalPermissionGroup } from '@src/app/core/_models/global-permission-group.model';
import { JUser } from '@src/app/core/_models/user.model';
import { ResponseWrapper } from '@src/app/core/_models/response.model';

import { AlertService } from '@src/app/core/_services/shared/alert.service';
import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';
import { GlobalService } from '@src/app/core/_services/main.service';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { SERV } from '@src/app/core/_services/main.config';
import { UIConfigService } from '@src/app/core/_services/shared/storage.service';
import { UnsubscribeService } from '@src/app/core/_services/unsubscribe.service';

import { USER_AGP_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { transformSelectOptions } from '@src/app/shared/utils/forms';
import { uiDatePipe } from '@src/app/core/_pipes/date.pipe';

import {
  EditUserForm,
  UpdatePassForm,
  getEditUserForm,
  getUpdatePassForm
} from '@src/app/users/edit-users/edit-user.form';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  providers: [uiDatePipe]
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
  selectGlobalPermissionGroups: JGlobalPermissionGroup[];

  /** Select Options Mapping */
  selectUserAgpMap = {
    fieldMapping: USER_AGP_FIELD_MAPPING
  };

  /** User Access Group Permissions. */
  userAgps: JAccessGroup[];

  // Edit Configuration
  editedUserIndex: number;
  editedUser: JUser; // Change to Model

  // Password validation
  strongPassword = false;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private uiService: UIConfigService,
    private route: ActivatedRoute,
    private datePipe: uiDatePipe,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.onInitialize();
    this.buildForm();
    titleService.set(['Edit User']);
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
        this.userAgps = transformSelectOptions(user.accessGroups, this.selectUserAgpMap);
      });

    this.unsubscribeService.add(loaduserAGPSubscription$);

    const loadAGPSubscription$ = this.gs
      .getAll(SERV.ACCESS_PERMISSIONS_GROUPS)
      .subscribe((response: ResponseWrapper) => {
        this.selectGlobalPermissionGroups = new JsonAPISerializer().deserialize<JGlobalPermissionGroup[]>({
          data: response.data,
          included: response.included
        });
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
        .subscribe(() => {
          this.alert.okAlert('User saved!', '');
          this.isUpdatingLoading = false;
          this.updateForm.reset(); // success, we reset form
          this.updatePassForm.reset();
          this.router.navigate(['users/all-users']);
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
    this.alert.deleteConfirmation('', 'Users').then((confirmed) => {
      if (confirmed) {
        // Deletion
        const onDeleteSubscription$ = this.gs.delete(SERV.USERS, this.editedUserIndex).subscribe(() => {
          // Successful deletion
          this.alert.okAlert(`Deleted User`, '');
          this.router.navigate(['/users/all-users']);
        });
        this.unsubscribeService.add(onDeleteSubscription$);
      } else {
        // Handle cancellation
        this.alert.okAlert(`User is safe!`, '');
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
    const setpass = String(val['password']).length;
    if (val['password']) {
      const payload = {
        password: val['password'],
        userId: this.editedUserIndex
      };
      const onUpdatePasswordSubscription$ = this.gs.chelper(SERV.HELPER, 'setUserPassword', payload).subscribe();
      this.unsubscribeService.add(onUpdatePasswordSubscription$);
    }
  }

  /**
   * Handles the change in password strength.
   *
   * @param event - A boolean indicating the strength of the password.
   *   - `true`: Password is strong.
   *   - `false`: Password is not strong.
   */
  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }
}
