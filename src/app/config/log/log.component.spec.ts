import { Component, Injector, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LogComponent } from '@src/app/config/log/log.component';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { AppModule } from '@src/app/app.module';
import { BackgroundJobsComponent } from '@src/app/config/background-jobs/background-jobs.component';

@Component({ selector: 'app-page', template: '<ng-content></ng-content>', standalone: false })
class StubPageComponent {
  @Input() title: string;
  @Input() actionTitle?: string;
  @Input() actionLink?: string;
  @Input() showAction?: boolean;
}

@Component({ selector: 'app-table', template: '<ng-content></ng-content>', standalone: false })
class StubTableComponent {}

@Component({ selector: 'logs-table', template: '', standalone: false })
class StubLogsTableComponent {}

describe('LogComponent', () => {
  let fixture: ComponentFixture<LogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogComponent, StubPageComponent, StubTableComponent, StubLogsTableComponent],
      providers: [
        {
          provide: AutoTitleService,
          useValue: { set: vi.fn().mockName('AutoTitleService.set') }
        }
      ]
    }).compileComponents();

    AppModule.injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(LogComponent);
    fixture.detectChanges();
  });

  it('renders the page title', () => {
    fixture = TestBed.createComponent(LogComponent);
    fixture.detectChanges();
    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.title).toBe('Logs');
  });

  it('renders the logs table inside the table container', () => {
    fixture = TestBed.createComponent(LogComponent);
    fixture.detectChanges();
    const tableContainer = fixture.debugElement.query(By.directive(StubTableComponent));

    expect(tableContainer).not.toBeNull();
    expect(tableContainer.query(By.directive(StubLogsTableComponent))).not.toBeNull();
  });
});
