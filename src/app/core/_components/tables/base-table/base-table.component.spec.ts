import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@src/app/core/_models/base.model';
import { BaseTableComponent } from './base-table.component';
import { Component } from '@angular/core';
import { ConfigService } from '@src/app/core/_services/shared/config.service';
import { GlobalService } from '@src/app/core/_services/main.service';
import { HTTableComponent } from '../ht-table/ht-table.component';
import { JAccessGroup } from '@src/app/core/_models/access-group.model';
import { JAgent } from '@src/app/core/_models/agent.model';
import { JChunk } from '@src/app/core/_models/chunk.model';
import { JHashlist } from '@src/app/core/_models/hashlist.model';
import { JSuperTask } from '@src/app/core/_models/supertask.model';
import { JTask } from '@src/app/core/_models/task.model';
import { JUser } from '@src/app/core/_models/user.model';
import { hasUncaughtExceptionCaptureCallback } from 'process';

// Create a test implementation of BaseTableComponent
@Component({
  selector: 'app-test-table',
  template: '<div>Test Table</div>'
})
class TestTableComponent extends BaseTableComponent {
  // Expose protected methods for testing
  public exposedSanitize(html: string) {
    return this.sanitize(html);
  }

  public exposedSetColumnLabels(labels: { [key: string]: string }): void {
    this.setColumnLabels(labels);
  }

  public getColumnLabels(): { [key: string]: string } {
    return this.columnLabels;
  }
}

