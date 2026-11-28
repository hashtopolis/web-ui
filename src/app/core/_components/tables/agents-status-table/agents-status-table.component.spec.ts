import { TableConfig, uiConfigDefault } from '@models/config-ui.model';
import { uiConfigSchema } from '@models/config-ui.schema';

import type { MockedObject } from 'vitest';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';

import { UiSettingsService } from '@services/shared/ui-settings.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';

import { AgentsDataSource } from '@datasources/agents.datasource';

import { AgentsStatusTableComponent } from '@src/app/core/_components/tables/agents-status-table/agents-status-table.component';
import {
  AgentsStatusTableCol,
  AgentsStatusTableColumnLabel
} from '@src/app/core/_components/tables/agents-status-table/agents-status-table.constants';
import { JAgent } from '@src/app/core/_models/agent.model';
import { ExportService } from '@src/app/core/_services/export/export.service';

class MockAgentsDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
  startAutoRefresh() {}
  stopAutoRefresh() {}
  autoRefreshService = { refreshPage: false };
}

class TestAgentsStatusTableComponent extends AgentsStatusTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(AgentsStatusTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockAgentsDataSource() as unknown as AgentsDataSource;
  }
}

describe('AgentsStatusTableComponent', () => {
  let component: TestAgentsStatusTableComponent;
  let fixture: ComponentFixture<TestAgentsStatusTableComponent>;
  let mockExportService: MockedObject<ExportService>;
  let mockHTTable: MockedObject<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = {
      handleExportAction: vi.fn().mockName('ExportService.handleExportAction')
    } as MockedObject<ExportService>;
    mockHTTable = {
      reload: vi.fn().mockName('HTTableComponent.reload')
    } as MockedObject<HTTableComponent<BaseModel>>;

    await TestBed.configureTestingModule({
      declarations: [TestAgentsStatusTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestAgentsStatusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('connectivity', () => {
    it('uses the last contact time independently of administrative activation', async () => {
      const now = 1760000000;
      const clock = vi.spyOn(Date, 'now').mockReturnValue(now * 1000);
      try {
        const column = component.getColumns().find((col) => col.id === AgentsStatusTableCol.CONNECTIVITY);
        expect(column).toBeDefined();
        const exportStatus = column!.export!;
        expect(await exportStatus({ isActive: false, lastTime: now } as JAgent)).toBe('Online');
        expect(await exportStatus({ isActive: true, lastTime: 0 } as JAgent)).toBe('Offline');
        expect(await exportStatus({ isActive: false, lastTime: now - 120 } as JAgent)).toBe('Online');
        expect(await exportStatus({ isActive: true, lastTime: now - 121 } as JAgent)).toBe('Offline');
        expect(await exportStatus({ isActive: true, lastTime: now + 1 } as JAgent)).toBe('Offline');
      } finally {
        clock.mockRestore();
      }
    });
  });

  it('uses the configured online threshold rather than the server task timeout', async () => {
    const now = 1760000000;
    const clock = vi.spyOn(Date, 'now').mockReturnValue(now * 1000);
    const setting = vi.spyOn(TestBed.inject(UiSettingsService), 'getSetting').mockReturnValue(30);
    try {
      const column = component.getColumns().find((col) => col.id === AgentsStatusTableCol.CONNECTIVITY);
      expect(await column!.export!({ lastTime: now - 30, isActive: false } as JAgent)).toBe('Online');
      expect(await column!.export!({ lastTime: now - 31, isActive: true } as JAgent)).toBe('Offline');
      expect(setting).toHaveBeenCalledWith('agentOnlineThreshold');
    } finally {
      clock.mockRestore();
      setting.mockRestore();
    }
  });

  it('does not treat a task as stopped solely because the display connectivity threshold is short', async () => {
    const now = 1760000000;
    const clock = vi.spyOn(Date, 'now').mockReturnValue(now * 1000);
    const setting = vi.spyOn(TestBed.inject(UiSettingsService), 'getSetting').mockReturnValue(1);
    try {
      const agent = {
        isActive: true,
        taskId: 123,
        lastAct: 'sendProgress',
        lastTime: now - 5
      } as JAgent;
      const columns = component.getColumns();
      const connectivity = columns.find((col) => col.id === AgentsStatusTableCol.CONNECTIVITY)!;
      const taskStatus = columns.find((col) => col.id === AgentsStatusTableCol.STATUS)!;
      expect(await connectivity.export!(agent)).toBe('Offline');
      expect(await taskStatus.export!(agent)).toBe('Running task');
    } finally {
      setting.mockRestore();
      clock.mockRestore();
    }
  });

  it('updates the cell at expiry without reloading the table or the data source', async () => {
    vi.useFakeTimers();
    const load = vi.spyOn(component.dataSource, 'loadAll');
    const reload = vi.spyOn(component.dataSource, 'reload');
    try {
      vi.setSystemTime(1760000000000);
      TestBed.inject(UiSettingsService).updateSettings({ agentOnlineThreshold: 1 });
      fixture.detectChanges();
      const column = component.getColumns().find((col) => col.id === AgentsStatusTableCol.CONNECTIVITY)!;
      const row = { lastTime: 1760000000 } as JAgent;
      const values: string[] = [];
      const status = column.async!(row) as import('rxjs').Observable<unknown>;
      expect(column.async!(row)).toBe(status);
      const subscription = status.subscribe((value) => values.push(String(value)));
      try {
        expect(values.at(-1)).toContain('Online');
        await vi.advanceTimersByTimeAsync(1000);
        expect(values.at(-1)).toContain('Online');
        await vi.advanceTimersByTimeAsync(1000);
        expect(values.at(-1)).toContain('Offline');
        expect(mockHTTable.reload).not.toHaveBeenCalled();
        expect(load).not.toHaveBeenCalled();
        expect(reload).not.toHaveBeenCalled();
      } finally {
        subscription.unsubscribe();
      }
    } finally {
      vi.useRealTimers();
    }
  });

  describe('table columns', () => {
    it('should expose the correct number of columns', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1, agentName: 'A1' }] as JAgent[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgent[]>;
      component.table.displayedColumns = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledExactlyOnceWith(
        event,
        component.tableColumns,
        AgentsStatusTableColumnLabel,
        'hashtopolis-agents'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items = [{ id: 1 }, { id: 2 }] as JAgent[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgent[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        AgentsStatusTableColumnLabel,
        'hashtopolis-agents'
      );
    });
  });
});

it('shows the new column after loading a pre-upgrade saved table configuration', () => {
  const fresh = uiConfigDefault.tableSettings['agentStatusTable'] as TableConfig;
  const legacyColumns = fresh.columns.filter((column) => column !== AgentsStatusTableCol.CONNECTIVITY);
  const stored = { ...fresh, columns: legacyColumns, columnsVersion: undefined };
  const config = uiConfigSchema.parse({ tableSettings: { agentStatusTable: stored } });
  const upgraded = config.tableSettings['agentStatusTable'] as TableConfig;
  expect(upgraded.columns).toEqual([...legacyColumns, AgentsStatusTableCol.CONNECTIVITY]);
  const hidden = { ...upgraded, columns: legacyColumns };
  const restored = uiConfigSchema.parse({ tableSettings: { agentStatusTable: hidden } });
  expect(restored.tableSettings['agentStatusTable']).toEqual(hidden);
  const fromLegacyArray = uiConfigSchema.parse({ tableSettings: { agentStatusTable: legacyColumns } });
  expect((fromLegacyArray.tableSettings['agentStatusTable'] as TableConfig).columns).toEqual(upgraded.columns);
});
