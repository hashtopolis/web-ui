import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { USER_AGP_FIELD_MAPPING } from 'src/app/core/_constants/select.config';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { environment } from 'src/environments/environment';
import { uiDatePipe } from 'src/app/core/_pipes/date.pipe';
import { SERV } from '../../core/_services/main.config';
import { User } from '../user.model';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { ChangeDetectorRef } from '@angular/core';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { ListResponseWrapper } from 'src/app/core/_models/response.model';
import { OnDestroy } from '@angular/core';
import { transformSelectOptions } from 'src/app/shared/utils/forms';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  providers: [uiDatePipe]
})
export class EditUsersComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for edit User. */
  updateForm: FormGroup;
  updatePassForm: FormGroup;

  /** On form update show a spinner loading */
  isUpdatingLoading = false;

  /** Select List of Access Group Permissions. */
  selectAgp: any;

  /** Select Options Mapping */
  selectUserAgpMap = {
    fieldMapping: USER_AGP_FIELD_MAPPING
  };

  /** User Access Group Permissions. */
  userAgps: any;

  // Edit Configuration
  editedUserIndex: number;
  editedUser: any; // Change to Model

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
   * Builds the form for editing a user.
   */
  buildForm(): void {
    this.updateForm = new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      name: new FormControl({ value: '', disabled: true }),
      email: new FormControl({ value: '', disabled: true }),
      registered: new FormControl({ value: '', disabled: true }),
      lastLogin: new FormControl({ value: '', disabled: true }),
      globalPermissionGroup: new FormControl({ value: '', disabled: true }),
      updateData: new FormGroup({
        globalPermissionGroupId: new FormControl(''),
        isValid: new FormControl('')
      })
    });

    this.updatePassForm = new FormGroup({
      password: new FormControl()
    });
  }

  /**
   * Loads data, user data and select options for the component.
   */
  loadData(): void {
    const loaduserAGPSubscription$ = this.gs
      .get(SERV.USERS, this.editedUserIndex, { expand: 'accessGroups' })
      .subscribe((response: ListResponseWrapper<any>) => {
        const transformedOptions = transformSelectOptions(
          response['accessGroups'],
          this.selectUserAgpMap
        );
        this.userAgps = transformedOptions;
      });

    this.unsubscribeService.add(loaduserAGPSubscription$);

    const loadAGPSubscription$ = this.gs
      .getAll(SERV.ACCESS_PERMISSIONS_GROUPS)
      .subscribe((response: ListResponseWrapper<any>) => {
        this.selectAgp = response.values;
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
    const loadSubscription$ = this.gs
      .get(SERV.USERS, this.editedUserIndex)
      .subscribe((response) => {
        this.updateForm = new FormGroup({
          id: new FormControl({ value: response['id'], disabled: true }),
          name: new FormControl({ value: response['name'], disabled: true }),
          email: new FormControl({ value: response['email'], disabled: true }),
          registered: new FormControl({
            value: this.datePipe.transform(response['registeredSince']),
            disabled: true
          }),
          lastLogin: new FormControl({
            value: this.datePipe.transform(response['lastLoginDate']),
            disabled: true
          }),
          globalPermissionGroup: new FormControl({
            value: response['globalPermissionGroup'],
            disabled: true
          }),
          updateData: new FormGroup({
            globalPermissionGroupId: new FormControl(
              response['globalPermissionGroupId']
            ),
            isValid: new FormControl(response['isValid'])
          })
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
        .update(
          SERV.USERS,
          this.editedUserIndex,
          this.updateForm.value.updateData
        )
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
        const onDeleteSubscription$ = this.gs
          .delete(SERV.USERS, this.editedUserIndex)
          .subscribe(() => {
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
   *   - `password` (string): The new password.
   */
  onUpdatePass(val: any) {
    const setpass = String(val['password']).length;
    if (val['password']) {
      const payload = {
        password: val['password'],
        userId: this.editedUserIndex
      };
      const onUpdatePasswordSubscription$ = this.gs
        .chelper(SERV.HELPER, 'setUserPassword', payload)
        .subscribe();
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
