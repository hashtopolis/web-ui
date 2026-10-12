import { HTTP_SKIP_ERROR_HEADER_CONFIG, HttpStatus } from '@constants/http.config';
import { zHashTypeListResponse } from '@generated/api/zod';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { NgTemplateOutlet } from '@angular/common';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { JHashtype } from '@models/hashtype.model';
import { CrackerBinaryId, HashTypeId } from '@models/id.types';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';

import { HASHTYPE_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { InputModule } from '@src/app/shared/input/input.module';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

export interface AddCrackerHashtypesDialogData {
  crackerBinaryId: CrackerBinaryId;
  /** Ids of the hashtypes the version already has, null while they are not loaded */
  assignedHashtypeIds: HashTypeId[] | null;
  /** Whether the user may also create new hashtypes */
  canCreate: boolean;
}

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
 * Adds hashtypes to a generic cracker version: existing ones picked from a list, or a new one created and added in
 * one step. Closes with true once the version has new hashtypes, it stays open on errors so the input is kept.
 */
@Component({
  selector: 'app-add-cracker-hashtypes-dialog',
  imports: [
    InputModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    NgTemplateOutlet,
    ReactiveFormsModule
  ],
  templateUrl: './add-cracker-hashtypes-dialog.component.html'
})
export class AddCrackerHashtypesDialogComponent implements OnInit {
  readonly data = inject<AddCrackerHashtypesDialogData>(MAT_DIALOG_DATA);

  /** 0: existing hashtypes, 1: new hashtype */
  selectedTab = 0;
  selectHashtypes: SelectOption<HashTypeId>[] = [];
  isLoadingOptions = false;
  isAdding = false;
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
  private dialogRef = inject<MatDialogRef<AddCrackerHashtypesDialogComponent, boolean>>(MatDialogRef);

  /** The create flow shows its own messages, expected 404 and 409 responses must not open the error dialog */
  private readonly skipErrorDialog = { headers: new HttpHeaders(HTTP_SKIP_ERROR_HEADER_CONFIG) };

  /** The new hashtype tab is active */
  get isNewTab(): boolean {
    return this.data.canCreate && this.selectedTab === 1;
  }

  ngOnInit(): void {
    void this.loadHashtypeOptions();
  }

  /** Load all hashtypes which are not assigned yet as select options */
  async loadHashtypeOptions(): Promise<void> {
    this.isLoadingOptions = true;
    try {
      const builder = new RequestParamBuilder();
      const assigned = this.data.assignedHashtypeIds ?? [];
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
        this.gs.postRelationships(SERV.CRACKERS, this.data.crackerBinaryId, RelationshipType.HASHTYPES, {
          data: ids.map((id) => ({ type: 'hashType', id }))
        })
      );
      this.alert.showSuccessMessage(`Added ${ids.length} hashtype${ids.length > 1 ? 's' : ''}`);
      this.dialogRef.close(true);
    } catch (error) {
      // the global HTTP error dialog shows the reason
      console.error('Failed to add hashtypes', error);
    } finally {
      this.isAdding = false;
    }
  }

  /**
   * Link the entered mode to the cracker version, creating it first if it does not exist yet. The link is tried
   * first, so an existing mode is added without being created, and a hashtype created by a submit whose link failed
   * is added by the next submit.
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

    if (this.data.assignedHashtypeIds?.includes(mode)) {
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
        this.dialogRef.close(true);
        return;
      } catch (error) {
        if (hasStatus(error, HttpStatus.CONFLICT)) {
          // the assigned ids were stale: close, so the page reloads them
          this.alert.showErrorMessage(`Hashtype ${mode} is already assigned to this version.`);
          this.dialogRef.close(true);
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
      this.dialogRef.close(true);
    } finally {
      this.isCreating = false;
    }
  }

  private linkHashtype(mode: HashTypeId): Promise<object> {
    return firstValueFrom(
      this.gs.postRelationships(
        SERV.CRACKERS,
        this.data.crackerBinaryId,
        RelationshipType.HASHTYPES,
        { data: [{ type: 'hashType', id: mode }] },
        this.skipErrorDialog
      )
    );
  }
}
