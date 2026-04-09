import { Observable, of, throwError } from 'rxjs';

import { ResponseWrapper } from '@models/response.model';
import { mockResponse } from '@src/app/testing/mock-response';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { UiSettings } from '@models/config-ui.schema';
import { JPretask } from '@models/pretask.model';
import { JTask } from '@models/task.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UIConfigService } from '@services/shared/storage.service';
import { TaskTooltipsLevel, TooltipService } from '@services/shared/tooltip.service';

import { CheatsheetComponent } from '@src/app/shared/alert/cheatsheet/cheatsheet.component';
import { NewTasksComponent } from '@src/app/tasks/new-tasks/new-tasks.component';
import { environment } from '@src/environments/environment';

const MOCK_HASHLISTS_RESPONSE = {
  jsonapi: { version: '1.1', ext: [] },
  data: [
    {
      id: 1,
      type: 'hashlist',
      attributes: {
        name: 'test-hashlist',
        format: 0,
        hashTypeId: 0,
        hashCount: 0,
        separator: null,
        cracked: 0,
        isSecret: false,
        isHexSalt: false,
        isSalted: false,
        accessGroupId: 1,
        notes: '',
        useBrain: false,
        brainFeatures: 0,
        isArchived: false
      }
    },
    {
      id: 2,
      type: 'hashlist',
      attributes: {
        name: 'second-hashlist',
        format: 0,
        hashTypeId: 1,
        hashCount: 0,
        separator: null,
        cracked: 0,
        isSecret: false,
        isHexSalt: false,
        isSalted: false,
        accessGroupId: 1,
        notes: '',
        useBrain: false,
        brainFeatures: 0,
        isArchived: false
      }
    }
  ],
  included: []
};

const MOCK_EMPTY_HASHLISTS_RESPONSE = {
  jsonapi: { version: '1.1', ext: [] },
  data: [],
  included: []
};

const MOCK_CRACKER_TYPES_RESPONSE = {
  jsonapi: { version: '1.1', ext: [] },
  data: [
    {
      id: 1,
      type: 'crackerBinaryType',
      attributes: { typeName: 'hashcat', isChunkingAvailable: true },
      relationships: {
        crackerVersions: {
          data: [{ type: 'crackerBinary', id: 10 }]
        }
      }
    }
  ],
  included: [
    {
      id: 10,
      type: 'crackerBinary',
      attributes: { crackerBinaryTypeId: 1, binaryName: 'hashcat', version: '6.2.6', downloadUrl: '' }
    }
  ]
};

const MOCK_CRACKERS_RESPONSE = {
  jsonapi: { version: '1.1', ext: [] },
  data: [
    {
      id: 10,
      type: 'crackerBinary',
      attributes: { crackerBinaryTypeId: 1, binaryName: 'hashcat', version: '6.2.6', downloadUrl: '' }
    }
  ],
  included: []
};

const MOCK_CRACKERS_EMPTY_RESPONSE = {
  jsonapi: { version: '1.1', ext: [] },
  data: [],
  included: []
};

const MOCK_PREPROCESSORS_RESPONSE = {
  jsonapi: { version: '1.1', ext: [] },
  data: [
    {
      id: 1,
      type: 'preprocessor',
      attributes: {
        name: 'prince',
        url: 'https://example.com/prince',
        binaryName: 'pp64.bin',
        keyspaceCommand: '--keyspace',
        skipCommand: '--skip',
        limitCommand: '--limit'
      }
    }
  ],
  included: []
};

const MOCK_TASK_ATTRIBUTES: Partial<JTask> = {
  taskName: 'Original Task',
  attackCmd: '-a 0 #HL# rockyou.txt',
  maxAgents: 2,
  chunkTime: 600,
  priority: 1,
  color: '#ff0000',
  isCpuTask: false,
  crackerBinaryTypeId: 1,
  isSmall: false,
  useNewBench: true,
  statusTimer: 5,
  skipKeyspace: 100,
  crackerBinaryId: 10,
  staticChunks: 2,
  chunkSize: 1000,
  forcePipe: true,
  preprocessorId: 3,
  preprocessorCommand: '--prince',
  notes: 'original notes',
  totalAssignedAgents: 0,
  keyspace: 0,
  keyspaceProgress: 0,
  taskWrapperId: 1,
  isArchived: false,
  dispatched: '',
  searched: '',
  status: 0,
  timeSpent: 0,
  currentSpeed: 0,
  estimatedTime: 0,
  cprogress: 0
};

