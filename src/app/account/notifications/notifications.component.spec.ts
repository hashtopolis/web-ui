import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';
import { By } from '@angular/platform-browser';
import { NotificationsComponent } from '@src/app/account/notifications/notifications.component';

@Component({
  selector: 'app-table',
  template: '<ng-content></ng-content>',
  standalone: true
})
class MockTableComponent {}
/* 
  Mock component for app-page-title to avoid dependency on the actual implementation.
*/
@Component({
  selector: 'app-page-title',
  template: '<ng-content></ng-content>',
  standalone: true
})
class MockPageTitleComponent {
  @Input() title: string;
  @Input() buttontitle: string;
  @Input() buttonlink: string;
  @Input() subbutton: boolean;
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

  beforeEach(() => {
    const titleServiceSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    TestBed.configureTestingModule({
      declarations: [NotificationsComponent],
      imports: [MockTableComponent, MockPageTitleComponent, MockNotificationsTableComponent],
      providers: [{ provide: AutoTitleService, useValue: titleServiceSpy }]
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

  it('should include app-page-title component with correct inputs', () => {
    const pageTitleElement = fixture.debugElement.query(By.directive(MockPageTitleComponent));
    expect(pageTitleElement).toBeTruthy();

    const pageTitleComponent = pageTitleElement.componentInstance;
    expect(pageTitleComponent.title).toBe('Notifications');
    expect(pageTitleComponent.buttontitle).toBe('New Notification');
    expect(pageTitleComponent.buttonlink).toBe('/account/notifications/new-notification');
    expect(pageTitleComponent.subbutton).toBe(true);
  });

  it('should include app-notifications-table component', () => {
    const tableElement = fixture.debugElement.query(By.directive(MockNotificationsTableComponent));
    expect(tableElement).toBeTruthy();
  });
});
