import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JNotification } from '@models/notification.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { NotificationsTableComponent } from '@components/tables/notifications-table/notifications-table.component';
import { NotificationsTableColumnLabel } from '@components/tables/notifications-table/notifications-table.constants';

import { NotificationsDataSource } from '@datasources/notifications.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockNotificationsDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestNotificationsTableComponent extends NotificationsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(NotificationsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockNotificationsDataSource() as unknown as NotificationsDataSource;
  }
}

describe('NotificationsTableComponent', () => {
  let component: TestNotificationsTableComponent;
  let fixture: ComponentFixture<TestNotificationsTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestNotificationsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestNotificationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for notifications', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1 }] as JNotification[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JNotification[]>;
      component.table.displayedColumns = ['0', '1', '2', '3', '4', '5'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        NotificationsTableColumnLabel,
        'hashtopolis-notifications'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items = [{ id: 1 }, { id: 2 }] as JNotification[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JNotification[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        NotificationsTableColumnLabel,
        'hashtopolis-notifications'
      );
    });
  });
});
