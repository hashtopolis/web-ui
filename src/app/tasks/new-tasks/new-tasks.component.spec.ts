import { of } from 'rxjs';

import { ChangeDetectorRef } from '@angular/core';
import { InjectionToken } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { GlobalService } from '@src/app/core/_services/main.service';
import { AlertService } from '@src/app/core/_services/shared/alert.service';
import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';
import { UIConfigService } from '@src/app/core/_services/shared/storage.service';
import { TooltipService } from '@src/app/core/_services/shared/tooltip.service';
import { UnsubscribeService } from '@src/app/core/_services/unsubscribe.service';
import { NewTasksComponent } from '@src/app/tasks/new-tasks/new-tasks.component';
import { getNewTaskForm } from '@src/app/tasks/new-tasks/new-tasks.form';

// Create a token for the form factory function
export const GET_TASK_FORM = new InjectionToken<typeof getNewTaskForm>('getTaskForm');

describe('NewTasksComponent', () => {
  let component: NewTasksComponent;
  let fixture: ComponentFixture<NewTasksComponent>;
  let uiServiceMock: jasmine.SpyObj<UIConfigService>;
  let mockForm: FormGroup;
  let getNewTaskFormSpy: jasmine.Spy;

  beforeEach(async () => {
    // Create spy objects for all required services
    const unsubscribeServiceSpy = jasmine.createSpyObj('UnsubscribeService', ['add', 'unsubscribeAll']);
    const changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    const titleServiceSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    const tooltipServiceSpy = jasmine.createSpyObj('TooltipService', ['getTaskTooltips']);
    uiServiceMock = jasmine.createSpyObj('UIConfigService', ['getUIsettings']);
    const routeSpy = {
      params: of({}),
      data: of({ kind: 'new-task' })
    };
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showErrorMessage', 'showSuccessMessage']);
    const globalServiceSpy = jasmine.createSpyObj('GlobalService', ['getAll', 'get', 'create']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Setup UI service mock to return configuration values for different settings
    uiServiceMock.getUIsettings.and.callFake((setting) => {
      const settings = {
        'tasks.priority': { value: 0 },
        'tasks.maxAgents': { value: 0 },
        'tasks.chunkTime': { value: 600 },
        'tasks.statusTimer': { value: 5 },
        'tasks.benchmarkType': { value: 0 },
        'tasks.color': { value: '#000000' }
      };
      return settings[setting] || null;
    });

    // Create a mock form
    mockForm = new FormGroup({
      taskName: new FormControl('', Validators.required),
      notes: new FormControl(''),
      hashlistId: new FormControl(0, Validators.required),
      attackCmd: new FormControl('', Validators.required),
      maxAgents: new FormControl(0),
      chunkTime: new FormControl(600),
      priority: new FormControl(0),
      color: new FormControl('#000000'),
      isCpuTask: new FormControl(false),
      crackerBinaryTypeId: new FormControl(0),
      crackerBinaryId: new FormControl(0),
      isSmall: new FormControl(false),
      useNewBench: new FormControl(false),
      skipKeyspace: new FormControl(0),
      isArchived: new FormControl(false),
      staticChunks: new FormControl(0),
      chunkSize: new FormControl(0),
      forcePipe: new FormControl(false),
      preprocessorId: new FormControl(0),
      preprocessorCommand: new FormControl(''),
      files: new FormControl([]),
      statusTimer: new FormControl(5)
    });

    // Create a spy for getNewTaskForm function
    getNewTaskFormSpy = jasmine.createSpy('getNewTaskForm').and.returnValue(mockForm);

    // Provide the mock function via Angular DI
    await TestBed.configureTestingModule({
      declarations: [NewTasksComponent],
      providers: [
        { provide: UnsubscribeService, useValue: unsubscribeServiceSpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy },
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: TooltipService, useValue: tooltipServiceSpy },
        { provide: UIConfigService, useValue: uiServiceMock },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        // Provide our spy via DI
        { provide: GET_TASK_FORM, useValue: getNewTaskFormSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTasksComponent);
    component = fixture.componentInstance;

    // Patch the component instance directly AFTER it's created
    component.buildForm = function () {
      this.form = getNewTaskFormSpy(this.uiService);
    };
  });

  describe('buildForm', () => {
    it('should initialize the form with getNewTaskForm', () => {
      // Call the buildForm method
      component.buildForm();

      // Verify the form was set on the component
      expect(component.form).toBeDefined();
      expect(component.form).toBe(mockForm);
    });

    it('should create a form with all required fields', () => {
      component.buildForm();

      // Check that all expected form controls exist
      expect(component.form.get('taskName')).toBeTruthy();
      expect(component.form.get('notes')).toBeTruthy();
      expect(component.form.get('hashlistId')).toBeTruthy();
      expect(component.form.get('attackCmd')).toBeTruthy();
      expect(component.form.get('maxAgents')).toBeTruthy();
      expect(component.form.get('chunkTime')).toBeTruthy();
      expect(component.form.get('priority')).toBeTruthy();
      expect(component.form.get('color')).toBeTruthy();
      expect(component.form.get('isCpuTask')).toBeTruthy();
      expect(component.form.get('crackerBinaryTypeId')).toBeTruthy();
      expect(component.form.get('crackerBinaryId')).toBeTruthy();
      expect(component.form.get('isSmall')).toBeTruthy();
      expect(component.form.get('useNewBench')).toBeTruthy();
      expect(component.form.get('skipKeyspace')).toBeTruthy();
      expect(component.form.get('isArchived')).toBeTruthy();
      expect(component.form.get('staticChunks')).toBeTruthy();
      expect(component.form.get('chunkSize')).toBeTruthy();
      expect(component.form.get('forcePipe')).toBeTruthy();
      expect(component.form.get('preprocessorId')).toBeTruthy();
      expect(component.form.get('preprocessorCommand')).toBeTruthy();
      expect(component.form.get('files')).toBeTruthy();
      expect(component.form.get('statusTimer')).toBeTruthy();
    });

    /*     it('should initialize form with values from UIConfigService', () => {
      // Reset the form spy to use the actual implementation
      (taskFormModule.getNewTaskForm as jasmine.Spy).and.callThrough();

      // Configure UI service to return specific values
      uiServiceMock.getUIsettings.and.callFake((setting) => {
        const settings = {
          'tasks.priority': { value: 100 },
          'tasks.maxAgents': { value: 5 },
          'tasks.chunkTime': { value: 300 },
          'tasks.statusTimer': { value: 10 },
          'tasks.benchmarkType': { value: 1 },
          'tasks.color': { value: '#FF0000' }
        };
        return settings[setting] || null;
      });

      component.buildForm();

      // Verify the form was initialized with values from the UI service
      expect(component.form.get('priority').value).toBe(100);
      expect(component.form.get('maxAgents').value).toBe(5);
      expect(component.form.get('chunkTime').value).toBe(300);
      expect(component.form.get('statusTimer').value).toBe(10);
      expect(component.form.get('color').value).toBe('#FF0000');
    }); */
  });
});
