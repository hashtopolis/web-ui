import { Observable, of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { TasksRoleService } from '@services/roles/tasks/tasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { ConfigService } from '@services/shared/config.service';

import { EditTasksComponent } from '@src/app/tasks/edit-tasks/edit-tasks.component';
import { ChunkView } from '@src/app/tasks/edit-tasks/edit-tasks.form';
import { EditTaskRouteKind } from '@src/app/tasks/tasks-routing.constants';
import { mockResponse } from '@src/app/testing/mock-response';

const API_BASE = 'http://localhost:8080/api/v2';

const MOCK_TASK: JTask = {
  id: 1,
  taskName: 'Test Task',
  attackCmd: '-a 0 #HL# dict.txt',
  notes: 'test notes',
  color: '#00ff00',
  chunkTime: 600,
  statusTimer: 5,
  priority: 1,
  maxAgents: 2,
  isCpuTask: false,
  isSmall: false,
  forcePipe: true,
  staticChunks: 1,
  skipKeyspace: 100,
  keyspace: 5000,
  keyspaceProgress: 2500,
  crackerBinaryId: 10,
  chunkSize: 1000,
  taskWrapperId: 42,
  preprocessorId: 0,
  timeSpent: 3600,
  currentSpeed: 1_000_000,
  estimatedTime: 7200,
  cprogress: 50,
  searched: '50%',
  assignedAgents: []
} as unknown as JTask;

async function flushTaskLoad(
  fixture: ComponentFixture<EditTasksComponent>,
  httpTesting: HttpTestingController,
  task: JTask = MOCK_TASK
): Promise<void> {
  fixture.detectChanges();
  const req = httpTesting.expectOne((r) => r.url.endsWith('/ui/tasks/1') && r.params.has('include'));
  req.flush(mockResponse({ data: { id: '1', type: 'Tasks', attributes: {} } }));
  void task;
  await fixture.whenStable();
}

describe('EditTasksComponent', () => {
  let component: EditTasksComponent;
  let fixture: ComponentFixture<EditTasksComponent>;
  let httpTesting: HttpTestingController;

  let titleServiceSpy: jasmine.SpyObj<AutoTitleService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let serializerSpy: jasmine.SpyObj<JsonAPISerializer>;
  let roleServiceSpy: jasmine.SpyObj<TasksRoleService>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let confirmDialogSpy: jasmine.SpyObj<ConfirmDialogService>;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;
  let activatedRoute: { snapshot: { params: Params }; data: Observable<unknown>; params: Observable<Params> };

  beforeEach(async () => {
    titleServiceSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', [
      'showErrorMessage',
      'showSuccessMessage',
      'showInfoMessage'
    ]);
    globalServiceSpy = jasmine.createSpyObj('GlobalService', ['getAll', 'get', 'create', 'update', 'chelper']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    serializerSpy = jasmine.createSpyObj('JsonAPISerializer', ['deserialize']);
    roleServiceSpy = jasmine.createSpyObj('TasksRoleService', ['hasRole']);
    configServiceSpy = jasmine.createSpyObj('ConfigService', ['getEndpoint']);
    confirmDialogSpy = jasmine.createSpyObj('ConfirmDialogService', ['confirmYesNo']);
    sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustUrl']);

    roleServiceSpy.hasRole.and.returnValue(false);
    configServiceSpy.getEndpoint.and.returnValue(API_BASE);
    serializerSpy.deserialize.and.returnValue(MOCK_TASK);
    globalServiceSpy.getAll.and.returnValue(of(mockResponse()));
    globalServiceSpy.update.and.returnValue(of(mockResponse()));
    globalServiceSpy.chelper.and.returnValue(of(mockResponse()));
    globalServiceSpy.create.and.returnValue(of(mockResponse()));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));

    activatedRoute = {
      snapshot: { params: { id: '1' } },
      data: of({ kind: EditTaskRouteKind.EditTask }),
      params: of({ id: '1' })
    };

    await TestBed.configureTestingModule({
      declarations: [EditTasksComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: JsonAPISerializer, useValue: serializerSpy },
        { provide: ConfirmDialogService, useValue: confirmDialogSpy },
        { provide: TasksRoleService, useValue: roleServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: DomSanitizer, useValue: sanitizerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(EditTasksComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('Component creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should set the page title to "Edit Task"', () => {
      expect(titleServiceSpy.set).toHaveBeenCalledWith(['Edit Task']);
    });
  });

  describe('getStaticChunkingLabel (via staticChunks form control)', () => {
    it('should render "Fixed chunk size (1)" when staticChunks is 1', async () => {
      serializerSpy.deserialize.and.returnValue({ ...MOCK_TASK, staticChunks: 1 });
      await flushTaskLoad(fixture, httpTesting);

      expect(component.updateForm.controls.staticChunks.value).toBe('Fixed chunk size (1)');
    });

    it('should render "Fixed number of chunks (2)" when staticChunks is 2', async () => {
      serializerSpy.deserialize.and.returnValue({ ...MOCK_TASK, staticChunks: 2 });
      await flushTaskLoad(fixture, httpTesting);

      expect(component.updateForm.controls.staticChunks.value).toBe('Fixed number of chunks (2)');
    });

    it('should render "No" when staticChunks is 0', async () => {
      serializerSpy.deserialize.and.returnValue({ ...MOCK_TASK, staticChunks: 0 });
      await flushTaskLoad(fixture, httpTesting);

      expect(component.updateForm.controls.staticChunks.value).toBe('No');
    });
  });

  describe('forcePipe display mapping', () => {
    it('should set forcePipe control to "Yes" when task.forcePipe is true', async () => {
      serializerSpy.deserialize.and.returnValue({ ...MOCK_TASK, forcePipe: true });
      await flushTaskLoad(fixture, httpTesting);

      expect(component.updateForm.controls.forcePipe.value).toBe('Yes');
    });

    it('should set forcePipe control to "No" when task.forcePipe is false', async () => {
      serializerSpy.deserialize.and.returnValue({ ...MOCK_TASK, forcePipe: false });
      await flushTaskLoad(fixture, httpTesting);

      expect(component.updateForm.controls.forcePipe.value).toBe('No');
    });
  });

  describe('skipKeyspace display mapping', () => {
    it('should set skipKeyspace to the task value when greater than 0', async () => {
      serializerSpy.deserialize.and.returnValue({ ...MOCK_TASK, skipKeyspace: 100 });
      await flushTaskLoad(fixture, httpTesting);

      expect(component.updateForm.controls.skipKeyspace.value).toBe(100);
    });

    it('should set skipKeyspace to "N/A" when task value is 0', async () => {
      serializerSpy.deserialize.and.returnValue({ ...MOCK_TASK, skipKeyspace: 0 });
      await flushTaskLoad(fixture, httpTesting);

      expect(component.updateForm.controls.skipKeyspace.value).toBe('N/A');
    });
  });

  describe('Form population', () => {
    it('should populate updateData controls from the loaded task', async () => {
      await flushTaskLoad(fixture, httpTesting);

      const updateData = component.updateForm.controls.updateData;
      expect(updateData.controls.taskName.value).toBe('Test Task');
      expect(updateData.controls.attackCmd.value).toBe('-a 0 #HL# dict.txt');
      expect(updateData.controls.notes.value).toBe('test notes');
      expect(updateData.controls.color.value).toBe('#00ff00');
      expect(updateData.controls.chunkTime.value).toBe(600);
      expect(updateData.controls.statusTimer.value).toBe(5);
      expect(updateData.controls.priority.value).toBe(1);
      expect(updateData.controls.maxAgents.value).toBe(2);
      expect(updateData.controls.isCpuTask.value).toBe(false);
      expect(updateData.controls.isSmall.value).toBe(false);
    });

    it('should stop showing the loading gate after the task loads', async () => {
      expect(component.isLoading).toBe(true);
      await flushTaskLoad(fixture, httpTesting);

      expect(component.isLoading).toBe(false);
    });
  });

  describe('Read-only mode', () => {
    it('should set isReadOnly to true when the user lacks the edit role', async () => {
      await flushTaskLoad(fixture, httpTesting);

      expect(component.isReadOnly).toBe(true);
    });

    it('should disable updateData controls when read-only', async () => {
      await flushTaskLoad(fixture, httpTesting);

      expect(component.updateForm.controls.updateData.controls.taskName.disabled).toBe(true);
      expect(component.updateForm.controls.updateData.controls.attackCmd.disabled).toBe(true);
    });

    it('should not call gs.update on submit when read-only', async () => {
      await flushTaskLoad(fixture, httpTesting);

      component.onSubmit();

      expect(globalServiceSpy.update).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit branches', () => {
    beforeEach(() => {
      roleServiceSpy.hasRole.and.callFake((role: string) => role === 'edit');
    });

    it('should call gs.update directly when attackCmd is unchanged', async () => {
      await flushTaskLoad(fixture, httpTesting);

      component.onSubmit();

      expect(globalServiceSpy.update).toHaveBeenCalled();
    });

    it('should not open the confirm dialog when attackCmd is unchanged', async () => {
      await flushTaskLoad(fixture, httpTesting);

      component.onSubmit();

      expect(confirmDialogSpy.confirmYesNo).not.toHaveBeenCalled();
    });

    it('should open the confirm dialog when attackCmd has been changed', async () => {
      confirmDialogSpy.confirmYesNo.and.returnValue(of(true));
      await flushTaskLoad(fixture, httpTesting);

      component.updateForm.controls.updateData.controls.attackCmd.setValue('-a 3 #HL# ?a?a?a');
      component.onSubmit();

      expect(confirmDialogSpy.confirmYesNo).toHaveBeenCalled();
    });

    it('should skip the update when the attackCmd-change dialog is rejected', async () => {
      confirmDialogSpy.confirmYesNo.and.returnValue(of(false));
      await flushTaskLoad(fixture, httpTesting);

      component.updateForm.controls.updateData.controls.attackCmd.setValue('-a 3 #HL# ?a?a?a');
      component.onSubmit();

      expect(globalServiceSpy.update).not.toHaveBeenCalled();
    });

    it('should show an info message when the attackCmd-change dialog is rejected', async () => {
      confirmDialogSpy.confirmYesNo.and.returnValue(of(false));
      await flushTaskLoad(fixture, httpTesting);

      component.updateForm.controls.updateData.controls.attackCmd.setValue('-a 3 #HL# ?a?a?a');
      component.onSubmit();

      expect(alertServiceSpy.showInfoMessage).toHaveBeenCalledWith('Task Information has not been updated');
    });

    it('should navigate back to show-tasks after a successful update', async () => {
      await flushTaskLoad(fixture, httpTesting);

      component.onSubmit();
      await fixture.whenStable();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['tasks/show-tasks']);
    });

    it('should send the updateData raw value as the update payload', async () => {
      await flushTaskLoad(fixture, httpTesting);

      component.onSubmit();

      expect(globalServiceSpy.update).toHaveBeenCalledWith(
        SERV.TASKS,
        1,
        component.updateForm.controls.updateData.getRawValue()
      );
    });

    it('should mark the form as touched when invalid', async () => {
      await flushTaskLoad(fixture, httpTesting);

      component.updateForm.controls.updateData.controls.taskName.setValue('');
      component.updateForm.controls.updateData.updateValueAndValidity();

      component.onSubmit();

      expect(component.updateForm.touched).toBe(true);
    });

    it('should not call gs.update when the form is invalid', async () => {
      await flushTaskLoad(fixture, httpTesting);

      component.updateForm.controls.updateData.controls.taskName.setValue('');
      component.updateForm.controls.updateData.updateValueAndValidity();

      component.onSubmit();

      expect(globalServiceSpy.update).not.toHaveBeenCalled();
    });
  });

  describe('Chunk view dispatch', () => {
    it('should set chunkview to ChunkView.Live for the EditTask route kind', async () => {
      await flushTaskLoad(fixture, httpTesting);

      expect(component.chunkview).toBe(ChunkView.Live);
    });

    it('should set chunkview to ChunkView.All for the EditTaskShowAllChunks route kind', async () => {
      activatedRoute.data = of({ kind: EditTaskRouteKind.EditTaskShowAllChunks });
      fixture = TestBed.createComponent(EditTasksComponent);
      component = fixture.componentInstance;

      await flushTaskLoad(fixture, httpTesting);

      expect(component.chunkview).toBe(ChunkView.All);
    });

    it('should leave chunkview undefined for an unknown route kind', async () => {
      activatedRoute.data = of({ kind: 'something-else' });
      fixture = TestBed.createComponent(EditTasksComponent);
      component = fixture.componentInstance;

      await flushTaskLoad(fixture, httpTesting);

      expect(component.chunkview).toBeUndefined();
    });
  });

  describe('purgeTask', () => {
    it('should call gs.chelper with purgeTask when the user confirms', async () => {
      confirmDialogSpy.confirmYesNo.and.returnValue(of(true));
      await flushTaskLoad(fixture, httpTesting);

      component.purgeTask();

      expect(globalServiceSpy.chelper).toHaveBeenCalledWith(SERV.HELPER, 'purgeTask', { taskId: 1 });
    });

    it('should show a success alert with the task id when the purge completes', async () => {
      confirmDialogSpy.confirmYesNo.and.returnValue(of(true));
      await flushTaskLoad(fixture, httpTesting);

      component.purgeTask();

      expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith('Purged task id 1');
    });

    it('should not call gs.chelper when the user cancels', async () => {
      confirmDialogSpy.confirmYesNo.and.returnValue(of(false));
      await flushTaskLoad(fixture, httpTesting);

      component.purgeTask();

      expect(globalServiceSpy.chelper).not.toHaveBeenCalled();
    });

    it('should show a cancelled info alert when the user cancels', async () => {
      confirmDialogSpy.confirmYesNo.and.returnValue(of(false));
      await flushTaskLoad(fixture, httpTesting);

      component.purgeTask();

      expect(alertServiceSpy.showInfoMessage).toHaveBeenCalledWith('Purge was cancelled');
    });
  });

  describe('loadTask error handling', () => {
    it('should redirect to /forbidden on a 403 response', async () => {
      fixture.detectChanges();
      const req = httpTesting.expectOne((r) => r.url.endsWith('/ui/tasks/1'));
      req.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
      await fixture.whenStable();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/forbidden');
    });

    it('should redirect to /not-found on a 404 response', async () => {
      fixture.detectChanges();
      const req = httpTesting.expectOne((r) => r.url.endsWith('/ui/tasks/1'));
      req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
      await fixture.whenStable();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/not-found');
    });

    it('should retry without includes when the first request returns 500', async () => {
      fixture.detectChanges();

      const first = httpTesting.expectOne((r) => r.url.endsWith('/ui/tasks/1') && r.params.has('include'));
      first.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
      await fixture.whenStable();
      await fixture.whenStable();

      const retry = httpTesting.expectOne((r) => r.url.endsWith('/ui/tasks/1') && !r.params.has('include'));
      retry.flush(mockResponse({ data: { id: '1', type: 'Tasks', attributes: {} } }));
      await fixture.whenStable();
      await fixture.whenStable();

      expect(component.isLoading).toBe(false);
    });

    it('should show an error message when both the primary and fallback requests return 500', async () => {
      const consoleErrorSpy = spyOn(console, 'error');
      fixture.detectChanges();

      const first = httpTesting.expectOne((r) => r.url.endsWith('/ui/tasks/1') && r.params.has('include'));
      first.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
      await fixture.whenStable();
      await fixture.whenStable();

      const retry = httpTesting.expectOne((r) => r.url.endsWith('/ui/tasks/1') && !r.params.has('include'));
      retry.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
      await fixture.whenStable();
      await fixture.whenStable();

      expect(alertServiceSpy.showErrorMessage).toHaveBeenCalled();
      // consoleErrorSpy installed to silence the expected console.error in this branch.
      void consoleErrorSpy;
    });
  });

  describe('Cleanup', () => {
    it('should revoke the task progress object URL on destroy when one is set', async () => {
      await flushTaskLoad(fixture, httpTesting);
      const revokeSpy = spyOn(URL, 'revokeObjectURL');
      (component as unknown as { rawTaskProgressObjectUrl: string }).rawTaskProgressObjectUrl =
        'blob:http://localhost/fake';

      component.ngOnDestroy();

      expect(revokeSpy).toHaveBeenCalledWith('blob:http://localhost/fake');
    });

    it('should not call URL.revokeObjectURL when no object URL is set', async () => {
      await flushTaskLoad(fixture, httpTesting);
      const revokeSpy = spyOn(URL, 'revokeObjectURL');

      component.ngOnDestroy();

      expect(revokeSpy).not.toHaveBeenCalled();
    });
  });
});
