import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ActivatedRoute, Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { TasksRoleService } from '@services/roles/tasks/tasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { ConfigService } from '@services/shared/config.service';

import { EditTasksComponent } from '@src/app/tasks/edit-tasks/edit-tasks.component';
import { mockResponse } from '@src/app/testing/mock-response';

const API_ENDPOINT = 'http://localhost:8080/api/v2';

const mockTaskResponse = (): ResponseWrapper =>
  mockResponse({
    data: {
      id: 1,
      type: 'task',
      attributes: {
        taskName: 'Test Task',
        attackCmd: '-a 0 #HL# rockyou.txt',
        chunkTime: 600,
        statusTimer: 5,
        keyspace: 1000,
        keyspaceProgress: 200,
        priority: 1,
        maxAgents: 0,
        color: '#ff0000',
        isSmall: false,
        isCpuTask: false,
        useNewBench: true,
        skipKeyspace: 0,
        crackerBinaryId: 1,
        crackerBinaryTypeId: 1,
        taskWrapperId: 2,
        isArchived: false,
        notes: 'Test notes',
        staticChunks: 0,
        chunkSize: 1000,
        forcePipe: false,
        preprocessorId: 0,
        preprocessorCommand: '',
        timeSpent: 120,
        currentSpeed: 500,
        estimatedTime: 60,
        cprogress: 10,
        status: 1,
        totalNumberOfChunks: 5,
        searched: '50'
      }
    }
  }) as ResponseWrapper;

