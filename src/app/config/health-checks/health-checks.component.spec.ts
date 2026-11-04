import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HealthCheckRoleService } from '@services/roles/config/healthcheck-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { HealthChecksComponent } from '@src/app/config/health-checks/health-checks.component';

@Component({ selector: 'app-page', template: '<ng-content></ng-content>', standalone: false })
class StubPageComponent {
  @Input() title: string;
  @Input() actionTitle?: string;
  @Input() actionLink?: string;
  @Input() showAction?: boolean;
}

@Component({ selector: 'app-table', template: '<ng-content></ng-content>', standalone: false })
class StubTableComponent {}

@Component({ selector: 'health-checks-table', template: '', standalone: false })
class StubHealthChecksTable {}

describe('HealthChecksComponent', () => {
  let fixture: ComponentFixture<HealthChecksComponent>;
  let hasRole: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    hasRole = vi.fn().mockName('HealthCheckRoleService.hasRole').mockReturnValue(true);

    await TestBed.configureTestingModule({
      declarations: [HealthChecksComponent, StubPageComponent, StubTableComponent, StubHealthChecksTable],
      providers: [
        { provide: AutoTitleService, useValue: { set: vi.fn().mockName('AutoTitleService.set') } },
        { provide: HealthCheckRoleService, useValue: { hasRole } }
      ]
    }).compileComponents();
  });

  it('renders the page title and create action details', () => {
    fixture = TestBed.createComponent(HealthChecksComponent);
    fixture.detectChanges();
    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.title).toBe('Health Checks');
    expect(page.actionTitle).toBe('New Health Check');
    expect(page.actionLink).toBe('/config/health-checks/new');
    expect(page.showAction).toBe(true);
  });

  it('hides the create action when the user lacks the create role', () => {
    hasRole.mockReturnValue(false);
    fixture = TestBed.createComponent(HealthChecksComponent);
    fixture.detectChanges();

    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.showAction).toBe(false);
  });

  it('renders the health checks table inside the table container', () => {
    fixture = TestBed.createComponent(HealthChecksComponent);
    fixture.detectChanges();
    const tableContainer = fixture.debugElement.query(By.directive(StubTableComponent));

    expect(tableContainer).not.toBeNull();
    expect(tableContainer.query(By.directive(StubHealthChecksTable))).not.toBeNull();
  });
});
