import { zCrackerBinaryRelationHashtypesGetResponse, zHashTypeListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FilterType, RequestParams } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import { CoreComponentsModule } from '@components/core-components.module';

import { CrackerHashtypesComponent } from '@src/app/config/engine/crackers/cracker-hashtypes/cracker-hashtypes.component';
import { mockValidResponse } from '@src/app/testing/mock-response';

@Component({ selector: 'app-cracker-hashtypes-table', template: '' })
class StubCrackerHashtypesTableComponent {
  @Input() crackerBinaryId: number;
  @Input() editable = false;
  @Output() hashtypesRemoved = new EventEmitter<void>();
  reload = jasmine.createSpy('reload');
}

const HASHTYPES = mockValidResponse(zHashTypeListResponse, {
  data: [
    { id: 0, type: 'hashType', attributes: { description: 'MD5', isSalted: false, isSlowHash: false } },
    { id: 100, type: 'hashType', attributes: { description: 'SHA1', isSalted: false, isSlowHash: false } }
  ]
});

function assignedResponse(ids: number[]) {
  return mockValidResponse(zCrackerBinaryRelationHashtypesGetResponse, {
    data: ids.map((id) => ({ type: 'hashType', id }))
  });
}

function httpError(status: number, title?: string) {
  return throwError(() => new HttpErrorResponse({ status, error: title ? { title } : null }));
}

function linkBody(id: number) {
  return { data: [{ type: 'hashType', id }] };
}

