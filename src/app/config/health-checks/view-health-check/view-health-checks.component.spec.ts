import { zHealthCheckResponse } from '@generated/api/zod';
import { of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { uiConfigDefault } from '@models/config-ui.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { ViewHealthChecksComponent } from '@src/app/config/health-checks/view-health-check/view-health-checks.component';
import { HealthCheckStatusPipe } from '@src/app/core/_pipes/healthcheck-status.pipe';
import { mockValidResponse } from '@src/app/testing/mock-response';

@Component({ selector: 'app-page', template: '<ng-content></ng-content>', standalone: false })
class StubPageComponent {
  @Input() title: string;
}

@Component({ selector: 'grid-main', template: '<ng-content></ng-content>', standalone: false })
class StubGridMainComponent {}

@Component({ selector: 'input-text', template: '', standalone: false })
class StubInputTextComponent {
  @Input() title: string;
  @Input() value: string;
  @Input() readonly: boolean;
}

@Component({ selector: 'app-page-subtitle', template: '', standalone: false })
class StubPageSubtitleComponent {
  @Input() subtitle: string;
}

@Component({ selector: 'app-table', template: '<ng-content></ng-content>', standalone: false })
class StubTableComponent {}

@Component({ selector: 'app-health-check-agents-table', template: '', standalone: false })
class StubHealthCheckAgentsTableComponent {
  @Input() healthCheckId: number;
}

describe('ViewHealthChecksComponent', () => {
  let fixture: ComponentFixture<ViewHealthChecksComponent>;
  let get: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    get = vi
      .fn()
      .mockName('GlobalService.get')
      .mockReturnValue(
        of(
          mockValidResponse(zHealthCheckResponse, {
            data: {
              id: 27,
              type: 'healthCheck',
              attributes: {
                time: 1_793_778_250,
                status: 1,
                checkType: 0,
                hashtypeId: 0,
                crackerBinaryId: 4,
                expectedCracks: 5,
                attackCmd: 'test command'
              }
            }
          })
        )
      );

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [
        ViewHealthChecksComponent,
        StubPageComponent,
        StubGridMainComponent,
        StubInputTextComponent,
        StubPageSubtitleComponent,
        StubTableComponent,
        StubHealthCheckAgentsTableComponent,
        HealthCheckStatusPipe
      ],
      providers: [
        { provide: GlobalService, useValue: { get } },
        { provide: AutoTitleService, useValue: { set: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '27' } } }
        },
        { provide: LocalStorageService, useValue: { getItem: vi.fn().mockReturnValue(uiConfigDefault) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewHealthChecksComponent);
    fixture.detectChanges();
  });

  it('renders the health check title, details, and checked agents table', () => {
    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;
    const detailFields = fixture.debugElement.queryAll(By.directive(StubInputTextComponent));

    expect(page.title).toBe('Health Check 27');
    expect(detailFields.map((field) => (field.componentInstance as StubInputTextComponent).title)).toEqual([
      'Created',
      'Status'
    ]);
    expect(detailFields.every((field) => (field.componentInstance as StubInputTextComponent).readonly)).toBe(true);
    expect(
      (
        fixture.debugElement.query(By.directive(StubPageSubtitleComponent))
          .componentInstance as StubPageSubtitleComponent
      ).subtitle
    ).toBe('Checked Agents');
    expect(fixture.debugElement.query(By.directive(StubHealthCheckAgentsTableComponent))).toBeTruthy();
  });

  it('loads the route health check and passes its id to the agents table', () => {
    expect(get).toHaveBeenCalledWith(SERV.HEALTH_CHECKS, 27);
    const table = fixture.debugElement.query(By.directive(StubHealthCheckAgentsTableComponent))
      .componentInstance as StubHealthCheckAgentsTableComponent;
    expect(table.healthCheckId).toBe(27);
  });

  it('renders the loaded status and creation time in the detail inputs', () => {
    const fields = fixture.debugElement
      .queryAll(By.directive(StubInputTextComponent))
      .map((field) => field.componentInstance as StubInputTextComponent);

    expect(fields[0].value).toBeTruthy();
    expect(fields[1].value).toBe('Completed');
  });
});
