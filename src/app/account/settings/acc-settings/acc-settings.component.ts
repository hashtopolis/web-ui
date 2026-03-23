import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { uiDatePipe } from 'src/app/core/_pipes/date.pipe';
import { GlobalService } from 'src/app/core/_services/main.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { JUser } from '@models/user.model';

import { SERV } from '@services/main.config';

import { changeOwnPasswordResponseSchema } from '@src/app/account/settings/acc-settings/acc-settings.schema';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { zUserResponse } from '@src/generated/api/zod.gen';
import { passwordMatchValidator } from '@src/app/core/_validators/password.validator';

export interface UpdateUserPassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
@Component({
  selector: 'app-acc-settings',
  templateUrl: './acc-settings.component.html',
  providers: [uiDatePipe],
  standalone: false
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  static readonly PWD_MIN = 4;
  static readonly PWD_MAX = 12;

  pwdMin = AccountSettingsComponent.PWD_MIN;
  pwdMax = AccountSettingsComponent.PWD_MAX;

  pageTitle = 'Account Settings';
  pageSubtitlePassword = 'Password Update';

  /** Form group for main form. */
  form: FormGroup;
  changepasswordFormGroup: FormGroup;

  /** On form update show a spinner loading */
  isUpdatingLoading = false;
  isUpdatingPassLoading = false;

  /**
   * Toggles for showing/hiding password fields in the form.
   * These are used to toggle visibility of the old, new, and confirm new password fields.
   * Hides the password input by default.
   * @type {boolean}
   */
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmNewPassword: boolean = false;

  /**
   * Array to hold subscriptions for cleanup on component destruction.
   * This prevents memory leaks by unsubscribing from observables when the component is destroyed.
   */
  subscriptions: Subscription[] = [];

  /**
   * FormControl reference for easier access to form controls.
   * This is used to access form controls in the template without needing to reference the entire form group.
   */
  protected readonly FormControl = FormControl;

  showPasswordForm: boolean = true;

  private titleService = inject(AutoTitleService);
  private datePipe = inject(uiDatePipe);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);

  constructor() {
    this.titleService.set(['Account Settings']);
  }
  /**
   * Initializes the form, loads user settings, and sets up initial data.
   */
  ngOnInit(): void {
    this.createForm();
    this.loadUserSettings();
    this.createUpdatePassForm();
  }

  /**
   * Unsubscribes from all active subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
  /**
   * Creates and configures basic controls
   */
  createForm(): void {
    this.form = new FormGroup({
      name: new FormControl({ value: '', disabled: true }), // disabled, no validators needed
      registeredSince: new FormControl({ value: '', disabled: true }), // disabled, no validators needed
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  createUpdatePassForm() {
    this.changepasswordFormGroup = new FormGroup(
      {
        oldPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(AccountSettingsComponent.PWD_MIN),
          Validators.maxLength(AccountSettingsComponent.PWD_MAX)
        ]),
        confirmNewPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(AccountSettingsComponent.PWD_MIN),
          Validators.maxLength(AccountSettingsComponent.PWD_MAX)
        ])
      },
      { validators: passwordMatchValidator() }
    );
  }

  get oldPasswordValueFromForm() {
    return this.changepasswordFormGroup.get('oldPassword').value;
  }
  get newPasswordValueFromForm() {
    return this.changepasswordFormGroup.get('newPassword').value;
  }
  get confirmNewPasswordValueFromForm() {
    return this.changepasswordFormGroup.get('confirmNewPassword').value;
  }

  /**
   * Resets the password form to its initial state.
   * This method clears all input fields and resets any validation errors.
   */
  resetPasswordForm() {
    this.changepasswordFormGroup.reset();
    this.showPasswordForm = false;
    setTimeout(() => (this.showPasswordForm = true));
  }

  /**
   * Handles form basic form submission
   */
  onSubmit() {
    if (this.form.valid) {
      this.isUpdatingLoading = true;
      this.subscriptions.push(
        this.gs.uhelper(SERV.HELPER, this.gs.userId, 'currentUser', this.form.value).subscribe({
          next: () => {
            this.alert.showSuccessMessage('User saved');
            this.isUpdatingLoading = false;
          },
          error: (err) => {
            console.error('Error updating user', err);
            this.isUpdatingLoading = false;
          }
        })
      );
    } else {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }

  /**
   * Handles password submission
   */
  onSubmitPass() {
    if (this.changepasswordFormGroup.pending) {
      return;
    }

    if (this.changepasswordFormGroup.invalid) {
      this.changepasswordFormGroup.markAllAsTouched();
      this.changepasswordFormGroup.updateValueAndValidity();
      return;
    }

    this.isUpdatingPassLoading = true;
    const payload: UpdateUserPassword = {
      oldPassword: this.oldPasswordValueFromForm,
      newPassword: this.newPasswordValueFromForm,
      confirmPassword: this.confirmNewPasswordValueFromForm
    };
    this.subscriptions.push(
      this.gs
        .chelper(SERV.HELPER, 'changeOwnPassword', payload)
        .pipe(
          map((r) => {
            const parseResult = changeOwnPasswordResponseSchema.safeParse(r);
            if (!parseResult.success) {
              console.error('Password change response validation failed', parseResult.error);
              this.alert.showErrorMessage('Unexpected response from server.');
              throw parseResult.error;
            }
            return parseResult.data;
          })
        )
        .subscribe({
          next: (val) => {
            this.alert.showSuccessMessage(val.meta['Change password']);
            this.isUpdatingPassLoading = false;
            this.resetPasswordForm();
          },
          error: () => {
            this.isUpdatingPassLoading = false;
          }
        })
    );
  }

  /**
   * Loads user settings from the server and populates the form with initial data.
   */
  private loadUserSettings() {
    this.subscriptions.push(
      this.gs.ghelper(SERV.HELPER, 'currentUser').subscribe((response) => {
        const users: JUser = new JsonAPISerializer().deserialize(response, zUserResponse);
        const user = users[0];

        this.form.patchValue({
          name: user?.name,
          registeredSince: this.datePipe.transform(Number(user?.registeredSince)),
          email: user?.email
        });
      })
    );
  }
}
