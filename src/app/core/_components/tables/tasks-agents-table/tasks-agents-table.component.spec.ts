import { of } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { JAgent } from '@models/agent.model';

import { TasksAgentsTableComponent } from '@components/tables/tasks-agents-table/tasks-agents-table.component';
import {
  AgentTableEditableAction,
  TasksAgentsTableColumnLabel
} from '@components/tables/tasks-agents-table/tasks-agents-table.constants';

import { AgentsDataSource } from '@datasources/agents.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';
import { SERV } from '@src/app/core/_services/main.config';
import { GlobalService } from '@src/app/core/_services/main.service';
import { PermissionService } from '@src/app/core/_services/permission/permission.service';
import { PreconfiguredTasksRoleService } from '@src/app/core/_services/roles/tasks/preconfiguredTasks-role.service';
import { TasksRoleService } from '@src/app/core/_services/roles/tasks/tasks-role.service';
import { AlertService } from '@src/app/core/_services/shared/alert.service';
import { ConfigService } from '@src/app/core/_services/shared/config.service';
import { UIConfigService } from '@src/app/core/_services/shared/storage.service';
import { LocalStorageService } from '@src/app/core/_services/storage/local-storage.service';

class MockAgentsDataSource {
  reload() {}
  setColumns() {}
  setTaskId() {}
}

class TestTasksAgentsTableComponent extends TasksAgentsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(TasksAgentsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockAgentsDataSource() as unknown as AgentsDataSource;
  }
}

describe('TasksAgentsTableComponent', () => {
  let fixture: ComponentFixture<TestTasksAgentsTableComponent>;
  let component: TestTasksAgentsTableComponent;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    globalServiceSpy = jasmine.createSpyObj('GlobalService', ['update']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);

    globalServiceSpy.update.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [TestTasksAgentsTableComponent],
      providers: [
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: ConfigService, useValue: jasmine.createSpyObj('ConfigService', ['getEndpoint']) },
        { provide: Clipboard, useValue: jasmine.createSpyObj('Clipboard', ['copy']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: LocalStorageService, useValue: jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']) },
        { provide: DomSanitizer, useValue: jasmine.createSpyObj('DomSanitizer', ['sanitize']) },
        { provide: UIConfigService, useValue: jasmine.createSpyObj('UIConfigService', ['getUISettings']) },
        { provide: ExportService, useValue: jasmine.createSpyObj('ExportService', ['handleExportAction']) },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: PermissionService, useValue: jasmine.createSpyObj('PermissionService', ['hasPermission']) },
        { provide: TasksRoleService, useValue: jasmine.createSpyObj('TasksRoleService', ['hasRole']) },
        {
          provide: PreconfiguredTasksRoleService,
          useValue: jasmine.createSpyObj('PreconfiguredTasksRoleService', ['hasRole'])
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestTasksAgentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should PATCH benchmark using assignmentId', () => {
    const agent = {
      id: 19,
      assignmentId: 123,
      benchmark: '1000'
    } as JAgent;

    component.editableSaved({
      data: agent,
      value: '2000',
      action: AgentTableEditableAction.CHANGE_BENCHMARK
    });

    expect(globalServiceSpy.update).toHaveBeenCalledWith(SERV.AGENT_ASSIGN, 123, { benchmark: '2000' });
  });

  it('should not PATCH benchmark when assignmentId is missing', () => {
    const agent = {
      id: 19,
      benchmark: '1000'
    } as JAgent;

    component.editableSaved({
      data: agent,
      value: '2000',
      action: AgentTableEditableAction.CHANGE_BENCHMARK
    });

    expect(globalServiceSpy.update).not.toHaveBeenCalled();
    expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith('Failed to update benchmark!');
  });
});