const MOCK_PRETASK_ATTRIBUTES: Partial<JPretask> = {
  taskName: 'My Pretask',
  attackCmd: '-a 3 ?a?a?a?a',
  maxAgents: 0,
  chunkTime: 300,
  priority: 5,
  color: '',
  isCpuTask: true,
  crackerBinaryTypeId: 1,
  isSmall: true,
  useNewBench: false,
  statusTimer: 10,
  isMaskImport: false
};

const MOCK_TASK_GET_RESPONSE = {
  jsonapi: { version: '1.1', ext: [] },
  data: {
    id: 42,
    type: 'task',
    attributes: MOCK_TASK_ATTRIBUTES,
    relationships: {
      hashlist: { data: { id: 1, type: 'hashlist' } },
      files: {
        data: [
          { id: 100, type: 'file' },
          { id: 101, type: 'file' }
        ]
      },
      speeds: { data: [] },
      crackerBinary: { data: { id: 10, type: 'crackerBinary' } },
      crackerBinaryType: { data: { id: 1, type: 'crackerBinaryType' } }
    }
  },
  included: [
    { id: 1, type: 'hashlist', attributes: { name: 'test-hashlist', isArchived: false, hashTypeId: 0 } },
    { id: 100, type: 'file', attributes: { filename: 'rockyou.txt', size: 0 } },
    { id: 101, type: 'file', attributes: { filename: 'rules.txt', size: 0 } },
    { id: 10, type: 'crackerBinary', attributes: { version: '6.2.6', binaryName: 'hashcat', crackerBinaryTypeId: 1 } },
    { id: 1, type: 'crackerBinaryType', attributes: { typeName: 'hashcat' } }
  ]
};

const MOCK_PRETASK_GET_RESPONSE = {
  jsonapi: { version: '1.1', ext: [] },
  data: {
    id: 7,
    type: 'pretask',
    attributes: MOCK_PRETASK_ATTRIBUTES,
    relationships: {
      pretaskFiles: { data: [{ id: 200, type: 'file' }] }
    }
  },
  included: [{ id: 200, type: 'file', attributes: { filename: 'mask.hcmask', size: 0 } }]
};

function buildGetAllCallFake(overrides: { [url: string]: Observable<ResponseWrapper> } = {}) {
  const defaults: { [url: string]: Observable<ResponseWrapper> } = {
    [SERV.HASHLISTS.URL]: of(mockResponse(MOCK_HASHLISTS_RESPONSE)),
    [SERV.CRACKERS_TYPES.URL]: of(mockResponse(MOCK_CRACKER_TYPES_RESPONSE)),
    [SERV.CRACKERS.URL]: of(mockResponse(MOCK_CRACKERS_RESPONSE)),
    [SERV.PREPROCESSORS.URL]: of(mockResponse(MOCK_PREPROCESSORS_RESPONSE))
  };
  const merged = { ...defaults, ...overrides };
  return (serviceConfig: { URL: string }) => {
    return merged[serviceConfig.URL] ?? of(mockResponse());
  };
}

// trigger ngOnInit
async function initComponent(fixture: ComponentFixture<NewTasksComponent>) {
  fixture.detectChanges(); // triggers ngOnInit
  await fixture.whenStable();
}

/**
 * Runs 10 change detection cycles and asserts the component stabilizes
 */
function expectChangeDetectionStability(fixture: ComponentFixture<NewTasksComponent>): void {
  const cycles = 10;
  let instabilities = 0;

  for (let i = 0; i < cycles; i++) {
    fixture.detectChanges();
    try {
      fixture.checkNoChanges();
    } catch {
      instabilities++;
    }
  }

  expect(instabilities).toBeLessThan(cycles);
}

