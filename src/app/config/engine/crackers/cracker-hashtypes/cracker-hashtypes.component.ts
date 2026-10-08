import { HTTP_SKIP_ERROR_HEADER_CONFIG, HttpStatus } from '@constants/http.config';
import { zCrackerBinaryRelationHashtypesGetResponse, zHashTypeListResponse } from '@generated/api/zod';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

/** Message of a backend error, null if the error has none */
function backendErrorTitle(error: unknown): string | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }
  const title = (error.error as { title?: unknown } | null)?.title;
  return typeof title === 'string' && title.length > 0 ? title : null;
}

function hasStatus(error: unknown, status: number): boolean {
  return error instanceof HttpErrorResponse && error.status === status;
}

/**
 * Supported hashtypes of a cracker version on its edit page. The hashtypes of hashcat versions are determined by
 * the background scan and read-only, generic versions get them added, created and removed here, applied immediately.
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
  @Input() canCreateHashtypes = false;

  @ViewChild('hashtypesTable') table?: CrackerHashtypesTableComponent;

  /** Ids of all assigned hashtypes (the table only holds one page), null until they are loaded */
  assignedHashtypeIds: HashTypeId[] | null = null;
  selectHashtypes: SelectOption<HashTypeId>[] = [];
  showAddForm = false;
  isLoadingOptions = false;
  isAdding = false;
  showCreateForm = false;
  isCreating = false;

  addForm = new FormGroup({
    hashtypeIds: new FormControl<HashTypeId[]>([], { nonNullable: true })
  });

  /** New hashtype: the mode is an integer of 0 or more, the description must contain a non-space character */
  createForm = new FormGroup({
    hashTypeId: new FormControl<number | null>(null, [Validators.required, Validators.pattern(/^\d+$/)]),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)]
    }),
    isSalted: new FormControl(false, { nonNullable: true }),
    isSlowHash: new FormControl(false, { nonNullable: true })
  });

  private gs = inject(GlobalService);
  private alert = inject(AlertService);

  /** The create flow shows its own messages, expected 404 and 409 responses must not open the error dialog */
  private readonly skipErrorDialog = { headers: new HttpHeaders(HTTP_SKIP_ERROR_HEADER_CONFIG) };

  /** Generic versions with the update role can change their hashtypes */
  get editable(): boolean {
    return this.canEdit && !this.isHashcat;
  }

  /** Generic versions with the update role, for users who may also create hashtypes */
  get canCreate(): boolean {
    return this.editable && this.canCreateHashtypes;
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
      this.showCreateForm = false;
      void this.loadHashtypeOptions();
    }
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (this.showCreateForm) {
      this.showAddForm = false;
    }
  }

  /**
   * Link the entered mode to the cracker version, creating it first if it does not exist yet. The link is tried
   * first, so an existing mode (also one invisible to the user) is added without being created, and a hashtype
   * created by a submit whose link failed is added by the next submit.
   */
  async onCreate(): Promise<void> {
    if (this.isCreating) {
      return;
    }
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    const { hashTypeId, isSalted, isSlowHash } = this.createForm.getRawValue();
    const mode = hashTypeId as HashTypeId;
    const description = this.createForm.controls.description.value.trim();

    if (this.assignedHashtypeIds?.includes(mode)) {
      this.alert.showErrorMessage(`Hashtype ${mode} is already assigned to this version.`);
      return;
    }

    this.isCreating = true;
    try {
      try {
        await this.linkHashtype(mode);
        this.alert.showSuccessMessage(
          `Hashtype ${mode} already existed and was added to this version. Its existing description was kept.`
        );
        this.onHashtypeLinked();
        return;
      } catch (error) {
        if (hasStatus(error, HttpStatus.CONFLICT)) {
          this.alert.showErrorMessage(`Hashtype ${mode} is already assigned to this version.`);
          this.onHashtypeLinked();
          return;
        }
        if (!hasStatus(error, HttpStatus.NOT_FOUND)) {
          console.error('Failed to add the hashtype', error);
          this.alert.showErrorMessage(backendErrorTitle(error) ?? `Failed to add hashtype ${mode}.`);
          return;
        }
      }

      try {
        await firstValueFrom(
          this.gs.create(SERV.HASHTYPES, { hashTypeId: mode, description, isSalted, isSlowHash }, this.skipErrorDialog)
        );
      } catch (error) {
        console.error('Failed to create the hashtype', error);
        this.alert.showErrorMessage(backendErrorTitle(error) ?? `Failed to create hashtype ${mode}.`);
        return;
      }

      try {
        await this.linkHashtype(mode);
      } catch (error) {
        console.error('Failed to add the created hashtype', error);
        const reason = backendErrorTitle(error) ?? 'unknown error';
        this.alert.showErrorMessage(
          `Hashtype ${mode} was created, but could not be added to this version: ${reason}. Submit again to add it.`
        );
        return;
      }
      this.alert.showSuccessMessage(`Created hashtype ${mode} (${description}) and added it to this version.`);
      this.onHashtypeLinked();
    } finally {
      this.isCreating = false;
    }
  }

  private linkHashtype(mode: HashTypeId): Promise<object> {
    return firstValueFrom(
      this.gs.postRelationships(
        SERV.CRACKERS,
        this.crackerBinaryId,
        RelationshipType.HASHTYPES,
        { data: [{ type: 'hashType', id: mode }] },
        this.skipErrorDialog
      )
    );
  }

  /** The version has the mode now: reset and close the form, refresh the table and the assigned ids */
  private onHashtypeLinked(): void {
    this.createForm.reset();
    this.showCreateForm = false;
    this.table?.reload();
    void this.loadAssignedHashtypeIds();
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
