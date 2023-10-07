import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from 'src/app/core/_services/main.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
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
import { EditNotificationComponent } from './edit-notification.component';

describe('EditNotificationComponent', () => {
  let component: EditNotificationComponent;
  let fixture: ComponentFixture<EditNotificationComponent>;

  const nodificationResponse = {
    "_expandable": "user",
    "_id": 1,
    "_self": "/api/v2/ui/notifications/1",
    "action": "logError",
    "isActive": true,
    "notification": "ChatBot",
    "notificationSettingId": 1,
    "objectId": null,
    "receiver": "asdasdasd",
    "userId": 1
  }

  const mockService: Partial<GlobalService> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    get(_methodUrl: string, id: number, _routerParams?: Params): Observable<any> {
      return of([])
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

  it('should not allow action to be edited', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    expectFieldToBeDisabled('select-action')
  });

  it('should not allow action-filter to be edited', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    expectFieldToBeDisabled('select-action-filter')
  });

  it('should not allow notification to be edited', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    expectFieldToBeDisabled('select-notification')
  });

  it('should not allow receiver to be edited', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    expectFieldToBeDisabled('input-receiver')
  });

  it('should allow status to be edited', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    expectFieldToBeEnabled('input-is-active')
  });

  it('should not allow form to be submitted when nothing has changed', () => {
    spyOn(mockService, 'get')
      .withArgs(SERV.NOTIFICATIONS, 1)
      .and.returnValue(of(nodificationResponse))

    expectButtonToBeDisabled()
  });


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