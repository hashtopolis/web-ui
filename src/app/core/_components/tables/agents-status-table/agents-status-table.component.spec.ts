import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { AgentsDataSource } from '@datasources/agents.datasource';

import { AgentsStatusTableComponent } from '@src/app/core/_components/tables/agents-status-table/agents-status-table.component';
import {
  AgentsStatusTableCol,
  AgentsStatusTableColumnLabel
} from '@src/app/core/_components/tables/agents-status-table/agents-status-table.constants';
import { JAgent } from '@src/app/core/_models/agent.model';
import { ExportService } from '@src/app/core/_services/export/export.service';
import { convertCrackingSpeed } from '@src/app/shared/utils/util';

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
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

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

  describe('table columns', () => {
    it('should expose the correct number of columns', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('currently working on column', () => {
    // The speed and chunk id come from the `chunks` relationship the server appends to every agent
    // resource — loadAll() requests no assignment aggregates.
    const working = {
      id: 1,
      taskId: 72,
      taskName: 'seed-task-0072',
      chunks: [{ id: 289, speed: 1_500_000_000 }]
    } as unknown as JAgent;
    const idle = { id: 2, chunks: [] } as unknown as JAgent;

    function workingOnColumn(): HTTableColumn {
      return component.tableColumns.find((col: HTTableColumn) => col.id === AgentsStatusTableCol.WORKING_ON)!;
    }

    it('should render task, speed and chunk link for an agent with an active chunk', () => {
      const html = workingOnColumn().render!(working) as string;

      expect(html).toContain('/#/tasks/show-tasks/72/edit');
      expect(html).toContain('seed-task-0072');
      // sanitize() HTML-encodes the non-breaking space in convertCrackingSpeed output.
      expect(html).toContain(convertCrackingSpeed(1_500_000_000).replace('\u00A0', '&#160;'));
      expect(html).toContain('/#/tasks/chunks/289/view');
    });

    it('should render nothing for an agent without an active chunk', () => {
      expect(workingOnColumn().render!(idle)).toBe('');
    });

    it('should export the active chunk details', async () => {
      await expectAsync(workingOnColumn().export!(working)).toBeResolvedTo(
        'Task: seed-task-0072 at 1500000000 H/s, working on chunk 289'
      );
      await expectAsync(workingOnColumn().export!(idle)).toBeResolvedTo('-');
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1, agentName: 'A1' }] as JAgent[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgent[]>;
      component.table.displayedColumns = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
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
