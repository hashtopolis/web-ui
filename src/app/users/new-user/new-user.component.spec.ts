import { of, throwError } from 'rxjs';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import { InputModule } from '@src/app/shared/input/input.module';
import { NewUserComponent } from '@src/app/users/new-user/new-user.component';

describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;

  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  const mockPermissionResponse: ResponseWrapper = {
    data: [
      {
        id: '1',
        type: SERV.ACCESS_PERMISSIONS_GROUPS.RESOURCE,
        attributes: {
          name: 'Default Group',
          permissions: {}
        }
      },
      {
        id: '2',
        type: SERV.ACCESS_PERMISSIONS_GROUPS.RESOURCE,
        attributes: {
          name: 'Custom Group',
          permissions: {}
        }
      }
    ],
    included: []
  };

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['getAll', 'create']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);

    await TestBed.configureTestingModule({
      declarations: [NewUserComponent],
      imports: [ReactiveFormsModule, InputModule],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: Router, useValue: mockRouter },
        { provide: AlertService, useValue: mockAlertService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    mockGlobalService.getAll.and.returnValue(of(mockPermissionResponse));
    fixture = TestBed.createComponent(NewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit and loads permissions
  });

  it('should create component and form', () => {
    expect(component).toBeTruthy();
    expect(component.newUserForm).toBeTruthy();
  });

  it('should load permission groups and map to select options', fakeAsync(() => {
    mockGlobalService.getAll.and.returnValue(of(mockPermissionResponse));

    component.loadPermissionGroups();
    tick();

    expect(mockGlobalService.getAll).toHaveBeenCalled();
    expect(component.selectGlobalPermissionGroups.length).toBe(2);
    expect(component.loadingPermissionGroups).toBeFalse();
  }));

  it('should show error message if loading permission groups fails', fakeAsync(() => {
    // Simulate an error response
    mockGlobalService.getAll.and.returnValue(throwError(() => new Error('Network error')));

    component.loadPermissionGroups();
    tick();

    expect(mockAlertService.showErrorMessage).toHaveBeenCalledWith('Error fetching permission groups');
    expect(component.loadingPermissionGroups).toBeFalse();
  }));

  // Tests related to form submission
  it('should not submit if form is invalid', async () => {
    component.newUserForm.patchValue({ email: '', username: '' }); // invalid
    await component.onSubmit();
    expect(mockGlobalService.create).not.toHaveBeenCalled();
  });

  it('should call create and navigate on valid form', async () => {
    component.newUserForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      globalPermissionGroupId: 1,
      isValid: true
    });
    component.newUserForm.updateValueAndValidity();

    // Simulate successful create
    mockGlobalService.create.and.returnValue(of({}));

    await component.onSubmit();

    expect(mockGlobalService.create).toHaveBeenCalledWith(SERV.USERS, {
      name: 'testuser',
      email: 'test@example.com',
      globalPermissionGroupId: 1,
      isValid: true
    });
    expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('User created');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['users/all-users']);
  });

  it('should show error if create fails', async () => {
    component.newUserForm.patchValue({
      username: 'failuser',
      email: 'fail@example.com',
      globalPermissionGroupId: 2,
      isValid: true
    });

    // Simulate create failure
    mockGlobalService.create.and.returnValue(throwError(() => new Error('Create failed')));

    await component.onSubmit();
    expect(mockAlertService.showErrorMessage).toHaveBeenCalledWith('Error creating user');
  });

  it('should show required field error message if fields are empty', () => {
    component.newUserForm.patchValue({
      username: '',
      email: '',
      globalPermissionGroupId: null
    });
    component.newUserForm.markAllAsTouched();
    fixture.detectChanges();

    // The help-block span should be visible if the form is invalid and touched
    const helpBlock = fixture.nativeElement.querySelector('.help-block');
    expect(helpBlock).toBeTruthy();
    expect(helpBlock.textContent).toContain('Please complete all required fields!');
  });

  it('should keep the submit button enabled if form is invalid', () => {
    // Make form invalid by clearing required fields
    component.newUserForm.patchValue({
      username: '',
      email: '',
      globalPermissionGroupId: null
    });
    component.newUserForm.markAllAsTouched();
    fixture.detectChanges();

    // Query the submit button and check if it is enabled
    const buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));
    expect(buttonDebugEl).toBeTruthy();
    const buttonEl: HTMLButtonElement = buttonDebugEl.nativeElement;
    expect(buttonEl.disabled).toBeFalse();
  });
});
