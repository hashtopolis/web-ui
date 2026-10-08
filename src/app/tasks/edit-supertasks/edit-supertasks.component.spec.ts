import { zPreTaskListResponse, zSupertaskResponse } from '@generated/api/zod';
import { of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { CrackerBinaryTypesService } from '@services/crackers/cracker-binary-types.service';
import { GlobalService } from '@services/main.service';
import { SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { EditSupertasksComponent } from '@src/app/tasks/edit-supertasks/edit-supertasks.component';
import { mockValidResponse } from '@src/app/testing/mock-response';

const SUPERTASK = mockValidResponse(zSupertaskResponse, {
  data: { id: 5, type: 'supertask', attributes: { supertaskName: 'BF set', crackerBinaryTypeId: 2 } }
});

function pretask(id: number, taskName: string, crackerBinaryTypeId: number) {
  return {
    id,
    type: 'preTask' as const,
    attributes: {
      taskName,
      attackCmd: '#HL# wordlist.txt',
      chunkTime: 600,
      statusTimer: 5,
      color: '',
      isSmall: false,
      isCpuTask: false,
      useNewBench: true,
      priority: 0,
      maxAgents: 0,
      isMaskImport: false,
      crackerBinaryTypeId
    }
  };
}

const PRETASKS = mockValidResponse(zPreTaskListResponse, {
  data: [pretask(2, 'hashcat pretask', 1), pretask(3, 'generic pretask', 2)]
});

describe('EditSupertasksComponent', () => {
  let fixture: ComponentFixture<EditSupertasksComponent>;
  let component: EditSupertasksComponent;

  beforeEach(async () => {
    const gs = jasmine.createSpyObj('GlobalService', ['get', 'getAll', 'update', 'delete', 'postRelationships']);
    gs.get.and.returnValue(of(SUPERTASK));
    gs.getAll.and.returnValue(of(PRETASKS));
    const roles = jasmine.createSpyObj('SupertasksRoleService', ['hasRole']);
    roles.hasRole.and.returnValue(true);
    const crackerBinaryTypes = jasmine.createSpyObj('CrackerBinaryTypesService', ['getTypeName']);
    crackerBinaryTypes.getTypeName.and.returnValue(of('generic'));

    await TestBed.configureTestingModule({
      declarations: [EditSupertasksComponent],
      providers: [
        { provide: GlobalService, useValue: gs },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '5' } } } },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']) },
        { provide: SupertasksRoleService, useValue: roles },
        { provide: CrackerBinaryTypesService, useValue: crackerBinaryTypes },
        { provide: ConfirmDialogService, useValue: jasmine.createSpyObj('ConfirmDialogService', ['confirmDeletion']) },
        {
          provide: AlertService,
          useValue: jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage'])
        },
        { provide: AutoTitleService, useValue: jasmine.createSpyObj('AutoTitleService', ['set']) }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditSupertasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the cracker type read-only', () => {
    const control = component.viewForm.get('crackerBinaryType');
    expect(control?.value).toBe('generic');
    expect(control?.disabled).toBeTrue();
    expect(component.crackerBinaryTypeId).toBe(2);
  });

  it('limits the pretasks not part of the supertask to its type', () => {
    const tables = fixture.nativeElement.querySelectorAll('app-pretasks-table') as NodeListOf<
      HTMLElement & { reverseQuery?: boolean; crackerBinaryTypeId?: number | null }
    >;
    const notContained = Array.from(tables).find((table) => table.reverseQuery === true);
    expect(notContained?.crackerBinaryTypeId).toBe(2);
    expect(component.selectPretasks?.map((option) => option.id)).toEqual([3]);
  });
});
