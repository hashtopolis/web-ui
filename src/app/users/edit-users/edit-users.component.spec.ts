import { zGlobalPermissionGroupListResponse } from '@generated/api/zod';
import { of } from 'rxjs';

import { LOCALE_ID, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { JGlobalPermissionGroup } from '@models/global-permission-group.model';
import { JUser } from '@models/user.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionRoleService } from '@services/roles/user/permission-role.service';
import { UserRoleService } from '@services/roles/user/user-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { mockResponse } from '@src/app/testing/mock-response';
import { EditUsersComponent } from '@src/app/users/edit-users/edit-users.component';

const MOCK_PERMISSION_GROUP: JGlobalPermissionGroup = {
  id: 1,
  name: 'Administrator',
  permissions: {}
} as JGlobalPermissionGroup;

const MOCK_USER: JUser = {
  id: 1,
  name: 'admin',
  email: 'admin@localhost',
  registeredSince: 1704067200,
  lastLoginDate: 1716115200,
  globalPermissionGroupId: 1,
  globalPermissionGroup: MOCK_PERMISSION_GROUP,
  isValid: true,
  accessGroups: [{ id: 1, groupName: 'Default Group' }],
  isComputedPassword: false,
  otp1: '',
  otp2: '',
  otp3: '',
  otp4: '',
  sessionLifetime: 0,
  yubikey: ''
} as JUser;

const MOCK_PERMISSION_GROUPS: JGlobalPermissionGroup[] = [MOCK_PERMISSION_GROUP];

describe('EditUsersComponent', () => {
  let component: EditUsersComponent;
  let fixture: ComponentFixture<EditUsersComponent>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockUnsubscribeService: jasmine.SpyObj<UnsubscribeService>;
  let mockAutoTitleService: jasmine.SpyObj<AutoTitleService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockConfirmDialogService: jasmine.SpyObj<ConfirmDialogService>;
  let mockUserRoleService: jasmine.SpyObj<UserRoleService>;
  let mockPermissionRoleService: jasmine.SpyObj<PermissionRoleService>;

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['get', 'getAll', 'update', 'delete', 'chelper']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage']);
    mockUnsubscribeService = jasmine.createSpyObj('UnsubscribeService', ['add', 'unsubscribeAll']);
    mockAutoTitleService = jasmine.createSpyObj('AutoTitleService', ['set']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockConfirmDialogService = jasmine.createSpyObj('ConfirmDialogService', ['confirmDeletion']);
    mockUserRoleService = jasmine.createSpyObj('UserRoleService', [
      'canRead',
      'canCreate',
      'canUpdate',
      'canDelete',
      'hasRole'
    ]);
    mockPermissionRoleService = jasmine.createSpyObj('PermissionRoleService', [
      'canRead',
      'canCreate',
      'canUpdate',
      'canDelete',
      'hasRole'
    ]);

    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    mockGlobalService.get.and.returnValue(of(mockResponse()));
    mockGlobalService.getAll.and.returnValue(of(mockResponse()));
    mockGlobalService.update.and.returnValue(of({}));
    mockGlobalService.delete.and.returnValue(of({}));
    mockGlobalService.chelper.and.returnValue(of({}));

    // JsonAPISerializer is used with `new` inside the component — spy on the
    // prototype to avoid coupling tests to the real JSON:API parsing logic.
    spyOn(JsonAPISerializer.prototype, 'deserialize').and.callFake((_body: unknown, schema?: unknown) => {
      if (schema === zGlobalPermissionGroupListResponse) return MOCK_PERMISSION_GROUPS;
      return MOCK_USER; // covers zUserResponse (loadData + initForm)
    });

    await TestBed.configureTestingModule({
      declarations: [EditUsersComponent],
      providers: [
        { provide: LOCALE_ID, useValue: 'en-US' },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: UnsubscribeService, useValue: mockUnsubscribeService },
        { provide: AutoTitleService, useValue: mockAutoTitleService },
        { provide: Router, useValue: mockRouter },
        { provide: ConfirmDialogService, useValue: mockConfirmDialogService },
        { provide: UserRoleService, useValue: mockUserRoleService },
        { provide: PermissionRoleService, useValue: mockPermissionRoleService },
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Initialization

  describe('initialization', () => {
    it('should extract the user ID from the route params', () => {
      expect(component.editedUserIndex).toBe(1);
    });

    it('should set the page title', () => {
      expect(mockAutoTitleService.set).toHaveBeenCalledWith(['Edit User']);
    });

    it('should build the edit form', () => {
      expect(component.updateForm).toBeDefined();
    });

    it('should build the password form', () => {
      expect(component.updatePassForm).toBeDefined();
    });
  });

  //loadData()

  describe('loadData()', () => {
    it('should store the user name for use in messages', () => {
      expect(component.editedUserName).toBe(MOCK_USER.name);
    });

    it('should populate the user access-group select options', () => {
      expect(component.selectUserAgps).toBeDefined();
      expect(component.selectUserAgps.length).toBe(MOCK_USER.accessGroups!.length);
    });

    it('should populate the global permission-group select options', () => {
      expect(component.selectGlobalPermissionGroups).toBeDefined();
      expect(component.selectGlobalPermissionGroups.length).toBe(MOCK_PERMISSION_GROUPS.length);
    });

    it('should set isLoading to false after the permission groups are fetched', () => {
      expect(component.isLoading).toBeFalse();
    });
  });

  //initForm()

  describe('initForm()', () => {
    it('should fill the form with the user name', () => {
      expect(component.updateForm.getRawValue().name).toBe(MOCK_USER.name);
    });

    it('should fill the form with the user email', () => {
      expect(component.updateForm.getRawValue().email).toBe(MOCK_USER.email);
    });

    it('should populate updateData.globalPermissionGroupId', () => {
      expect(component.updateForm.value.updateData?.globalPermissionGroupId).toBe(MOCK_USER.globalPermissionGroupId);
    });

    it('should populate updateData.isValid with the user active status', () => {
      expect(component.updateForm.value.updateData?.isValid).toBe(MOCK_USER.isValid);
    });
  });

  //onSubmit()

  describe('onSubmit()', () => {
    describe('when the form is valid', () => {
      beforeEach(() => {
        component.updateForm.get('updateData.globalPermissionGroupId')?.setValue(MOCK_USER.globalPermissionGroupId);
        component.updateForm.get('updateData.isValid')?.setValue(MOCK_USER.isValid);
      });

      it('should call gs.update with the correct endpoint and user ID', () => {
        component.onSubmit();
        expect(mockGlobalService.update).toHaveBeenCalledOnceWith(
          SERV.USERS,
          component.editedUserIndex,
          jasmine.objectContaining({
            globalPermissionGroupId: MOCK_USER.globalPermissionGroupId,
            isValid: MOCK_USER.isValid
          })
        );
      });

      it('should navigate to the users list after a successful update', () => {
        component.onSubmit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['users/all-users']);
      });

      it('should show a success message containing the user name', async () => {
        component.onSubmit();
        await Promise.resolve(); // wait for router.navigate().then()
        expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith(jasmine.stringContaining(MOCK_USER.name));
      });

      it('should reset isUpdatingLoading to false after the update completes', () => {
        component.onSubmit();
        expect(component.isUpdatingLoading).toBeFalse();
      });
    });

    describe('when the form is invalid', () => {
      beforeEach(() => {
        component.updateForm.setErrors({ required: true });
      });

      it('should NOT call gs.update', () => {
        component.onSubmit();
        expect(mockGlobalService.update).not.toHaveBeenCalled();
      });

      it('should mark all form controls as touched so validation messages become visible', () => {
        component.onSubmit();
        expect(component.updateForm.touched).toBeTrue();
      });
    });
  });

  //onDelete()

  describe('onDelete()', () => {
    describe('when the user confirms deletion', () => {
      beforeEach(() => {
        mockConfirmDialogService.confirmDeletion.and.returnValue(of(true));
      });

      it('should call gs.delete with the correct endpoint and user ID', () => {
        component.onDelete();
        expect(mockGlobalService.delete).toHaveBeenCalledOnceWith(SERV.USERS, component.editedUserIndex);
      });

      it('should navigate to the users list after deletion', () => {
        component.onDelete();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/users/all-users']);
      });

      it('should show a success message containing the user name', async () => {
        component.onDelete();
        await Promise.resolve(); // wait for router.navigate().then()
        expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith(
          jasmine.stringContaining(component.editedUserName)
        );
      });
    });

    describe('when the user cancels deletion', () => {
      beforeEach(() => {
        mockConfirmDialogService.confirmDeletion.and.returnValue(of(false));
      });

      it('should NOT call gs.delete', () => {
        component.onDelete();
        expect(mockGlobalService.delete).not.toHaveBeenCalled();
      });

      it('should NOT navigate', () => {
        component.onDelete();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });
    });
  });

  //onUpdatePass()

  describe('onUpdatePass()', () => {
    it('should call gs.chelper with the password and the current user ID when a password is provided', () => {
      component.onUpdatePass({ password: 'newpassword123' });
      expect(mockGlobalService.chelper).toHaveBeenCalledOnceWith(
        SERV.HELPER,
        'setUserPassword',
        jasmine.objectContaining({
          password: 'newpassword123',
          userId: component.editedUserIndex
        })
      );
    });

    it('should NOT call gs.chelper when the password field is empty', () => {
      component.onUpdatePass({ password: '' });
      expect(mockGlobalService.chelper).not.toHaveBeenCalled();
    });

    it('should NOT call gs.chelper when no password is provided', () => {
      component.onUpdatePass({});
      expect(mockGlobalService.chelper).not.toHaveBeenCalled();
    });
  });

  //ngOnDestroy()

  describe('ngOnDestroy()', () => {
    it('should call unsubscribeService.unsubscribeAll to prevent memory leaks', () => {
      component.ngOnDestroy();
      expect(mockUnsubscribeService.unsubscribeAll).toHaveBeenCalledTimes(1);
    });
  });
});
