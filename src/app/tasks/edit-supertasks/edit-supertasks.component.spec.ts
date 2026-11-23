import { zSupertaskResponse } from '@generated/api/zod';
import { Subject, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { CrackerBinaryTypesService } from '@services/crackers/cracker-binary-types.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { EditSupertasksComponent } from '@src/app/tasks/edit-supertasks/edit-supertasks.component';
import { mockValidResponse } from '@src/app/testing/mock-response';
import { wait } from '@src/app/testing/wait';

const supertaskResponse = (supertaskName: string) =>
  mockValidResponse(zSupertaskResponse, {
    data: { id: 5, type: 'supertask', attributes: { supertaskName, crackerBinaryTypeId: 2 } }
  });

const SUPERTASK = supertaskResponse('BF set');

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

  it('renames the supertask and shows the reloaded supertask on the page instead of navigating', async () => {
    const gs = TestBed.inject(GlobalService) as MockedObject<GlobalService>;
    const router = TestBed.inject(Router) as MockedObject<Router>;
    const reloaded$ = new Subject<ResponseWrapper>();
    gs.update.mockReturnValue(of({}));
    gs.get.mockReturnValue(reloaded$);
    component.viewForm.get('supertaskName')?.setValue('Renamed');
    component.onUpdate();

    expect(gs.update).toHaveBeenCalledWith(SERV.SUPER_TASKS, 5, { supertaskName: 'Renamed' });
    expect(component.isUpdatingSupertask).toBe(true);

    reloaded$.next(supertaskResponse('Renamed'));
    reloaded$.complete();
    await wait();

    expect(component.editName).toBe('Renamed');
    expect(component.isUpdatingSupertask).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('stops the save spinner and keeps the typed name when the reload after renaming fails', async () => {
    const gs = TestBed.inject(GlobalService) as MockedObject<GlobalService>;
    vi.spyOn(console, 'error').mockReturnValue(undefined);
    gs.update.mockReturnValue(of({}));
    gs.get.mockReturnValue(throwError(() => ({ status: 500 })));
    component.viewForm.get('supertaskName')?.setValue('Renamed');
    component.onUpdate();
    await wait();

    expect(component.isUpdatingSupertask).toBe(false);
    expect(component.editName).toBe('BF set');
    expect(component.viewForm.get('supertaskName')?.value).toBe('Renamed');
  });
});
