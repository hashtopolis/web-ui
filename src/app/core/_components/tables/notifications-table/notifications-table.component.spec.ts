import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JNotification } from '@models/notification.model';

import { NotificationsTableComponent } from '@components/tables/notifications-table/notifications-table.component';
import { NotificationsTableCol } from '@components/tables/notifications-table/notifications-table.constants';

import { ACTION } from '@src/app/core/_constants/notifications.config';

class MockNotificationsDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestNotificationsTableComponent extends NotificationsTableComponent {
  override ngOnInit(): void {
    // Only set columns and mock dataSource — skip real NotificationsDataSource
    this.setColumnLabels({
      [NotificationsTableCol.APPLIED_TO]: 'Applied To',
      [NotificationsTableCol.ID]: 'ID',
      [NotificationsTableCol.STATUS]: 'Status',
      [NotificationsTableCol.ACTION]: 'Action',
      [NotificationsTableCol.NOTIFICATION]: 'Notification',
      [NotificationsTableCol.RECEIVER]: 'Receiver'
    });
    this.tableColumns = this.getColumns();
    this.dataSource = new MockNotificationsDataSource() as any;
  }
}

describe('NotificationsTableComponent', () => {
  let component: TestNotificationsTableComponent;
  let fixture: ComponentFixture<TestNotificationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestNotificationsTableComponent],
      providers: [provideHttpClientTesting(), provideHttpClient()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestNotificationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a link when objectId exists', () => {
    const notification: JNotification = {
      type: 'notificationSetting',
      id: 1,
      action: ACTION.USER_DELETED,
      objectId: 42,
      isActive: true,
      notification: 'Test notification',
      receiver: 'test@test.com',
      userId: 123
    };

    component.getColumns().forEach((col) => {
      if (col.id === NotificationsTableCol.APPLIED_TO && col.routerLink) {
        col.routerLink(notification).subscribe((links) => {
          expect(links[0].label).toContain('User: 42');
          expect(links[0].routerLink).toEqual(['/users', 42]);
        });
      }
    });
  });

  it('should render placeholder when objectId is null', () => {
    const notification: JNotification = {
      type: 'notificationSetting',
      id: 2,
      action: ACTION.USER_DELETED,
      objectId: undefined,
      isActive: true,
      notification: 'Test notification',
      receiver: 'test@test.com',
      userId: 123
    };

    component.getColumns().forEach((col) => {
      if (col.id === NotificationsTableCol.APPLIED_TO && col.routerLink) {
        col.routerLink(notification).subscribe((links) => {
          expect(links[0].label).toBe('N/A');
          expect(links[0].routerLink).toBeNull();
        });
      }
    });
  });
});
