import { zHashTypeListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { HashTypeId } from '@models/id.types';
import { FilterType, RequestParams } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import {
  AddCrackerHashtypesDialogComponent,
  AddCrackerHashtypesDialogData
} from '@src/app/config/engine/crackers/cracker-hashtypes/add-cracker-hashtypes-dialog/add-cracker-hashtypes-dialog.component';
import { provideDisabledMaterialAnimations } from '@src/app/testing/material-animations';
import { mockValidResponse } from '@src/app/testing/mock-response';

const HASHTYPES = mockValidResponse(zHashTypeListResponse, {
  data: [
    { id: 0, type: 'hashType', attributes: { description: 'MD5', isSalted: false, isSlowHash: false } },
    { id: 100, type: 'hashType', attributes: { description: 'SHA1', isSalted: false, isSlowHash: false } }
  ]
});

function httpError(status: number, title?: string) {
  return throwError(() => new HttpErrorResponse({ status, error: title ? { title } : null }));
}

function linkBody(id: number) {
  return { data: [{ type: 'hashType', id }] };
}

describe('AddCrackerHashtypesDialogComponent', () => {
  let fixture: ComponentFixture<AddCrackerHashtypesDialogComponent>;
  let component: AddCrackerHashtypesDialogComponent;
  let gs: MockedObject<GlobalService>;
  let alert: MockedObject<AlertService>;
  let dialogRef: MockedObject<MatDialogRef<AddCrackerHashtypesDialogComponent, boolean>>;

  async function setup(
    data: Partial<AddCrackerHashtypesDialogData> & {
      assignedHashtypeIds?: HashTypeId[] | null;
    } = {}
  ): Promise<void> {
    const dialogData: AddCrackerHashtypesDialogData = {
      crackerBinaryId: 12,
      assignedHashtypeIds: data.assignedHashtypeIds === undefined ? [1000] : data.assignedHashtypeIds,
      canCreate: data.canCreate ?? false
    };
    await TestBed.configureTestingModule({
      imports: [AddCrackerHashtypesDialogComponent],
      providers: [
        provideDisabledMaterialAnimations(),
        { provide: GlobalService, useValue: gs },
        { provide: AlertService, useValue: alert },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AddCrackerHashtypesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function el(): HTMLElement {
    return fixture.nativeElement;
  }

  beforeEach(() => {
    gs = {
      getAll: vi.fn().mockName('GlobalService.getAll'),
      postRelationships: vi.fn().mockName('GlobalService.postRelationships'),
      create: vi.fn().mockName('GlobalService.create')
    } as MockedObject<GlobalService>;
    gs.getAll.mockReturnValue(of(HASHTYPES));
    gs.postRelationships.mockReturnValue(of({}));
    gs.create.mockReturnValue(of({} as ResponseWrapper));
    alert = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage')
    } as MockedObject<AlertService>;
    dialogRef = {
      close: vi.fn().mockName('MatDialogRef.close')
    } as MockedObject<MatDialogRef<AddCrackerHashtypesDialogComponent, boolean>>;
  });

  describe('tabs', () => {
    it('shows only the existing hashtypes without the create permission', async () => {
      await setup({ canCreate: false });
      expect(el().querySelector('mat-tab-group')).toBeNull();
      expect(el().querySelector('[data-testid="create-hashtype-form"]')).toBeNull();
      expect(el().querySelector('[data-testid="add-hashtypes"]')).not.toBeNull();
    });

    it('offers a tab for existing and one for new hashtypes with the create permission', async () => {
      await setup({ canCreate: true });
      const labels = Array.from(el().querySelectorAll('[role="tab"]')).map((tab) => tab.textContent?.trim());
      expect(labels).toEqual(['Existing', 'New']);
      expect(el().querySelector('[data-testid="add-hashtypes"]')).not.toBeNull();
      expect(el().querySelector('[data-testid="create-hashtype"]')).toBeNull();
    });

    it('switches the action to create on the new tab', async () => {
      await setup({ canCreate: true });
      component.selectedTab = 1;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(el().querySelector('[data-testid="create-hashtype"]')?.textContent).toContain('Create and add');
      expect(el().querySelector('[data-testid="add-hashtypes"]')).toBeNull();
    });

    it('labels the mode as the numeric hashcat mode', async () => {
      await setup({ canCreate: true });
      component.selectedTab = 1;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const mode = el().querySelector<HTMLInputElement>('[data-testid="create-hashtype-form"] input[type="number"]');
      expect(el().querySelector('[data-testid="create-hashtype-form"] label')?.textContent).toContain(
        'Mode (hashcat -m)'
      );
      expect(mode?.placeholder).toBe('e.g. 1400');
    });
  });

  describe('adding existing hashtypes', () => {
    beforeEach(async () => await setup());

    it('offers the hashtypes which are not assigned yet', () => {
      const [serviceConfig, params] = vi.mocked(gs.getAll).mock.lastCall!;
      expect(serviceConfig).toEqual(SERV.HASHTYPES);
      expect((params as RequestParams).filter).toEqual([{ field: 'id', operator: FilterType.NOTIN, value: [1000] }]);
      expect(component.selectHashtypes.map((option) => option.id)).toEqual([0, 100]);
    });

    it('adds the selected hashtypes and closes with a change', async () => {
      component.addForm.controls.hashtypeIds.setValue([0, 100]);

      await component.onAdd();

      expect(gs.postRelationships).toHaveBeenCalledWith(SERV.CRACKERS, 12, RelationshipType.HASHTYPES, {
        data: [
          { type: 'hashType', id: 0 },
          { type: 'hashType', id: 100 }
        ]
      });
      expect(alert.showSuccessMessage).toHaveBeenCalledWith('Added 2 hashtypes');
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('stays open when adding fails', async () => {
      gs.postRelationships.mockReturnValue(httpError(500));
      component.addForm.controls.hashtypeIds.setValue([0]);

      await component.onAdd();

      expect(dialogRef.close).not.toHaveBeenCalled();
      expect(component.addForm.controls.hashtypeIds.value).toEqual([0]);
      expect(component.isAdding).toBe(false);
    });

    it('sends nothing without a selection', async () => {
      await component.onAdd();
      expect(gs.postRelationships).not.toHaveBeenCalled();
    });
  });

  describe('without loaded assigned ids', () => {
    beforeEach(async () => await setup({ assignedHashtypeIds: null }));

    it('offers all hashtypes', () => {
      expect((vi.mocked(gs.getAll).mock.lastCall![1] as RequestParams).filter).toBeUndefined();
    });
  });

  describe('creating a hashtype', () => {
    beforeEach(async () => await setup({ canCreate: true }));

    function fill(values: {
      hashTypeId: number | null;
      description: string;
      isSalted?: boolean;
      isSlowHash?: boolean;
    }) {
      component.createForm.setValue({
        hashTypeId: values.hashTypeId,
        description: values.description,
        isSalted: values.isSalted ?? false,
        isSlowHash: values.isSlowHash ?? false
      });
    }

    function skipsErrorDialog(
      options:
        | {
            headers?: HttpHeaders;
          }
        | undefined
    ): boolean {
      return options?.headers?.get('X-Skip-Error-Dialog') === 'true';
    }

    it('rejects an empty mode', async () => {
      fill({ hashTypeId: null, description: 'Custom' });
      await component.onCreate();
      expect(gs.postRelationships).not.toHaveBeenCalled();
      expect(component.createForm.controls.hashTypeId.touched).toBe(true);
    });

    it('rejects a negative mode', async () => {
      fill({ hashTypeId: -1, description: 'Custom' });
      await component.onCreate();
      expect(gs.postRelationships).not.toHaveBeenCalled();
    });

    it('rejects a fractional mode', async () => {
      fill({ hashTypeId: 1.5, description: 'Custom' });
      await component.onCreate();
      expect(gs.postRelationships).not.toHaveBeenCalled();
    });

    it('rejects a blank description', async () => {
      fill({ hashTypeId: 99000, description: '   ' });
      await component.onCreate();
      expect(gs.postRelationships).not.toHaveBeenCalled();
    });

    it('does not send a mode which is already assigned and stays open', async () => {
      fill({ hashTypeId: 1000, description: 'Custom' });
      await component.onCreate();
      expect(gs.postRelationships).not.toHaveBeenCalled();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Hashtype 1000 is already assigned to this version.');
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('adds an existing mode without creating it', async () => {
      fill({ hashTypeId: 100, description: 'My SHA1' });
      await component.onCreate();

      const [serviceConfig, id, relType, body, options] = vi.mocked(gs.postRelationships).mock.calls[0];
      expect(serviceConfig).toEqual(SERV.CRACKERS);
      expect(id).toBe(12);
      expect(relType).toBe(RelationshipType.HASHTYPES);
      expect(body).toEqual(linkBody(100));
      expect(skipsErrorDialog(options)).toBe(true);
      expect(gs.create).not.toHaveBeenCalled();
      expect(alert.showSuccessMessage).toHaveBeenCalledWith(
        'Hashtype 100 already existed and was added to this version. Its existing description was kept.'
      );
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('links mode 0', async () => {
      fill({ hashTypeId: 0, description: 'MD5' });
      await component.onCreate();
      expect(vi.mocked(gs.postRelationships).mock.calls[0][3]).toEqual(linkBody(0));
      expect(alert.showSuccessMessage).toHaveBeenCalledWith(
        'Hashtype 0 already existed and was added to this version. Its existing description was kept.'
      );
    });

    it('creates a missing mode and adds it', async () => {
      gs.postRelationships.mockReturnValueOnce(httpError(404)).mockReturnValueOnce(of({}));
      fill({ hashTypeId: 99000, description: 'My custom hash', isSalted: true });
      await component.onCreate();

      const [serviceConfig, item, options] = vi.mocked(gs.create).mock.calls[0];
      expect(serviceConfig).toEqual(SERV.HASHTYPES);
      expect(item).toEqual({ hashTypeId: 99000, description: 'My custom hash', isSalted: true, isSlowHash: false });
      expect(skipsErrorDialog(options)).toBe(true);
      expect(gs.postRelationships).toHaveBeenCalledTimes(2);
      expect(vi.mocked(gs.postRelationships).mock.calls[1][3]).toEqual(linkBody(99000));
      expect(skipsErrorDialog(vi.mocked(gs.postRelationships).mock.calls[1][4])).toBe(true);
      expect(alert.showSuccessMessage).toHaveBeenCalledWith(
        'Created hashtype 99000 (My custom hash) and added it to this version.'
      );
      expect(alert.showErrorMessage).not.toHaveBeenCalled();
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('sends the description trimmed', async () => {
      gs.postRelationships.mockReturnValueOnce(httpError(404)).mockReturnValueOnce(of({}));
      fill({ hashTypeId: 99000, description: '  My custom hash  ' });
      await component.onCreate();
      expect(
        (
          vi.mocked(gs.create).mock.calls[0][1] as {
            description: string;
          }
        ).description
      ).toBe('My custom hash');
    });

    it('reports a mode which was assigned in between and closes with a change', async () => {
      gs.postRelationships.mockReturnValue(httpError(409, 'Relation already exists'));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(gs.create).not.toHaveBeenCalled();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Hashtype 99000 is already assigned to this version.');
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('stops when the first link fails otherwise', async () => {
      gs.postRelationships.mockReturnValue(httpError(403, 'No access to this object!'));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(gs.create).not.toHaveBeenCalled();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('No access to this object!');
      expect(component.createForm.controls.hashTypeId.value).toBe(99000);
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('falls back without a backend title', async () => {
      gs.postRelationships.mockReturnValue(httpError(500));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Failed to add hashtype 99000.');
    });

    it('falls back for a non-HTTP error', async () => {
      gs.postRelationships.mockReturnValue(throwError(() => new TypeError('boom')));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Failed to add hashtype 99000.');
    });

    it('stops when the create fails', async () => {
      gs.postRelationships.mockReturnValue(httpError(404));
      gs.create.mockReturnValue(httpError(400, 'This hash number is already used!'));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(gs.postRelationships).toHaveBeenCalledTimes(1);
      expect(alert.showErrorMessage).toHaveBeenCalledWith('This hash number is already used!');
      expect(component.createForm.controls.description.value).toBe('My custom hash');
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('falls back without a title when the create fails', async () => {
      gs.postRelationships.mockReturnValue(httpError(404));
      gs.create.mockReturnValue(httpError(500));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Failed to create hashtype 99000.');
    });

    it('reports a created hashtype which could not be added, and adds it on the next submit', async () => {
      gs.postRelationships
        .mockReturnValueOnce(httpError(404))
        .mockReturnValueOnce(httpError(500, 'Database error'))
        .mockReturnValueOnce(of({}));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();

      expect(alert.showErrorMessage).toHaveBeenCalledWith(
        'Hashtype 99000 was created, but could not be added to this version: Database error. Submit again to add it.'
      );
      expect(dialogRef.close).not.toHaveBeenCalled();

      await component.onCreate();
      expect(gs.create).toHaveBeenCalledTimes(1);
      expect(alert.showSuccessMessage).toHaveBeenCalledWith(
        'Hashtype 99000 already existed and was added to this version. Its existing description was kept.'
      );
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('uses "unknown error" when the second link has no title', async () => {
      gs.postRelationships.mockReturnValueOnce(httpError(404)).mockReturnValueOnce(httpError(500));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(alert.showErrorMessage).toHaveBeenCalledWith(
        'Hashtype 99000 was created, but could not be added to this version: unknown error. Submit again to add it.'
      );
    });

    it('runs the flow once on a double submit', async () => {
      fill({ hashTypeId: 100, description: 'My SHA1' });
      await Promise.all([component.onCreate(), component.onCreate()]);
      expect(gs.postRelationships).toHaveBeenCalledTimes(1);
      expect(component.isCreating).toBe(false);
    });
  });

  describe('creating while the assigned ids are not loaded', () => {
    beforeEach(async () => await setup({ canCreate: true, assignedHashtypeIds: null }));

    it('relies on the backend', async () => {
      gs.postRelationships.mockReturnValue(httpError(409));
      component.createForm.setValue({ hashTypeId: 1000, description: 'Custom', isSalted: false, isSlowHash: false });
      await component.onCreate();
      expect(gs.postRelationships).toHaveBeenCalledTimes(1);
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Hashtype 1000 is already assigned to this version.');
    });
  });
});
