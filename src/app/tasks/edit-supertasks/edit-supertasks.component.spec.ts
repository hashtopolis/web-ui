import { zSupertaskResponse } from '@generated/api/zod';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { CrackerBinaryTypesService } from '@services/crackers/cracker-binary-types.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { EditSupertasksComponent } from '@src/app/tasks/edit-supertasks/edit-supertasks.component';
import { mockValidResponse } from '@src/app/testing/mock-response';

const SUPERTASK = mockValidResponse(zSupertaskResponse, {
  data: { id: 5, type: 'supertask', attributes: { supertaskName: 'BF set', crackerBinaryTypeId: 2 } }
});

describe('EditSupertasksComponent', () => {
  let fixture: ComponentFixture<EditSupertasksComponent>;
  let component: EditSupertasksComponent;

  beforeEach(async () => {
    const gs = {
      get: vi.fn().mockName('GlobalService.get'),
      update: vi.fn().mockName('GlobalService.update'),
      delete: vi.fn().mockName('GlobalService.delete'),
      postRelationships: vi.fn().mockName('GlobalService.postRelationships')
    };
    gs.get.mockReturnValue(of(SUPERTASK));
    const roles = {
      hasRole: vi.fn().mockName('SupertasksRoleService.hasRole')
    };
    roles.hasRole.mockReturnValue(true);
    const crackerBinaryTypes = {
      getTypeName: vi.fn().mockName('CrackerBinaryTypesService.getTypeName')
    };
    crackerBinaryTypes.getTypeName.mockReturnValue(of('generic'));

    await TestBed.configureTestingModule({
      declarations: [EditSupertasksComponent],
      providers: [
        { provide: GlobalService, useValue: gs },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '5' } } } },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn().mockName('Router.navigate'),
            navigateByUrl: vi.fn().mockName('Router.navigateByUrl')
          }
        },
        { provide: SupertasksRoleService, useValue: roles },
        { provide: CrackerBinaryTypesService, useValue: crackerBinaryTypes },
        {
          provide: ConfirmDialogService,
          useValue: {
            confirmDeletion: vi.fn().mockName('ConfirmDialogService.confirmDeletion')
          }
        },
        {
          provide: AlertService,
          useValue: {
            showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
            showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage')
          }
        },
        {
          provide: AutoTitleService,
          useValue: {
            set: vi.fn().mockName('AutoTitleService.set')
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditSupertasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the cracker type read-only', () => {
    const control = component.viewForm.get('crackerBinaryType');
    expect(control?.value).toBe('generic');
    expect(control?.disabled).toBe(true);
    expect(component.crackerBinaryTypeId).toBe(2);
  });

  it('limits the pretasks not part of the supertask to its type', () => {
    const tables = fixture.nativeElement.querySelectorAll('app-pretasks-table') as NodeListOf<
      HTMLElement & {
        reverseQuery?: boolean;
        crackerBinaryTypeId?: number | null;
      }
    >;
    const notContained = Array.from(tables).find((table) => table.reverseQuery === true);
    expect(notContained?.crackerBinaryTypeId).toBe(2);
  });

  it('renames the supertask and reloads it on the page instead of navigating', () => {
    const gs = TestBed.inject(GlobalService) as MockedObject<GlobalService>;
    const router = TestBed.inject(Router) as MockedObject<Router>;
    gs.update.mockReturnValue(of({}));
    component.viewForm.get('supertaskName')?.setValue('Renamed');

    component.onUpdate();

    expect(gs.update).toHaveBeenCalledWith(SERV.SUPER_TASKS, 5, { supertaskName: 'Renamed' });
    expect(gs.get).toHaveBeenCalledTimes(2);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
