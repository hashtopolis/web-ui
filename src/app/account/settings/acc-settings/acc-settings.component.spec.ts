import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of, throwError } from 'rxjs';
import type { Mock, MockedObject } from 'vitest';

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

import { AuthData } from '@models/auth-user.model';
import { UiSettings } from '@models/config-ui.schema';

import { AuthService } from '@services/access/auth.service';
import { JsonAPISerializer } from '@services/api/serializer-service';
import { AlertService } from '@services/shared/alert.service';
import { UIConfigService } from '@services/shared/storage.service';

import { AccountSettingsComponent } from '@src/app/account/settings/acc-settings/acc-settings.component';
import { SERV } from '@src/app/core/_services/main.config';
import { GlobalService } from '@src/app/core/_services/main.service';
import { ComponentsModule } from '@src/app/shared/components.module';
import { PipesModule } from '@src/app/shared/pipes.module';
import { mockResponse } from '@src/app/testing/mock-response';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;

  let alertSpy: MockedObject<AlertService>;
  let authSpy: MockedObject<AuthService>;
  let deserializeSpy: Mock;
  let uiSettings: Partial<UiSettings>;

  const userResponse = {
    type: 'user',
    id: 1,
    attributes: {
      name: 'admin',
      email: 'admin@localhost',
      isValid: true,
      isComputedPassword: true,
      lastLoginDate: 1752647017,
      registeredSince: 1744086356,
      sessionLifetime: 3 * 3600,
      globalPermissionGroupId: 1
    }
  };

  // Mock GlobalService
  const mockService: Partial<GlobalService> = {
    get(serviceConfig) {
      if (serviceConfig.URL === SERV.USERS.URL) {
        return of(mockResponse({ data: userResponse }));
      }
      return of(mockResponse());
    },
    create() {
      return of(mockResponse());
    },
    update() {
      return of({});
    },
    chelper: (() => {
      return of(mockResponse());
    }) as GlobalService['chelper'],
    ghelper(_serviceConfig: unknown, _option: string) {
      return of(mockResponse({ data: userResponse }));
    },
    uhelper(_serviceConfig: unknown, _id: number, _option: string, _payload: Record<string, unknown>) {
      return of({});
    },
    userId: 1
  };

  const mockUser = {
    id: 1,
    name: userResponse.attributes.name,
    email: userResponse.attributes.email,
    isValid: userResponse.attributes.isValid,
    isComputedPassword: userResponse.attributes.isComputedPassword,
    lastLoginDate: userResponse.attributes.lastLoginDate,
    registeredSince: userResponse.attributes.registeredSince,
    sessionLifetime: userResponse.attributes.sessionLifetime,
    globalPermissionGroupId: userResponse.attributes.globalPermissionGroupId
  };

  beforeEach(async () => {
    alertSpy = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage'),
      showInfoMessage: vi.fn().mockName('AlertService.showInfoMessage')
    } as MockedObject<AlertService>;
    uiSettings = { maxSessionLength: 48 };

    authSpy = {
      refreshToken: vi.fn().mockName('AuthService.refreshToken'),
      logOut: vi.fn().mockName('AuthService.logOut')
    } as MockedObject<AuthService>;
    authSpy.refreshToken.mockReturnValue(of({} as AuthData));

    deserializeSpy = vi.spyOn(JsonAPISerializer.prototype, 'deserialize').mockReturnValue(mockUser);

    await TestBed.configureTestingModule({
      declarations: [AccountSettingsComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        ComponentsModule,
        PipesModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        {
          provide: GlobalService,
          useValue: mockService
        },
        {
          provide: AlertService,
          useValue: alertSpy
        },
        {
          provide: AuthService,
          useValue: authSpy
        },
        {
          provide: UIConfigService,
          useValue: { getUISettings: () => uiSettings }
        },
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('User settings loading', () => {
    it('populates form with user data from single-object response', () => {
      // The mock ghelper returns { data: userResponse } (single object, not array).
      // loadUserSettings() is called in ngOnInit, so the form should already be populated.
      expect(component.form.controls.name.value).toBe('admin');
      expect(component.form.controls.email.value).toBe('admin@localhost');
    });

    it('preselects the session lifetime of the user', () => {
      expect(component.form.controls.sessionLifetime.value).toBe(3 * 3600);
    });

    it('offers the presets up to the maximum and the current session lifetime', () => {
      const names = component.sessionLifetimeOptions.map((option) => option.name);

      expect(names).toStrictEqual(['2 hours', '3 hours', '4 hours', '8 hours', '12 hours', '1 day', '2 days']);
    });

    it('shows the preselected session lifetime in the select', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const select = fixture.debugElement.query(By.css('[data-testid="input-session-lifetime"] mat-select'));

      expect(select.nativeElement.textContent).toContain('3 hours');
    });

    it('caps the offered session lifetimes at the maximum session length', () => {
      uiSettings = { maxSessionLength: 6 };
      deserializeSpy.mockReturnValue({ ...mockUser, sessionLifetime: 24 * 3600 });

      component['loadUserSettings']();

      const names = component.sessionLifetimeOptions.map((option) => option.name);
      expect(names).toStrictEqual(['2 hours', '4 hours', '6 hours']);
    });

    it('preselects the maximum when the stored session lifetime exceeds it', () => {
      uiSettings = { maxSessionLength: 6 };
      deserializeSpy.mockReturnValue({ ...mockUser, sessionLifetime: 24 * 3600 });

      component['loadUserSettings']();

      expect(component.form.controls.sessionLifetime.value).toBe(6 * 3600);
    });

    it('populates registeredSince as a formatted date', () => {
      // registeredSince should be set from the user data, not be null/undefined
      const registeredSince = component.form.controls.registeredSince.value;
      expect(registeredSince).toBeTruthy();
    });
  });

  describe('Main form tests', () => {
    it('validates email as required', () => {
      const emailControl = component.form.controls.email;
      emailControl.patchValue(null);
      component.form.updateValueAndValidity();
      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('validates email format', () => {
      const emailControl = component.form.controls.email;

      emailControl.patchValue('invalid-email');
      component.form.updateValueAndValidity();
      expect(emailControl.hasError('email')).toBe(true);

      emailControl.patchValue('test@example.com');
      component.form.updateValueAndValidity();
      expect(emailControl.hasError('email')).toBe(false);
    });

    it('enables form submission when form is valid', () => {
      component.form.patchValue({ email: 'test@example.com' });
      component.form.updateValueAndValidity();
      fixture.detectChanges();

      expect(component.form.valid).toBe(true);
      const btn = fixture.debugElement.query(By.css('[data-testid="button-update-submit"]'));
      const nativeBtn = btn.nativeElement.querySelector('button');
      expect(nativeBtn?.disabled).toBe(false);
    });

    it('keeps submit button enabled when form is invalid', () => {
      component.form.patchValue({ email: 'invalid-email' });
      component.form.updateValueAndValidity();
      fixture.detectChanges();

      expect(component.form.valid).toBe(false);
      const btn = fixture.debugElement.query(By.css('[data-testid="button-update-submit"]'));
      const nativeBtn = btn.nativeElement.querySelector('button');
      expect(nativeBtn?.disabled).toBe(false);
    });

    it('submits form with valid email', () => {
      vi.spyOn(component['gs'], 'uhelper').mockReturnValue(of({}));

      component.form.patchValue({ email: 'test@example.com' });
      component.form.updateValueAndValidity();
      fixture.detectChanges();

      const btnDebugEl = fixture.debugElement.query(By.css('[data-testid="button-update-submit"]'));
      btnDebugEl.nativeElement.click();
      fixture.detectChanges();

      expect(component['gs'].uhelper).toHaveBeenCalledExactlyOnceWith(
        SERV.HELPER,
        Number(component['gs'].userId),
        'currentUser',
        { email: 'test@example.com', sessionLifetime: 3 * 3600 }
      );
      expect(component['alert'].showSuccessMessage).toHaveBeenCalled();
    });

    it('requires a session lifetime', () => {
      component.form.controls.sessionLifetime.patchValue(null);

      expect(component.form.controls.sessionLifetime.hasError('required')).toBe(true);
    });

    it('submits the chosen session lifetime', () => {
      const uhelperSpy = vi.spyOn(component['gs'], 'uhelper').mockReturnValue(of({}));
      component.form.patchValue({ email: 'test@example.com', sessionLifetime: 8 * 3600 });

      component.onSubmit();

      expect(uhelperSpy).toHaveBeenCalledExactlyOnceWith(
        SERV.HELPER,
        Number(component['gs'].userId),
        'currentUser',
        expect.objectContaining({ sessionLifetime: 8 * 3600 })
      );
    });

    it('renews the session once the session lifetime changed', () => {
      vi.spyOn(component['gs'], 'uhelper').mockReturnValue(of({}));
      component.form.patchValue({ email: 'test@example.com', sessionLifetime: 8 * 3600 });

      component.onSubmit();
      component.onSubmit();

      expect(authSpy.refreshToken).toHaveBeenCalledExactlyOnceWith({ force: true });
    });

    it('does not renew the session when the session lifetime is unchanged', () => {
      vi.spyOn(component['gs'], 'uhelper').mockReturnValue(of({}));
      component.form.patchValue({ email: 'changed@example.com' });

      component.onSubmit();

      expect(authSpy.refreshToken).not.toHaveBeenCalled();
    });

    it('tells the user and logs out when renewing the session fails', () => {
      vi.spyOn(component['gs'], 'uhelper').mockReturnValue(of({}));
      authSpy.refreshToken.mockReturnValue(throwError(() => new Error('Refresh token has expired')));
      component.form.patchValue({ email: 'test@example.com', sessionLifetime: 8 * 3600 });

      component.onSubmit();

      expect(alertSpy.showInfoMessage).toHaveBeenCalledExactlyOnceWith('Session expired, please log in again.');
      expect(authSpy.logOut).toHaveBeenCalledExactlyOnceWith();
    });

    it('does not submit form with invalid email', () => {
      const uhelperSpy = vi.spyOn(component['gs'], 'uhelper').mockReturnValue(undefined as never);
      component.form.patchValue({ email: 'invalid-email' });
      component.form.updateValueAndValidity();
      fixture.detectChanges();

      const btnDebugEl = fixture.debugElement.query(By.css('[data-testid="button-update-submit"]'));
      btnDebugEl.nativeElement.click();
      fixture.detectChanges();

      expect(component.form.valid).toBe(false);
      expect(uhelperSpy).not.toHaveBeenCalled();
      expect(component['alert'].showSuccessMessage).not.toHaveBeenCalled();
    });
  });

  describe('Password change form tests', () => {
    it('initializes the password form with empty default values', () => {
      const formValue = component.changepasswordFormGroup.getRawValue();
      expect(formValue.oldPassword).toBe('');
      expect(formValue.newPassword).toBe('');
      expect(formValue.confirmNewPassword).toBe('');
    });

    it('validates all password fields as required', () => {
      const form = component.changepasswordFormGroup;

      // Clear all values
      form.patchValue({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });

      form.markAllAsTouched();
      form.updateValueAndValidity();
      fixture.detectChanges();

      const oldPasswordControl = form.controls.oldPassword;
      const newPasswordControl = form.controls.newPassword;
      const confirmPasswordControl = form.controls.confirmNewPassword;

      expect(oldPasswordControl.hasError('required')).toBe(true);
      expect(newPasswordControl.hasError('required')).toBe(true);
      expect(confirmPasswordControl.hasError('required')).toBe(true);
    });

    it('shows validation only for the password field that has been visited', () => {
      const form = component.changepasswordFormGroup;
      const oldPasswordHost = fixture.debugElement.query(By.css('[data-testid="input-oldPassword"]'));
      const newPasswordHost = fixture.debugElement.query(By.css('[data-testid="input-newPassword"]'));
      const confirmPasswordHost = fixture.debugElement.query(By.css('[data-testid="input-confirmNewPassword"]'));

      const oldPasswordInput = oldPasswordHost.query(By.css('input')).nativeElement as HTMLInputElement;
      oldPasswordInput.value = 'oldpassword';
      oldPasswordInput.dispatchEvent(new Event('input'));
      oldPasswordInput.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(form.controls.oldPassword.touched).toBe(true);
      expect(form.controls.newPassword.touched).toBe(false);
      expect(form.controls.confirmNewPassword.touched).toBe(false);
      expect(newPasswordHost.query(By.css('.field-stack')).nativeElement.classList).not.toContain('is-invalid');
      expect(confirmPasswordHost.query(By.css('.field-stack')).nativeElement.classList).not.toContain('is-invalid');

      const newPasswordInput = newPasswordHost.query(By.css('input')).nativeElement as HTMLInputElement;
      newPasswordInput.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(form.controls.newPassword.touched).toBe(true);
      expect(form.controls.confirmNewPassword.touched).toBe(false);
      expect(newPasswordHost.query(By.css('.field-stack')).nativeElement.classList).toContain('is-invalid');
      expect(confirmPasswordHost.query(By.css('.field-stack')).nativeElement.classList).not.toContain('is-invalid');
    });

    it('shows every invalid password field after an invalid submission', () => {
      component.onSubmitPass();
      fixture.detectChanges();

      expect(component.changepasswordFormGroup.controls.oldPassword.touched).toBe(true);
      expect(component.changepasswordFormGroup.controls.newPassword.touched).toBe(true);
      expect(component.changepasswordFormGroup.controls.confirmNewPassword.touched).toBe(true);

      for (const testId of ['input-oldPassword', 'input-newPassword', 'input-confirmNewPassword']) {
        const field = fixture.debugElement.query(By.css(`[data-testid="${testId}"] .field-stack`));
        expect(field.nativeElement.classList).toContain('is-invalid');
      }
    });

    it('validates password length', () => {
      const newPasswordControl = component.changepasswordFormGroup.controls.newPassword;
      const confirmPasswordControl = component.changepasswordFormGroup.controls.confirmNewPassword;

      // Too short
      newPasswordControl.patchValue('123');
      confirmPasswordControl.patchValue('123');
      component.changepasswordFormGroup.updateValueAndValidity();

      expect(newPasswordControl.hasError('minlength')).toBe(true);
      expect(confirmPasswordControl.hasError('minlength')).toBe(true);

      // Exactly min
      newPasswordControl.patchValue('1234');
      confirmPasswordControl.patchValue('1234');
      component.changepasswordFormGroup.updateValueAndValidity();

      expect(newPasswordControl.hasError('minlength')).toBe(false);
      expect(confirmPasswordControl.hasError('minlength')).toBe(false);

      // Long passwords are allowed: there is no maximum length limit
      newPasswordControl.patchValue('VeryNiceLongPasswordWithoutAnyLengthLimitForHashtopolis');
      confirmPasswordControl.patchValue('VeryNiceLongPasswordWithoutAnyLengthLimitForHashtopolis');
      component.changepasswordFormGroup.updateValueAndValidity();

      expect(newPasswordControl.hasError('maxlength')).toBe(false);
      expect(confirmPasswordControl.hasError('maxlength')).toBe(false);
    });

    it('validates password match', () => {
      // Set different passwords
      component.changepasswordFormGroup.patchValue({
        newPassword: 'password1234',
        confirmNewPassword: 'P4ssw0rd1234'
      });
      component.changepasswordFormGroup.updateValueAndValidity();
      fixture.detectChanges();
      expect(component.changepasswordFormGroup.hasError('passwordMismatch')).toBe(true);

      // Set matching passwords
      component.changepasswordFormGroup.patchValue({
        newPassword: 'password1234',
        confirmNewPassword: 'password1234'
      });
      component.changepasswordFormGroup.updateValueAndValidity();
      fixture.detectChanges();
      expect(component.changepasswordFormGroup.hasError('passwordMismatch')).toBe(false);
    });

    it('Submits password form and resets on success', () => {
      // Arrange
      const chelperSpy = vi
        .spyOn(component['gs'], 'chelper')
        .mockReturnValue(of(mockResponse({ meta: { 'Change password': 'Password changed successfully' } })));
      const resetSpy = vi.spyOn(component, 'resetPasswordForm').mockReturnValue(undefined);

      // Fill valid form values
      component.changepasswordFormGroup.patchValue({
        oldPassword: 'oldPass123',
        newPassword: 'newPass456',
        confirmNewPassword: 'newPass456'
      });
      component.changepasswordFormGroup.updateValueAndValidity();
      fixture.detectChanges();

      // Click the submit button
      const btn = fixture.debugElement.query(By.css('[data-testid="button-password-submit"]'));
      expect(btn).toBeTruthy();
      btn.nativeElement.click();
      fixture.detectChanges();

      // Assert
      expect(chelperSpy).toHaveBeenCalledExactlyOnceWith(SERV.HELPER, 'changeOwnPassword', {
        oldPassword: 'oldPass123',
        newPassword: 'newPass456',
        confirmPassword: 'newPass456'
      });
      expect(component['alert'].showSuccessMessage).toHaveBeenCalledExactlyOnceWith('Password changed successfully');
      expect(resetSpy).toHaveBeenCalled();
      expect(component.isUpdatingPassLoading).toBe(false);
    });

    it('Does not submit password form if invalid', () => {
      const chelperSpy = vi.spyOn(component['gs'], 'chelper').mockReturnValue(undefined as never);
      const resetSpy = vi.spyOn(component, 'resetPasswordForm').mockReturnValue(undefined);

      // Make the form invalid by patching passwords not matching
      component.changepasswordFormGroup.patchValue({
        oldPassword: 'oldpassword',
        newPassword: 'newpassword',
        confirmNewPassword: 'NewPassword'
      });
      component.changepasswordFormGroup.updateValueAndValidity();
      fixture.detectChanges();

      // Click the submit button
      const btn = fixture.debugElement.query(By.css('[data-testid="button-password-submit"]'));
      expect(btn).toBeTruthy();
      btn.nativeElement.click();

      // Service should not be called
      expect(chelperSpy).not.toHaveBeenCalled();
      // Alert should not be called
      expect(component['alert'].showSuccessMessage).not.toHaveBeenCalled();
      // Reset should not be called
      expect(resetSpy).not.toHaveBeenCalled();
      // isUpdatingPassLoading should remain false (no submission started)
      expect(component.isUpdatingPassLoading).toBe(false);
    });
  });
});
