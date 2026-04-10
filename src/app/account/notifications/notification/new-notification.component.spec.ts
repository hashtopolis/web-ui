import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TJsonApiData } from 'jsona/lib/JsonaTypes';
import { of } from 'rxjs';
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
import { mockResponse } from '@src/app/testing/mock-response';

let loader: HarnessLoader;

describe('NewNotificationComponent', () => {
  let component: NewNotificationComponent;
  let fixture: ComponentFixture<NewNotificationComponent>;
  let mockRoleService: jasmine.SpyObj<NotificationsRoleService>;

  // Sample data for agents, tasks, hashlist, and users
  // Attributes must match the Zod schemas (zAgentListResponse, zTaskListResponse, etc.)
  const agentValues: ResponseWrapper = mockResponse({
    data: [
      {
        id: 1,
        type: 'agent',
        attributes: {
          agentName: 'Agent Smith',
          uid: 'uid-001',
          os: 0,
          devices: 'GPU #1',
          cmdPars: '',
          ignoreErrors: 0,
          isActive: true,
          isTrusted: true,
          token: 'tok-001',
          lastAct: 'bench',
          lastTime: 1720000000,
          lastIp: '10.0.0.1',
          userId: null,
          cpuOnly: false,
          clientSignature: 'generic'
        }
      }
    ]
  });

  const taskValues: ResponseWrapper = mockResponse({
    data: [
      {
        id: 101,
        type: 'task',
        attributes: {
          taskName: 'Password cracking',
          attackCmd: '#HL# -a 0 -r rules.rule',
          chunkTime: 600,
          statusTimer: 5,
          keyspace: 0,
          keyspaceProgress: 0,
          priority: 1,
          maxAgents: 0,
          color: null,
          isSmall: false,
          isCpuTask: false,
          useNewBench: true,
          skipKeyspace: 0,
          crackerBinaryId: 1,
          crackerBinaryTypeId: 1,
          taskWrapperId: 1,
          isArchived: false,
          notes: '',
          staticChunks: 0,
          chunkSize: 0,
          forcePipe: false,
          preprocessorId: 0,
          preprocessorCommand: ''
        }
      },
      {
        id: 102,
        type: 'task',
        attributes: {
          taskName: 'GPU stress test',
          attackCmd: '#HL# -a 3 ?a?a?a?a',
          chunkTime: 600,
          statusTimer: 5,
          keyspace: 0,
          keyspaceProgress: 0,
          priority: 5,
          maxAgents: 0,
          color: null,
          isSmall: false,
          isCpuTask: false,
          useNewBench: true,
          skipKeyspace: 0,
          crackerBinaryId: 1,
          crackerBinaryTypeId: null,
          taskWrapperId: 1,
          isArchived: false,
          notes: '',
          staticChunks: 0,
          chunkSize: 0,
          forcePipe: false,
          preprocessorId: 0,
          preprocessorCommand: ''
        }
      }
    ]
  });

  const userValues: ResponseWrapper = mockResponse({
    data: [
      {
        id: 1,
        type: 'user',
        attributes: {
          name: 'Alice Admin',
          email: 'alice@example.com',
          isValid: true,
          isComputedPassword: false,
          lastLoginDate: 1720000000,
          registeredSince: 1700000000,
          sessionLifetime: 3600,
          globalPermissionGroupId: 1,
          yubikey: '',
          otp1: '',
          otp2: '',
          otp3: '',
          otp4: ''
        }
      },
      {
        id: 2,
        type: 'user',
        attributes: {
          name: 'Bob User',
          email: 'bob@example.com',
          isValid: true,
          isComputedPassword: false,
          lastLoginDate: 1719900000,
          registeredSince: 1705000000,
          sessionLifetime: 3600,
          globalPermissionGroupId: 2,
          yubikey: '',
          otp1: '',
          otp2: '',
          otp3: '',
          otp4: ''
        }
      }
    ]
  });

  const hashlistValues: ResponseWrapper = mockResponse({
    data: [
      {
        id: 1,
        type: 'hashlist',
        attributes: {
          name: 'Hashlist Alpha',
          format: 0,
          hashTypeId: 100,
          hashCount: 5000,
          separator: null,
          cracked: 3000,
          isSecret: false,
          isHexSalt: false,
          isSalted: false,
          accessGroupId: 1,
          notes: '',
          useBrain: false,
          brainFeatures: 0,
          isArchived: false
        }
      },
      {
        id: 2,
        type: 'hashlist',
        attributes: {
          name: 'Hashlist Beta',
          format: 0,
          hashTypeId: 200,
          hashCount: 1200,
          separator: null,
          cracked: 100,
          isSecret: false,
          isHexSalt: false,
          isSalted: false,
          accessGroupId: 1,
          notes: '',
          useBrain: false,
          brainFeatures: 0,
          isArchived: false
        }
      }
    ]
  });

  // Partial mock service
  const mockService: Pick<GlobalService, 'getAll' | 'create'> = {
    getAll(serviceConfig) {
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
          return of(mockResponse());
      }
    },
    create() {
      return of(mockResponse());
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
        ComponentsModule,
        RouterModule,
        PipesModule,
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

  it('should keep submit button enabled but not submit when form is empty', () => {
    expectButtonToBeEnabled();

    const submitButton: DebugElement = findEl(fixture, 'button-create');
    submitButton.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(component.form.invalid).toBeTrue();
  });

  it('should keep submit button enabled but not submit when trigger action is not selected', () => {
    setFieldValue(fixture, 'select-notification', NOTIF.TELEGRAM);
    setFieldValue(fixture, 'input-receiver', 'test-receiver');
    expectButtonToBeEnabled();

    const submitButton: DebugElement = findEl(fixture, 'button-create');
    submitButton.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(component.form.invalid).toBeTrue();
  });

  it('should keep submit button enabled but not submit when notification is not selected', () => {
    spyOn(mockService, 'getAll').withArgs(SERV.TASKS).and.returnValue(of(taskValues));

    setAction(ACTION.NEW_TASK);
    setFieldValue(fixture, 'input-receiver', 'test-receiver');
    expectButtonToBeEnabled();

    const submitButton: DebugElement = findEl(fixture, 'button-create');
    submitButton.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(component.form.invalid).toBeTrue();
  });

  it('should keep submit button enabled but not submit when receiver is not selected', () => {
    spyOn(mockService, 'getAll').withArgs(SERV.TASKS).and.returnValue(of(taskValues));

    setAction(ACTION.NEW_TASK);
    setFieldValue(fixture, 'select-notification', NOTIF.EMAIL);
    expectButtonToBeEnabled();

    const submitButton: DebugElement = findEl(fixture, 'button-create');
    submitButton.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(component.form.invalid).toBeTrue();
  });

  it('should be possible to submit the form when all fields have data', () => {
    spyOn(mockService, 'getAll').withArgs(SERV.TASKS).and.returnValue(of(taskValues));

    setAction(ACTION.NEW_TASK);
    component.form.controls.actionFilter.patchValue('1');
    component.form.controls.notification.patchValue(NOTIF.EMAIL);
    component.form.controls.receiver.patchValue('test@mail.com');
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
      .and.returnValue(of(mockResponse()));

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
    setAction(ACTION.NEW_TASK);
    component.form.controls.action.patchValue('1');
    component.form.controls.actionFilter.patchValue('1');
    component.form.controls.notification.patchValue(NOTIF.EMAIL);
    component.form.controls.receiver.patchValue('test@mail.com');

    fixture.detectChanges();
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
    component.form.controls.action.patchValue(action);
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
      expect(option).toBe((agentValues.data! as TJsonApiData[])[i].attributes!.agentName);
    }
  };

  const expectTaskOptionsOnAction = async (action: string): Promise<void> => {
    spyOn(mockService, 'getAll').withArgs(SERV.TASKS).and.returnValue(of(taskValues));

    const options = await getOptions(action);

    for (let i = 0; i < options.length; i++) {
      const option = await options[i].getText();
      expect(option).toBe((taskValues.data! as TJsonApiData[])[i].attributes!.taskName);
    }
  };

  const expectHashlistOptionsOnAction = async (action: string): Promise<void> => {
    spyOn(mockService, 'getAll').withArgs(SERV.HASHLISTS).and.returnValue(of(hashlistValues));

    const options = await getOptions(action);

    for (let i = 0; i < options.length; i++) {
      const option = await options[i].getText();
      expect(option).toBe((hashlistValues.data! as TJsonApiData[])[i].attributes!.name);
    }
  };

  const expectUserOptionsOnAction = async (action: string): Promise<void> => {
    spyOn(mockService, 'getAll').withArgs(SERV.USERS).and.returnValue(of(userValues));

    const options = await getOptions(action);

    for (let i = 0; i < options.length; i++) {
      const option = await options[i].getText();
      expect(option).toBe((userValues.data! as TJsonApiData[])[i].attributes!.name);
    }
  };
});
