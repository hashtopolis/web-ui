import { Component, Injector, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AutoTitleService } from '@services/shared/autotitle.service';

import { AppModule } from '@src/app/app.module';
import { BackgroundJobsComponent } from '@src/app/config/background-jobs/background-jobs.component';

@Component({ selector: 'app-page', template: '<ng-content></ng-content>', standalone: false })
class StubPageComponent {
  @Input() title: string;
}

@Component({ selector: 'app-table', template: '<ng-content></ng-content>', standalone: false })
class StubTableComponent {}

@Component({ selector: 'background-jobs-table', template: '', standalone: false })
class StubBackgroundJobsTableComponent {}

describe('BackgroundJobsComponent', () => {
  let fixture: ComponentFixture<BackgroundJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BackgroundJobsComponent, StubPageComponent, StubTableComponent, StubBackgroundJobsTableComponent],
      providers: [
        {
          provide: AutoTitleService,
          useValue: { set: vi.fn().mockName('AutoTitleService.set') }
        }
      ]
    }).compileComponents();

    AppModule.injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(BackgroundJobsComponent);
    fixture.detectChanges();
  });

  it('renders the background jobs table inside the table container', () => {
    const tableContainer = fixture.debugElement.query(By.directive(StubTableComponent));

    expect(tableContainer).not.toBeNull();
    expect(tableContainer.query(By.directive(StubBackgroundJobsTableComponent))).not.toBeNull();
  });
});
