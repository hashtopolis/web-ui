import { ComponentFixture, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GlobalService } from 'src/app/core/_services/main.service';
import { Observable, of } from 'rxjs';
import { SERV } from '../../core/_services/main.config';
import { NotificationListResponse, Notification } from 'src/app/core/_models/notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components.module';
import { PipesModule } from 'src/app/shared/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  // Sample notifications data
  const notifications: Notification[] = [
    {
      _id: 1,
      _self: 'http://example.com/notifications/1',
      action: 'Action 1',
      isActive: true,
      notification: 'Notification 1',
      receiver: 'Receiver 1',
      userId: 1,
      notificationSettingId: 101,
      objectId: 201,
    },
    {
      _id: 2,
      _self: 'http://example.com/notifications/2',
      action: 'Action 2',
      isActive: true,
      notification: 'Notification 2',
      receiver: 'Receiver 2',
      userId: 2,
      notificationSettingId: 102,
      objectId: 202,
    },
    {
      _id: 3,
      _self: 'http://example.com/notifications/3',
      action: 'Action 3',
      isActive: true,
      notification: 'Notification 3',
      receiver: 'Receiver 3',
      userId: 3,
      notificationSettingId: 103,
      objectId: 203,
    },
  ];

  // Mock GlobalService with required methods
  const mockService: Partial<GlobalService> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    getAll(_methodUrl: string, params: any): Observable<NotificationListResponse> {
      if (_methodUrl === SERV.NOTIFICATIONS) {
        const response: NotificationListResponse = {
          _expandable: '',
          startAt: 0,
          maxResults: notifications.length,
          total: notifications.length,
          isLast: true,
          values: notifications,
        };
        return of(response);
      }
      return of({} as NotificationListResponse);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete(_methodUrl: string, id: number): Observable<any> {
      if (_methodUrl === SERV.NOTIFICATIONS) {
        const index = notifications.findIndex((n) => n._id === id);
        if (index !== -1) {
          notifications.splice(index, 1);
        }
        return of({});
      }
      return of({});
    },
  };

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
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [NotificationsComponent],
      providers: [
        {
          provide: GlobalService,
          useValue: mockService,
        },
        Swal
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  // Check if the component is created successfully
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Ensure that notifications are fetched and stored in the component
  it('should fetch notifications on initialization', () => {
    expect(component.notifications).toEqual(notifications);
  });

  // Verify that the table in the component's HTML is populated with the correct number of rows
  it('should render the table with notifications', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(notifications.length);
  });

  // Simulate the deletion of a notification and confirm the action
  // Expect that the notification deletion was called, Swal fire was triggered,
  // and the notification is no longer in the component's list
  it('should handle notification deletion', fakeAsync(() => {
    const deleteSpy = spyOn(mockService, 'delete').and.callThrough();
    const swalFireSpy = spyOn(Swal, 'fire').and.callFake(() => {
      return Promise.resolve({ isConfirmed: true });
    });

    const notificationToDelete = notifications[0];
    component.onDelete(notificationToDelete._id, notificationToDelete.notification);

    // Trigger the confirmation and flush any asynchronous tasks
    Swal.clickConfirm();
    flush();

    expect(deleteSpy).toHaveBeenCalledWith(SERV.NOTIFICATIONS, notificationToDelete._id);
    expect(swalFireSpy).toHaveBeenCalled();
    expect(component.notifications).not.toContain(notificationToDelete);
  }));

  // Simulate the deletion of a notification and cancel the action
  // Expect that the notification deletion was not called,
  // Swal fire was triggered, and the notification remains in the component's list
  it('should handle notification deletion cancellation', fakeAsync(() => {
    const deleteSpy = spyOn(mockService, 'delete').and.callThrough();
    const swalFireSpy = spyOn(Swal, 'fire').and.callFake(() => {
      return Promise.resolve({ isConfirmed: false });
    });

    const notificationToDelete = notifications[0];
    component.onDelete(notificationToDelete._id, notificationToDelete.notification);

    // Trigger the cancellation and flush any asynchronous tasks
    Swal.clickCancel()
    flush();

    expect(deleteSpy).not.toHaveBeenCalled();
    expect(swalFireSpy).toHaveBeenCalled();
    expect(component.notifications).toContain(notificationToDelete);
  }));

});
