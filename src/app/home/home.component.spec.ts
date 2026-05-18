import { Subject, of, throwError } from 'rxjs';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, DebugElement, Injector, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink, RouterLinkWithHref, provideRouter } from '@angular/router';

import { uiConfigDefault } from '@models/config-ui.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';
import { TaskType } from '@models/task.model';

import { SERV, ServiceConfig } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { AppModule } from '@src/app/app.module';
import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';
import { PageTitle } from '@src/app/core/_decorators/autotitle';
import { HomeComponent } from '@src/app/home/home.component';
import { HomeModule } from '@src/app/home/home.module';
import { mockResponse } from '@src/app/testing/mock-response';

/**
 * Stub component to replace the real app-heatmap-chart component in tests.
 * Prevents the need to load its internal logic or dependencies.
 */
@Component({
  selector: 'app-heatmap-chart',
  template: '<div>Heatmap Chart Stub</div>'
})
class HeatmapChartStubComponent {
  /** Input for heatmap data */
  @Input() data: unknown;

  /** Input for dark mode styling */
  @Input() isDarkMode: boolean;
}

/**
 * Dummy component used for routing configuration during tests.
 * Acts as a placeholder target for router navigation.
 */
@Component({ template: '' })
class DummyComponent {}

/**
 * Stub routes used during test setup to initialize the RouterTestingModule.
 */
const routes = [{ path: '', component: DummyComponent }];

/**
 * Mock implementation of GlobalService.
 * Simulates various backend service responses based on service type and filter params.
 */
const globalServiceMock = jasmine.createSpyObj('GlobalService', ['getAll', 'ghelper']);

/**
 * Conditional return logic for the mocked `getAll` method of GlobalService.
 * Returns different counts depending on the service and filter parameters.
 */
globalServiceMock.getAll.and.callFake((service: ServiceConfig, params?: RequestParams) => {
  // Handle TASKS_WRAPPER_COUNT — differentiate between Supertasks and regular Tasks
  if (service === SERV.TASKS_WRAPPER_COUNT) {
    const isSuperTask = params?.filter?.some(
      (filter: Filter) => filter.field === 'taskType' && filter.value === TaskType.SUPERTASK
    );

    const isCompleted = params?.filter?.some(
      (filter: Filter) => filter.field === 'keyspace' && filter.operator === FilterType.GREATER
    );

    // Return counts based on task type and completion status
    if (isSuperTask) {
      return of({ meta: { count: isCompleted ? 5 : 10 } }); // 5 completed, 10 total supertasks
    } else {
      return of({ meta: { count: isCompleted ? 15 : 30 } }); // 15 completed, 30 total tasks
    }
  }

  // Handle AGENTS_COUNT — returns total and active agent counts
  if (service === SERV.AGENTS_COUNT) {
    return of({ meta: { total_count: 50, count: 20 } }); // 20 active, 50 total agents
  }

  // Handle HASHES_COUNT — returns number of cracked hashes
  if (service === SERV.HASHES_COUNT) {
    return of({ meta: { count: 7 } }); // 7 hashes cracked
  }

  // Handle HASHES — return an empty dataset for now
  if (service === SERV.HASHES) {
    return of(mockResponse()); // simulate empty response
  }

  // Default fallback for any other service
  return of({ meta: { count: 0 }, results: [] });
});

/**
 * Mock for `ghelper` — returns an empty data array for any helper endpoint.
 */
globalServiceMock.ghelper.and.returnValue(of({ data: [] }));

/**
 * Mock implementation of LocalStorageService for testing purposes.
 * Simulates localStorage behavior by stubbing `getItem` and `setItem`.
 */
const mockLocalStorageService = {
  /** Simulates retrieving a value from localStorage. Returns uiConfigDefault so UISettingsUtilityClass has a valid timefmt. */
  getItem: jasmine.createSpy('getItem').and.returnValue(uiConfigDefault),

  /** Simulates saving a value in localStorage. Does not persist anything. */
  setItem: jasmine.createSpy('setItem')
};

// Stub for PageTitle decorator behavior
class PageTitleStub {
  set = jasmine.createSpy('set');
}

/**
 * Mock for the PermissionService.
 * All permissions return `true` by default unless explicitly overridden.
 */
const permissionServiceMock = jasmine.createSpyObj('PermissionService', ['hasPermissionSync']);
permissionServiceMock.hasPermissionSync.and.returnValue(true);

function createMockAutoRefreshService() {
  const service = {
    refreshPage: false,
    refresh$: new Subject<void>(),
    toggleAutoRefresh: jasmine
      .createSpy('toggleAutoRefresh')
      .and.callFake((enabled: boolean, options?: { immediate: boolean }) => {
        service.refreshPage = enabled;
        if (options?.immediate) {
          service.refresh$.next();
        }
      }),
    startAutoRefresh: jasmine.createSpy('startAutoRefresh'),
    stopAutoRefresh: jasmine.createSpy('stopAutoRefresh')
  };
  return service;
}

