import {
  SESSION_LENGTH_FALLBACK_HOURS,
  SESSION_LIFETIME_MIN_SECONDS,
  SESSION_LIFETIME_PRESET_HOURS
} from '@constants/session.config';
import { map } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { JUser } from '@models/user.model';

import { AuthService } from '@services/access/auth.service';
import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { UIConfigService } from '@services/shared/storage.service';

import { uiDatePipe } from '@src/app/core/_pipes/date.pipe';
import { GlobalService } from '@src/app/core/_services/main.service';
import { AlertService } from '@src/app/core/_services/shared/alert.service';
import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';
import { emailValidator } from '@src/app/core/_validators/email.validator';
import { passwordMatchValidator } from '@src/app/core/_validators/password.validator';
import { formatSessionLifetime } from '@src/app/shared/utils/datetime';
import { SelectOption } from '@src/app/shared/utils/forms';
import { zChangeOwnPasswordHelperApiResponse, zCurrentUserHelperApiResponse } from '@src/generated/api/zod';

export interface UpdateUserPassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AccSettingsForm {
  name: FormControl<string | null>;
  registeredSince: FormControl<string | null>;
  email: FormControl<string | null>;
  sessionLifetime: FormControl<number | null>;
}

export interface AccChangePasswordForm {
  oldPassword: FormControl<string | null>;
  newPassword: FormControl<string | null>;
  confirmNewPassword: FormControl<string | null>;
}
@Component({
  selector: 'app-acc-settings',
  templateUrl: './acc-settings.component.html',
  providers: [uiDatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AccountSettingsComponent implements OnInit {
  static readonly PWD_MIN = 4;

  pwdMin = AccountSettingsComponent.PWD_MIN;

  /** Session lifetimes the user may choose from, in seconds. */
  sessionLifetimeOptions: SelectOption<number>[] = [];

  /** Session lifetime in effect on the server, in seconds, to tell whether a save changes it. */
  private savedSessionLifetime: number | null = null;

  pageTitle = 'Account Settings';
  pageSubtitlePassword = 'Password Update';

  /** Form group for main form. */
  form: FormGroup<AccSettingsForm>;
  changepasswordFormGroup: FormGroup<AccChangePasswordForm>;

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

  private destroyRef = inject(DestroyRef);

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
  private uicService = inject(UIConfigService);
  private authService = inject(AuthService);

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

    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }

  /**
   * Creates and configures basic controls
   */
  createForm(): void {
    this.buildSessionLifetimeOptions(null);
    this.form = new FormGroup<AccSettingsForm>({
      name: new FormControl({ value: '', disabled: true }), // disabled, no validators needed
      registeredSince: new FormControl({ value: '', disabled: true }), // disabled, no validators needed
      email: new FormControl('', [Validators.required, emailValidator]),
      sessionLifetime: new FormControl<number | null>(null, Validators.required)
    });
  }

  /**
   * Offers the presets up to the maximum session lifetime, the maximum itself and the current
   * session lifetime of the user.
   *
   * @param current - The current session lifetime of the user in seconds, if known.
   */
  private buildSessionLifetimeOptions(current: number | null): void {
    const max = this.maxSessionLifetime();
    const seconds = SESSION_LIFETIME_PRESET_HOURS.map((hours) => hours * 3600).filter((value) => value <= max);
    seconds.push(max);

    if (current !== null) {
      seconds.push(current);
    }

    this.sessionLifetimeOptions = [...new Set(seconds)]
      .sort((a, b) => a - b)
      .map((value) => ({ id: value, name: formatSessionLifetime(value) }));
  }

  /**
   * Longest session lifetime in seconds the server accepts, taken from the maxSessionLength setting.
   */
  private maxSessionLifetime(): number {
    let hours = Math.trunc(this.uicService.getUISettings()?.maxSessionLength ?? 0);
    if (hours < 1) {
      hours = SESSION_LENGTH_FALLBACK_HOURS;
    }

    return Math.max(hours * 3600, SESSION_LIFETIME_MIN_SECONDS);
  }

  /**
   * Bounds a session lifetime the way the server does when it issues a refresh token.
   *
   * @param seconds - A session lifetime in seconds.
   */
  private clampSessionLifetime(seconds: number): number {
    return Math.min(Math.max(seconds, SESSION_LIFETIME_MIN_SECONDS), this.maxSessionLifetime());
  }

  createUpdatePassForm() {
    this.changepasswordFormGroup = new FormGroup<AccChangePasswordForm>(
      {
        oldPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', [Validators.required, Validators.minLength(AccountSettingsComponent.PWD_MIN)]),
        confirmNewPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(AccountSettingsComponent.PWD_MIN)
        ])
      },
      { validators: passwordMatchValidator() }
    );
  }

  get oldPasswordValueFromForm() {
    return this.changepasswordFormGroup.controls.oldPassword.value ?? '';
  }
  get newPasswordValueFromForm() {
    return this.changepasswordFormGroup.controls.newPassword.value ?? '';
  }
  get confirmNewPasswordValueFromForm() {
    return this.changepasswordFormGroup.controls.confirmNewPassword.value ?? '';
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
      const payload = {
        email: this.form.controls.email.value,
        sessionLifetime: this.form.controls.sessionLifetime.value
      };
      this.gs
        .uhelper(SERV.HELPER, this.gs.userId!, 'currentUser', payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.alert.showSuccessMessage('User saved');
            this.isUpdatingLoading = false;

            if (payload.sessionLifetime !== this.savedSessionLifetime) {
              this.savedSessionLifetime = payload.sessionLifetime;
              this.renewSession();
            }
          },
          error: (err) => {
            console.error('Error updating user', err);
            this.isUpdatingLoading = false;
          }
        });
    } else {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }

  /**
   * Renews the session, so its refresh token takes on the session lifetime just saved instead of
   * keeping the one it was issued with. A failed renewal means the session has ended already.
   */
  private renewSession(): void {
    this.authService.refreshToken({ force: true }).subscribe({
      error: () => {
        this.alert.showInfoMessage('Session expired, please log in again.');
        this.authService.logOut();
      }
    });
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
    this.gs
      .chelper(SERV.HELPER, 'changeOwnPassword', { ...payload })
      .pipe(
        map((r) => {
          const parseResult = zChangeOwnPasswordHelperApiResponse.safeParse(r);
          if (!parseResult.success) {
            console.error('Password change response validation failed', parseResult.error);
            this.alert.showErrorMessage('Unexpected response from server.');
            throw parseResult.error;
          }
          return parseResult.data;
        }),
        takeUntilDestroyed(this.destroyRef)
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
      });
  }

  /**
   * Loads user settings from the server and populates the form with initial data.
   */
  private loadUserSettings() {
    this.gs
      .ghelper(SERV.HELPER, 'currentUser')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        const user: JUser = new JsonAPISerializer().deserialize(response, zCurrentUserHelperApiResponse);
        const sessionLifetime = user.sessionLifetime ? this.clampSessionLifetime(user.sessionLifetime) : null;
        this.savedSessionLifetime = sessionLifetime;
        this.buildSessionLifetimeOptions(sessionLifetime);

        this.form.patchValue({
          name: user.name,
          registeredSince: this.datePipe.transform(user.registeredSince),
          email: user.email ?? null,
          sessionLifetime
        });
      });
  }
}
