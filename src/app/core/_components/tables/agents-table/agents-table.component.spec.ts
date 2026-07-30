import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { AgentsTableComponent } from '@components/tables/agents-table/agents-table.component';
import { AgentsTableCol, AgentsTableColumnLabel } from '@components/tables/agents-table/agents-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { AgentsDataSource } from '@datasources/agents.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';
import { convertCrackingSpeed } from '@src/app/shared/utils/util';

class MockAgentsDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestAgentsTableComponent extends AgentsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(AgentsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockAgentsDataSource() as unknown as AgentsDataSource;
  }
}

describe('AgentsTableComponent', () => {
  let component: TestAgentsTableComponent;
  let fixture: ComponentFixture<TestAgentsTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestAgentsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestAgentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for agent management', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('active chunk columns', () => {
    // loadAll() has no assignment aggregates: speed and chunk id come from the `chunks` relationship,
    // which the server appends to every agent resource without an include.
    const CHUNK_SPEED = 1_500_000_000;
    const working = { id: 1, chunks: [{ id: 289, speed: CHUNK_SPEED }] } as unknown as JAgent;
    const idle = { id: 2, chunks: [] } as unknown as JAgent;

    function column(id: AgentsTableCol): HTTableColumn {
      return component.tableColumns.find((col: HTTableColumn) => col.id === id)!;
    }

    it('should render the speed of the active chunk', () => {
      expect(column(AgentsTableCol.TASK_SPEED).render!(working)).toBe(convertCrackingSpeed(CHUNK_SPEED));
    });

    it('should render a dash and no progress icon when the agent has no active chunk', () => {
      const speedColumn = column(AgentsTableCol.TASK_SPEED);
      expect(speedColumn.render!(idle)).toBe('-');
      expect(speedColumn.icon!(idle)).toEqual({ name: '' });
    });

    it('should show the progress icon while the agent works on a chunk', () => {
      expect(column(AgentsTableCol.TASK_SPEED).icon!(working)).toEqual({
        name: 'radio_button_checked',
        cls: 'pulsing-progress'
      });
    });

    it('should link to the active chunk', (done) => {
      column(AgentsTableCol.CURRENT_CHUNK).routerLink!(working).subscribe((links) => {
        expect(links).toEqual([{ routerLink: ['/tasks', 'chunks', 289, 'view'], label: 289 }]);
        done();
      });
    });

    it('should render no chunk link when the agent has no active chunk', (done) => {
      column(AgentsTableCol.CURRENT_CHUNK).routerLink!(idle).subscribe((links) => {
        expect(links).toEqual([]);
        done();
      });
    });

    it('should export the active chunk speed and id', async () => {
      await expectAsync(column(AgentsTableCol.TASK_SPEED).export!(working)).toBeResolvedTo(CHUNK_SPEED + '');
      await expectAsync(column(AgentsTableCol.CURRENT_CHUNK).export!(working)).toBeResolvedTo('289');
      await expectAsync(column(AgentsTableCol.TASK_SPEED).export!(idle)).toBeResolvedTo('-');
      await expectAsync(column(AgentsTableCol.CURRENT_CHUNK).export!(idle)).toBeResolvedTo('');
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1, agentName: 'A1' }] as JAgent[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgent[]>;
      component.table.displayedColumns = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        AgentsTableColumnLabel,
        'hashtopolis-agents'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items = [{ id: 1 }, { id: 2 }] as JAgent[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgent[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        AgentsTableColumnLabel,
        'hashtopolis-agents'
      );
    });
  });
});
