import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewNotificationComponent } from './new-notification.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from 'src/app/core/_services/main.service';
import { Observable, of } from 'rxjs';
import { Params, RouterModule } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataTablesModule } from 'angular-datatables';
import { ComponentsModule } from 'src/app/shared/components.module';
import { PipesModule } from 'src/app/shared/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  findEl,
  setFieldValue
} from 'src/app/spec-helpers/element.spec-helper';
import { ACTION, NOTIF } from 'src/app/core/_constants/notifications.config';
import { DebugElement } from '@angular/core';
import { SERV } from 'src/app/core/_services/main.config';
import { By } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

let loader: HarnessLoader;

describe('NewNotificationComponent', () => {
  let component: NewNotificationComponent;
  let fixture: ComponentFixture<NewNotificationComponent>;

  // Define sample data for agent, task, hashlist, and user values.
  const agentValues = [
    { _id: '1', agentName: 'Agent 1' },
    { _id: '2', agentName: 'Agent 2' },
    { _id: '3', agentName: 'Agent 3' },
    { _id: '4', agentName: 'Agent 4' },
    { _id: '5', agentName: 'Agent 5' }
  ];
  const taskValues = [
    { _id: '1', taskName: 'Task 1' },
    { _id: '2', taskName: 'Task 2' },
    { _id: '3', taskName: 'Task 3' },
    { _id: '4', taskName: 'Task 4' },
    { _id: '5', taskName: 'Task 5' }
  ];
  const hashlistValues = [
    { _id: '1', name: 'Hashlist 1' },
    { _id: '2', name: 'Hashlist 2' },
    { _id: '3', name: 'Hashlist 3' },
    { _id: '4', name: 'Hashlist 4' },
    { _id: '5', name: 'Hashlist 5' }
  ];
  const userValues = [
    { _id: '1', name: 'User 1' },
    { _id: '2', name: 'User 2' },
    { _id: '3', name: 'User 3' },
    { _id: '4', name: 'User 4' },
    { _id: '5', name: 'User 5' }
  ];

  // Define a partial mock service to simulate service calls.
  const mockService: Partial<GlobalService> = {
    // Simulate the 'getAll' method to return an empty observable.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    getAll(_methodUrl: string, _routerParams?: Params): Observable<any> {
      return of([]);
    },
    // Simulate the 'create' method to return an empty observable.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    create(_methodUrl: string, _object: any): Observable<any> {
      return of({});
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NewNotificationComponent],
    imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        DataTablesModule,
        ComponentsModule,
        RouterModule,
        PipesModule,
        NgbModule,
        MatSnackBarModule],
    providers: [
        provideAnimations(),
        {
            provide: GlobalService,
            useValue: mockService
        },
        provideHttpClient(withInterceptorsFromDi())
    ]
}).compileComponents();

    fixture = TestBed.createComponent(NewNotificationComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // --- Test Methods ---
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test for Empty Form Submission
  it('shold not be possible to submit the form when form is empty', () => {
    expectButtonToBeDisabled();
  });

  // Test for Form Submission Without Trigger Action
  it('shold not be possible to submit the form when trigger action is not selected', () => {
    setFieldValue(fixture, 'select-notification', NOTIF.TELEGRAM);
    setFieldValue(fixture, 'input-receiver', 'test-receiver');
    expectButtonToBeDisabled();
  });

  // Test for Form Submission Without Notification Selection
  it('shold not be possible to submit the form when notification is not selected', () => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.TASKS)
      .and.returnValue(of({ values: taskValues }));

    setAction(ACTION.NEW_TASK);
    setFieldValue(fixture, 'select-action-filter', '1');
    setFieldValue(fixture, 'input-receiver', 'test-receiver');
    expectButtonToBeDisabled();
  });

  // Test for Form Submission Without Receiver Selection
  it('shold not be possible to submit the form when receiver is not selected', () => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.TASKS)
      .and.returnValue(of({ values: taskValues }));

    setAction(ACTION.NEW_TASK);
    setFieldValue(fixture, 'select-action-filter', '1');
    setFieldValue(fixture, 'select-notification', NOTIF.EMAIL);
    expectButtonToBeDisabled();
  });

  // Test for Form Submission with All Required Data
  it('should be possible to submit the form when all fields have data', () => {
    const ActionFilterControl = component.form.get('actionFilter');
    const NotificationControl = component.form.get('notification');
    const ReceiverControl = component.form.get('receiver');

    spyOn(mockService, 'getAll')
      .withArgs(SERV.TASKS)
      .and.returnValue(of({ values: taskValues }));

    setAction(ACTION.NEW_TASK);
    ActionFilterControl.patchValue('1');
    NotificationControl.patchValue(NOTIF.EMAIL);
    ReceiverControl.patchValue('test@mail.com');
    fixture.detectChanges();

    expectButtonToBeEnabled();
  });

  // Tests for Filter Display
  it('displays agent filters when action AGENT_ERROR is selected', async () => {
    await expectAgentOptionsOnAction(ACTION.AGENT_ERROR);
  });

  it('displays agent filters when action is OWN_AGENT_ERROR ', async () => {
    await expectAgentOptionsOnAction(ACTION.OWN_AGENT_ERROR);
  });

  it('displays agent filters when action is DELETE_AGENT ', async () => {
    await expectAgentOptionsOnAction(ACTION.DELETE_AGENT);
  });

  it('displays task filters when action is NEW_TASK ', async () => {
    await expectTaskOptionsOnAction(ACTION.NEW_TASK);
  });

  it('displays task filters when action is TASK_COMPLETE ', async () => {
    await expectTaskOptionsOnAction(ACTION.TASK_COMPLETE);
  });

  it('displays task filters when action is DELETE_TASK ', async () => {
    await expectTaskOptionsOnAction(ACTION.DELETE_TASK);
  });

  it('displays no filters when action is NEW_HASHLIST ', async () => {
    await expectHiddenOnAction(ACTION.NEW_HASHLIST);
  });

  it('displays hashlist filters when action is DELETE_HASHLIST ', async () => {
    await expectHashlistOptionsOnAction(ACTION.DELETE_HASHLIST);
  });

  it('displays hashlist filters when action is HASHLIST_ALL_CRACKED ', async () => {
    await expectHashlistOptionsOnAction(ACTION.HASHLIST_ALL_CRACKED);
  });

  it('displays hashlist filters when action is HASHLIST_CRACKED_HASH ', async () => {
    await expectHashlistOptionsOnAction(ACTION.HASHLIST_CRACKED_HASH);
  });

  it('displays user filters when action is USER_CREATED ', async () => {
    await expectUserOptionsOnAction(ACTION.USER_CREATED);
  });

  it('displays user filters when action is USER_DELETED ', async () => {
    await expectUserOptionsOnAction(ACTION.USER_DELETED);
  });

  it('displays user filters when action is USER_LOGIN_FAILED ', async () => {
    await expectUserOptionsOnAction(ACTION.USER_LOGIN_FAILED);
  });

  it('displays no filters when action is LOG_WARN ', () => {
    expectHiddenOnAction(ACTION.LOG_WARN);
  });

  it('displays no filters when action is LOG_FATAL ', () => {
    expectHiddenOnAction(ACTION.LOG_FATAL);
  });

  it('displays no filters when action is LOG_ERROR ', () => {
    expectHiddenOnAction(ACTION.LOG_ERROR);
  });

  // Test for Form Submission When It Is Valid
  it('should submit the form when it is valid', () => {
    const serviceSpy = spyOn(mockService, 'create')
      .withArgs(SERV.NOTIFICATIONS.URL, jasmine.any(Object))
      .and.returnValue(of({}));

    setValidFormValues();
    fixture.detectChanges();

    const submitButton: DebugElement = findEl(fixture, 'button-create');
    submitButton.nativeElement.querySelector('button').click();

    expect(serviceSpy).toHaveBeenCalledWith(
      SERV.NOTIFICATIONS.URL,
      jasmine.any(Object)
    );
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
    const btn: DebugElement = findEl(fixture, 'button-create');
    expect(
      btn.nativeElement.attributes.getNamedItem('ng-reflect-disabled').value
    ).toEqual('true');
  };

  const expectButtonToBeEnabled = (): void => {
    const btn: DebugElement = findEl(fixture, 'button-create');
    expect(
      btn.nativeElement.attributes.getNamedItem('ng-reflect-disabled').value
    ).toEqual('false');
  };

  const expectHiddenOnAction = (action: string): void => {
    spyOn(mockService, 'getAll');
    setAction(action);
    expect(mockService.getAll).not.toHaveBeenCalled();
    expect(
      fixture.debugElement.query(By.css('select-action-filter'))
    ).toBeFalsy();
  };

  const getOptions = async (action: string) => {
    const actionLoader = await loader.getChildLoader(
      '[data-testid="select-action"]'
    );
    const selectAction = await actionLoader.getHarness(MatSelectHarness);
    await selectAction.open();
    await selectAction.clickOptions({ text: action });
    const actionFilterLoader = await loader.getChildLoader(
      '[data-testid="select-action-filter"]'
    );
    const selectActionFilter =
      await actionFilterLoader.getHarness(MatSelectHarness);
    await selectActionFilter.open();
    return await selectActionFilter.getOptions();
  };

  const expectAgentOptionsOnAction = async (action: string): Promise<void> => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.AGENTS)
      .and.returnValue(of({ values: agentValues }));

    const options = await getOptions(action);

    for (let i = 0; i < options.length; i++) {
      const option = await options[i].getText();
      expect(option).toBe(agentValues[i].agentName);
    }
  };

  const expectTaskOptionsOnAction = async (action: string): Promise<void> => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.TASKS)
      .and.returnValue(of({ values: taskValues }));

    const options = await getOptions(action);

    for (let i = 0; i < options.length; i++) {
      const option = await options[i].getText();
      expect(option).toBe(taskValues[i].taskName);
    }
  };

  const expectHashlistOptionsOnAction = async (
    action: string
  ): Promise<void> => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.HASHLISTS)
      .and.returnValue(of({ values: hashlistValues }));

    const options = await getOptions(action);

    for (let i = 0; i < options.length; i++) {
      const option = await options[i].getText();
      expect(option).toBe(hashlistValues[i].name);
    }
  };

  const expectUserOptionsOnAction = async (action: string): Promise<void> => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.USERS)
      .and.returnValue(of({ values: userValues }));

    const options = await getOptions(action);

    for (let i = 0; i < options.length; i++) {
      const option = await options[i].getText();
      expect(option).toBe(userValues[i].name);
    }
  };

  const setAction = (action: string): void => {
    const ActionControl = component.form.get('action');
    ActionControl.patchValue(action);
    fixture.detectChanges();
  };
});
