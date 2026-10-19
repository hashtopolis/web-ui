import { HttpHeaderName } from '@constants/http.config';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

import { StaticChunkingMode } from '@src/app/core/_constants/tasks.config';
import { EditTasksComponent } from '@src/app/tasks/edit-tasks/edit-tasks.component';
import { mockResponse } from '@src/app/testing/mock-response';
import { wait } from '@src/app/testing/wait';

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

  let titleServiceSpy: MockedObject<AutoTitleService>;
  let alertServiceSpy: MockedObject<AlertService>;
  let globalServiceSpy: MockedObject<GlobalService>;
  let routerSpy: MockedObject<Router>;
  let confirmDialogSpy: MockedObject<ConfirmDialogService>;
  let roleServiceSpy: MockedObject<TasksRoleService>;
  let configServiceSpy: MockedObject<ConfigService>;

  beforeEach(async () => {
    vi.spyOn(console, 'error').mockReturnValue(undefined);
    vi.spyOn(console, 'warn').mockReturnValue(undefined);

    titleServiceSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;
    alertServiceSpy = {
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage'),
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
      showInfoMessage: vi.fn().mockName('AlertService.showInfoMessage')
    } as MockedObject<AlertService>;
    globalServiceSpy = {
      getAll: vi.fn().mockName('GlobalService.getAll'),
      get: vi.fn().mockName('GlobalService.get'),
      create: vi.fn().mockName('GlobalService.create'),
      update: vi.fn().mockName('GlobalService.update'),
      chelper: vi.fn().mockName('GlobalService.chelper')
    } as MockedObject<GlobalService>;
    routerSpy = {
      navigate: vi.fn().mockName('Router.navigate'),
      navigateByUrl: vi.fn().mockName('Router.navigateByUrl')
    } as MockedObject<Router>;
    routerSpy.navigate.mockResolvedValue(true);
    routerSpy.navigateByUrl.mockResolvedValue(true);
    confirmDialogSpy = {
      confirmYesNo: vi.fn().mockName('ConfirmDialogService.confirmYesNo')
    } as MockedObject<ConfirmDialogService>;
    roleServiceSpy = {
      hasRole: vi.fn().mockName('TasksRoleService.hasRole')
    } as MockedObject<TasksRoleService>;
    roleServiceSpy.hasRole.mockReturnValue(false);
    configServiceSpy = {
      getEndpoint: vi.fn().mockName('ConfigService.getEndpoint')
    } as MockedObject<ConfigService>;
    configServiceSpy.getEndpoint.mockReturnValue(API_ENDPOINT);

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
    expect(req.request.headers.get(HttpHeaderName.SKIP_CACHE)).toBe('true');
    req.flush(response);
  }

  describe('Component initialization', () => {
    it('should create', () => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());

      expect(component).toBeTruthy();
    });

    it('should set page title to "Edit Task"', () => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());

      expect(titleServiceSpy.set).toHaveBeenCalledWith(['Edit Task']);
    });

    it('should define updateForm with all expected controls', () => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());

      expect(component.updateForm.get('taskId')).toBeDefined();
      expect(component.updateForm.get('totalNumberOfChunks')).toBeDefined();
      expect(component.updateForm.get('updateData.taskName')).toBeDefined();
      expect(component.updateForm.get('updateData.attackCmd')).toBeDefined();
      expect(component.updateForm.get('updateData.notes')).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should set isLoading to false after task loads successfully', async () => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      expect(component.isLoading).toBe(false);
    });

    it('should populate form with task data from response', async () => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      expect(component.updateForm.getRawValue()).toEqual(
        expect.objectContaining({
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
    });

    it('should populate updateData sub-form from task attributes', async () => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      const updateData = component.updateForm.getRawValue()['updateData'];
      expect(updateData).toEqual(
        expect.objectContaining({
          taskName: 'Test Task',
          attackCmd: '-a 0 #HL# rockyou.txt',
          notes: 'Test notes',
          color: '#ff0000',
          chunkTime: 600,
          priority: 1
        })
      );
    });

    it('should set component time/speed properties from task data', async () => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      expect(component.ctimespent).toBe(120);
      expect(component.currenspeed).toBe(500);
      expect(component.estimatedTime).toBe(60);
      expect(component.cprogress).toBe(10);
      expect(component.tkeyspace).toBe(1000);
      expect(component.taskWrapperId).toBe(2);
    });

    it('should set chunkview to 0 for edit-task route', async () => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      expect(component.chunkview).toBe(0);
    });

    it('should show forcePipe as "Yes" when task.forcePipe is true', async () => {
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
      await wait();

      expect(component.updateForm.getRawValue()['forcePipe']).toBe('Yes');
    });

    it('should show skipKeyspace value when it is greater than 0', async () => {
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
      await wait();

      expect(component.updateForm.getRawValue()['skipKeyspace']).toBe(500);
    });

    async function loadWithStaticChunks(staticChunks: number): Promise<string> {
      const response = mockResponse({
        data: {
          ...(mockTaskResponse().data as object),
          attributes: {
            ...((mockTaskResponse().data as Record<string, unknown>)['attributes'] as object),
            staticChunks
          }
        }
      }) as ResponseWrapper;

      initComponent();
      respondToTaskRequest(response);
      await wait();

      return component.updateForm.getRawValue()['staticChunks'];
    }

    it('should label staticChunks=0 as "No"', async () => {
      expect(await loadWithStaticChunks(StaticChunkingMode.NONE)).toBe('No');
    });

    it('should label staticChunks=1 with the fixed chunk size', async () => {
      expect(await loadWithStaticChunks(StaticChunkingMode.FIXED_CHUNK_SIZE)).toBe(
        `Fixed chunksize: ${(1000).toLocaleString()}`
      );
    });

    it('should label staticChunks=2 with the fixed number of chunks', async () => {
      expect(await loadWithStaticChunks(StaticChunkingMode.FIXED_NUMBER_OF_CHUNKS)).toBe(
        `Fixed number of chunks: ${(1000).toLocaleString()}`
      );
    });

    it('should render the static chunking field in the task information form', async () => {
      await loadWithStaticChunks(StaticChunkingMode.FIXED_CHUNK_SIZE);
      fixture.detectChanges();

      const field: HTMLElement | null = fixture.nativeElement.querySelector(
        'input-text[formControlName="staticChunks"]'
      );

      expect(field?.getAttribute('title')).toBe('Use static chunking');
    });

    it('should navigate to /not-found on 404 error', async () => {
      initComponent();
      const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/'));
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
      await wait();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/not-found');
    });

    it('should navigate to /forbidden on 403 error', async () => {
      initComponent();
      const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/'));
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
      await wait();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/forbidden');
    });

    it('should show error message on 500 without redirect', async () => {
      initComponent();
      const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/') && r.params.has('include'));
      expect(req.request.headers.get(HttpHeaderName.SKIP_CACHE)).toBe('true');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      await wait();

      const retryReq = httpMock.expectOne((r) => r.url.includes('/ui/tasks/') && !r.params.has('include'));
      expect(retryReq.request.headers.get(HttpHeaderName.SKIP_CACHE)).toBe('true');
      retryReq.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      await wait();

      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
      expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith(expect.stringContaining('Error loading task'));
      expect(component.isLoading).toBe(false);
    });

    it('should retry without includes on 500 and succeed', async () => {
      initComponent();
      const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/') && r.params.has('include'));
      expect(req.request.headers.get(HttpHeaderName.SKIP_CACHE)).toBe('true');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      await wait();

      const retryReq = httpMock.expectOne((r) => r.url.includes('/ui/tasks/') && !r.params.has('include'));
      expect(retryReq.request.headers.get(HttpHeaderName.SKIP_CACHE)).toBe('true');
      retryReq.flush(mockTaskResponse());
      await wait();

      expect(component.isLoading).toBe(false);
      expect(component.tkeyspace).toBe(1000);
    });

    it('should show generic error message on non-HTTP error', async () => {
      initComponent();
      const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/'));
      expect(req.request.headers.get(HttpHeaderName.SKIP_CACHE)).toBe('true');
      req.error(new ProgressEvent('error'));
      await wait();

      expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith('Error loading task.');
      expect(component.isLoading).toBe(false);
    });
  });

  describe('isReadOnly', () => {
    it('should be true when "edit" role is not present', () => {
      roleServiceSpy.hasRole.mockReturnValue(false);
      initComponent();
      respondToTaskRequest(mockTaskResponse());

      expect(component.isReadOnly).toBe(true);
    });

    it('should be false when "edit" role is present', () => {
      roleServiceSpy.hasRole.mockImplementation((role: string) => role === 'edit');
      initComponent();
      respondToTaskRequest(mockTaskResponse());

      expect(component.isReadOnly).toBe(false);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      roleServiceSpy.hasRole.mockImplementation((role: string) => role === 'edit');
    });

    it('should call gs.update and navigate when form is valid and attackCmd unchanged', async () => {
      globalServiceSpy.update.mockReturnValue(of({}));
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      component.onSubmit();

      expect(globalServiceSpy.update).toHaveBeenCalledWith(
        SERV.TASKS,
        1,
        expect.objectContaining({ taskName: 'Test Task', attackCmd: '-a 0 #HL# rockyou.txt' })
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['tasks/show-tasks']);
    });

    it('should show success message after successful update', async () => {
      globalServiceSpy.update.mockReturnValue(of({}));
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      component.onSubmit();
      await wait();

      expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith('Task data has been updated successfully.');
    });

    it('should open confirm dialog when attackCmd is changed', async () => {
      confirmDialogSpy.confirmYesNo.mockReturnValue(of(false));
      globalServiceSpy.update.mockReturnValue(of({}));
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      component.updateForm.get('updateData.attackCmd')?.setValue('-a 3 #HL#');
      component.onSubmit();

      expect(confirmDialogSpy.confirmYesNo).toHaveBeenCalledWith('Update task data', expect.any(String));
    });

    it('should call gs.update after confirming attackCmd change', async () => {
      confirmDialogSpy.confirmYesNo.mockReturnValue(of(true));
      globalServiceSpy.update.mockReturnValue(of({}));
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      component.updateForm.get('updateData.attackCmd')?.setValue('-a 3 #HL#');
      component.onSubmit();

      expect(globalServiceSpy.update).toHaveBeenCalled();
    });

    it('should show info message when attackCmd change is cancelled', async () => {
      confirmDialogSpy.confirmYesNo.mockReturnValue(of(false));
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      component.updateForm.get('updateData.attackCmd')?.setValue('-a 3 #HL#');
      component.onSubmit();

      expect(globalServiceSpy.update).not.toHaveBeenCalled();
      expect(alertServiceSpy.showInfoMessage).toHaveBeenCalledWith('Task Information has not been updated');
    });

    it('should mark form as touched when form is invalid', async () => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      component.updateForm.get('updateData.attackCmd')?.setValue('');
      const markAllAsTouchedSpy = vi.spyOn(component.updateForm, 'markAllAsTouched').mockReturnValue(undefined);
      const updateValueAndValiditySpy = vi
        .spyOn(component.updateForm, 'updateValueAndValidity')
        .mockReturnValue(undefined);

      component.onSubmit();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(updateValueAndValiditySpy).toHaveBeenCalled();
      expect(globalServiceSpy.update).not.toHaveBeenCalled();
    });
  });

  describe('purgeTask', () => {
    it('should call chelper and show success message on confirmation', () => {
      confirmDialogSpy.confirmYesNo.mockReturnValue(of(true));
      globalServiceSpy.chelper.mockReturnValue(of({}));
      initComponent();
      respondToTaskRequest(mockTaskResponse());

      component.purgeTask();

      expect(globalServiceSpy.chelper).toHaveBeenCalledWith(SERV.HELPER, 'purgeTask', { taskId: 1 });
      expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith('Purged task id 1');
    });

    it('should show info message when purge is cancelled', () => {
      confirmDialogSpy.confirmYesNo.mockReturnValue(of(false));
      initComponent();
      respondToTaskRequest(mockTaskResponse());

      component.purgeTask();

      expect(globalServiceSpy.chelper).not.toHaveBeenCalled();
      expect(alertServiceSpy.showInfoMessage).toHaveBeenCalledWith('Purge was cancelled');
    });
  });

  describe('onChunkViewChange', () => {
    it('should set chunkview to the event value', async () => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      component.onChunkViewChange({ value: 1 } as MatButtonToggleChange);

      expect(component.chunkview).toBe(1);
    });

    it('should switch chunkview back to 0', async () => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());
      await wait();

      component.onChunkViewChange({ value: 1 } as MatButtonToggleChange);
      component.onChunkViewChange({ value: 0 } as MatButtonToggleChange);

      expect(component.chunkview).toBe(0);
    });
  });

  describe('ngOnDestroy', () => {
    it('should destroy without errors', () => {
      initComponent();
      respondToTaskRequest(mockTaskResponse());

      expect(() => fixture.destroy()).not.toThrow();
    });
  });
});

