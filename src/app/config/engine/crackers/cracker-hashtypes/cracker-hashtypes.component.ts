import { zCrackerBinaryRelationHashtypesGetResponse, zHashTypeListResponse } from '@generated/api/zod';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { JHashtype } from '@models/hashtype.model';
import { CrackerBinaryId, HashTypeId } from '@models/id.types';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';

import { CoreComponentsModule } from '@components/core-components.module';
import { CrackerHashtypesTableComponent } from '@components/tables/cracker-hashtypes-table/cracker-hashtypes-table.component';

import { HASHTYPE_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

/**
 * Supported hashtypes of a cracker version on its edit page. The hashtypes of hashcat versions are determined by
 * the background scan and read-only, generic versions get them added and removed here, applied immediately.
 */
@Component({
  selector: 'app-cracker-hashtypes',
  imports: [
    ButtonsModule,
    ComponentsModule,
    CoreComponentsModule,
    InputModule,
    MatProgressSpinnerModule,
    PageTitleModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './cracker-hashtypes.component.html'
})
export class CrackerHashtypesComponent implements OnInit {
  @Input({ required: true }) crackerBinaryId: CrackerBinaryId;
  @Input() isHashcat = false;
  @Input() canEdit = false;

  @ViewChild('hashtypesTable') table?: CrackerHashtypesTableComponent;

  /** Ids of all assigned hashtypes (the table only holds one page), null until they are loaded */
  assignedHashtypeIds: HashTypeId[] | null = null;
  selectHashtypes: SelectOption<HashTypeId>[] = [];
  showAddForm = false;
  isLoadingOptions = false;
  isAdding = false;

  addForm = new FormGroup({
    hashtypeIds: new FormControl<HashTypeId[]>([], { nonNullable: true })
  });

  private gs = inject(GlobalService);
  private alert = inject(AlertService);

  /** Generic versions with the update role can change their hashtypes */
  get editable(): boolean {
    return this.canEdit && !this.isHashcat;
  }

  ngOnInit(): void {
    void this.loadAssignedHashtypeIds();
  }

  /** Refresh the assigned ids (and the add options) after the table removed hashtypes */
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
      if (this.showAddForm) {
        await this.loadHashtypeOptions();
      }
    } catch (error) {
      // the global HTTP error dialog shows the reason
      console.error('Failed to load the hashtypes of the cracker version', error);
    }
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      void this.loadHashtypeOptions();
    }
  }

  /** Load all hashtypes which are not assigned yet as select options */
  async loadHashtypeOptions(): Promise<void> {
    this.isLoadingOptions = true;
    try {
      const builder = new RequestParamBuilder();
      const assigned = this.assignedHashtypeIds ?? [];
      if (assigned.length > 0) {
        builder.addFilter({ field: 'id', operator: FilterType.NOTIN, value: assigned });
      }
      const response: ResponseWrapper = await lastValueFrom(this.gs.getAll(SERV.HASHTYPES, builder.create()));
      const hashtypes: JHashtype[] = new JsonAPISerializer().deserialize(response, zHashTypeListResponse);
      this.selectHashtypes = transformSelectOptions(hashtypes, HASHTYPE_FIELD_MAPPING);
    } catch (error) {
      // the global HTTP error dialog shows the reason
      console.error('Failed to load hashtypes', error);
    } finally {
      this.isLoadingOptions = false;
    }
  }

  /** Assign the selected hashtypes to the cracker version */
  async onAdd(): Promise<void> {
    const ids = this.addForm.controls.hashtypeIds.value;
    if (ids.length === 0 || this.isAdding) {
      return;
    }
    this.isAdding = true;
    try {
      await firstValueFrom(
        this.gs.postRelationships(SERV.CRACKERS, this.crackerBinaryId, RelationshipType.HASHTYPES, {
          data: ids.map((id) => ({ type: 'hashType', id }))
        })
      );
      this.alert.showSuccessMessage(`Added ${ids.length} hashtype${ids.length > 1 ? 's' : ''}`);
      this.addForm.controls.hashtypeIds.reset([]);
      this.showAddForm = false;
      this.table?.reload();
      void this.loadAssignedHashtypeIds();
    } catch (error) {
      // the global HTTP error dialog shows the reason
      console.error('Failed to add hashtypes', error);
    } finally {
      this.isAdding = false;
    }
  }
}
