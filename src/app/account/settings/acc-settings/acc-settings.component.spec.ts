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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Params, provideRouter } from '@angular/router';

import { AccountSettingsComponent } from '@src/app/account/settings/acc-settings/acc-settings.component';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;

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

  // Define a partial mock service to simulate service calls.
  const mockService: Partial<GlobalService> = {
    // Simulate the 'get' method to return an empty observable.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    get(_serviceConfig, _id: number, _routerParams?: Params): Observable<any> {
      if (_serviceConfig.URL === SERV.USERS.URL) {
        return of({
          data: userResponse
        });
      }
      return of([]);
    },
    // Simulate the 'create' method to return an empty observable.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    create(serviceConfig, _object: any): Observable<any> {
      return of({});
    },

    userId: 1
  };
  beforeEach(() => {
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
        MatSnackBarModule
      ],
      providers: [
        provideAnimations(),
        {
          provide: GlobalService,
          useValue: mockService
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  // --- Test Methods ---
  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('initializes the form with default values', () => {
    const formValue = component.form.getRawValue();
    expect(formValue.name).toBe(userResponse.attributes.name);
    expect(formValue.registeredSince).toBe('08/04/2025 6:25:56');
    expect(formValue.email).toBe(userResponse.attributes.email);

    const passFormValue = component.changepasswordFormGroup.getRawValue();
    expect(passFormValue.oldPassword).toBe('');
    expect(passFormValue.newPassword).toBe('');
    expect(passFormValue.confirmNewPassword).toBe('');
  });

  it('validates email as required', async () => {
    const emailControl = component.form.get('email');
    emailControl?.patchValue(null);
    expect(emailControl?.hasError('required')).toBeTrue();
  });

  it('validates email format', () => {
    const emailControl = component.form.get('email');

    // Set an invalid email format
    emailControl?.patchValue('invalid-email');
    expect(emailControl.hasError('email')).toBeTrue();

    // Set a valid email format
    emailControl?.patchValue('test@example.com');
    expect(emailControl.hasError('email')).toBeFalse();
  });

  it('validates password length', () => {
    const newPasswordControl = component.form.get('newpassword');
    const confirmPasswordControl = component.form.get('confirmpass');

    // Set a password with length less than PWD_MIN
    newPasswordControl.patchValue('123');
    confirmPasswordControl.patchValue('123');
    expect(newPasswordControl.hasError('minlength')).toBe(true);
    expect(confirmPasswordControl.hasError('minlength')).toBe(true);

    // Set a password with length equal to PWD_MIN
    newPasswordControl.patchValue('1234');
    confirmPasswordControl.patchValue('1234');
    expect(newPasswordControl.hasError('minlength')).toBe(false);
    expect(confirmPasswordControl.hasError('minlength')).toBe(false);

    // Set a password with length greater than PWD_MAX
    newPasswordControl.patchValue('1234567890123');
    confirmPasswordControl.patchValue('1234567890123');
    expect(newPasswordControl.hasError('maxlength')).toBe(true);
    expect(confirmPasswordControl.hasError('maxlength')).toBe(true);

    // Set a password with length equal to PWD_MAX
    newPasswordControl.patchValue('123456789012');
    confirmPasswordControl.patchValue('123456789012');
    expect(newPasswordControl.hasError('maxlength')).toBe(false);
    expect(confirmPasswordControl.hasError('maxlength')).toBe(false);
  });

  it('validates password match', () => {
    const newPasswordControl = component.changepasswordFormGroup.get('newPassword');
    const confirmPasswordControl = component.changepasswordFormGroup.get('confirmNewPassword');
    // Set different passwords
    newPasswordControl.patchValue('password123');
    confirmPasswordControl.patchValue('password1234');
    expect(component.changepasswordFormGroup.hasError('mismatch')).toBe(true);

    // Set matching passwords
    newPasswordControl.patchValue('password123');
    confirmPasswordControl.patchValue('password123');
    fixture.detectChanges();
    expect(component.changepasswordFormGroup.hasError('mismatch')).toBe(false);
  });

  it('enables form submission when form is valid', () => {
    const EmailControl = component.form.get('email');
    EmailControl.patchValue('test@example.com');
    // The form should now be valid, and the submit button should be enabled
    expect(component.form.valid).toBe(true);
    // Find all button-submit elements
    const btns = fixture.debugElement.queryAll(By.css('[data-testid="button-submit"]'));
    // Select the correct button (e.g., first for account update)
    const btn = btns[0];
    const disabledAttr = btn.nativeElement.attributes.getNamedItem('ng-reflect-disabled');
    expect(disabledAttr ? disabledAttr.value : null).toEqual('false');
  });

  it('disables form submission when form is invalid', () => {
    const EmailControl = component.form.get('email');
    EmailControl.patchValue('invalid-email');
    // The form should now be invalid, and the submit button should be disabled
    expect(component.form.valid).toBe(false);
    // Find all button-submit elements
    const btns = fixture.debugElement.queryAll(By.css('[data-testid="button-submit"]'));
    // Select the correct button (e.g., first for account update)
    const btn = btns[0];
    const disabledAttr = btn.nativeElement.attributes.getNamedItem('ng-reflect-disabled');
    expect(disabledAttr ? disabledAttr.value : null).toEqual('true');
  });
});