describe('BaseTableComponent', () => {
  let component: TestTableComponent;
  let fixture: ComponentFixture<TestTableComponent>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockConfigService: jasmine.SpyObj<ConfigService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent>;

  beforeEach(() => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['foo']);
    mockConfigService = jasmine.createSpyObj('ConfigService', ['foo']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    TestBed.configureTestingModule({
      imports: [TestTableComponent],
      declarations: [],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: ConfigService, useValue: mockConfigService }
      ] // Add any necessary providers here
    }).compileComponents();
    fixture = TestBed.createComponent(TestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call reload on the table', () => {
    component.reload();
    expect(mockHTTable.reload).toHaveBeenCalled();
  });

  it('should render status icon correctly for active model', () => {
    const activeModel = { isActive: true } as JAgent;
    const icon = component.renderStatusIcon(activeModel);
    expect(icon.name).toBe('check_circle');
    expect(icon.cls).toBe('text-ok');
  });

  it('should render status icon correctly for inactive model', () => {
    const inactiveModel = { isActive: false } as JAgent;
    const icon = component.renderStatusIcon(inactiveModel);
    expect(icon.name).toBe('remove_circle');
    expect(icon.cls).toBe('text-critical');
  });

  it('should render supertask link', (done) => {
    const mockSuperTask = { id: 1, supertaskName: 'Test SuperTask' } as JSuperTask;
    component.renderSupertaskLink(mockSuperTask).subscribe((links) => {
      expect(links.length).toBe(1);
      expect(links[0].routerLink).toEqual(['/tasks/', 1, 'edit']);
      expect(links[0].label).toBe('Test SuperTask');
      done();
    });
  });

  it('should render cracked link from chunk', (done) => {
    const mockChunk = { taskId: 1, cracked: 100 } as JChunk;
    component.renderCrackedLinkFromChunk(mockChunk).subscribe((links) => {
      expect(links.length).toBe(1);
      expect(links[0].routerLink).toEqual(['/hashlists', 'hashes', 'tasks', 1]);
      expect(links[0].label).toBe('100');
      done();
    });
  });
  it('should render cracked link from task', (done) => {
    const mockTask = { id: 1, chunkData: { cracked: 100 } } as JTask;
    component.renderCrackedLinkFromTask(mockTask).subscribe((links) => {
      expect(links.length).toBe(1);
      expect(links[0].routerLink).toEqual(['/hashlists', 'hashes', 'tasks', 1]);
      expect(links[0].label).toBe('100');
      done();
    });
  });

  it('should render hashlist link', (done) => {
    const mockHashlist = { id: 1, name: 'Test Hashlist', isSecret: true } as JHashlist;
    component.renderHashlistLink(mockHashlist).subscribe((links) => {
      expect(links.length).toBe(1);
      expect(links[0].routerLink).toEqual(['/hashlists', 'hashlist', 1, 'edit']);
      expect(links[0].label).toBe('Test Hashlist');
      expect(links[0].icon.tooltip).toBe('Secret hashlist');
      expect(links[0].icon.faIcon.iconName).toBe('key');
      done();
    });
  });
  it('should render access group link', (done) => {
    const accessGroup = { id: 1, groupName: 'Test Group' } as JAccessGroup;
    component.renderAccessGroupLink(accessGroup).subscribe((links) => {
      expect(links.length).toBe(1);
      expect(links[0].routerLink).toEqual(['/users', 'access-groups', 1, 'edit']);
      expect(links[0].label).toBe('Test Group');
      done();
    });
  });

  it('should render access group links', (done) => {
    const accessGroup = [{ id: 1, groupName: 'Test Group' }] as JAccessGroup[];
    const agent = { id: 1, accessGroups: accessGroup /* id: 1, groupName: 'Test Group'  */ } as JAgent;
    component.renderAccessGroupLinks(agent).subscribe((links) => {
      expect(links.length).toBe(1);
      expect(links[0].routerLink).toEqual(['/users', 'access-groups', 1, 'edit']);
      expect(links[0].label).toBe('Test Group');
      done();
    });
  });

  it('should render agent link', (done) => {
    const agent = { id: 1, agentName: 'Test Agent', isTrusted: true } as JAgent;
    component.renderAgentLink(agent).subscribe((links) => {
      expect(links.length).toBe(1);
      expect(links[0].routerLink).toEqual(['/agents', 'show-agents', 1, 'edit']);
      expect(links[0].label).toBe('Test Agent');
      expect(links[0].icon.tooltip).toBe('Trusted Agent');
      done();
    });
  });
  it('should render agent link from chunck', (done) => {
    const agent = { id: 1, agentName: 'Test Agent', isTrusted: true } as JAgent;
    const chunk = { agentId: 1, agentName: 'Test Agent', agent: agent } as JChunk;
    component.renderAgentLinkFromChunk(chunk).subscribe((links) => {
      expect(links.length).toBe(1);
      expect(links[0].routerLink).toEqual(['/agents', 'show-agents', 1, 'edit']);
      expect(links[0].label).toBe('Test Agent');
      done();
    });
  });

  it('should render user link', (done) => {
    const user = { id: 1, name: 'Test User' } as JUser;
    component.renderUserLink(user).subscribe((links) => {
      expect(links.length).toBe(1);
      expect(links[0].routerLink).toEqual(['/users', 1, 'edit']);
      expect(links[0].label).toBe('Test User');
      done();
    });
  });

  it('should render user link from agent', (done) => {
    const user = { id: 1, name: 'Test User' } as JUser;
    const agent = { id: 1, userId: 1, user: user } as JAgent;
    component.renderUserLinkFromAgent(agent).subscribe((links) => {
      expect(links.length).toBe(1);
      expect(links[0].routerLink).toEqual(['/users', 1, 'edit']);
      expect(links[0].label).toBe('Test User');
      done();
    });
  });

  it('should render task link with task name', (done) => {
    const model = { taskId: 1, task: { taskName: 'Test Task' } } as JChunk;

    component.renderTaskLink(model).subscribe((links) => {
      expect(links.length).toBe(1);
      expect(links[0].routerLink).toEqual(['/tasks', 'show-tasks', 1, 'edit']);
      expect(links[0].label).toBe('Test Task');
      done();
    });
  });

  it('should render task link with task id', (done) => {
    const model = { taskId: 1, task: { taskName: 'Test Task' } } as JChunk;
    component.renderTaskLink(model, true).subscribe((links) => {
      expect(links.length).toBe(1);
      expect(links[0].routerLink).toEqual(['/tasks', 'show-tasks', 1, 'edit']);
      expect(links[0].label).toBe('1');
      done();
    });
  });

  it('should render valid icon for valid user', () => {
    const user = { isValid: true } as JUser;
    const icon = component.renderIsValidIcon(user);
    expect(icon.name).toBe('check_circle');
    expect(icon.cls).toBe('text-ok');
  });

  it('should render invalid icon for invalid user', () => {
    const user = { isValid: false } as JUser;
    const icon = component.renderIsValidIcon(user);
    expect(icon.name).toBe('remove_circle');
    expect(icon.cls).toBe('text-critical');
  });

  it('should render secret icon for secret model', () => {
    const model = { id: 1, type: '', isSecret: true } as BaseModel;
    const icon = component.renderSecretIcon(model);
    expect(icon.name).toBe('lock');
    expect(icon.tooltip).toBe('Secret');
  });

  it('should format cracked hashes correctly', () => {
    const hashlist = { cracked: 50, hashCount: 100 } as JHashlist;
    const result = component.renderCrackedHashes(hashlist, false);
    expect(result).toBe('50 (50%)');
  });

  it('should set column labels', () => {
    const labels = { col1: 'Column 1', col2: 'Column 2' };
    component.exposedSetColumnLabels(labels);
    expect(component.getColumnLabels()).toEqual(labels);
  });
  it('should sanitize HTML', () => {
    const html = '<div>Test</div>';
    const result = component.exposedSanitize(html);
    expect(result).toBeTruthy();
  });
});
