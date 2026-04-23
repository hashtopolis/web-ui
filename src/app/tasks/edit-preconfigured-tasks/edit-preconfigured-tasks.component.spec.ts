import { of, throwError } from 'rxjs';

import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { JPretask } from '@models/pretask.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { GlobalService } from '@services/main.service';
import {
  PreconfiguredTasksRoleService,
  PretaskRole
} from '@services/roles/tasks/preconfiguredTasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { ConfigService } from '@services/shared/config.service';

import { EditPreconfiguredTasksComponent } from '@src/app/tasks/edit-preconfigured-tasks/edit-preconfigured-tasks.component';
import { mockResponse } from '@src/app/testing/mock-response';

const API_BASE = 'http://localhost:8080/api/v2';

const MOCK_PRETASK: JPretask = {
  id: 7,
  taskName: 'Wordlist baseline',
  attackCmd: '-a 0 #HL# dict.txt',
  color: '#112233',
  chunkTime: 600,
  statusTimer: 5,
  priority: 10,
  maxAgents: 4,
  isCpuTask: false,
  isSmall: false,
  isMaskImport: false,
  useNewBench: true,
  crackerBinaryTypeId: 1
} as unknown as JPretask;

async function flushPretaskLoad(
  fixture: ComponentFixture<EditPreconfiguredTasksComponent>,
  httpTesting: HttpTestingController,
  pretask: JPretask = MOCK_PRETASK
): Promise<void> {
  fixture.detectChanges();
  const req = httpTesting.expectOne((r) => r.url.endsWith('/ui/pretasks/7'));
  req.flush(mockResponse({ data: { id: String(pretask.id), type: 'Pretasks', attributes: {} } }));
  await fixture.whenStable();
}

