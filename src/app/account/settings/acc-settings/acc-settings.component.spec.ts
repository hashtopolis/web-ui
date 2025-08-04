// eslint-disable-next-line sort-imports
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { Observable, of } from 'rxjs';
import { SERV } from 'src/app/core/_services/main.config';
import { GlobalService } from 'src/app/core/_services/main.service';
import { ComponentsModule } from 'src/app/shared/components.module';
import { PipesModule } from 'src/app/shared/pipes.module';

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Params } from '@angular/router';

import { AlertService } from '@services/shared/alert.service';

import { AccountSettingsComponent } from '@src/app/account/settings/acc-settings/acc-settings.component';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;

  let alertSpy: jasmine.SpyObj<AlertService>;

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
      sessionLifetime: 3600,
      globalPermissionGroupId: 1,
      yubikey: '0',
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: ''
    }
  };

  // Mock GlobalService
  const mockService: Partial<GlobalService> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    get(_serviceConfig, _id: number, _routerParams?: Params): Observable<any> {
      if (_serviceConfig.URL === SERV.USERS.URL) {
        return of({ data: userResponse });
      }
      return of([]);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(serviceConfig, _object: any): Observable<any> {
      return of({});
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_serviceConfig, id, _object: any): Observable<any> {
      return of({});
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    chelper(_serviceConfig, option: string, _payload: any): Observable<any> {
      return of({});
    },
    userId: 1
  };

  beforeEach(() => {
    alertSpy = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);

    TestBed.configureTestingModule({
      declarations: [AccountSettingsComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        DataTablesModule,
        ComponentsModule,
        PipesModule,
        NgbModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        provideAnimations(),
        {
          provide: GlobalService,
          useValue: mockService
        },
        {
          provide: AlertService,
          useValue: alertSpy
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

  describe('Main form tests', () => {
    it('initializes the form with default values', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const formValue = component.form.getRawValue();

      expect(formValue.name).toBe(userResponse.attributes.name);
      expect(formValue.email).toBe(userResponse.attributes.email);
      expect(formValue.registeredSince).toBe('08/04/2025 6:25:56');
    }));

    it('validates email as required', async () => {
      const emailControl = component.form.get('email');
      emailControl?.patchValue(null);
      component.form.updateValueAndValidity();
      expect(emailControl?.hasError('required')).toBeTrue();
    });

    it('validates email format', () => {
      const emailControl = component.form.get('email');

      emailControl?.patchValue('invalid-email');
      component.form.updateValueAndValidity();
      expect(emailControl.hasError('email')).toBeTrue();

      emailControl?.patchValue('test@example.com');
      component.form.updateValueAndValidity();
      expect(emailControl.hasError('email')).toBeFalse();
    });

    it('enables form submission when form is valid', () => {
      component.form.patchValue({ email: 'test@example.com' });
      component.form.updateValueAndValidity();
      fixture.detectChanges();

      expect(component.form.valid).toBe(true);
      const btn = fixture.debugElement.query(By.css('[data-testid="button-update-submit"]'));
      const nativeBtn = btn.nativeElement.querySelector('button');
      expect(nativeBtn?.disabled).toBeFalse();
    });

    it('disables form submission when form is invalid', () => {
      component.form.patchValue({ email: 'invalid-email' });
      component.form.updateValueAndValidity();
      fixture.detectChanges();

      expect(component.form.valid).toBe(false);
      const btn = fixture.debugElement.query(By.css('[data-testid="button-update-submit"]'));
      const nativeBtn = btn.nativeElement.querySelector('button');
      expect(nativeBtn?.disabled).toBeTrue();
    });

    it('submits form with valid email', () => {
      spyOn(component['gs'], 'update').and.returnValue(of({}));

      component.form.patchValue({ email: 'test@example.com' });
      component.form.updateValueAndValidity();
      fixture.detectChanges();

      const btnDebugEl = fixture.debugElement.query(By.css('[data-testid="button-update-submit"]'));
      btnDebugEl.nativeElement.click();
      fixture.detectChanges();

      expect(component['gs'].update).toHaveBeenCalledWith(SERV.USERS, component['gs'].userId, component.form.value);
      expect(component['alert'].showSuccessMessage).toHaveBeenCalled();
    });

    it('does not submit form with invalid email', () => {
      const updateSpy = spyOn(component['gs'], 'update');
      component.form.patchValue({ email: 'invalid-email' });
      component.form.updateValueAndValidity();
      fixture.detectChanges();

      const btnDebugEl = fixture.debugElement.query(By.css('[data-testid="button-update-submit"]'));
      btnDebugEl.nativeElement.click();
      fixture.detectChanges();

      expect(component.form.valid).toBeFalse();
      expect(updateSpy).not.toHaveBeenCalled();
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

      const oldPasswordControl = form.get('oldPassword');
      const newPasswordControl = form.get('newPassword');
      const confirmPasswordControl = form.get('confirmNewPassword');

      expect(oldPasswordControl?.hasError('required')).toBeTrue();
      expect(newPasswordControl?.hasError('required')).toBeTrue();
      expect(confirmPasswordControl?.hasError('required')).toBeTrue();
    });

    it('validates password length', () => {
      const newPasswordControl = component.changepasswordFormGroup.get('newPassword');
      const confirmPasswordControl = component.changepasswordFormGroup.get('confirmNewPassword');

      // Too short
      newPasswordControl.patchValue('123');
      confirmPasswordControl.patchValue('123');
      component.changepasswordFormGroup.updateValueAndValidity();

      expect(newPasswordControl.hasError('minlength')).toBeTrue();
      expect(confirmPasswordControl.hasError('minlength')).toBeTrue();

      // Exactly min
      newPasswordControl.patchValue('1234');
      confirmPasswordControl.patchValue('1234');
      component.changepasswordFormGroup.updateValueAndValidity();

      expect(newPasswordControl.hasError('minlength')).toBeFalse();
      expect(confirmPasswordControl.hasError('minlength')).toBeFalse();

      // Too long
      newPasswordControl.patchValue('VeryNiceLongPasswordButTooLongForHashtopolis');
      confirmPasswordControl.patchValue('VeryNiceLongPasswordButTooLongForHashtopolis');
      component.changepasswordFormGroup.updateValueAndValidity();

      expect(newPasswordControl.hasError('maxlength')).toBeTrue();
      expect(confirmPasswordControl.hasError('maxlength')).toBeTrue();

      // Exactly max
      newPasswordControl.patchValue('Password12!#');
      confirmPasswordControl.patchValue('Password12!#');
      component.changepasswordFormGroup.updateValueAndValidity();

      expect(newPasswordControl.hasError('maxlength')).toBeFalse();
      expect(confirmPasswordControl.hasError('maxlength')).toBeFalse();
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

    it('Submits password form and resets on success', fakeAsync(() => {
      // Arrange
      const chelperSpy = spyOn(component['gs'], 'chelper').and.returnValue(
        of({ meta: { 'Change password': 'Password changed successfully' } })
      );
      const resetSpy = spyOn(component, 'resetPasswordForm');

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

      tick(); // flush observable
      fixture.detectChanges();

      // Assert
      expect(chelperSpy).toHaveBeenCalledOnceWith(SERV.HELPER, 'changeOwnPassword', {
        oldPassword: 'oldPass123',
        newPassword: 'newPass456',
        confirmPassword: 'newPass456'
      });
      expect(component['alert'].showSuccessMessage).toHaveBeenCalledOnceWith('Password changed successfully');
      expect(resetSpy).toHaveBeenCalled();
      expect(component.isUpdatingPassLoading).toBeFalse();
    }));

    it('Does not submit password form if invalid', () => {
      const chelperSpy = spyOn(component['gs'], 'chelper');
      const resetSpy = spyOn(component, 'resetPasswordForm');

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
      expect(component.isUpdatingPassLoading).toBeFalse();
    });
  });
});
