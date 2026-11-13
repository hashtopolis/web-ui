import { zCrackerBinaryTypeListResponse } from '@generated/api/zod';
import { zPreTaskResponse, zTaskResponse } from '@generated/api/zod';
import { Subject, of } from 'rxjs';
import type { Observable } from 'rxjs';
import type { MockedObject } from 'vitest';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import type { Data, Params } from '@angular/router';

import type { TaskSelectFile } from '@models/file.model';
import { ResponseWrapper } from '@models/response.model';
import { NewPretaskRouteKind } from '@models/routes.schema';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UIConfigService } from '@services/shared/storage.service';

import { CheckboxColumnType } from '@components/tables/ht-table/ht-table.models';

import { NewPreconfiguredTasksComponent } from '@src/app/tasks/new-preconfigured-tasks/new-preconfigured-tasks.component';
import { mockResponse, mockValidResponse } from '@src/app/testing/mock-response';

describe('NewPreconfiguredTasksComponent', () => {
  let fixture: ComponentFixture<NewPreconfiguredTasksComponent>;
  let component: NewPreconfiguredTasksComponent;
  let gs: MockedObject<GlobalService>;
  let alert: MockedObject<AlertService>;
  let router: MockedObject<Router>;
  let activatedRoute: { params: Observable<Params>; data: Observable<Data> };

  beforeEach(async () => {
    gs = {
      get: vi.fn().mockName('GlobalService.get'),
      getAll: vi.fn().mockName('GlobalService.getAll'),
      create: vi.fn().mockName('GlobalService.create')
    } as MockedObject<GlobalService>;
    gs.getAll.mockReturnValue(
      of(
        mockValidResponse(zCrackerBinaryTypeListResponse, {
          data: [
            {
              id: 10,
              type: 'crackerBinaryType',
              attributes: { typeName: 'Hashcat', isChunkingAvailable: true },
              relationships: { crackerVersions: { data: [{ type: 'crackerBinary', id: 20 }] } }
            }
          ],
          included: [
            {
              id: 20,
              type: 'crackerBinary',
              attributes: {
                crackerBinaryTypeId: 10,
                version: '7.1.2',
                downloadUrl: null,
                binaryName: 'hashcat',
                filename: 'hashcat.7z',
                accessGroupId: 1
              }
            }
          ]
        })
      )
    );
    alert = { showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage') } as MockedObject<AlertService>;
    router = { navigate: vi.fn().mockName('Router.navigate').mockResolvedValue(true) } as MockedObject<Router>;
    activatedRoute = { params: of({}), data: of({ kind: NewPretaskRouteKind.NewPretask }) };
    await TestBed.configureTestingModule({
      declarations: [NewPreconfiguredTasksComponent],
      providers: [
        { provide: GlobalService, useValue: gs },
        { provide: AlertService, useValue: alert },
        { provide: AutoTitleService, useValue: { set: vi.fn().mockName('AutoTitleService.set') } },
        { provide: Router, useValue: router },
        { provide: UIConfigService, useValue: { getUISettings: () => ({ hashlistAlias: '#HL#' }) } },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(NewPreconfiguredTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  async function initializeCopyMode(
    kind: typeof NewPretaskRouteKind.CopyPretask | typeof NewPretaskRouteKind.CopyTask,
    id: number
  ) {
    fixture.destroy();
    activatedRoute.params = of({ id: String(id) });
    activatedRoute.data = of({ kind });
    const sourceResponse = new Subject<ResponseWrapper>();
    gs.get.mockReturnValue(sourceResponse.asObservable());

    fixture = TestBed.createComponent(NewPreconfiguredTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const response = kind === NewPretaskRouteKind.CopyPretask ? mockCopyPretaskResponse(id) : mockCopyTaskResponse(id);
    sourceResponse.next(response);
    sourceResponse.complete();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function mockCopyFile(id: number) {
    return {
      id,
      type: 'file',
      attributes: {
        filename: 'words.txt',
        size: 123,
        isSecret: false,
        fileType: 0,
        accessGroupId: 1,
        lineCount: 10,
        checksum: null
      }
    };
  }

  function mockCopyPretaskResponse(id: number): ResponseWrapper {
    return mockValidResponse(zPreTaskResponse, {
      data: {
        id,
        type: 'preTask',
        attributes: {
          taskName: 'Preset',
          attackCmd: '-a 0 #HL# words.txt',
          chunkTime: 600,
          statusTimer: 5,
          color: '#112233',
          isSmall: true,
          isCpuTask: false,
          useNewBench: true,
          priority: 2,
          maxAgents: 4,
          isMaskImport: false,
          crackerBinaryTypeId: 1
        },
        relationships: { pretaskFiles: { data: [{ type: 'file', id: 31 }] } }
      },
      included: [mockCopyFile(31)]
    });
  }

  function mockCopyTaskResponse(id: number): ResponseWrapper {
    return mockValidResponse(zTaskResponse, {
      data: {
        id,
        type: 'task',
        attributes: {
          taskName: 'Source task',
          attackCmd: '-a 0 #HL# words.txt',
          chunkTime: 600,
          statusTimer: 5,
          keyspace: 1000,
          keyspaceProgress: 250,
          priority: 2,
          maxAgents: 4,
          color: '#112233',
          isSmall: true,
          isCpuTask: false,
          useNewBench: true,
          skipKeyspace: 0,
          crackerBinaryId: 5,
          crackerBinaryTypeId: 1,
          taskWrapperId: 2,
          isArchived: false,
          notes: '',
          staticChunks: 0,
          chunkSize: 1000,
          forcePipe: false,
          preprocessorId: 0,
          preprocessorCommand: ''
        },
        relationships: { files: { data: [{ type: 'file', id: 31 }] } }
      },
      included: [mockCopyFile(31)]
    });
  }

  it('initializes a new pretask form and loads cracker type options', () => {
    expect(component.whichView).toBe('create');
    expect(component.copyMode).toBe(false);
    expect(component.createForm.controls.attackCmd.value).toBe('#HL#');
    expect(component.selectCrackertype).toStrictEqual([{ id: 10, name: 'Hashcat' }]);
    expect(gs.getAll).toHaveBeenCalledExactlyOnceWith(SERV.CRACKERS_TYPES, { include: ['crackerVersions'] });
  });

  it('updates the attack command and file selection from the file picker', () => {
    const event: TaskSelectFile = {
      type: CheckboxColumnType.CMD,
      attackCmd: '-a 0 #HL# dict.txt',
      files: [4, 9],
      otherFiles: []
    };
    component.onUpdateForm(event);
    expect(component.getFormData()).toStrictEqual({ attackCmd: '-a 0 #HL# dict.txt', files: [4, 9] });
  });

  it('marks the form touched and skips submission when invalid', () => {
    component.onSubmit();
    expect(component.createForm.controls.taskName.touched).toBe(true);
    expect(component.createForm.controls.attackCmd.touched).toBe(true);
    expect(gs.create).not.toHaveBeenCalled();
  });

  it('creates a valid pretask and navigates after success', () => {
    gs.create.mockReturnValue(of(mockResponse()));
    component.createForm.patchValue({ taskName: 'Sample', attackCmd: '-a 0 #HL# words.txt' });
    component.onSubmit();
    expect(gs.create).toHaveBeenCalledExactlyOnceWith(
      SERV.PRETASKS,
      expect.objectContaining({
        taskName: 'Sample',
        attackCmd: '-a 0 #HL# words.txt',
        files: []
      })
    );
    expect(alert.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('New Preconfigured Task created');
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['tasks/preconfigured-tasks']);
    expect(component.isCreatingLoading).toBe(false);
  });

  it('copies a pretask name and its attached files', async () => {
    await initializeCopyMode(NewPretaskRouteKind.CopyPretask, 41);

    expect(component.whichView).toBe('edit');
    expect(component.createForm.controls.taskName.value).toBe('Preset_(Copied_pretask_id_41)');
    expect(component.createForm.controls.files.value).toStrictEqual([31]);
    expect(gs.get).toHaveBeenCalledExactlyOnceWith(SERV.PRETASKS, 41, { include: ['pretaskFiles'] });
  });

  it('copies a task name and its attached files', async () => {
    await initializeCopyMode(NewPretaskRouteKind.CopyTask, 42);

    expect(component.whichView).toBe('task');
    expect(component.createForm.controls.taskName.value).toBe('Source task_(Copied_pretask_from_task_id_42)');
    expect(component.createForm.controls.files.value).toStrictEqual([31]);
    expect(gs.get).toHaveBeenCalledExactlyOnceWith(SERV.TASKS, 42, { include: ['files'] });
  });
});