describe('CrackerHashtypesComponent', () => {
  let fixture: ComponentFixture<CrackerHashtypesComponent>;
  let component: CrackerHashtypesComponent;
  let gs: jasmine.SpyObj<GlobalService>;
  let alert: jasmine.SpyObj<AlertService>;

  async function setup(inputs: { isHashcat: boolean; canEdit: boolean; canCreateHashtypes?: boolean }): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [CrackerHashtypesComponent],
      providers: [
        { provide: GlobalService, useValue: gs },
        { provide: AlertService, useValue: alert },
        provideRouter([])
      ]
    })
      .overrideComponent(CrackerHashtypesComponent, {
        remove: { imports: [CoreComponentsModule] },
        add: { imports: [StubCrackerHashtypesTableComponent] }
      })
      .compileComponents();
    fixture = TestBed.createComponent(CrackerHashtypesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('crackerBinaryId', 12);
    fixture.componentRef.setInput('isHashcat', inputs.isHashcat);
    fixture.componentRef.setInput('canEdit', inputs.canEdit);
    fixture.componentRef.setInput('canCreateHashtypes', inputs.canCreateHashtypes ?? false);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function el(): HTMLElement {
    return fixture.nativeElement;
  }

  function table(): StubCrackerHashtypesTableComponent {
    return component.table as unknown as StubCrackerHashtypesTableComponent;
  }

  beforeEach(() => {
    gs = jasmine.createSpyObj('GlobalService', ['getAll', 'postRelationships', 'getRelationshipLink', 'create']);
    gs.getRelationshipLink.and.returnValue(of(assignedResponse([1000])));
    gs.getAll.and.returnValue(of(HASHTYPES));
    gs.postRelationships.and.returnValue(of({}));
    gs.create.and.returnValue(of({} as ResponseWrapper));
    alert = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
  });

  describe('hashcat version', () => {
    beforeEach(async () => await setup({ isHashcat: true, canEdit: true }));

    it('explains the scan, offers no add and passes a read-only table', () => {
      expect(el().querySelector('[data-testid="hashcat-scan-note"]')?.textContent).toContain(
        'determined by a background scan of the archive'
      );
      expect(el().querySelector('[data-testid="toggle-add-hashtypes"]')).toBeNull();
      expect(table().editable).toBeFalse();
    });

    it('loads the ids of the assigned hashtypes', () => {
      expect(gs.getRelationshipLink).toHaveBeenCalledWith(SERV.CRACKERS, 12, RelationshipType.HASHTYPES);
      expect(component.assignedHashtypeIds).toEqual([1000]);
      expect(el().querySelector('[data-testid="hashcat-scan-pending"]')).toBeNull();
    });
  });

  describe('hashcat version without hashtypes', () => {
    beforeEach(async () => {
      gs.getRelationshipLink.and.returnValue(of(assignedResponse([])));
      await setup({ isHashcat: true, canEdit: true });
    });

    it('points to the background jobs', () => {
      const note = el().querySelector('[data-testid="hashcat-scan-pending"]');
      expect(note?.textContent).toContain('No hashtypes yet.');
      expect(note?.querySelector('a')?.getAttribute('href')).toBe('/config/background-jobs');
    });
  });

  describe('generic version with update role', () => {
    beforeEach(async () => await setup({ isHashcat: false, canEdit: true }));

    it('passes an editable table and shows no scan note', () => {
      expect(table().editable).toBeTrue();
      expect(el().querySelector('[data-testid="hashcat-scan-note"]')).toBeNull();
    });

    it('offers the hashtypes which are not assigned yet', async () => {
      component.toggleAddForm();
      await fixture.whenStable();

      const [serviceConfig, params] = gs.getAll.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.HASHTYPES);
      expect((params as RequestParams).filter).toEqual([{ field: 'id', operator: FilterType.NOTIN, value: [1000] }]);
      expect(component.selectHashtypes.map((option) => option.id)).toEqual([0, 100]);
    });

    it('adds the selected hashtypes and reloads the table', async () => {
      component.toggleAddForm();
      await fixture.whenStable();
      component.addForm.controls.hashtypeIds.setValue([0, 100]);

      await component.onAdd();

      expect(gs.postRelationships).toHaveBeenCalledWith(SERV.CRACKERS, 12, RelationshipType.HASHTYPES, {
        data: [
          { type: 'hashType', id: 0 },
          { type: 'hashType', id: 100 }
        ]
      });
      expect(alert.showSuccessMessage).toHaveBeenCalledWith('Added 2 hashtypes');
      expect(component.showAddForm).toBeFalse();
      expect(component.addForm.controls.hashtypeIds.value).toEqual([]);
      expect(table().reload).toHaveBeenCalled();
      expect(gs.getRelationshipLink).toHaveBeenCalledTimes(2);
    });

    it('reloads the assigned ids after the table removed hashtypes', async () => {
      gs.getRelationshipLink.and.returnValue(of(assignedResponse([])));

      table().hashtypesRemoved.emit();
      await fixture.whenStable();

      expect(component.assignedHashtypeIds).toEqual([]);
    });

    it('sends nothing without a selection', async () => {
      await component.onAdd();
      expect(gs.postRelationships).not.toHaveBeenCalled();
    });
  });

  describe('generic version without update role', () => {
    beforeEach(async () => await setup({ isHashcat: false, canEdit: false }));

    it('is read-only', () => {
      expect(el().querySelector('[data-testid="toggle-add-hashtypes"]')).toBeNull();
      expect(table().editable).toBeFalse();
    });
  });

  describe('new hashtype form', () => {
    function toggleCreate(): HTMLElement | null {
      return el().querySelector('[data-testid="toggle-create-hashtype"]');
    }

    it('is offered for generic versions with update role and create permission', async () => {
      await setup({ isHashcat: false, canEdit: true, canCreateHashtypes: true });
      expect(toggleCreate()).not.toBeNull();
      expect(el().querySelector('[data-testid="create-hashtype-form"]')).toBeNull();
    });

    it('is hidden without the create permission', async () => {
      await setup({ isHashcat: false, canEdit: true, canCreateHashtypes: false });
      expect(toggleCreate()).toBeNull();
    });

    it('is hidden without the update role', async () => {
      await setup({ isHashcat: false, canEdit: false, canCreateHashtypes: true });
      expect(toggleCreate()).toBeNull();
    });

    it('is hidden for hashcat versions', async () => {
      await setup({ isHashcat: true, canEdit: true, canCreateHashtypes: true });
      expect(toggleCreate()).toBeNull();
    });

    it('opens the create form and closes the add form', async () => {
      await setup({ isHashcat: false, canEdit: true, canCreateHashtypes: true });
      component.toggleAddForm();
      component.toggleCreateForm();
      fixture.detectChanges();

      expect(component.showCreateForm).toBeTrue();
      expect(component.showAddForm).toBeFalse();
      expect(el().querySelector('[data-testid="create-hashtype-form"]')).not.toBeNull();
    });

    it('closes the create form when the add form opens', async () => {
      await setup({ isHashcat: false, canEdit: true, canCreateHashtypes: true });
      component.toggleCreateForm();
      component.toggleAddForm();

      expect(component.showAddForm).toBeTrue();
      expect(component.showCreateForm).toBeFalse();
    });
  });

  describe('creating a hashtype', () => {
    beforeEach(async () => {
      await setup({ isHashcat: false, canEdit: true, canCreateHashtypes: true });
      component.toggleCreateForm();
      gs.getRelationshipLink.calls.reset();
    });

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

    function skipsErrorDialog(options: { headers?: HttpHeaders } | undefined): boolean {
      return options?.headers?.get('X-Skip-Error-Dialog') === 'true';
    }

    function expectReloadedAndClosed(): void {
      expect(component.showCreateForm).toBeFalse();
      expect(component.createForm.controls.hashTypeId.value).toBeNull();
      expect(component.createForm.controls.description.value).toBe('');
      expect(table().reload).toHaveBeenCalled();
      expect(gs.getRelationshipLink).toHaveBeenCalledTimes(1);
    }

    it('rejects an empty mode', async () => {
      fill({ hashTypeId: null, description: 'Custom' });
      await component.onCreate();
      expect(gs.postRelationships).not.toHaveBeenCalled();
      expect(component.createForm.controls.hashTypeId.touched).toBeTrue();
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

    it('does not send a mode which is already assigned', async () => {
      fill({ hashTypeId: 1000, description: 'Custom' });
      await component.onCreate();
      expect(gs.postRelationships).not.toHaveBeenCalled();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Hashtype 1000 is already assigned to this version.');
    });

    it('adds an existing mode without creating it', async () => {
      fill({ hashTypeId: 100, description: 'My SHA1' });
      await component.onCreate();

      const [serviceConfig, id, relType, body, options] = gs.postRelationships.calls.argsFor(0);
      expect(serviceConfig).toEqual(SERV.CRACKERS);
      expect(id).toBe(12);
      expect(relType).toBe(RelationshipType.HASHTYPES);
      expect(body).toEqual(linkBody(100));
      expect(skipsErrorDialog(options)).toBeTrue();
      expect(gs.create).not.toHaveBeenCalled();
      expect(alert.showSuccessMessage).toHaveBeenCalledWith(
        'Hashtype 100 already existed and was added to this version. Its existing description was kept.'
      );
      expectReloadedAndClosed();
    });

    it('links mode 0', async () => {
      fill({ hashTypeId: 0, description: 'MD5' });
      await component.onCreate();
      expect(gs.postRelationships.calls.argsFor(0)[3]).toEqual(linkBody(0));
      expect(alert.showSuccessMessage).toHaveBeenCalledWith(
        'Hashtype 0 already existed and was added to this version. Its existing description was kept.'
      );
    });

    it('creates a missing mode and adds it', async () => {
      gs.postRelationships.and.returnValues(httpError(404), of({}));
      fill({ hashTypeId: 99000, description: 'My custom hash', isSalted: true });
      await component.onCreate();

      const [serviceConfig, item, options] = gs.create.calls.argsFor(0);
      expect(serviceConfig).toEqual(SERV.HASHTYPES);
      expect(item).toEqual({ hashTypeId: 99000, description: 'My custom hash', isSalted: true, isSlowHash: false });
      expect(skipsErrorDialog(options)).toBeTrue();
      expect(gs.postRelationships).toHaveBeenCalledTimes(2);
      expect(gs.postRelationships.calls.argsFor(1)[3]).toEqual(linkBody(99000));
      expect(skipsErrorDialog(gs.postRelationships.calls.argsFor(1)[4])).toBeTrue();
      expect(alert.showSuccessMessage).toHaveBeenCalledWith(
        'Created hashtype 99000 (My custom hash) and added it to this version.'
      );
      expect(alert.showErrorMessage).not.toHaveBeenCalled();
      expectReloadedAndClosed();
    });

    it('sends the description trimmed', async () => {
      gs.postRelationships.and.returnValues(httpError(404), of({}));
      fill({ hashTypeId: 99000, description: '  My custom hash  ' });
      await component.onCreate();
      expect((gs.create.calls.argsFor(0)[1] as { description: string }).description).toBe('My custom hash');
    });

    it('reports a mode which was assigned in between', async () => {
      gs.postRelationships.and.returnValue(httpError(409, 'Relation already exists'));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(gs.create).not.toHaveBeenCalled();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Hashtype 99000 is already assigned to this version.');
      expectReloadedAndClosed();
    });

    it('relies on the backend while the assigned ids are loading', async () => {
      component.assignedHashtypeIds = null;
      gs.postRelationships.and.returnValue(httpError(409));
      fill({ hashTypeId: 1000, description: 'Custom' });
      await component.onCreate();
      expect(gs.postRelationships).toHaveBeenCalledTimes(1);
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Hashtype 1000 is already assigned to this version.');
    });

    it('stops when the first link fails otherwise', async () => {
      gs.postRelationships.and.returnValue(httpError(403, 'No access to this object!'));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(gs.create).not.toHaveBeenCalled();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('No access to this object!');
      expect(component.showCreateForm).toBeTrue();
      expect(component.createForm.controls.hashTypeId.value).toBe(99000);
      expect(table().reload).not.toHaveBeenCalled();
    });

    it('falls back without a backend title', async () => {
      gs.postRelationships.and.returnValue(httpError(500));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Failed to add hashtype 99000.');
    });

    it('falls back for a non-HTTP error', async () => {
      gs.postRelationships.and.returnValue(throwError(() => new TypeError('boom')));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Failed to add hashtype 99000.');
    });

    it('stops when the create fails', async () => {
      gs.postRelationships.and.returnValue(httpError(404));
      gs.create.and.returnValue(httpError(400, 'This hash number is already used!'));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(gs.postRelationships).toHaveBeenCalledTimes(1);
      expect(alert.showErrorMessage).toHaveBeenCalledWith('This hash number is already used!');
      expect(component.showCreateForm).toBeTrue();
      expect(component.createForm.controls.description.value).toBe('My custom hash');
    });

    it('falls back without a title when the create fails', async () => {
      gs.postRelationships.and.returnValue(httpError(404));
      gs.create.and.returnValue(httpError(500));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();
      expect(alert.showErrorMessage).toHaveBeenCalledWith('Failed to create hashtype 99000.');
    });

    it('reports a created hashtype which could not be added, and adds it on the next submit', async () => {
      gs.postRelationships.and.returnValues(httpError(404), httpError(500, 'Database error'), of({}));
      fill({ hashTypeId: 99000, description: 'My custom hash' });
      await component.onCreate();

      expect(alert.showErrorMessage).toHaveBeenCalledWith(
        'Hashtype 99000 was created, but could not be added to this version: Database error. Submit again to add it.'
      );
      expect(component.showCreateForm).toBeTrue();
      expect(table().reload).not.toHaveBeenCalled();

      await component.onCreate();
      expect(gs.create).toHaveBeenCalledTimes(1);
      expect(alert.showSuccessMessage).toHaveBeenCalledWith(
        'Hashtype 99000 already existed and was added to this version. Its existing description was kept.'
      );
      expectReloadedAndClosed();
    });

    it('uses "unknown error" when the second link has no title', async () => {
      gs.postRelationships.and.returnValues(httpError(404), httpError(500));
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
      expect(component.isCreating).toBeFalse();
    });
  });
});
