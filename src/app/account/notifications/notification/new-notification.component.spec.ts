import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { Observable, of } from 'rxjs';
import { PipesModule } from 'src/app/shared/pipes.module';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { NotificationsRoleService } from '@services/roles/config/notifications-role.service';

import { NewNotificationComponent } from '@src/app/account/notifications/notification/new-notification.component';
import { ACTION, NOTIF } from '@src/app/core/_constants/notifications.config';
import { ComponentsModule } from '@src/app/shared/components.module';
import { findEl, setFieldValue } from '@src/app/spec-helpers/element.spec-helper';

let loader: HarnessLoader;

describe('NewNotificationComponent', () => {
  let component: NewNotificationComponent;
  let fixture: ComponentFixture<NewNotificationComponent>;
  let mockRoleService: jasmine.SpyObj<NotificationsRoleService>;

  // Sample data for agents, tasks, hashlist, and users
  const agentValues: ResponseWrapper = {
    data: [
      {
        id: 'agent-1',
        type: SERV.AGENTS.RESOURCE,
        attributes: {
          agentName: 'Agent Smith',
          status: 'active',
          ipAddress: '10.0.0.1',
          lastSeen: '2025-07-15T10:00:00Z',
          version: '3.5.1',
          os: 'Linux',
          architecture: 'x86_64',
          cpuCount: 8,
          memoryTotalMB: 16384,
          gpuModel: 'NVIDIA GTX 1080',
          gpuMemoryMB: 8192,
          tags: ['production', 'backend'],
          createdAt: '2023-01-01T08:00:00Z',
          updatedAt: '2025-07-15T09:59:00Z'
        },
        relationships: {
          assignedTasks: {
            data: [
              { type: SERV.TASKS.RESOURCE, id: 'task-101' },
              { type: SERV.TASKS.RESOURCE, id: 'task-102' }
            ]
          }
        }
      }
    ],
    included: [],
    jsonapi: { version: '1.0', ext: [] },
    links: { self: '/api/v2/ui/agents', next: null, prev: null },
    meta: {}
  };

  const taskValues: ResponseWrapper = {
    data: [
      {
        id: 'task-101',
        type: SERV.TASKS.RESOURCE,
        attributes: {
          taskName: 'Password cracking',
          status: 'completed',
          priority: 'high',
          createdAt: '2025-07-01T10:00:00Z',
          startedAt: '2025-07-02T09:00:00Z',
          completedAt: '2025-07-05T18:00:00Z',
          description: 'Crack passwords from hashlist Alpha',
          hashlistId: 'hashlist-1',
          progressPercent: 100,
          resultCount: 150,
          failedCount: 3
        },
        relationships: {
          assignedAgent: { data: { type: SERV.AGENTS.RESOURCE, id: 'agent-1' } },
          hashlist: { data: { type: SERV.HASHLISTS.RESOURCE, id: 'hashlist-1' } }
        }
      },
      {
        id: 'task-102',
        type: SERV.TASKS.RESOURCE,
        attributes: {
          taskName: 'GPU stress test',
          status: 'running',
          priority: 'medium',
          createdAt: '2025-07-10T14:00:00Z',
          startedAt: '2025-07-11T08:00:00Z',
          description: 'Stress test GPU on agent-1',
          hashlistId: null,
          progressPercent: 45,
          resultCount: 0,
          failedCount: 0
        },
        relationships: {
          assignedAgent: { data: { type: SERV.AGENTS.RESOURCE, id: 'agent-1' } }
        }
      }
    ],
    included: [],
    jsonapi: { version: '1.0', ext: [] },
    links: { self: '/api/v2/ui/tasks', next: null, prev: null },
    meta: {}
  };

  const userValues: ResponseWrapper = {
    data: [
      {
        id: 'user-1',
        type: SERV.USERS.RESOURCE,
        attributes: {
          name: 'Alice Admin',
          email: 'alice@example.com',
          role: 'admin',
          isActive: true,
          createdAt: '2024-12-01T09:00:00Z',
          lastLogin: '2025-07-15T07:30:00Z',
          permissions: ['CREATE_TASK', 'DELETE_TASK', 'VIEW_AGENT'],
          profilePictureUrl: 'https://example.com/profiles/alice.png',
          timeZone: 'Europe/Berlin'
        },
        relationships: {
          hashlistsOwned: {
            data: [
              { type: SERV.HASHLISTS.RESOURCE, id: 'hashlist-1' },
              { type: SERV.HASHLISTS.RESOURCE, id: 'hashlist-2' }
            ]
          }
        }
      },
      {
        id: 'user-2',
        type: SERV.USERS.RESOURCE,
        attributes: {
          name: 'Bob User',
          email: 'bob@example.com',
          role: 'user',
          isActive: true,
          createdAt: '2025-01-15T11:30:00Z',
          lastLogin: '2025-07-14T21:00:00Z',
          permissions: ['VIEW_AGENT'],
          profilePictureUrl: null,
          timeZone: 'America/New_York'
        },
        relationships: {
          hashlistsOwned: {
            data: []
          }
        }
      }
    ],
    included: [],
    jsonapi: { version: '1.0', ext: [] },
    links: { self: '/api/v2/ui/users', next: null, prev: null },
    meta: {}
  };

  const hashlistValues: ResponseWrapper = {
    data: [
      {
        id: 'hashlist-1',
        type: SERV.HASHLISTS.RESOURCE,
        attributes: {
          name: 'Hashlist Alpha',
          description: 'Primary password hashlist for cracking',
          createdAt: '2025-06-01T08:00:00Z',
          hashCount: 5000,
          crackedCount: 3000,
          isPublic: false,
          createdByUserId: 'user-1'
        },
        relationships: {
          owner: { data: { type: SERV.USERS.RESOURCE, id: 'user-1' } }
        }
      },
      {
        id: 'hashlist-2',
        type: SERV.HASHLISTS.RESOURCE,
        attributes: {
          name: 'Hashlist Beta',
          description: 'Secondary list for testing',
          createdAt: '2025-06-15T10:00:00Z',
          hashCount: 1200,
          crackedCount: 100,
          isPublic: true,
          createdByUserId: 'user-2'
        },
        relationships: {
          owner: { data: { type: SERV.USERS.RESOURCE, id: 'user-2' } }
        }
      }
    ],
    included: [],
    jsonapi: { version: '1.0', ext: [] },
    links: { self: '/api/v2/ui/hashlists', next: null, prev: null },
    meta: {}
  };

  // Partial mock service
  const mockService: Partial<GlobalService> = {
    getAll(serviceConfig, _routerParams?): Observable<any> {
      switch (serviceConfig) {
        case SERV.AGENTS:
          return of(agentValues);
        case SERV.TASKS:
          return of(taskValues);
        case SERV.HASHLISTS:
          return of(hashlistValues);
        case SERV.USERS:
          return of(userValues);
        default:
          return of({ data: [] });
      }
    },
    create(serviceConfig, _object: any): Observable<any> {
      return of({});
    }
  };

  beforeEach(async () => {
    mockRoleService = jasmine.createSpyObj('NotificationsRoleService', ['hasRole']);

    await TestBed.configureTestingModule({
      declarations: [NewNotificationComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        DataTablesModule,
        ComponentsModule,
        RouterModule,
        PipesModule,
        NgbModule,
        MatSnackBarModule
      ],
      providers: [
        provideAnimations(),
        { provide: GlobalService, useValue: mockService },
        { provide: NotificationsRoleService, useValue: mockRoleService },
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewNotificationComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    mockRoleService.hasRole.and.returnValue(true);
    fixture.detectChanges();
  });

  // --- Test Methods ---
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not be possible to submit the form when form is empty', () => {
    expectButtonToBeDisabled();
  });

  it('should not be possible to submit the form when trigger action is not selected', () => {
    setFieldValue(fixture, 'select-notification', NOTIF.TELEGRAM);
    setFieldValue(fixture, 'input-receiver', 'test-receiver');
    expectButtonToBeDisabled();
  });

  it('should not be possible to submit the form when notification is not selected', () => {
    spyOn(mockService, 'getAll').withArgs(SERV.TASKS).and.returnValue(of(taskValues));

    setAction(ACTION.NEW_TASK);
    setFieldValue(fixture, 'input-receiver', 'test-receiver');
    expectButtonToBeDisabled();
  });

  it('should not be possible to submit the form when receiver is not selected', () => {
    spyOn(mockService, 'getAll').withArgs(SERV.TASKS).and.returnValue(of(taskValues));

    setAction(ACTION.NEW_TASK);
    setFieldValue(fixture, 'select-notification', NOTIF.EMAIL);
    expectButtonToBeDisabled();
  });

  it('should be possible to submit the form when all fields have data', () => {
    const ActionFilterControl = component.form.get('actionFilter');
    const NotificationControl = component.form.get('notification');
    const ReceiverControl = component.form.get('receiver');

    spyOn(mockService, 'getAll').withArgs(SERV.TASKS).and.returnValue(of(taskValues));

    setAction(ACTION.NEW_TASK);
    ActionFilterControl.patchValue('1');
    NotificationControl.patchValue(NOTIF.EMAIL);
    ReceiverControl.patchValue('test@mail.com');
    fixture.detectChanges();

    expectButtonToBeEnabled();
  });

  it('displays agent filters when action AGENT_ERROR is selected', async () => {
    await expectAgentOptionsOnAction(ACTION.AGENT_ERROR);
  });

  it('displays agent filters when action is OWN_AGENT_ERROR', async () => {
    await expectAgentOptionsOnAction(ACTION.OWN_AGENT_ERROR);
  });

  it('displays agent filters when action is DELETE_AGENT', async () => {
    await expectAgentOptionsOnAction(ACTION.DELETE_AGENT);
  });

  it('displays task filters when action is TASK_COMPLETE', async () => {
    await expectTaskOptionsOnAction(ACTION.TASK_COMPLETE);
  });

  it('displays task filters when action is DELETE_TASK', async () => {
    await expectTaskOptionsOnAction(ACTION.DELETE_TASK);
  });

  it('displays hashlist filters when action is DELETE_HASHLIST', async () => {
    await expectHashlistOptionsOnAction(ACTION.DELETE_HASHLIST);
  });

  it('displays hashlist filters when action is HASHLIST_ALL_CRACKED', async () => {
    await expectHashlistOptionsOnAction(ACTION.HASHLIST_ALL_CRACKED);
  });

  it('displays hashlist filters when action is HASHLIST_CRACKED_HASH', async () => {
    await expectHashlistOptionsOnAction(ACTION.HASHLIST_CRACKED_HASH);
  });

  it('displays user filters when action is USER_DELETED', async () => {
    await expectUserOptionsOnAction(ACTION.USER_DELETED);
  });

  it('displays user filters when action is USER_LOGIN_FAILED', async () => {
    await expectUserOptionsOnAction(ACTION.USER_LOGIN_FAILED);
  });

  it('displays no filters when action is LOG_WARN', () => {
    expectHiddenOnAction(ACTION.LOG_WARN);
  });

  it('displays no filters when action is LOG_FATAL', () => {
    expectHiddenOnAction(ACTION.LOG_FATAL);
  });

  it('displays no filters when action is LOG_ERROR', () => {
    expectHiddenOnAction(ACTION.LOG_ERROR);
  });

  it('should submit the form when it is valid', () => {
    const serviceSpy = spyOn(mockService, 'create')
      .withArgs(SERV.NOTIFICATIONS, jasmine.any(Object))
      .and.returnValue(of({}));

    setValidFormValues();
    fixture.detectChanges();

    const submitButton: DebugElement = findEl(fixture, 'button-create');
    submitButton.nativeElement.querySelector('button').click();

    expect(serviceSpy).toHaveBeenCalledWith(SERV.NOTIFICATIONS, jasmine.any(Object));
  });

  it('should show actionFilter only for actions with filters', async () => {
    const allActions = Object.values(ACTION); // all possible actions
    const actionsWithFilters = component.actionsWithFilters; // use the component's list

    for (const action of allActions) {
      const shouldShow = actionsWithFilters.includes(action);
      setAction(action); // select the trigger action
      fixture.detectChanges();

      const actionFilterDe = fixture.debugElement.query(By.css('[data-testid="select-action-filter"]'));

      if (shouldShow) {
        expect(actionFilterDe).toBeTruthy();
      } else {
        expect(actionFilterDe).toBeNull();
      }
    }
  });

  // --- Helper functions ---
  const setValidFormValues = (): void => {
    const actionSelect = component.form.get('action');
    const actionFilterSelect = component.form.get('actionFilter');
    const notificationSelect = component.form.get('notification');
    const receiverInput = component.form.get('receiver');

    setAction(ACTION.NEW_TASK);
    actionSelect.patchValue('1');
    actionFilterSelect.patchValue('1');
    notificationSelect.patchValue(NOTIF.EMAIL);
    receiverInput.patchValue('test@mail.com');

    fixture.detectChanges();
  };

  const expectButtonToBeDisabled = (): void => {
    const btn: HTMLButtonElement = findEl(fixture, 'button-create').nativeElement.querySelector('button');
    expect(btn.disabled).toBeTrue();
  };

  const expectButtonToBeEnabled = (): void => {
    const btn: HTMLButtonElement = findEl(fixture, 'button-create').nativeElement.querySelector('button');
    expect(btn.disabled).toBeFalse();
  };

  const expectHiddenOnAction = (action: string): void => {
    spyOn(mockService, 'getAll');
    setAction(action);
    expect(mockService.getAll).not.toHaveBeenCalled();
    const actionFilter = fixture.debugElement.query(By.css('select-action-filter'));
    expect(actionFilter).toBeNull();
  };

  const setAction = (action: string): void => {
    const actionControl = component.form.get('action');
    actionControl.patchValue(action);
    fixture.detectChanges();
  };

  const getOptions = async (action: string) => {
    const actionLoader = await loader.getChildLoader('[data-testid="select-action"]');
    const selectAction = await actionLoader.getHarness(MatSelectHarness);
    await selectAction.open();
    await selectAction.clickOptions({ text: action });
    const actionFilterLoader = await loader.getChildLoader('[data-testid="select-action-filter"]');
    const selectActionFilter = await actionFilterLoader.getHarness(MatSelectHarness);
    await selectActionFilter.open();
    return await selectActionFilter.getOptions();
  };

  const expectAgentOptionsOnAction = async (action: string): Promise<void> => {
    spyOn(mockService, 'getAll').withArgs(SERV.AGENTS).and.returnValue(of(agentValues));

    const options = await getOptions(action);

    for (let i = 0; i < options.length; i++) {
      const option = await options[i].getText();
      expect(option).toBe(agentValues.data[i].attributes.agentName);
    }
  };

  const expectTaskOptionsOnAction = async (action: string): Promise<void> => {
    spyOn(mockService, 'getAll').withArgs(SERV.TASKS).and.returnValue(of(taskValues));

    const options = await getOptions(action);

    for (let i = 0; i < options.length; i++) {
      const option = await options[i].getText();
      expect(option).toBe(taskValues.data[i].attributes.taskName);
    }
  };

  const expectHashlistOptionsOnAction = async (action: string): Promise<void> => {
    spyOn(mockService, 'getAll').withArgs(SERV.HASHLISTS).and.returnValue(of(hashlistValues));

    const options = await getOptions(action);

    for (let i = 0; i < options.length; i++) {
      const option = await options[i].getText();
      expect(option).toBe(hashlistValues.data[i].attributes.name);
    }
  };

  const expectUserOptionsOnAction = async (action: string): Promise<void> => {
    spyOn(mockService, 'getAll').withArgs(SERV.USERS).and.returnValue(of(userValues));

    const options = await getOptions(action);

    for (let i = 0; i < options.length; i++) {
      const option = await options[i].getText();
      expect(option).toBe(userValues.data[i].attributes.name);
    }
  };
});
