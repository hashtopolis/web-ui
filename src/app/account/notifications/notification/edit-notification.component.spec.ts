import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from 'src/app/core/_services/main.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataTablesModule } from 'angular-datatables';
import { ComponentsModule } from 'src/app/shared/components.module';
import { PipesModule } from 'src/app/shared/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { checkField, findEl } from 'src/app/spec-helpers/element.spec-helper';
import { DebugElement } from '@angular/core';
import { SERV } from 'src/app/core/_services/main.config';
import { EditNotificationComponent } from './edit-notification.component';


describe('EditNotificationComponent', () => {
  let component: EditNotificationComponent;
  let fixture: ComponentFixture<EditNotificationComponent>;

  // Define a mock response for the notification
  const nodificationResponse = {
    '_expandable': 'user',
    '_id': 1,
    '_self': '/api/v2/ui/notifications/1',
    'action': 'logError',
    'isActive': false,
    'notification': 'ChatBot',
    'notificationSettingId': 1,
    'objectId': null,
    'receiver': 'asdasdasd',
    'userId': 1
  }

  // Define a partial mock service to simulate service calls.
  const mockService: Partial<GlobalService> = {
    // Simulate the 'get' method to return an empty observable.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    get(_methodUrl: string, _id: number, _routerParams?: Params): Observable<any> {
      return of([])
    },
    // Simulate the 'update' method to return an empty observable.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    update(_methodUrl: string, _id: number, _object: any): Observable<any> {
      return of({})
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
        EditNotificationComponent
      ],
      providers: [
        {
          provide: GlobalService,
          useValue: mockService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              id: 1,
            }),
          },
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  // --- Test Methods ---


  // Check if the 'action' field is disabled and cannot be edited.
  it('should not allow action to be edited', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    expectFieldToBeDisabled('select-action')
  });

  // Check if the 'action-filter' field is disabled and cannot be edited.
  it('should not allow action-filter to be edited', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    expectFieldToBeDisabled('select-action-filter')
  });

  // Check if the 'notification' field is disabled and cannot be edited.
  it('should not allow notification to be edited', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    expectFieldToBeDisabled('select-notification')
  });

  // Check if the 'receiver' field is disabled and cannot be edited.
  it('should not allow receiver to be edited', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    expectFieldToBeDisabled('input-receiver')
  });

  // Check if the 'status' field is enabled and can be edited.
  it('should allow status to be edited', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    expectFieldToBeEnabled('input-is-active')
  });

  // Check if the form is disabled and cannot be submitted when nothing has changed.
  it('should not allow form to be submitted when nothing has changed', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    expectButtonToBeDisabled()
  });

  // Check if the form is enabled and can be submitted when the status has changed.
  it('should allow form to be submitted when status has changed', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    checkField(fixture, 'input-is-active', true)
    fixture.detectChanges();

    expectButtonToBeEnabled()
  });

  // Check if the form is submitted when it is valid and button is clicked.
  it('should submit the form when it is valid', () => {
    const serviceSpy = spyOn(mockService, 'update')
      .withArgs(SERV.NOTIFICATIONS, 1, jasmine.any(Object))
      .and.returnValue(of({}));

    checkField(fixture, 'input-is-active', true)
    fixture.detectChanges();

    const submitButton: DebugElement = findEl(fixture, 'button-create');
    submitButton.nativeElement.querySelector('button').click();

    expect(serviceSpy).toHaveBeenCalledWith(SERV.NOTIFICATIONS, 1, jasmine.any(Object));
  });


  // --- Helper functions ---


  const expectFieldToBeDisabled = (testId: string): void => {
    const field: DebugElement = findEl(fixture, testId)
    expect(field.nativeElement.disabled).toEqual(true)
  }

  const expectFieldToBeEnabled = (testId: string): void => {
    const field: DebugElement = findEl(fixture, testId)
    expect(field.nativeElement.disabled).toEqual(false)
  }

  const expectButtonToBeDisabled = (): void => {
    const btn: DebugElement = findEl(fixture, 'button-create')
    expect(btn.nativeElement.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('true')
  }

  const expectButtonToBeEnabled = (): void => {
    const btn: DebugElement = findEl(fixture, 'button-create')
    expect(btn.nativeElement.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('false')
  }

});