describe('EditPreconfiguredTasksComponent', () => {
  let component: EditPreconfiguredTasksComponent;
  let fixture: ComponentFixture<EditPreconfiguredTasksComponent>;
  let httpTesting: HttpTestingController;

  let titleServiceSpy: jasmine.SpyObj<AutoTitleService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let serializerSpy: jasmine.SpyObj<JsonAPISerializer>;
  let roleServiceSpy: jasmine.SpyObj<PreconfiguredTasksRoleService>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;

  beforeEach(async () => {
    titleServiceSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['showErrorMessage', 'showSuccessMessage']);
    globalServiceSpy = jasmine.createSpyObj('GlobalService', ['update']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    serializerSpy = jasmine.createSpyObj('JsonAPISerializer', ['deserialize']);
    roleServiceSpy = jasmine.createSpyObj('PreconfiguredTasksRoleService', ['hasRole']);
    configServiceSpy = jasmine.createSpyObj('ConfigService', ['getEndpoint']);

    roleServiceSpy.hasRole.and.returnValue(false);
    configServiceSpy.getEndpoint.and.returnValue(API_BASE);
    serializerSpy.deserialize.and.returnValue(MOCK_PRETASK);
    globalServiceSpy.update.and.returnValue(of(mockResponse()));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [EditPreconfiguredTasksComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '7' } } } },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: JsonAPISerializer, useValue: serializerSpy },
        { provide: PreconfiguredTasksRoleService, useValue: roleServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(EditPreconfiguredTasksComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('Component creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should set the page title', () => {
      expect(titleServiceSpy.set).toHaveBeenCalledWith(['Edit Preconfigured Tasks']);
    });
  });

  describe('Form population', () => {
    it('should populate updateData controls from the loaded pretask', async () => {
      await flushPretaskLoad(fixture, httpTesting);

      const updateData = component.updateForm.controls.updateData;
      expect(updateData.controls.taskName.value).toBe('Wordlist baseline');
      expect(updateData.controls.attackCmd.value).toBe('-a 0 #HL# dict.txt');
      expect(updateData.controls.color.value).toBe('#112233');
      expect(updateData.controls.chunkTime.value).toBe(600);
      expect(updateData.controls.priority.value).toBe(10);
      expect(updateData.controls.maxAgents.value).toBe(4);
      expect(updateData.controls.isCpuTask.value).toBe(false);
      expect(updateData.controls.isSmall.value).toBe(false);
    });

    it('should populate the disabled pretaskId / statusTimer / useNewBench controls', async () => {
      await flushPretaskLoad(fixture, httpTesting);

      expect(component.updateForm.controls.pretaskId.value).toBe(7);
      expect(component.updateForm.controls.statusTimer.value).toBe(5);
      expect(component.updateForm.controls.useNewBench.value).toBe(true);
    });

    it('should drop the loading gate after load', async () => {
      expect(component.isLoading).toBe(true);
      await flushPretaskLoad(fixture, httpTesting);

      expect(component.isLoading).toBe(false);
    });
  });

  describe('Read-only mode', () => {
    it('should set isReadOnly to true when the user lacks the edit role', async () => {
      await flushPretaskLoad(fixture, httpTesting);

      expect(component.isReadOnly).toBe(true);
    });

    it('should disable updateData controls when read-only', async () => {
      await flushPretaskLoad(fixture, httpTesting);

      expect(component.updateForm.controls.updateData.controls.taskName.disabled).toBe(true);
      expect(component.updateForm.controls.updateData.controls.attackCmd.disabled).toBe(true);
    });

    it('should not call gs.update on submit when read-only', async () => {
      await flushPretaskLoad(fixture, httpTesting);

      component.onSubmit();

      expect(globalServiceSpy.update).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      roleServiceSpy.hasRole.and.callFake((role: string) => role === PretaskRole.Edit);
    });

    it('should send the raw updateData value to gs.update', async () => {
      await flushPretaskLoad(fixture, httpTesting);

      component.onSubmit();

      expect(globalServiceSpy.update).toHaveBeenCalled();
      const [, , payload] = globalServiceSpy.update.calls.mostRecent().args;
      expect(payload).toEqual(
        jasmine.objectContaining({
          taskName: 'Wordlist baseline',
          attackCmd: '-a 0 #HL# dict.txt'
        })
      );
    });

    it('should navigate to the pretasks list after a successful update', async () => {
      await flushPretaskLoad(fixture, httpTesting);

      await component.onSubmit();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['tasks/preconfigured-tasks']);
    });

    it('should not call gs.update when the form is invalid', async () => {
      await flushPretaskLoad(fixture, httpTesting);

      component.updateForm.controls.updateData.controls.taskName.setValue('');
      component.onSubmit();

      expect(globalServiceSpy.update).not.toHaveBeenCalled();
    });
  });

  describe('Error handling during load', () => {
    it('should redirect to /forbidden on 403', async () => {
      spyOn(component as unknown as { loadPretask: () => Promise<void> }, 'loadPretask').and.returnValue(
        Promise.reject(new HttpErrorResponse({ status: 403 }))
      );

      await component.ngOnInit();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/forbidden');
    });

    it('should redirect to /not-found on 404', async () => {
      spyOn(component as unknown as { loadPretask: () => Promise<void> }, 'loadPretask').and.returnValue(
        Promise.reject(new HttpErrorResponse({ status: 404 }))
      );

      await component.ngOnInit();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/not-found');
    });

    it('should show an alert on other server errors', async () => {
      spyOn(component as unknown as { loadPretask: () => Promise<void> }, 'loadPretask').and.returnValue(
        Promise.reject(new HttpErrorResponse({ status: 500 }))
      );

      await component.ngOnInit();

      expect(alertServiceSpy.showErrorMessage).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
    });

    it('should propagate update errors without navigating', async () => {
      roleServiceSpy.hasRole.and.callFake((role: string) => role === PretaskRole.Edit);
      globalServiceSpy.update.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
      await flushPretaskLoad(fixture, httpTesting);

      await component.onSubmit();

      expect(component.isUpdatingLoading).toBe(false);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });
});
