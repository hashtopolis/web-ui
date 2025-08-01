import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';
import { NotificationsComponent } from '@src/app/account/notifications/notifications.component';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let titleService: jasmine.SpyObj<AutoTitleService>;
  beforeEach(() => {
    const titleServiceSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    TestBed.configureTestingModule({
      declarations: [NotificationsComponent],
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
});
