import { zCrackerBinaryRelationHashtypesGetResponse, zHashTypeListResponse } from '@generated/api/zod';
import { of } from 'rxjs';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FilterType, RequestParams } from '@models/request-params.model';

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

describe('CrackerHashtypesComponent', () => {
  let fixture: ComponentFixture<CrackerHashtypesComponent>;
  let component: CrackerHashtypesComponent;
  let gs: jasmine.SpyObj<GlobalService>;
  let alert: jasmine.SpyObj<AlertService>;

  async function setup(inputs: { isHashcat: boolean; canEdit: boolean }): Promise<void> {
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
    gs = jasmine.createSpyObj('GlobalService', ['getAll', 'postRelationships', 'getRelationshipLink']);
    gs.getRelationshipLink.and.returnValue(of(assignedResponse([1000])));
    gs.getAll.and.returnValue(of(HASHTYPES));
    gs.postRelationships.and.returnValue(of({}));
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
});
