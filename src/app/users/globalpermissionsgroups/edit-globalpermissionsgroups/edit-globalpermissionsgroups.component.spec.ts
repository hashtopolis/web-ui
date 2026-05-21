import { zGlobalPermissionGroupResponse } from '@generated/api/zod';
import { of } from 'rxjs';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { JGlobalPermissionGroup } from '@models/global-permission-group.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { mockResponse } from '@src/app/testing/mock-response';
import { EditGlobalpermissionsgroupsComponent } from '@src/app/users/globalpermissionsgroups/edit-globalpermissionsgroups/edit-globalpermissionsgroups.component';

const MOCK_GPG: JGlobalPermissionGroup = {
  id: 1,
  type: 'globalPermissionGroup',
  name: 'Administrators',
  permissions: {}
};

describe('EditGlobalpermissionsgroupsComponent', () => {
  let component: EditGlobalpermissionsgroupsComponent;
  let fixture: ComponentFixture<EditGlobalpermissionsgroupsComponent>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockUnsubscribeService: jasmine.SpyObj<UnsubscribeService>;
  let mockAutoTitleService: jasmine.SpyObj<AutoTitleService>;

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['get', 'update']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage']);
    mockUnsubscribeService = jasmine.createSpyObj('UnsubscribeService', ['add', 'unsubscribeAll']);
    mockAutoTitleService = jasmine.createSpyObj('AutoTitleService', ['set']);

    mockGlobalService.get.and.returnValue(of(mockResponse()));
    mockGlobalService.update.and.returnValue(of({}));

    // JsonAPISerializer is used with `new` inside the component — spy on the
    // prototype to avoid coupling tests to the real JSON:API parsing logic.
    spyOn(JsonAPISerializer.prototype, 'deserialize').and.callFake((_body: unknown, schema?: unknown) => {
      if (schema === zGlobalPermissionGroupResponse) return MOCK_GPG;
      return MOCK_GPG;
    });

    await TestBed.configureTestingModule({
      declarations: [EditGlobalpermissionsgroupsComponent],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: UnsubscribeService, useValue: mockUnsubscribeService },
        { provide: AutoTitleService, useValue: mockAutoTitleService },
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditGlobalpermissionsgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // initialization

  describe('initialization', () => {
    it('should extract the group ID from the route params', () => {
      expect(component.editedGPGIndex).toBe(1);
    });

    it('should set the page title', () => {
      expect(mockAutoTitleService.set).toHaveBeenCalledWith(['Edit Global Permissions']);
    });

    it('should build the update form', () => {
      expect(component.updateForm).toBeDefined();
    });
  });

  // loadData()

  describe('loadData()', () => {
    it('should call gs.get with the correct endpoint and ID', () => {
      expect(mockGlobalService.get).toHaveBeenCalled();
      const [config, id, params] = mockGlobalService.get.calls.mostRecent().args;
      expect(config).toEqual(SERV.ACCESS_PERMISSIONS_GROUPS);
      expect(id).toBe(1);
      expect(params).toEqual(jasmine.objectContaining({ include: ['userMembers'] }));
    });

    it('should store the deserialized group in editedGPG', () => {
      expect(component.editedGPG).toEqual(MOCK_GPG);
    });

    it('should populate the form name field with the group name', () => {
      expect(component.updateForm.getRawValue().name).toBe(MOCK_GPG.name);
    });
  });

  // onSubmit()

  describe('onSubmit()', () => {
    describe('when the form is valid', () => {
      it('should call gs.update with the correct endpoint and ID', () => {
        component.onSubmit();
        expect(mockGlobalService.update).toHaveBeenCalledOnceWith(
          SERV.ACCESS_PERMISSIONS_GROUPS,
          component.editedGPGIndex,
          component.updateForm.value
        );
      });

      it('should show a success message', () => {
        component.onSubmit();
        expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Global Permission Group saved');
      });

      it('should set processing to false after the update completes', () => {
        component.onSubmit();
        expect(component.processing).toBeFalse();
      });
    });

    describe('when the form is invalid', () => {
      beforeEach(() => {
        component.updateForm.controls.name.setValue('');
        component.updateForm.controls.name.markAsTouched();
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
});
