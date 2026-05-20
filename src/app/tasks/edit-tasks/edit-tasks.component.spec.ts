import { Observable, of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

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

const API_ENDPOINT = 'http://localhost:8080/api/v2';

const MOCK_TASK: JTask = {
  id: 1,
  type: 'task',
  taskName: 'Test Task',
  attackCmd: '-a 0 #HL# rockyou.txt',
  notes: '',
  color: '#ff0000',
  chunkTime: 600,
  statusTimer: 5,
  priority: 1,
  maxAgents: 0,
  isCpuTask: false,
  isSmall: false,
  isArchived: false,
  forcePipe: false,
  staticChunks: 0,
  skipKeyspace: 0,
  keyspace: 0,
  keyspaceProgress: 0,
  crackerBinaryId: 1,
  crackerBinaryTypeId: 1,
  chunkSize: 1000,
  useNewBench: true,
  preprocessorId: 0,
  preprocessorCommand: '',
  taskWrapperId: 1,
  timeSpent: 0,
  currentSpeed: 0,
  estimatedTime: 0,
  cprogress: 0,
  dispatched: '',
  searched: '',
  status: 0,
  totalAssignedAgents: 0,
  assignedAgents: []
};

describe('EditTasksComponent', () => {
  let component: EditTasksComponent;
  let fixture: ComponentFixture<EditTasksComponent>;
  let httpMock: HttpTestingController;

  let titleServiceSpy: jasmine.SpyObj<AutoTitleService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let serializerSpy: jasmine.SpyObj<JsonAPISerializer>;
  let confirmDialogSpy: jasmine.SpyObj<ConfirmDialogService>;
  let roleServiceSpy: jasmine.SpyObj<TasksRoleService>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let activatedRoute: { snapshot: { params: Record<string, string> }; data: Observable<unknown> };

  beforeEach(async () => {
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
    serializerSpy = jasmine.createSpyObj('JsonAPISerializer', ['deserialize']);
    serializerSpy.deserialize.and.returnValue(MOCK_TASK);
    confirmDialogSpy = jasmine.createSpyObj('ConfirmDialogService', ['confirmYesNo']);
    roleServiceSpy = jasmine.createSpyObj('TasksRoleService', ['hasRole']);
    roleServiceSpy.hasRole.and.returnValue(false);
    configServiceSpy = jasmine.createSpyObj('ConfigService', ['getEndpoint']);
    configServiceSpy.getEndpoint.and.returnValue(API_ENDPOINT);

    activatedRoute = {
      snapshot: { params: { id: '1' } },
      data: of({ kind: 'edit-task' })
    };

    await TestBed.configureTestingModule({
      declarations: [EditTasksComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: JsonAPISerializer, useValue: serializerSpy },
        { provide: ConfirmDialogService, useValue: confirmDialogSpy },
        { provide: TasksRoleService, useValue: roleServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  async function initComponent(): Promise<void> {
    fixture = TestBed.createComponent(EditTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const req = httpMock.expectOne((r) => r.url.includes(SERV.TASKS.URL));
    req.flush({ data: { id: 1, type: 'task', attributes: {} } });
    await fixture.whenStable();
  }

  it('should create', async () => {
    await initComponent();
    expect(component).toBeTruthy();
  });

  it('should set page title to "Edit Task"', async () => {
    await initComponent();
    expect(titleServiceSpy.set).toHaveBeenCalledWith(['Edit Task']);
  });

  it('should set isReadOnly to true when role edit is not present', async () => {
    roleServiceSpy.hasRole.and.returnValue(false);
    await initComponent();
    expect(component.isReadOnly).toBe(true);
  });

  it('should set isReadOnly to false when role edit is present', async () => {
    roleServiceSpy.hasRole.and.callFake((role: string) => role === 'edit');
    await initComponent();
    expect(component.isReadOnly).toBe(false);
  });

  it('should set isLoading to false after task loads', async () => {
    await initComponent();
    expect(component.isLoading).toBe(false);
  });

  it('should navigate to /not-found when task returns 404', async () => {
    fixture = TestBed.createComponent(EditTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const req = httpMock.expectOne((r) => r.url.includes(SERV.TASKS.URL));
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/not-found');
  });

  it('should navigate to /forbidden when task returns 403', async () => {
    fixture = TestBed.createComponent(EditTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const req = httpMock.expectOne((r) => r.url.includes(SERV.TASKS.URL));
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    await fixture.whenStable();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/forbidden');
  });

/*   it('should show error message on unexpected server error', async () => {
    fixture = TestBed.createComponent(EditTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const req = httpMock.expectOne((r) => r.url.includes(SERV.TASKS.URL));
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    // 500 triggers a fallback retry without includes
    const fallbackReq = httpMock.expectOne((r) => r.url.includes(SERV.TASKS.URL));
    fallbackReq.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();
    expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith(jasmine.stringContaining('Error loading task'));
  }); */

  describe('ngOnDestroy', () => {
    it('should destroy without errors', async () => {
      await initComponent();
      expect(() => fixture.destroy()).not.toThrow();
    });
  });
});
