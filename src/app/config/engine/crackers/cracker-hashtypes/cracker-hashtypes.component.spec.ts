import { zCrackerBinaryRelationHashtypesGetResponse } from '@generated/api/zod';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';

import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';

import { CoreComponentsModule } from '@components/core-components.module';

import {
  AddCrackerHashtypesDialogComponent,
  AddCrackerHashtypesDialogData
} from '@src/app/config/engine/crackers/cracker-hashtypes/add-cracker-hashtypes-dialog/add-cracker-hashtypes-dialog.component';
import { CrackerHashtypesComponent } from '@src/app/config/engine/crackers/cracker-hashtypes/cracker-hashtypes.component';
import { mockValidResponse } from '@src/app/testing/mock-response';

@Component({ selector: 'app-cracker-hashtypes-table', template: '' })
class StubCrackerHashtypesTableComponent {
  @Input()
  crackerBinaryId: number;
  @Input()
  editable = false;
  @Output()
  hashtypesRemoved = new EventEmitter<void>();
  reload = vi.fn().mockName('reload');
}

function assignedResponse(ids: number[]) {
  return mockValidResponse(zCrackerBinaryRelationHashtypesGetResponse, {
    data: ids.map((id) => ({ type: 'hashType', id }))
  });
}

describe('CrackerHashtypesComponent', () => {
  let fixture: ComponentFixture<CrackerHashtypesComponent>;
  let component: CrackerHashtypesComponent;
  let gs: MockedObject<GlobalService>;
  let dialog: MockedObject<MatDialog>;
  /** Result the add dialog closes with */
  let dialogResult: boolean | undefined;

  async function setup(inputs: { isHashcat: boolean; canEdit: boolean; canCreateHashtypes?: boolean }): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [CrackerHashtypesComponent],
      providers: [{ provide: GlobalService, useValue: gs }, provideRouter([])]
    })
      // the imported modules provide their own MatDialog, the override replaces it on every level
      .overrideProvider(MatDialog, { useValue: dialog })
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

  function openButton(): HTMLElement | null {
    return el().querySelector('[data-testid="open-add-hashtypes"]');
  }

  function table(): StubCrackerHashtypesTableComponent {
    return component.table as unknown as StubCrackerHashtypesTableComponent;
  }

  beforeEach(() => {
    gs = {
      getRelationshipLink: vi.fn().mockName('GlobalService.getRelationshipLink')
    } as MockedObject<GlobalService>;
    gs.getRelationshipLink.mockReturnValue(of(assignedResponse([1000])));
    dialogResult = true;
    dialog = {
      open: vi.fn().mockName('MatDialog.open')
    } as MockedObject<MatDialog>;
    dialog.open.mockImplementation(
      () => ({ afterClosed: () => of(dialogResult) }) as MatDialogRef<AddCrackerHashtypesDialogComponent, boolean>
    );
  });

  describe('hashcat version', () => {
    beforeEach(async () => await setup({ isHashcat: true, canEdit: true }));

    it('explains the scan, offers no add and passes a read-only table', () => {
      expect(el().querySelector('[data-testid="hashcat-scan-note"]')?.textContent).toContain(
        'determined by a background scan of the archive'
      );
      expect(openButton()).toBeNull();
      expect(table().editable).toBe(false);
    });

    it('loads the ids of the assigned hashtypes', () => {
      expect(gs.getRelationshipLink).toHaveBeenCalledWith(SERV.CRACKERS, 12, RelationshipType.HASHTYPES);
      expect(component.assignedHashtypeIds).toEqual([1000]);
      expect(el().querySelector('[data-testid="hashcat-scan-pending"]')).toBeNull();
    });
  });

  describe('hashcat version without hashtypes', () => {
    beforeEach(async () => {
      gs.getRelationshipLink.mockReturnValue(of(assignedResponse([])));
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
      expect(table().editable).toBe(true);
      expect(el().querySelector('[data-testid="hashcat-scan-note"]')).toBeNull();
    });

    it('opens the add dialog with the version, the assigned ids and the create permission', () => {
      openButton()?.click();

      const [dialogComponent, config] = dialog.open.mock.lastCall!;
      expect(dialogComponent).toBe(AddCrackerHashtypesDialogComponent);
      expect(config?.data).toEqual({ crackerBinaryId: 12, assignedHashtypeIds: [1000], canCreate: false });
    });

    it('focuses the dialog itself, so the hashtype search does not open its options over the actions', () => {
      component.openAddDialog();
      expect(dialog.open.mock.lastCall![1]?.autoFocus).toBe('dialog');
    });

    it('reloads the table and the assigned ids after hashtypes were added', async () => {
      gs.getRelationshipLink.mockReturnValue(of(assignedResponse([0, 1000])));

      component.openAddDialog();
      await fixture.whenStable();

      expect(table().reload).toHaveBeenCalled();
      expect(component.assignedHashtypeIds).toEqual([0, 1000]);
    });

    it('reloads nothing when the dialog was cancelled', () => {
      dialogResult = undefined;
      gs.getRelationshipLink.mockClear();

      component.openAddDialog();

      expect(table().reload).not.toHaveBeenCalled();
      expect(gs.getRelationshipLink).not.toHaveBeenCalled();
    });

    it('reloads the assigned ids after the table removed hashtypes', async () => {
      gs.getRelationshipLink.mockReturnValue(of(assignedResponse([])));

      table().hashtypesRemoved.emit();
      await fixture.whenStable();

      expect(component.assignedHashtypeIds).toEqual([]);
    });
  });

  describe('generic version with update role and create permission', () => {
    beforeEach(async () => await setup({ isHashcat: false, canEdit: true, canCreateHashtypes: true }));

    it('lets the dialog create hashtypes', () => {
      component.openAddDialog();
      expect((dialog.open.mock.lastCall![1]?.data as AddCrackerHashtypesDialogData).canCreate).toBe(true);
    });
  });

  describe('generic version without update role', () => {
    beforeEach(async () => await setup({ isHashcat: false, canEdit: false, canCreateHashtypes: true }));

    it('is read-only', () => {
      expect(openButton()).toBeNull();
      expect(table().editable).toBe(false);
    });
  });
});
