import { HttpStatus } from '@constants/http.config';
import { zSupertaskResponse } from '@generated/api/zod';
import { finalize } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CrackerBinaryTypeId } from '@models/id.types';
import { JPretask } from '@models/pretask.model';
import { ResponseWrapper } from '@models/response.model';
import { zIdRouteParams } from '@models/routes.schema';
import { JSuperTask } from '@models/supertask.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { CrackerBinaryTypesService, fallbackCrackerTypeName } from '@services/crackers/cracker-binary-types.service';
import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { PretasksTableComponent } from '@components/tables/pretasks-table/pretasks-table.component';

@Component({
  selector: 'app-edit-supertasks',
  templateUrl: './edit-supertasks.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class EditSupertasksComponent implements OnInit {
  /** Flag indicating whether the supertask name is currently being updated. */
  isUpdatingSupertask = false;

  viewForm: FormGroup; //Supertask details

  // Edit
  private _editedSTIndex: number;
  @Input()
  set editedSTIndex(value: number) {
    if (value !== this._editedSTIndex) {
      this._editedSTIndex = value;
    }
  }
  get editedSTIndex(): number {
    if (this._editedSTIndex === undefined) {
      return 0;
    } else {
      return this._editedSTIndex;
    }
  }

  editName = '';

  /** Cracker binary type of the supertask, null until it is loaded; only pretasks of this type can be added */
  crackerBinaryTypeId: CrackerBinaryTypeId | null = null;

  @ViewChild('superTasksPretasksTable') superTasksPretasksTable: PretasksTableComponent;
  @ViewChild('superTasksPretaskNotContainedTable') superTasksPretasksNotContainedTable: PretasksTableComponent;

  private destroyRef = inject(DestroyRef);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private titleService = inject(AutoTitleService);
  private route = inject(ActivatedRoute);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);
  private serializer = inject(JsonAPISerializer);
  private confirmDialog = inject(ConfirmDialogService);
  protected roleService = inject(SupertasksRoleService);
  private crackerBinaryTypes = inject(CrackerBinaryTypesService);

  constructor() {
    this.buildForm();
    this.titleService.set(['Edit Supertasks']);
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.editedSTIndex = zIdRouteParams.parse(this.route.snapshot.params).id;
    this.loadData();
  }

  /**
   * Builds the form for creating a new Superhashlist.
   */
  buildForm(): void {
    // Form details
    const canEdit = this.roleService.hasRole('edit');
    this.viewForm = new FormGroup({
      supertaskId: new FormControl({ value: '', disabled: true }),
      supertaskName: new FormControl({ value: '', disabled: !canEdit }, canEdit ? [Validators.required] : []),
      crackerBinaryType: new FormControl({ value: '', disabled: true })
    });
  }

  /**
   * Loads the supertask. Used when the page opens and after renaming; the pretask tables load their own data.
   */
  loadData(): void {
    this.gs
      .get(SERV.SUPER_TASKS, this.editedSTIndex)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ResponseWrapper) => {
          const supertask: JSuperTask = this.serializer.deserialize(response, zSupertaskResponse);
          this.applySupertask(supertask);
        },
        error: (err: unknown) => {
          const status = err instanceof HttpErrorResponse ? err.status : undefined;
          if (status === HttpStatus.FORBIDDEN) {
            this.router.navigateByUrl('/forbidden');
            return;
          }
          if (status === HttpStatus.NOT_FOUND) {
            this.router.navigateByUrl('/not-found');
            return;
          }

          // For any other errors show a friendly message

          console.error('Error loading supertask:', err);
          const msg = status ? `Error loading supertask (server returned ${status}).` : 'Error loading supertask.';
          this.alert.showErrorMessage(msg);
        }
      });
  }

  /**
   * Shows the loaded supertask: name form, read-only cracker type (name resolved asynchronously) and the type the
   * pretask tables are limited to.
   */
  private applySupertask(supertask: JSuperTask): void {
    this.editName = supertask.supertaskName;
    this.crackerBinaryTypeId = supertask.crackerBinaryTypeId;
    const canEdit = this.roleService.hasRole('edit');
    this.viewForm = new FormGroup({
      supertaskId: new FormControl({ value: supertask.id, disabled: true }),
      supertaskName: new FormControl(
        { value: supertask.supertaskName, disabled: !canEdit },
        canEdit ? [Validators.required] : []
      ),
      crackerBinaryType: new FormControl({
        value: fallbackCrackerTypeName(supertask.crackerBinaryTypeId),
        disabled: true
      })
    });
    this.crackerBinaryTypes
      .getTypeName(supertask.crackerBinaryTypeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((name) => {
        this.viewForm.get('crackerBinaryType')?.setValue(name);
        this.changeDetectorRef.detectChanges();
      });
  }

  /**
   * Renames the supertask and reloads it on this page.
   */
  onUpdate(): void {
    const nameControl = this.viewForm.get('supertaskName');
    if (!nameControl || nameControl.invalid) {
      nameControl?.markAsTouched();
      return;
    }

    this.isUpdatingSupertask = true;
    this.gs
      .update(SERV.SUPER_TASKS, this.editedSTIndex, { supertaskName: nameControl.value })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.isUpdatingSupertask = false))
      )
      .subscribe({
        next: () => {
          this.alert.showSuccessMessage('Supertask data has been updated successfully');
          this.loadData();
        },
        error: (err: unknown) => {
          console.error('Error updating Supertask:', err);
          this.alert.showErrorMessage(`Error updating Supertask`);
        }
      });
  }

  /**
   * Handle add-pretask requests coming from PretasksTableComponent.
   * Posts multiple relationships and refreshes the UI.
   */
  onPretaskAdd(pretasks: JPretask[]): void {
    if (!pretasks?.length || !this.editedSTIndex) return;

    const body = {
      data: pretasks.map((pretask) => ({
        type: RelationshipType.PRETASKS,
        id: pretask.id
      }))
    };

    this.gs
      .postRelationships(SERV.SUPER_TASKS, this.editedSTIndex, RelationshipType.PRETASKS, body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alert.showSuccessMessage(`${pretasks.length} pretask(s) added to Supertask`);
          this.onPretaskChanged();
        },
        error: (err) => {
          this.alert.showErrorMessage('Failed to add pretask(s).');
          console.error('Failed to add pretasks:', err);
        }
      });
  }

  onPretaskChanged(): void {
    try {
      this.superTasksPretasksTable?.reload();
      this.superTasksPretasksNotContainedTable?.reload();
    } catch {
      // silent if viewchild not present yet
    }
  }

  /**
   * Handles the deletion of a super task. Displays a confirmation dialog,
   * and if confirmed, triggers the deletion of the super task.
   * Navigates to the super tasks page after successful deletion.
   */
  onDelete() {
    this.confirmDialog
      .confirmDeletion('Supertask', this.editName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.gs
            .delete(SERV.SUPER_TASKS, this.editedSTIndex)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.router
                .navigate(['/tasks/supertasks'])
                .then(() => this.alert.showSuccessMessage(`Succesfully deleted Supertask: ${this.editedSTIndex}`));
            });
        }
      });
  }
}