describe('HomeComponent (template permissions and view)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugEl: DebugElement;
  let mockAutoRefreshService: ReturnType<typeof createMockAutoRefreshService>;

  beforeEach(async () => {
    mockAutoRefreshService = createMockAutoRefreshService();

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HomeModule, RouterLink, RouterLinkWithHref, HeatmapChartStubComponent],
      providers: [
        provideHttpClientTesting(),
        provideRouter(routes),
        { provide: GlobalService, useValue: globalServiceMock },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: PermissionService, useValue: permissionServiceMock },
        { provide: AutoRefreshService, useValue: mockAutoRefreshService },
        { provide: PageTitle, useClass: PageTitleStub }
      ]
    }).compileComponents();

    AppModule.injector = TestBed.inject(Injector);

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;

    component.activeAgents = 10;
    component.totalAgents = 20;
    component.completedTasks = 15;
    component.totalTasks = 30;
    component.completedSupertasks = 5;
    component.totalSupertasks = 10;
    component.totalCracks = 7;
    component.heatmapData = [
      ['2025-07-01', 3],
      ['2025-07-02', 4]
    ];
    component.lastUpdated = new Date('2025-07-20T10:00:00');
    component.isDarkMode = false;

    permissionServiceMock.hasPermissionSync.calls.reset();
    globalServiceMock.getAll.calls.reset();

    fixture.detectChanges();
    mockAutoRefreshService.toggleAutoRefresh.calls.reset();
    mockAutoRefreshService.refreshPage = false;
  });

  it('should show agent count when permission is granted', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm === Perm.Agent.READ);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    const agentCard = debugEl.query(By.css('.co-25:nth-child(1)'));
    expect(text).toContain('20 / 50');
    expect(agentCard.nativeElement.textContent).not.toContain('No permission');
  });

  it('should show "No permission" for agents when canReadAgents false', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm !== Perm.Agent.READ);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();

    const agentCard = debugEl.query(By.css('.co-25:nth-child(1)'));
    expect(agentCard.nativeElement.textContent).toContain('No permission');
    expect(agentCard.nativeElement.textContent).not.toContain('10 / 20');
  });

  it('should show tasks stats and hide "no permission" when canReadTasks true', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm === Perm.Task.READ);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();

    const tasksCard = debugEl.queryAll(By.css('.co-25'))[1];
    expect(tasksCard.nativeElement.textContent).toContain('Tasks');
    expect(tasksCard.nativeElement.textContent).toContain('15 / 30');
    expect(tasksCard.query(By.css('.no-permission'))).toBeNull();
  });

  it('should show "No permission" for tasks when canReadTasks false', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm !== Perm.Task.READ);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();

    const tasksCard = debugEl.queryAll(By.css('.co-25'))[1];
    expect(tasksCard.nativeElement.textContent).toContain('No permission');
    expect(tasksCard.nativeElement.textContent).not.toContain('15 / 30');
  });

  it('should show supertask count when permission is granted', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm === Perm.Task.READ);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    const noPermText = fixture.debugElement.query(By.css('.supertasks-section .no-permission'));
    expect(text).toContain('5 / 10');
    expect(noPermText).toBeNull();
  });

  it('should show "No permission" for supertasks when canReadTasks false', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm !== Perm.Task.READ);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();

    const supertasksCard = debugEl.queryAll(By.css('.co-25'))[2];
    expect(supertasksCard.nativeElement.textContent).toContain('No permission');
    expect(supertasksCard.nativeElement.textContent).not.toContain('5 / 10');
  });

  it('should show cracks count and hide "no permission" when canReadCracks true', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm === Perm.Hash.READ);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();

    const cracksCard = debugEl.queryAll(By.css('.co-25'))[3];
    expect(cracksCard.nativeElement.textContent).toContain('Cracks');
    expect(cracksCard.nativeElement.textContent).toContain('7');
    expect(cracksCard.query(By.css('.no-permission'))).toBeNull();
  });

  it('should show "No permission" for cracks when canReadCracks is false', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm !== Perm.Hash.READ);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();

    const cracksCard = debugEl.query(By.css('.co-25:nth-child(4)'));
    const cracksValueSpan = cracksCard.query(By.css('.value'));
    const noPermissionSpan = cracksCard.query(By.css('.no-permission'));
    expect(cracksCard).toBeTruthy();
    expect(cracksValueSpan).toBeNull();
    expect(noPermissionSpan).toBeTruthy();
    expect(noPermissionSpan.nativeElement.textContent).toContain('No permission');
  });

  it('should NOT show heatmap chart when canReadCracks false', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm !== Perm.Hash.READ);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();

    const heatmap = debugEl.query(By.directive(HeatmapChartStubComponent));
    const chartContainer = debugEl.query(By.css('.app-echarts'));
    const noPermText = chartContainer.query(By.css('.no-permission'));
    expect(heatmap).toBeNull();
    expect(chartContainer).toBeTruthy();
    expect(noPermText).toBeTruthy();
    expect(noPermText.nativeElement.textContent).toContain('No permission to view chart data');
  });

  it('should show "No permission to view chart data" when no permission for cracks', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm !== Perm.Hash.READ);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();

    const chartContainer = debugEl.query(By.css('.app-echarts'));
    const noPermText = chartContainer.query(By.css('.no-permission'));
    expect(noPermText.nativeElement.textContent).toContain('No permission to view chart data');
  });

  /**TODO: Fix these tests - they currently do only run if executed isolated, but not in the suite */
  /*it('should show enable auto reload button when refreshPage false', () => {
    mockAutoRefreshService.refreshPage = false;
    fixture.detectChanges();

    const enableButton = debugEl.query(By.css('button[data-testid="enable-auto-reload"]'));
    expect(enableButton).toBeTruthy();
  });

  it('should show pause auto reload button when refreshPage true', () => {
    mockAutoRefreshService.refreshPage = true;
    fixture.detectChanges();

    const pauseButton = debugEl.query(By.css('button[data-testid="pause-auto-reload"]'));
    expect(pauseButton).toBeTruthy();
  });

  it('should call toggleAutoRefresh(true) when enable button clicked', () => {
    mockAutoRefreshService.refreshPage = false;
    fixture.detectChanges();

    const enableButton = debugEl.query(By.css('button[data-testid="enable-auto-reload"]'));
    enableButton.nativeElement.click();

    expect(mockAutoRefreshService.toggleAutoRefresh).toHaveBeenCalledWith(true, { immediate: true });
  });

  it('should call toggleAutoRefresh(false) when pause button clicked', () => {
    mockAutoRefreshService.refreshPage = true;
    fixture.detectChanges();

    const pauseButton = debugEl.query(By.css('button[data-testid="pause-auto-reload"]'));
    pauseButton.nativeElement.click();

    expect(mockAutoRefreshService.toggleAutoRefresh).toHaveBeenCalledWith(false, { immediate: true });
  });*/
});

