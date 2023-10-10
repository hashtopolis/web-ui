import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountSettingsComponent } from './acc-settings.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataTablesModule } from 'angular-datatables';
import { ComponentsModule } from 'src/app/shared/components.module';
import { PipesModule } from 'src/app/shared/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/core/_services/main.service';
import { Params } from '@angular/router';
import { Observable, of } from 'rxjs';
import { findEl, setFieldValue } from 'src/app/spec-helpers/element.spec-helper';
import { DebugElement } from '@angular/core';
import { SERV } from 'src/app/core/_services/main.config';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;

  const userSettingsResponse = {
    "_expandable": "accessGroups",
    "_id": 1,
    "_self": "/api/v2/ui/users/1",
    "email": "user@test.com",
    "globalPermissionGroup": {
      "_id": 1,
      "_self": "/api/v2/ui/globalpermissiongroups/1",
      "id": 1,
      "name": "Administrator",
      "permissions": {}
    },
    "globalPermissionGroupId": 1,
    "id": 1,
    "isComputedPassword": true,
    "isValid": true,
    "lastLoginDate": 1695811400,
    "name": "admin",
    "otp1": "",
    "otp2": "",
    "otp3": "",
    "otp4": "",
    "registeredSince": 1695810913,
    "sessionLifetime": 3600,
    "yubikey": "0"
  }

  // Define a partial mock service to simulate service calls.
  const mockService: Partial<GlobalService> = {
    // Simulate the 'get' method to return an empty observable.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    get(_methodUrl: string, _id: number, _routerParams?: Params): Observable<any> {
      if (_methodUrl === SERV.USERS) {
        return of(userSettingsResponse)
      }
      return of([])
    },
    // Simulate the 'create' method to return an empty observable.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    create(_methodUrl: string, _object: any): Observable<any> {
      return of({});
    },

    userId: 1
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FontAwesomeModule,
        DataTablesModule,
        ComponentsModule,
        PipesModule,
        NgbModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: GlobalService,
          useValue: mockService
        },
      ],
      declarations: [AccountSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  // --- Test Methods ---


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const formValue = component.form.getRawValue();

    // Ensure that the initial form values are as expected
    expect(formValue.name).toBe(userSettingsResponse.globalPermissionGroup.name);
    expect(formValue.registeredSince).toBe('27/09/2023 12:35:13');
    expect(formValue.email).toBe(userSettingsResponse.email);
    expect(formValue.oldpassword).toBe('');
    expect(formValue.newpassword).toBe('');
    expect(formValue.confirmpass).toBe('');
  });

  it('should validate email as required', () => {
    const emailControl = component.form.get('email');

    // Set an empty email value
    emailControl.setValue('');
    expect(emailControl.hasError('required')).toBe(true);

    setFieldValue(fixture, 'input-email', 'test@example.com');
    expect(emailControl.hasError('required')).toBe(false);
  });


  it('should validate email format', () => {
    const emailControl = component.form.get('email');

    // Set an invalid email format
    setFieldValue(fixture, 'input-email', 'invalid-email');
    expect(emailControl.hasError('email')).toBe(true);

    // Set a valid email format
    setFieldValue(fixture, 'input-email', 'test@example.com');
    expect(emailControl.hasError('email')).toBe(false);
  });


  it('should validate password length', () => {
    const newPasswordControl = component.form.get('newpassword');
    const confirmPasswordControl = component.form.get('confirmpass');

    // Set a password with length less than PWD_MIN
    setFieldValue(fixture, 'input-newpassword', '123');
    setFieldValue(fixture, 'input-confirmpass', '123');
    expect(newPasswordControl.hasError('minlength')).toBe(true);
    expect(confirmPasswordControl.hasError('minlength')).toBe(true);

    // Set a password with length equal to PWD_MIN
    setFieldValue(fixture, 'input-newpassword', '1234');
    setFieldValue(fixture, 'input-confirmpass', '1234');
    expect(newPasswordControl.hasError('minlength')).toBe(false);
    expect(confirmPasswordControl.hasError('minlength')).toBe(false);

    // Set a password with length greater than PWD_MAX
    setFieldValue(fixture, 'input-newpassword', '1234567890123');
    setFieldValue(fixture, 'input-confirmpass', '1234567890123');
    expect(newPasswordControl.hasError('maxlength')).toBe(true);
    expect(confirmPasswordControl.hasError('maxlength')).toBe(true);

    // Set a password with length equal to PWD_MAX
    setFieldValue(fixture, 'input-newpassword', '123456789012');
    setFieldValue(fixture, 'input-confirmpass', '123456789012');
    expect(newPasswordControl.hasError('maxlength')).toBe(false);
    expect(confirmPasswordControl.hasError('maxlength')).toBe(false);
  });

  it('should validate password match', () => {
    // Set different passwords
    setFieldValue(fixture, 'input-newpassword', 'password123');
    setFieldValue(fixture, 'input-confirmpass', 'password456');

    expect(component.form.hasError('mismatch')).toBe(true);

    // Set matching passwords
    setFieldValue(fixture, 'input-newpassword', 'password123');
    setFieldValue(fixture, 'input-confirmpass', 'password123');

    expect(component.form.hasError('mismatch')).toBe(false);
  });

  it('should enable form submission when form is valid', () => {
    const btn: DebugElement = findEl(fixture, 'button-submit')

    // Initially, the form should be invalid, and the submit button should be disabled
    expect(component.form.valid).toBe(false);
    expect(btn.nativeElement.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('true')

    // Set valid values for the form
    setFieldValue(fixture, 'input-name', 'admin');
    setFieldValue(fixture, 'input-registered-since', '27/09/2023 12:35:13');
    setFieldValue(fixture, 'input-email', 'test@example.com');
    setFieldValue(fixture, 'input-password', 'summer123');
    setFieldValue(fixture, 'input-newpassword', 'password123');
    setFieldValue(fixture, 'input-confirmpass', 'password123');

    fixture.detectChanges();

    // The form should now be valid, and the submit button should be enabled
    expect(component.form.valid).toBe(true);
    expect(btn.nativeElement.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('false')
  });
});