describe('EditTasksComponent (edit-task-cAll route)', () => {
  let component: EditTasksComponent;
  let fixture: ComponentFixture<EditTasksComponent>;
  let httpMock: HttpTestingController;

  let titleServiceSpy: MockedObject<AutoTitleService>;
  let alertServiceSpy: MockedObject<AlertService>;
  let globalServiceSpy: MockedObject<GlobalService>;
  let routerSpy: MockedObject<Router>;
  let confirmDialogSpy: MockedObject<ConfirmDialogService>;
  let roleServiceSpy: MockedObject<TasksRoleService>;
  let configServiceSpy: MockedObject<ConfigService>;

  beforeEach(async () => {
    vi.spyOn(console, 'error').mockReturnValue(undefined);
    vi.spyOn(console, 'warn').mockReturnValue(undefined);

    titleServiceSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;
    alertServiceSpy = {
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage'),
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
      showInfoMessage: vi.fn().mockName('AlertService.showInfoMessage')
    } as MockedObject<AlertService>;
    globalServiceSpy = {
      getAll: vi.fn().mockName('GlobalService.getAll'),
      get: vi.fn().mockName('GlobalService.get'),
      create: vi.fn().mockName('GlobalService.create'),
      update: vi.fn().mockName('GlobalService.update'),
      chelper: vi.fn().mockName('GlobalService.chelper')
    } as MockedObject<GlobalService>;
    routerSpy = {
      navigate: vi.fn().mockName('Router.navigate'),
      navigateByUrl: vi.fn().mockName('Router.navigateByUrl')
    } as MockedObject<Router>;
    routerSpy.navigate.mockResolvedValue(true);
    routerSpy.navigateByUrl.mockResolvedValue(true);
    confirmDialogSpy = {
      confirmYesNo: vi.fn().mockName('ConfirmDialogService.confirmYesNo')
    } as MockedObject<ConfirmDialogService>;
    roleServiceSpy = {
      hasRole: vi.fn().mockName('TasksRoleService.hasRole')
    } as MockedObject<TasksRoleService>;
    roleServiceSpy.hasRole.mockReturnValue(false);
    configServiceSpy = {
      getEndpoint: vi.fn().mockName('ConfigService.getEndpoint')
    } as MockedObject<ConfigService>;
    configServiceSpy.getEndpoint.mockReturnValue(API_ENDPOINT);

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

  it('should set chunkview to 1 for edit-task-cAll route', async () => {
    fixture = TestBed.createComponent(EditTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne((r) => r.url.includes('/ui/tasks/') && r.params.has('include'));
    req.flush(mockTaskResponse());
    await wait();

    expect(component.chunkview).toBe(1);
  });
});