describe('HomeComponent — updateHeatmapData$()', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockAutoRefreshService: ReturnType<typeof createMockAutoRefreshService>;

  beforeEach(async () => {
    mockAutoRefreshService = createMockAutoRefreshService();

    // Reset ghelper to a clean state before each test
    globalServiceMock.ghelper.and.returnValue(of({ data: [] }));

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HomeModule, RouterLink, RouterLinkWithHref, HeatmapChartStubComponent],
      providers: [
        provideHttpClientTesting(),
        provideRouter(routes),
        { provide: GlobalService, useValue: globalServiceMock },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: PermissionService, useValue: permissionServiceMock },
        { provide: AutoRefreshService, useValue: mockAutoRefreshService },
        { provide: PageTitle, useClass: PageTitleStub }
      ]
    }).compileComponents();

    AppModule.injector = TestBed.inject(Injector);
  });

  it('should call ghelper with SERV.HELPER and getCracksPerDay when canReadCracks is true', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm === Perm.Hash.READ);
    globalServiceMock.getAll.calls.reset();
    globalServiceMock.ghelper.calls.reset();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(globalServiceMock.ghelper).toHaveBeenCalledWith(SERV.HELPER, 'getCracksPerDay');
  });

  it('should NOT call ghelper when canReadCracks is false', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm !== Perm.Hash.READ);
    globalServiceMock.ghelper.calls.reset();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(globalServiceMock.ghelper).not.toHaveBeenCalled();
  });

  it('should populate heatmapData from ghelper response and fill missing days with 0', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm === Perm.Hash.READ);

    const today = new Date();
    const year = today.getFullYear();
    const jan2 = `${year}-01-02`;
    globalServiceMock.ghelper.and.returnValue(of({ data: [{ day: jan2, total: 42 }] }));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const jan1 = `${year}-01-01`;
    const jan1Entry = component.heatmapData.find(([d]) => d === jan1);
    const jan2Entry = component.heatmapData.find(([d]) => d === jan2);

    expect(jan1Entry).toBeTruthy();
    expect(jan1Entry![1]).toBe(0); // missing day filled with 0
    expect(jan2Entry).toBeTruthy();
    expect(jan2Entry![1]).toBe(42);
  });

  it('should include all days from Jan 1st to today', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm === Perm.Hash.READ);
    globalServiceMock.ghelper.and.returnValue(of({ data: [] }));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const today = new Date();
    const year = today.getFullYear();
    const start = new Date(year, 0, 1);
    const expectedDays = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;

    expect(component.heatmapData.length).toBe(expectedDays);
  });

  it('should handle ghelper errors gracefully and keep heatmapData empty', () => {
    permissionServiceMock.hasPermissionSync.and.callFake((perm: PermissionValues) => perm === Perm.Hash.READ);
    globalServiceMock.ghelper.and.returnValue(throwError(() => new Error('network error')));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(component.heatmapData).toEqual([]);
  });
});