describe('EditTasksComponent', () => {
  let component: EditTasksComponent;
  let fixture: ComponentFixture<EditTasksComponent>;
  let httpMock: HttpTestingController;

  let titleServiceSpy: jasmine.SpyObj<AutoTitleService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let confirmDialogSpy: jasmine.SpyObj<ConfirmDialogService>;
  let roleServiceSpy: jasmine.SpyObj<TasksRoleService>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;

  beforeEach(async () => {
    spyOn(console, 'error');
    spyOn(console, 'warn');

    titleServiceSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', [
      'showErrorMessage',
      'showSuccessMessage',
      'showInfoMessage'
    ]);
    globalServiceSpy = jasmine.createSpyObj('GlobalService', ['getAll', 'get', 'create', 'update', 'chelper']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));
    confirmDialogSpy = jasmine.createSpyObj('ConfirmDialogService', ['confirmYesNo']);
    roleServiceSpy = jasmine.createSpyObj('TasksRoleService', ['hasRole']);
    roleServiceSpy.hasRole.and.returnValue(false);
    configServiceSpy = jasmine.createSpyObj('ConfigService', ['getEndpoint']);
    configServiceSpy.getEndpoint.and.returnValue(API_ENDPOINT);

    await TestBed.configureTestingModule({
      declarations: [EditTasksComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ConfirmDialogService, useValue: confirmDialogSpy },
        { provide: TasksRoleService, useValue: roleServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '1' } },
            data: of({ kind: 'edit-task' })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function initComponent(): void {
    fixture = TestBed.createComponent(EditTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function respondToTaskRequest(response: ResponseWrapper): void {
    const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/') && r.params.has('include'));
    req.flush(response);
  }

  describe('Component initialization', () => {
    it('should create', fakeAsync(() => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      expect(component).toBeTruthy();
    }));

    it('should set page title to "Edit Task"', fakeAsync(() => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      expect(titleServiceSpy.set).toHaveBeenCalledWith(['Edit Task']);
    }));

    it('should define updateForm with all expected controls', fakeAsync(() => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      expect(component.updateForm.get('taskId')).toBeDefined();
      expect(component.updateForm.get('totalNumberOfChunks')).toBeDefined();
      expect(component.updateForm.get('updateData.taskName')).toBeDefined();
      expect(component.updateForm.get('updateData.attackCmd')).toBeDefined();
      expect(component.updateForm.get('updateData.notes')).toBeDefined();
    }));
  });

  describe('ngOnInit', () => {
    it('should set isLoading to false after task loads successfully', fakeAsync(() => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      expect(component.isLoading).toBeFalse();
    }));

    it('should populate form with task data from response', fakeAsync(() => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      expect(component.updateForm.getRawValue()).toEqual(
        jasmine.objectContaining({
          taskId: 1,
          forcePipe: 'No',
          staticChunks: 'No',
          skipKeyspace: 'N/A',
          keyspace: 1000,
          keyspaceProgress: 200,
          crackerBinaryId: 1,
          chunkSize: 1000,
          totalNumberOfChunks: 5
        })
      );
    }));

    it('should populate updateData sub-form from task attributes', fakeAsync(() => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      const updateData = component.updateForm.getRawValue()['updateData'];
      expect(updateData).toEqual(
        jasmine.objectContaining({
          taskName: 'Test Task',
          attackCmd: '-a 0 #HL# rockyou.txt',
          notes: 'Test notes',
          color: '#ff0000',
          chunkTime: 600,
          priority: 1
        })
      );
    }));

    it('should set component time/speed properties from task data', fakeAsync(() => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      expect(component.ctimespent).toBe(120);
      expect(component.currenspeed).toBe(500);
      expect(component.estimatedTime).toBe(60);
      expect(component.cprogress).toBe(10);
      expect(component.tkeyspace).toBe(1000);
      expect(component.taskWrapperId).toBe(2);
    }));

    it('should set chunkview to 0 for edit-task route', fakeAsync(() => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      expect(component.chunkview).toBe(0);
    }));

    it('should show forcePipe as "Yes" when task.forcePipe is true', fakeAsync(() => {
      const response = mockResponse({
        data: {
          ...(mockTaskResponse().data as object),
          attributes: {
            ...((mockTaskResponse().data as Record<string, unknown>)['attributes'] as object),
            forcePipe: true
          }
        }
      }) as ResponseWrapper;

      initComponent();
      respondToTaskRequest(response);
      tick();

      expect(component.updateForm.getRawValue()['forcePipe']).toBe('Yes');
    }));

    it('should show skipKeyspace value when it is greater than 0', fakeAsync(() => {
      const response = mockResponse({
        data: {
          ...(mockTaskResponse().data as object),
          attributes: {
            ...((mockTaskResponse().data as Record<string, unknown>)['attributes'] as object),
            skipKeyspace: 500
          }
        }
      }) as ResponseWrapper;

      initComponent();
      respondToTaskRequest(response);
      tick();

      expect(component.updateForm.getRawValue()['skipKeyspace']).toBe(500);
    }));

    it('should label staticChunks=1 as "Fixed chunk size (1)"', fakeAsync(() => {
      const response = mockResponse({
        data: {
          ...(mockTaskResponse().data as object),
          attributes: {
            ...((mockTaskResponse().data as Record<string, unknown>)['attributes'] as object),
            staticChunks: 1
          }
        }
      }) as ResponseWrapper;

      initComponent();
      respondToTaskRequest(response);
      tick();

      expect(component.updateForm.getRawValue()['staticChunks']).toBe('Fixed chunk size (1)');
    }));

    it('should label staticChunks=2 as "Fixed number of chunks (2)"', fakeAsync(() => {
      const response = mockResponse({
        data: {
          ...(mockTaskResponse().data as object),
          attributes: {
            ...((mockTaskResponse().data as Record<string, unknown>)['attributes'] as object),
            staticChunks: 2
          }
        }
      }) as ResponseWrapper;

      initComponent();
      respondToTaskRequest(response);
      tick();

      expect(component.updateForm.getRawValue()['staticChunks']).toBe('Fixed number of chunks (2)');
    }));

    it('should navigate to /not-found on 404 error', fakeAsync(() => {
      initComponent();
      const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/'));
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
      tick();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/not-found');
    }));

    it('should navigate to /forbidden on 403 error', fakeAsync(() => {
      initComponent();
      const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/'));
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
      tick();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/forbidden');
    }));

    it('should show error message on 500 without redirect', fakeAsync(() => {
      initComponent();
      const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/') && r.params.has('include'));
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      tick();

      const retryReq = httpMock.expectOne((r) => r.url.includes('/ui/tasks/') && !r.params.has('include'));
      retryReq.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      tick();

      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
      expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith(jasmine.stringContaining('Error loading task'));
      expect(component.isLoading).toBeFalse();
    }));

    it('should retry without includes on 500 and succeed', fakeAsync(() => {
      initComponent();
      const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/') && r.params.has('include'));
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      tick();

      const retryReq = httpMock.expectOne((r) => r.url.includes('/ui/tasks/') && !r.params.has('include'));
      retryReq.flush(mockTaskResponse());
      tick();

      expect(component.isLoading).toBeFalse();
      expect(component.tkeyspace).toBe(1000);
    }));

    it('should show generic error message on non-HTTP error', fakeAsync(() => {
      initComponent();
      const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/'));
      req.error(new ProgressEvent('error'));
      tick();

      expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith('Error loading task.');
      expect(component.isLoading).toBeFalse();
    }));
  });

  describe('isReadOnly', () => {
    it('should be true when "edit" role is not present', fakeAsync(() => {
      roleServiceSpy.hasRole.and.returnValue(false);
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      expect(component.isReadOnly).toBeTrue();
    }));

    it('should be false when "edit" role is present', fakeAsync(() => {
      roleServiceSpy.hasRole.and.callFake((role: string) => role === 'edit');
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      expect(component.isReadOnly).toBeFalse();
    }));
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      roleServiceSpy.hasRole.and.callFake((role: string) => role === 'edit');
    });

    it('should call gs.update and navigate when form is valid and attackCmd unchanged', fakeAsync(() => {
      globalServiceSpy.update.and.returnValue(of({}));
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      component.onSubmit();
      tick();

      expect(globalServiceSpy.update).toHaveBeenCalledWith(
        SERV.TASKS,
        1,
        jasmine.objectContaining({ taskName: 'Test Task', attackCmd: '-a 0 #HL# rockyou.txt' })
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['tasks/show-tasks']);
    }));

    it('should show success message after successful update', fakeAsync(() => {
      globalServiceSpy.update.and.returnValue(of({}));
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      component.onSubmit();
      tick();

      expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith('Task data has been updated successfully.');
    }));

    it('should open confirm dialog when attackCmd is changed', fakeAsync(() => {
      confirmDialogSpy.confirmYesNo.and.returnValue(of(false));
      globalServiceSpy.update.and.returnValue(of({}));
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      component.updateForm.get('updateData.attackCmd')?.setValue('-a 3 #HL#');
      component.onSubmit();
      tick();

      expect(confirmDialogSpy.confirmYesNo).toHaveBeenCalledWith('Update task data', jasmine.any(String));
    }));

    it('should call gs.update after confirming attackCmd change', fakeAsync(() => {
      confirmDialogSpy.confirmYesNo.and.returnValue(of(true));
      globalServiceSpy.update.and.returnValue(of({}));
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      component.updateForm.get('updateData.attackCmd')?.setValue('-a 3 #HL#');
      component.onSubmit();
      tick();

      expect(globalServiceSpy.update).toHaveBeenCalled();
    }));

    it('should show info message when attackCmd change is cancelled', fakeAsync(() => {
      confirmDialogSpy.confirmYesNo.and.returnValue(of(false));
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      component.updateForm.get('updateData.attackCmd')?.setValue('-a 3 #HL#');
      component.onSubmit();
      tick();

      expect(globalServiceSpy.update).not.toHaveBeenCalled();
      expect(alertServiceSpy.showInfoMessage).toHaveBeenCalledWith('Task Information has not been updated');
    }));

    it('should mark form as touched when form is invalid', fakeAsync(() => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      component.updateForm.get('updateData.attackCmd')?.setValue('');
      const markAllAsTouchedSpy = spyOn(component.updateForm, 'markAllAsTouched');
      const updateValueAndValiditySpy = spyOn(component.updateForm, 'updateValueAndValidity');

      component.onSubmit();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(updateValueAndValiditySpy).toHaveBeenCalled();
      expect(globalServiceSpy.update).not.toHaveBeenCalled();
    }));
  });

  describe('purgeTask', () => {
    it('should call chelper and show success message on confirmation', fakeAsync(() => {
      confirmDialogSpy.confirmYesNo.and.returnValue(of(true));
      globalServiceSpy.chelper.and.returnValue(of({}));
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      component.purgeTask();
      tick();

      expect(globalServiceSpy.chelper).toHaveBeenCalledWith(SERV.HELPER, 'purgeTask', { taskId: 1 });
      expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith('Purged task id 1');
    }));

    it('should show info message when purge is cancelled', fakeAsync(() => {
      confirmDialogSpy.confirmYesNo.and.returnValue(of(false));
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      component.purgeTask();

      expect(globalServiceSpy.chelper).not.toHaveBeenCalled();
      expect(alertServiceSpy.showInfoMessage).toHaveBeenCalledWith('Purge was cancelled');
    }));
  });

  describe('onChunkViewChange', () => {
    it('should set chunkview to the event value', fakeAsync(() => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      component.onChunkViewChange({ value: 1 } as MatButtonToggleChange);

      expect(component.chunkview).toBe(1);
    }));

    it('should switch chunkview back to 0', fakeAsync(() => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      component.onChunkViewChange({ value: 1 } as MatButtonToggleChange);
      component.onChunkViewChange({ value: 0 } as MatButtonToggleChange);

      expect(component.chunkview).toBe(0);
    }));
  });

  describe('ngOnDestroy', () => {
    it('should destroy without errors', fakeAsync(() => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      tick();

      expect(() => fixture.destroy()).not.toThrow();
    }));
  });
});

