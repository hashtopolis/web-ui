import { zCrackerBinaryTypeListResponse } from '@generated/api/zod';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import type { TaskSelectFile } from '@models/file.model';
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

  beforeEach(async () => {
    gs = {
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
    await TestBed.configureTestingModule({
      declarations: [NewPreconfiguredTasksComponent],
      providers: [
        { provide: GlobalService, useValue: gs },
        { provide: AlertService, useValue: alert },
        { provide: AutoTitleService, useValue: { set: vi.fn() } },
        { provide: Router, useValue: router },
        { provide: UIConfigService, useValue: { getUISettings: () => ({ hashlistAlias: '#HL#' }) } },
        { provide: ActivatedRoute, useValue: { params: of({}), data: of({ kind: NewPretaskRouteKind.NewPretask }) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(NewPreconfiguredTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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
    expect(gs.create).toHaveBeenCalledExactlyOnceWith(SERV.PRETASKS, expect.objectContaining({ taskName: 'Sample' }));
    expect(alert.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('New Preconfigured Task created');
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['tasks/preconfigured-tasks']);
    expect(component.isCreatingLoading).toBe(false);
  });
});
