import { zCrackerBinaryRelationHashtypesGetResponse } from '@generated/api/zod';
import { firstValueFrom } from 'rxjs';

import { Component, DestroyRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { CrackerBinaryId, HashTypeId } from '@models/id.types';

import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';

import { CoreComponentsModule } from '@components/core-components.module';
import { CrackerHashtypesTableComponent } from '@components/tables/cracker-hashtypes-table/cracker-hashtypes-table.component';

import {
  AddCrackerHashtypesDialogComponent,
  AddCrackerHashtypesDialogData
} from '@src/app/config/engine/crackers/cracker-hashtypes/add-cracker-hashtypes-dialog/add-cracker-hashtypes-dialog.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';

/**
 * Supported hashtypes of a cracker version on its edit page. The hashtypes of hashcat versions are determined by
 * the background scan and read-only, generic versions get them added (in a dialog) and removed here, applied
 * immediately.
 */
@Component({
  selector: 'app-cracker-hashtypes',
  imports: [ButtonsModule, ComponentsModule, CoreComponentsModule, PageTitleModule, RouterModule],
  templateUrl: './cracker-hashtypes.component.html'
})
export class CrackerHashtypesComponent implements OnInit {
  @Input({ required: true }) crackerBinaryId: CrackerBinaryId;
  @Input() isHashcat = false;
  @Input() canEdit = false;
  @Input() canCreateHashtypes = false;

  @ViewChild('hashtypesTable') table?: CrackerHashtypesTableComponent;

  /** Ids of all assigned hashtypes (the table only holds one page), null until they are loaded */
  assignedHashtypeIds: HashTypeId[] | null = null;

  private gs = inject(GlobalService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  /** Generic versions with the update role can change their hashtypes */
  get editable(): boolean {
    return this.canEdit && !this.isHashcat;
  }

  ngOnInit(): void {
    void this.loadAssignedHashtypeIds();
  }

  /** Refresh the assigned ids after the table removed hashtypes */
  onHashtypesRemoved(): void {
    void this.loadAssignedHashtypeIds();
  }

  /** Load the ids of all assigned hashtypes, they are excluded from the add options */
  async loadAssignedHashtypeIds(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.gs.getRelationshipLink(SERV.CRACKERS, this.crackerBinaryId, RelationshipType.HASHTYPES)
      );
      this.assignedHashtypeIds = zCrackerBinaryRelationHashtypesGetResponse
        .parse(response)
        .data.map((hashtype) => hashtype.id);
    } catch (error) {
      // the global HTTP error dialog shows the reason
      console.error('Failed to load the hashtypes of the cracker version', error);
    }
  }

  /** Open the add dialog, refresh the table and the assigned ids once the version got new hashtypes */
  openAddDialog(): void {
    this.dialog
      .open<AddCrackerHashtypesDialogComponent, AddCrackerHashtypesDialogData, boolean>(
        AddCrackerHashtypesDialogComponent,
        {
          width: '640px',
          // focusing the first field would open the hashtype options over the dialog actions
          autoFocus: 'dialog',
          data: {
            crackerBinaryId: this.crackerBinaryId,
            assignedHashtypeIds: this.assignedHashtypeIds,
            canCreate: this.canCreateHashtypes
          }
        }
      )
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((changed) => {
        if (changed) {
          this.table?.reload();
          void this.loadAssignedHashtypeIds();
        }
      });
  }
}
