import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTableComponent } from './base-table.component';
import { Component } from '@angular/core';
import { ConfigService } from '@src/app/core/_services/shared/config.service';
import { GlobalService } from '@src/app/core/_services/main.service';
import { HTTableComponent } from '../ht-table/ht-table.component';
import { JAgent } from '@src/app/core/_models/agent.model';
import { JChunk } from '@src/app/core/_models/chunk.model';
import { JSuperTask } from '@src/app/core/_models/supertask.model';

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
});
