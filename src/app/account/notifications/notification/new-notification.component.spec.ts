import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewNotificationComponent } from './new-notification.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from 'src/app/core/_services/main.service';
import { Observable, of } from 'rxjs';
import { Params, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataTablesModule } from 'angular-datatables';
import { ComponentsModule } from 'src/app/shared/components.module';
import { PipesModule } from 'src/app/shared/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { findEl, setFieldValue } from 'src/app/spec-helpers/element.spec-helper';
import { ACTION, NOTIF } from 'src/app/core/_constants/notifications.config';
import { DebugElement } from '@angular/core';
import { SERV } from 'src/app/core/_services/main.config';
import { By } from '@angular/platform-browser';

describe('NewNotificationComponent', () => {
  let component: NewNotificationComponent;
  let fixture: ComponentFixture<NewNotificationComponent>;

  // Define sample data for agent, task, hashlist, and user values.
  const agentValues = [
    { _id: '1', agentName: 'Agent 1' },
    { _id: '2', agentName: 'Agent 2' },
    { _id: '3', agentName: 'Agent 3' },
    { _id: '4', agentName: 'Agent 4' },
    { _id: '5', agentName: 'Agent 5' },
  ]
  const taskValues = [
    { _id: '1', taskName: 'Task 1' },
    { _id: '2', taskName: 'Task 2' },
    { _id: '3', taskName: 'Task 3' },
    { _id: '4', taskName: 'Task 4' },
    { _id: '5', taskName: 'Task 5' },
  ]
  const hashlistValues = [
    { _id: '1', name: 'Hashlist 1' },
    { _id: '2', name: 'Hashlist 2' },
    { _id: '3', name: 'Hashlist 3' },
    { _id: '4', name: 'Hashlist 4' },
    { _id: '5', name: 'Hashlist 5' },
  ]
  const userValues = [
    { _id: '1', name: 'User 1' },
    { _id: '2', name: 'User 2' },
    { _id: '3', name: 'User 3' },
    { _id: '4', name: 'User 4' },
    { _id: '5', name: 'User 5' },
  ]

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
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FontAwesomeModule,
        DataTablesModule,
        ComponentsModule,
        RouterModule,
        PipesModule,
        NgbModule,
      ],
      declarations: [
        NewNotificationComponent
      ],
      providers: [
        {
          provide: GlobalService,
          useValue: mockService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewNotificationComponent);
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
    setFieldValue(fixture, 'select-notification', NOTIF.TELEGRAM)
    setFieldValue(fixture, 'input-receiver', 'test-receiver')
    expectButtonToBeDisabled();
  });

  // Test for Form Submission Without Notification Selection
  it('shold not be possible to submit the form when notification is not selected', () => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.TASKS, { 'maxResults': component.maxResults })
      .and.returnValue(of({ values: taskValues }));

    setAction(ACTION.NEW_TASK);
    setFieldValue(fixture, 'select-action-filter', '1');
    setFieldValue(fixture, 'input-receiver', 'test-receiver');
    expectButtonToBeDisabled();
  });

  // Test for Form Submission Without Receiver Selection
  it('shold not be possible to submit the form when receiver is not selected', () => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.TASKS, { 'maxResults': component.maxResults })
      .and.returnValue(of({ values: taskValues }))

    setAction(ACTION.NEW_TASK)
    setFieldValue(fixture, 'select-action-filter', '1')
    setFieldValue(fixture, 'select-notification', NOTIF.EMAIL)
    expectButtonToBeDisabled()
  });

  // Test for Form Submission with All Required Data
  it('should be possible to submit the form when all fields have data', () => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.TASKS, { 'maxResults': component.maxResults })
      .and.returnValue(of({ values: taskValues }))

    setAction(ACTION.NEW_TASK)
    setFieldValue(fixture, 'select-action-filter', '1')
    setFieldValue(fixture, 'select-notification', NOTIF.EMAIL)
    setFieldValue(fixture, 'input-receiver', 'test@mail.com')
    fixture.detectChanges();

    expectButtonToBeEnabled()
  });

  // Tests for Filter Display
  it('should display agent filters when action is AGENT_ERROR', () => {
    expectAgentOptionsOnAction(ACTION.AGENT_ERROR)
  });

  it('should display agent filters when action is OWN_AGENT_ERROR ', () => {
    expectAgentOptionsOnAction(ACTION.OWN_AGENT_ERROR)
  });

  it('should display agent filters when action is DELETE_AGENT ', () => {
    expectAgentOptionsOnAction(ACTION.DELETE_AGENT)
  });

  it('should display task filters when action is NEW_TASK ', () => {
    expectTaskOptionsOnAction(ACTION.NEW_TASK)
  });

  it('should display task filters when action is TASK_COMPLETE ', () => {
    expectTaskOptionsOnAction(ACTION.TASK_COMPLETE)
  });

  it('should display task filters when action is DELETE_TASK ', () => {
    expectTaskOptionsOnAction(ACTION.DELETE_TASK)
  });

  it('should display no filters when action is NEW_HASHLIST ', () => {
    expectHiddenOnAction(ACTION.NEW_HASHLIST)
  });

  it('should display hashlist filters when action is DELETE_HASHLIST ', () => {
    expectHashlistOptionsOnAction(ACTION.DELETE_HASHLIST)
  });

  it('should display hashlist filters when action is HASHLIST_ALL_CRACKED ', () => {
    expectHashlistOptionsOnAction(ACTION.HASHLIST_ALL_CRACKED)
  });

  it('should display hashlist filters when action is HASHLIST_CRACKED_HASH ', () => {
    expectHashlistOptionsOnAction(ACTION.HASHLIST_CRACKED_HASH)
  });

  it('should display user filters when action is USER_CREATED ', () => {
    expectUserOptionsOnAction(ACTION.USER_CREATED)
  });

  it('should display user filters when action is USER_DELETED ', () => {
    expectUserOptionsOnAction(ACTION.USER_DELETED)
  });

  it('should display user filters when action is USER_LOGIN_FAILED ', () => {
    expectUserOptionsOnAction(ACTION.USER_LOGIN_FAILED)
  });

  it('should display no filters when action is LOG_WARN ', () => {
    expectHiddenOnAction(ACTION.LOG_WARN)
  });

  it('should display no filters when action is LOG_FATAL ', () => {
    expectHiddenOnAction(ACTION.LOG_FATAL)
  });

  it('should display no filters when action is LOG_ERROR ', () => {
    expectHiddenOnAction(ACTION.LOG_ERROR)
  });

  // Test for Form Submission When It Is Valid
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


  // --- Helper functions ---

  const setValidFormValues = (): void => {
    setAction(ACTION.NEW_TASK);
    setFieldValue(fixture, 'select-action-filter', '1');
    setFieldValue(fixture, 'select-notification', NOTIF.EMAIL);
    setFieldValue(fixture, 'input-receiver', 'test@mail.com');
    fixture.detectChanges();
  };

  const expectButtonToBeDisabled = (): void => {
    const btn: DebugElement = findEl(fixture, 'button-create')
    expect(btn.nativeElement.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('true')
  }

  const expectButtonToBeEnabled = (): void => {
    const btn: DebugElement = findEl(fixture, 'button-create')
    expect(btn.nativeElement.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('false')
  }

  const expectHiddenOnAction = (action: string): void => {
    spyOn(mockService, 'getAll')
    setAction(action)
    expect(mockService.getAll).not.toHaveBeenCalled()
    expect(fixture.debugElement.query(By.css('select-action-filter'))).toBeFalsy()
  }

  const expectAgentOptionsOnAction = (action: string): void => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.AGENTS, { 'maxResults': component.maxResults })
      .and.returnValue(of({ values: agentValues }))

    setAction(action)
    const elem = findEl(fixture, 'select-action-filter')
    for (let i = 0; i < 5; i++) {
      expextOptionToBe(elem, i + 1, agentValues[i]._id, agentValues[i].agentName)
    }
  }

  const expectTaskOptionsOnAction = (action: string): void => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.TASKS, { 'maxResults': component.maxResults })
      .and.returnValue(of({ values: taskValues }))

    setAction(action)
    const elem = findEl(fixture, 'select-action-filter')
    for (let i = 0; i < 5; i++) {
      expextOptionToBe(elem, i + 1, taskValues[i]._id, taskValues[i].taskName)
    }
  }

  const expectHashlistOptionsOnAction = (action: string): void => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.HASHLISTS, { 'maxResults': component.maxResults })
      .and.returnValue(of({ values: hashlistValues }))

    setAction(action)
    const elem = findEl(fixture, 'select-action-filter')
    for (let i = 0; i < 5; i++) {
      expextOptionToBe(elem, i + 1, hashlistValues[i]._id, hashlistValues[i].name)
    }
  }

  const expectUserOptionsOnAction = (action: string): void => {
    spyOn(mockService, 'getAll')
      .withArgs(SERV.USERS, { 'maxResults': component.maxResults })
      .and.returnValue(of({ values: userValues }))

    setAction(action)
    const elem = findEl(fixture, 'select-action-filter')
    for (let i = 0; i < 5; i++) {
      expextOptionToBe(elem, i + 1, userValues[i]._id, userValues[i].name)
    }
  }

  const setAction = (action: string): void => {
    setFieldValue(fixture, 'select-action', action)
    fixture.detectChanges();
  }

  const expextOptionToBe = (elem: DebugElement, index: number, value: string, textContent: string): void => {
    expect(elem.childNodes[index].nativeNode.value).toEqual(value);
    expect(elem.childNodes[index].nativeNode.textContent).toEqual(textContent);
  }
});







