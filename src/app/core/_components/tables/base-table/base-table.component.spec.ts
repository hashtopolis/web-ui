import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTableComponent } from './base-table.component';
import { Component } from '@angular/core';
import { ConfigService } from '@src/app/core/_services/shared/config.service';
import { GlobalService } from '@src/app/core/_services/main.service';
import { HTTableComponent } from '../ht-table/ht-table.component';

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

  beforeEach(() => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['foo']);
    mockConfigService = jasmine.createSpyObj('ConfigService', ['foo']);
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
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