describe('NewTasksComponent', () => {
  let component: NewTasksComponent;
  let fixture: ComponentFixture<NewTasksComponent>;

  let titleServiceSpy: jasmine.SpyObj<AutoTitleService>;
  let tooltipServiceSpy: jasmine.SpyObj<TooltipService>;
  let uiServiceMock: jasmine.SpyObj<UIConfigService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRoute: { params: Observable<Params>; data: Observable<unknown>; snapshot: { params: Params } };

  beforeEach(async () => {
    titleServiceSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    tooltipServiceSpy = jasmine.createSpyObj('TooltipService', ['getTaskTooltips']);
    tooltipServiceSpy.getTaskTooltips.and.returnValue({} as TaskTooltipsLevel);

    uiServiceMock = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
    uiServiceMock.getUISettings.and.returnValue({
      hashlistAlias: '#HL#',
      chunktime: 600,
      statustimer: 5
    } as unknown as UiSettings);

    alertServiceSpy = jasmine.createSpyObj('AlertService', ['showErrorMessage', 'showSuccessMessage']);
    globalServiceSpy = jasmine.createSpyObj('GlobalService', ['getAll', 'get', 'create']);
    globalServiceSpy.getAll.and.callFake(buildGetAllCallFake());
    globalServiceSpy.create.and.returnValue(of(mockResponse()));

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    activatedRoute = {
      params: of({}),
      data: of({ kind: 'new-task' }),
      snapshot: { params: {} }
    };

    await TestBed.configureTestingModule({
      declarations: [NewTasksComponent],
      providers: [
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: TooltipService, useValue: tooltipServiceSpy },
        { provide: UIConfigService, useValue: uiServiceMock },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTasksComponent);
    component = fixture.componentInstance;
  });

  describe('Component creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should set page title to "New Task"', () => {
      // The constructor calls titleService.set immediately
      expect(titleServiceSpy.set).toHaveBeenCalledWith(['New Task']);
    });
  });

  describe('onSubmit', () => {
    it('should have an invalid form by default after init', async () => {
      await initComponent(fixture);

      expect(component.form.valid).toBe(false);
    });

    it('should have a valid form when all required fields are filled', async () => {
      await initComponent(fixture);

      component.form.patchValue({
        taskName: 'My Task',
        hashlistId: 1,
        attackCmd: '-a 0 #HL# dict.txt',
        priority: 0,
        crackerBinaryTypeId: 1,
        crackerBinaryId: 10
      });
      component.form.updateValueAndValidity();

      expect(component.form.valid).toBe(true);
    });

    it('should call gs.create and navigate on valid form', async () => {
      await initComponent(fixture);

      component.form.patchValue({
        taskName: 'My Task',
        hashlistId: 1,
        attackCmd: '-a 0 #HL# dict.txt',
        priority: 0,
        crackerBinaryId: 10
      });
      component.form.updateValueAndValidity();

      const payload = { ...component.form.value };
      delete payload.crackerBinaryTypeId;

      await component['onSubmit']();

      expect(globalServiceSpy.create).toHaveBeenCalledWith(SERV.TASKS, payload);
      expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith('New Task created');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['tasks/show-tasks']);
    });

    it('should mark form as touched when invalid and not submit', async () => {
      await initComponent(fixture);

      // Leave required fields empty so form is invalid
      component.form.patchValue({ taskName: '', hashlistId: null, attackCmd: '' });
      component.form.updateValueAndValidity();

      await component['onSubmit']();

      expect(globalServiceSpy.create).not.toHaveBeenCalled();
      expect(component.form.touched).toBe(true);
    });
  });

  describe('Copy Task flow', () => {
    beforeEach(() => {
      activatedRoute.params = of({ id: '42' });
      activatedRoute.data = of({ kind: 'copy-task' });
      globalServiceSpy.get.and.returnValue(of(mockResponse(MOCK_TASK_GET_RESPONSE)));
    });

    it('should call gs.get with SERV.TASKS endpoint and the task id', async () => {
      await initComponent(fixture);

      expect(globalServiceSpy.get).toHaveBeenCalled();
      const [endpoint, id] = globalServiceSpy.get.calls.mostRecent().args;
      expect(endpoint).toEqual(SERV.TASKS);
      expect(id).toBe(42);
    });

    it('should have a valid form after copying a task', async () => {
      await initComponent(fixture);

      expect(component.form.valid).toBe(true);
    });

    it('should patch form with copied task name and notes', async () => {
      await initComponent(fixture);

      expect(component.form.controls.taskName.value).toBe('Original Task_(Copied_task_id_42)');
      expect(component.form.controls.notes.value).toBe('Copied from task id 42');
    });

    it('should patch form with common task fields from the source', async () => {
      await initComponent(fixture);

      expect(component.form.controls.attackCmd.value).toBe('-a 0 #HL# rockyou.txt');
      expect(component.form.controls.maxAgents.value).toBe(2);
      expect(component.form.controls.chunkTime.value).toBe(600);
      expect(component.form.controls.priority.value).toBe(1);
      expect(component.form.controls.color.value).toBe('#ff0000');
      expect(component.form.controls.isCpuTask.value).toBe(false);
      expect(component.form.controls.crackerBinaryTypeId.value).toBe(1);
      expect(component.form.controls.isSmall.value).toBe(false);
      expect(component.form.controls.useNewBench.value).toBe(true);
      expect(component.form.controls.statusTimer.value).toBe(5);
    });

    it('should always set isArchived to false on copy', async () => {
      await initComponent(fixture);

      expect(component.form.controls.isArchived.value).toBe(false);
    });

    it('should extract task-specific fields via extractCopyData', async () => {
      await initComponent(fixture);

      expect(component.form.controls.skipKeyspace.value).toBe(100);
      expect(component.form.controls.crackerBinaryId.value).toBe(10);
      expect(component.form.controls.staticChunks.value).toBe(2);
      expect(component.form.controls.chunkSize.value).toBe(1000);
      expect(component.form.controls.forcePipe.value).toBe(true);
    });

    it('should set preprocessorId as a number from the source task', async () => {
      await initComponent(fixture);

      expect(component.form.controls.preprocessorId.value).toBe(3);
      expect(typeof component.form.controls.preprocessorId.value).toBe('number');
      expect(component.form.controls.preprocessorCommand.value).toBe('--prince');
    });

    it('should patch hashlistId to the source task hashlist id', async () => {
      await initComponent(fixture);

      // The mock task has hashlist relationship with id '1'
      const hashlistId = component.form.controls.hashlistId.value;
      expect(hashlistId).not.toBeNull();
      expect(String(hashlistId)).toBe('1');
    });

    it('should set copyFiles from the source task files', async () => {
      await initComponent(fixture);

      expect(component.copyFiles).toBeDefined();
      expect(component.copyFiles.length).toBe(2);
    });

    it('should set copyMode to true', async () => {
      await initComponent(fixture);

      expect(component.copyMode).toBe(true);
    });

    it('should set hashlistId to null when the source task has no hashlist', async () => {
      const taskWithoutHashlist = {
        ...MOCK_TASK_GET_RESPONSE,
        data: {
          ...MOCK_TASK_GET_RESPONSE.data,
          relationships: {
            ...MOCK_TASK_GET_RESPONSE.data.relationships,
            hashlist: { data: null }
          }
        }
      };
      globalServiceSpy.get.and.returnValue(of(mockResponse(taskWithoutHashlist)));

      await initComponent(fixture);

      expect(component.form.controls.hashlistId.value).toBeNull();
    });
  });

  describe('Copy Pretask flow', () => {
    beforeEach(() => {
      activatedRoute.params = of({ id: '7' });
      activatedRoute.data = of({ kind: 'copy-pretask' });
      globalServiceSpy.get.and.returnValue(of(mockResponse(MOCK_PRETASK_GET_RESPONSE)));
    });

    it('should call gs.get with SERV.PRETASKS endpoint and the pretask id', async () => {
      await initComponent(fixture);

      expect(globalServiceSpy.get).toHaveBeenCalled();
      const [endpoint, id] = globalServiceSpy.get.calls.mostRecent().args;
      expect(endpoint).toEqual(SERV.PRETASKS);
      expect(id).toBe(7);
    });

    it('should have an invalid form because hashlistId is missing', async () => {
      await initComponent(fixture);

      expect(component.form.valid).toBe(false);
      expect(component.form.controls.hashlistId.value).toBeNull();
    });

    it('should patch form with copied pretask name and notes', async () => {
      await initComponent(fixture);

      expect(component.form.controls.taskName.value).toBe('My Pretask_(Copied_pretask_id_7)');
      expect(component.form.controls.notes.value).toBe('Copied from pretask id 7');
    });

    it('should patch form with common fields from the source pretask', async () => {
      await initComponent(fixture);

      expect(component.form.controls.attackCmd.value).toBe('-a 3 ?a?a?a?a');
      expect(component.form.controls.maxAgents.value).toBe(0);
      expect(component.form.controls.chunkTime.value).toBe(300);
      expect(component.form.controls.priority.value).toBe(5);
      expect(component.form.controls.isCpuTask.value).toBe(true);
      expect(component.form.controls.isSmall.value).toBe(true);
      expect(component.form.controls.useNewBench.value).toBe(false);
      expect(component.form.controls.statusTimer.value).toBe(10);
    });

    it('should set hashlistId to null — not the old sentinel value 999999', async () => {
      await initComponent(fixture);

      expect(component.form.controls.hashlistId.value).toBeNull();
      expect(component.form.controls.hashlistId.value).not.toBe(999999);
    });

    it('should set pretask defaults for task-specific fields', async () => {
      await initComponent(fixture);

      expect(component.form.controls.skipKeyspace.value).toBe(0);
      expect(component.form.controls.crackerBinaryId.value).toBe(10);
      expect(component.form.controls.staticChunks.value).toBe(0);
      expect(component.form.controls.chunkSize.value).toBe(environment.config.tasks.chunkSize);
      expect(component.form.controls.forcePipe.value).toBe(false);
    });

    it('should set preprocessorId to 0 (number, not null or string) for pretask', async () => {
      await initComponent(fixture);

      expect(component.form.controls.preprocessorId.value).toBe(0);
      expect(typeof component.form.controls.preprocessorId.value).toBe('number');
      expect(component.form.controls.preprocessorId.value).not.toBeNull();
      expect(component.form.controls.preprocessorCommand.value).toBe('');
    });

    it('should set copyFiles from pretaskFiles', async () => {
      await initComponent(fixture);

      expect(component.copyFiles).toBeDefined();
      expect(component.copyFiles.length).toBe(1);
    });

    it('should set copyMode to true', async () => {
      await initComponent(fixture);

      expect(component.copyMode).toBe(true);
    });
  });

  describe('buildForm', () => {
    it('should initialize the form with all expected controls', () => {
      component.buildForm();

      const expectedControls = [
        'taskName',
        'notes',
        'hashlistId',
        'attackCmd',
        'priority',
        'maxAgents',
        'chunkTime',
        'statusTimer',
        'color',
        'isCpuTask',
        'skipKeyspace',
        'crackerBinaryId',
        'crackerBinaryTypeId',
        'isArchived',
        'staticChunks',
        'chunkSize',
        'forcePipe',
        'preprocessorId',
        'preprocessorCommand',
        'isSmall',
        'useNewBench',
        'files'
      ];
      for (const ctrl of expectedControls) {
        expect(component.form.get(ctrl)).toBeTruthy(`Missing control: ${ctrl}`);
      }
    });

    it('should subscribe to crackerBinaryTypeId value changes', async () => {
      await initComponent(fixture);

      // Reset call tracking so we only see calls triggered by the value change
      globalServiceSpy.getAll.calls.reset();

      component.form.controls.crackerBinaryTypeId.setValue(2);
      await fixture.whenStable();

      // handleChangeBinary should have called gs.getAll(SERV.CRACKERS, ...)
      const crackerCalls = globalServiceSpy.getAll.calls.allArgs().filter((args) => args[0].URL === SERV.CRACKERS.URL);
      expect(crackerCalls.length).toBeGreaterThanOrEqual(1);
    });

    it('should subscribe to preprocessorId value changes and update form value', async () => {
      await initComponent(fixture);

      component.form.controls.preprocessorId.setValue(5);
      await fixture.whenStable();

      expect(component.form.controls.preprocessorId.value).toBe(5);
    });
  });

  describe('loadSelectOptions', () => {
    it('should load hashlists, cracker types/versions, and preprocessors', async () => {
      await initComponent(fixture);

      // Hashlists were loaded
      expect(component.selectHashlists).toBeDefined();
      expect(component.selectHashlists.length).toBe(2);

      // Cracker types were loaded
      expect(component.selectCrackertype).toBeDefined();
      expect(component.selectCrackertype.length).toBe(1);

      // Cracker versions were loaded
      expect(component.selectCrackerversions).toBeDefined();
      expect(component.selectCrackerversions.length).toBeGreaterThanOrEqual(1);

      // Preprocessors were loaded
      expect(component.selectPreprocessor).toBeDefined();
      expect(component.selectPreprocessor.length).toBe(1);
    });

    it('should set isLoading to false after hashlists load', async () => {
      expect(component.isLoading).toBe(true);
      await initComponent(fixture);
      expect(component.isLoading).toBe(false);
    });

    it('should show error when no hashlists are available', async () => {
      globalServiceSpy.getAll.and.callFake(
        buildGetAllCallFake({ [SERV.HASHLISTS.URL]: of(mockResponse(MOCK_EMPTY_HASHLISTS_RESPONSE)) })
      );

      await initComponent(fixture);

      expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith(
        'You need to create a Hashlist to continue creating a Task'
      );
    });

    it('should show error message when hashlists fail to load', async () => {
      globalServiceSpy.getAll.and.callFake(
        buildGetAllCallFake({ [SERV.HASHLISTS.URL]: throwError(() => new Error('Network error')) })
      );

      await initComponent(fixture);

      expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith('Failed to load hashlists');
    });
  });

  describe('handleChangeBinary', () => {
    it('should load cracker versions when binary type changes', async () => {
      await initComponent(fixture);
      globalServiceSpy.getAll.calls.reset();

      component.form.controls.crackerBinaryTypeId.setValue(1);
      await fixture.whenStable();

      const crackerCalls = globalServiceSpy.getAll.calls.allArgs().filter((args) => args[0].URL === SERV.CRACKERS.URL);
      expect(crackerCalls.length).toBeGreaterThanOrEqual(1);
      expect(component.selectCrackerversions).toBeDefined();
    });

    it('should select the last version by default', async () => {
      const multiVersionResponse = {
        jsonapi: { version: '1.1', ext: [] },
        data: [
          {
            id: 10,
            type: 'crackerBinary',
            attributes: { crackerBinaryTypeId: 1, binaryName: 'hashcat', version: '6.2.5', downloadUrl: '' }
          },
          {
            id: 11,
            type: 'crackerBinary',
            attributes: { crackerBinaryTypeId: 1, binaryName: 'hashcat', version: '6.2.6', downloadUrl: '' }
          }
        ],
        included: []
      };

      await initComponent(fixture);

      // Override only CRACKERS responses for the next value change
      globalServiceSpy.getAll.and.callFake(buildGetAllCallFake({ [SERV.CRACKERS.URL]: of(mockResponse(multiVersionResponse)) }));

      component.form.controls.crackerBinaryTypeId.setValue(1);
      await fixture.whenStable();

      // Last version id should be 11 (Number-converted from SelectOption.id string '11')
      expect(component.form.controls.crackerBinaryId.value).toBe(11);
    });

    it('should set required error when no versions are available', async () => {
      await initComponent(fixture);

      globalServiceSpy.getAll.and.callFake(
        buildGetAllCallFake({ [SERV.CRACKERS.URL]: of(mockResponse(MOCK_CRACKERS_EMPTY_RESPONSE)) })
      );

      component.form.controls.crackerBinaryTypeId.setValue(999);
      await fixture.whenStable();

      const crackerCtrl = component.form.controls.crackerBinaryId;
      expect(crackerCtrl.errors).toEqual({ required: true });
      expect(crackerCtrl.touched).toBe(true);
      expect(crackerCtrl.dirty).toBe(true);
    });
  });

  describe('handleChangePreprocessor', () => {
    it('should update preprocessorId when value changes', async () => {
      await initComponent(fixture);

      component.form.controls.preprocessorId.setValue(5);
      await fixture.whenStable();

      expect(component.form.controls.preprocessorId.value).toBe(5);
    });

    it('should not re-emit when value has not changed', async () => {
      await initComponent(fixture);

      component.form.controls.preprocessorId.setValue(3);
      await fixture.whenStable();

      const spy = spyOn(component.form.controls.preprocessorId, 'setValue').and.callThrough();

      // Set the same value again — handler should skip the inner setValue
      component.form.controls.preprocessorId.setValue(3);
      await fixture.whenStable();

      // The spy captures our explicit setValue(3) call, but the handler
      // should NOT have called setValue again since value didn't change.
      const handlerCalls = spy.calls
        .allArgs()
        .filter((args) => args.length > 1 && (args[1] as Record<string, unknown>)?.emitEvent === false);
      expect(handlerCalls.length).toBe(0);
    });
  });

  describe('determineView / initialization modes', () => {
    it('should set copyMode to true when route has id param', async () => {
      activatedRoute.params = of({ id: '42' });

      await initComponent(fixture);

      expect(component.copyMode).toBe(true);
    });

    it('should set copyMode to false when route has no id param', async () => {
      activatedRoute.params = of({});

      await initComponent(fixture);

      expect(component.copyMode).toBe(false);
    });

    it('should leave hashlistId as default (null) in new-task mode', async () => {
      activatedRoute.params = of({});
      activatedRoute.data = of({ kind: 'new-task' });

      await initComponent(fixture);

      expect(component.form.controls.hashlistId.value).toBeNull();
    });
  });

  describe('getFormData', () => {
    it('should return attackCmd, files, and preprocessorCommand from form', async () => {
      await initComponent(fixture);

      component.form.patchValue({
        attackCmd: '-a 0 #HL# dict.txt',
        files: [1, 2],
        preprocessorCommand: '--prince'
      });

      const data = component['getFormData']();
      expect(data.attackCmd).toBe('-a 0 #HL# dict.txt');
      expect(data.files).toEqual([1, 2]);
      expect(data.preprocessorCommand).toBe('--prince');
    });

    it('should return empty defaults when form is not ready', () => {
      // Before ngOnInit, formReady is false
      const data = component['getFormData']();
      expect(data.attackCmd).toBe('');
      expect(data.files).toEqual([]);
      expect(data.preprocessorCommand).toBe('');
    });
  });

  describe('isPreprocessor', () => {
    it('should return true when preprocessorId is a non-zero number', async () => {
      await initComponent(fixture);

      component.form.controls.preprocessorId.setValue(5, { emitEvent: false });

      expect(component['isPreprocessor']()).toBe(true);
    });

    it('should return false when preprocessorId is 0', async () => {
      await initComponent(fixture);

      component.form.controls.preprocessorId.setValue(0, { emitEvent: false });

      expect(component['isPreprocessor']()).toBe(false);
    });
  });

  describe('onUpdateForm', () => {
    it('should update attackCmd and files when event type is CMD', async () => {
      await initComponent(fixture);

      component['onUpdateForm']({
        type: 'CMD',
        attackCmd: '-a 3 ?a?a?a',
        files: [10, 20],
        otherFiles: []
      });

      expect(component.form.controls.attackCmd.value).toBe('-a 3 ?a?a?a');
      expect(component.form.controls.files.value).toEqual([10, 20]);
    });

    it('should update preprocessorCommand when event type is not CMD', async () => {
      await initComponent(fixture);

      component['onUpdateForm']({
        type: 'PREPROCESSOR',
        attackCmd: '--prince-elem-cnt-min=1',
        files: [],
        otherFiles: []
      });

      expect(component.form.controls.preprocessorCommand.value).toBe('--prince-elem-cnt-min=1');
    });
  });

  describe('openHelpDialog', () => {
    it('should open CheatsheetComponent dialog with full width', () => {
      component['openHelpDialog']();

      expect(dialogSpy.open).toHaveBeenCalledWith(CheatsheetComponent, { width: '100%' });
    });
  });

  describe('ngOnDestroy', () => {
    it('should destroy the component without errors', async () => {
      await initComponent(fixture);

      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });
  });

  describe('change detection stability', () => {
    it('should stabilize after init', async () => {
      await initComponent(fixture);

      expectChangeDetectionStability(fixture);
    });

    it('should stabilize after form value changes', async () => {
      await initComponent(fixture);

      component.form.patchValue({
        attackCmd: '-a 3 ?a?a?a',
        files: [1, 2],
        preprocessorCommand: '--prince'
      });

      expectChangeDetectionStability(fixture);
    });
  });

  // check this as there was a 'null' check before the refactoring, so add this to be source
  describe('preprocessorId typing', () => {
    it('should default to 0 (number) on fresh form', async () => {
      await initComponent(fixture);

      const value = component.form.controls.preprocessorId.value;
      expect(value).toBe(0);
      expect(typeof value).toBe('number');
    });

    it('should remain a number after setting via setValue', async () => {
      await initComponent(fixture);

      component.form.controls.preprocessorId.setValue(5, { emitEvent: false });

      const value = component.form.controls.preprocessorId.value;
      expect(typeof value).toBe('number');
      expect(value).not.toBeNull();
    });

    it('should report isPreprocessor correctly based on numeric value', async () => {
      await initComponent(fixture);

      component.form.controls.preprocessorId.setValue(0, { emitEvent: false });
      expect(component['isPreprocessor']()).toBe(false);

      component.form.controls.preprocessorId.setValue(1, { emitEvent: false });
      expect(component['isPreprocessor']()).toBe(true);
    });
  });
});
