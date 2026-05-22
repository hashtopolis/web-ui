import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NotificationsRoleService } from '@services/roles/config/notifications-role.service';

import { NotificationsComponent } from '@src/app/account/notifications/notifications.component';
import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';

@Component({
  selector: 'app-table',
  template: '<ng-content></ng-content>',
  standalone: true
})
class MockTableComponent {}
/*
  Mock component for app-page to avoid dependency on the actual implementation.
*/
@Component({
  selector: 'app-page',
  template: '<ng-content></ng-content>',
  standalone: true
})
class MockPageComponent {
  @Input() title: string;
  @Input() subtitle?: string;
  @Input() actionTitle?: string;
  @Input() actionLink?: string;
  @Input() showAction?: boolean;
}

@Component({
  selector: 'app-notifications-table',
  template: '<ng-content></ng-content>',
  standalone: true
})
class MockNotificationsTableComponent {}

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let titleService: jasmine.SpyObj<AutoTitleService>;
  let mockRoleService: jasmine.SpyObj<NotificationsRoleService>;

  beforeEach(() => {
    const titleServiceSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    mockRoleService = jasmine.createSpyObj('NotificationsRoleService', ['hasRole']);

    TestBed.configureTestingModule({
      declarations: [NotificationsComponent],
      imports: [MockTableComponent, MockPageComponent, MockNotificationsTableComponent],
      providers: [
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: NotificationsRoleService, useValue: mockRoleService }
      ]
    });

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(AutoTitleService) as jasmine.SpyObj<AutoTitleService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title to "Notifications"', () => {
    expect(titleService.set).toHaveBeenCalledWith(['Notifications']);
  });

  it('should include app-table component', () => {
    const tableElement = fixture.debugElement.query(By.directive(MockTableComponent));
    expect(tableElement).toBeTruthy();
  });

  it('should include app-page component with correct inputs', () => {
    const pageElement = fixture.debugElement.query(By.directive(MockPageComponent));
    expect(pageElement).toBeTruthy();
    const pageComponent = pageElement.componentInstance;
    expect(pageComponent.title).toBe('Notifications');
    expect(pageComponent.actionTitle).toBe('New Notification');
    expect(pageComponent.actionLink).toBe('/account/notifications/new-notification');
  });

  it('should include app-notifications-table component', () => {
    const tableElement = fixture.debugElement.query(By.directive(MockNotificationsTableComponent));
    expect(tableElement).toBeTruthy();
  });
});