describe('EditTasksComponent (edit-task-cAll route)', () => {
  let component: EditTasksComponent;
  let fixture: ComponentFixture<EditTasksComponent>;
  let httpMock: HttpTestingController;

  let titleServiceSpy: jasmine.SpyObj<AutoTitleService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let confirmDialogSpy: jasmine.SpyObj<ConfirmDialogService>;
  let roleServiceSpy: jasmine.SpyObj<TasksRoleService>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;

  beforeEach(async () => {
    spyOn(console, 'error');
    spyOn(console, 'warn');

    titleServiceSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', [
      'showErrorMessage',
      'showSuccessMessage',
      'showInfoMessage'
    ]);
    globalServiceSpy = jasmine.createSpyObj('GlobalService', ['getAll', 'get', 'create', 'update', 'chelper']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));
    confirmDialogSpy = jasmine.createSpyObj('ConfirmDialogService', ['confirmYesNo']);
    roleServiceSpy = jasmine.createSpyObj('TasksRoleService', ['hasRole']);
    roleServiceSpy.hasRole.and.returnValue(false);
    configServiceSpy = jasmine.createSpyObj('ConfigService', ['getEndpoint']);
    configServiceSpy.getEndpoint.and.returnValue(API_ENDPOINT);

    await TestBed.configureTestingModule({
      declarations: [EditTasksComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ConfirmDialogService, useValue: confirmDialogSpy },
        { provide: TasksRoleService, useValue: roleServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '1' } },
            data: of({ kind: 'edit-task-cAll' })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set chunkview to 1 for edit-task-cAll route', fakeAsync(() => {
    fixture = TestBed.createComponent(EditTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/') && r.params.has('include'));
    req.flush(mockTaskResponse());
    tick();

    expect(component.chunkview).toBe(1);
  }));
});
