import { zPreTaskListResponse, zSupertaskResponse } from '@generated/api/zod';
import { finalize } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, DestroyRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PretaskId } from '@models/id.types';
import { JPretask } from '@models/pretask.model';
import { ResponseWrapper } from '@models/response.model';
import { zIdRouteParams } from '@models/routes.schema';
import { JSuperTask } from '@models/supertask.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { PretasksTableComponent } from '@components/tables/pretasks-table/pretasks-table.component';

import { SUPER_TASK_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

@Component({
  selector: 'app-edit-supertasks',
  templateUrl: './edit-supertasks.component.html',
  standalone: false
})
export class EditSupertasksComponent implements OnInit {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Flag indicating whether the supertask name is currently being updated. */
  isUpdatingSupertask = false;

  /** Form group for the new Supertask. */
  updateForm: FormGroup;
  etForm: FormGroup; //estimation time form
  viewForm: FormGroup; //Supertask details

  /** List of Preconfigured Tasks. */
  selectPretasks: SelectOption<PretaskId>[] | undefined;

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
      supertaskName: new FormControl({ value: '', disabled: !canEdit }, canEdit ? [Validators.required] : [])
    });

    // Form add pretasks
    this.updateForm = new FormGroup({
      pretasks: new FormControl('')
    });

    // Form calculate benchmark
    this.etForm = new FormGroup({
      benchmarka0: new FormControl(0),
      benchmarka3: new FormControl(0)
    });
  }

  /**
   * Loads data, specifically hashlists, for the component.
   */
  loadData(): void {
    const params = new RequestParamBuilder().addInclude('pretasks').create();
    this.gs
      .get(SERV.SUPER_TASKS, this.editedSTIndex, params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ResponseWrapper) => {
          const supertask: JSuperTask = this.serializer.deserialize(response, zSupertaskResponse);
          this.editName = supertask.supertaskName;
          const canEdit = this.roleService.hasRole('edit');
          this.viewForm = new FormGroup({
            supertaskId: new FormControl({
              value: supertask.id,
              disabled: true
            }),
            supertaskName: new FormControl(
              {
                value: supertask.supertaskName,
                disabled: !canEdit
              },
              canEdit ? [Validators.required] : []
            )
          });

          if (this.roleService.hasRole('editSupertaskPreTasks')) {
            this.gs
              .getAll(SERV.PRETASKS)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe((responsePT: ResponseWrapper) => {
                const pretasks: JPretask[] = this.serializer.deserialize(responsePT, zPreTaskListResponse);
                const availablePretasks = this.getAvailablePretasks(supertask.pretasks ?? [], pretasks);

                this.selectPretasks = transformSelectOptions(availablePretasks, SUPER_TASK_FIELD_MAPPING);
                this.isLoading = false;
                this.changeDetectorRef.detectChanges();
              });
          }
        },
        error: (err: unknown) => {
          const status = err instanceof HttpErrorResponse ? err.status : undefined;
          if (status === 403) {
            this.router.navigateByUrl('/forbidden');
            return;
          }
          if (status === 404) {
            this.router.navigateByUrl('/not-found');
            return;
          }

          // For server errors try a fallback request without includes to at least load primary data
          if (err instanceof HttpErrorResponse && status && status >= 500) {
            console.warn('loadData(): request with includes failed, retrying without includes', err);
            this.gs
              .get(SERV.SUPER_TASKS, this.editedSTIndex)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                next: (response2: ResponseWrapper) => {
                  const supertask2: JSuperTask = this.serializer.deserialize(response2, zSupertaskResponse);
                  this.editName = supertask2.supertaskName;
                  const canEdit2 = this.roleService.hasRole('edit');
                  this.viewForm = new FormGroup({
                    supertaskId: new FormControl({ value: supertask2.id, disabled: true }),
                    supertaskName: new FormControl(
                      { value: supertask2.supertaskName, disabled: !canEdit2 },
                      canEdit2 ? [Validators.required] : []
                    )
                  });
                  // still try to load pretasks list for selection
                  this.gs
                    .getAll(SERV.PRETASKS)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((responsePT: ResponseWrapper) => {
                      const pretasks: JPretask[] = this.serializer.deserialize(responsePT, zPreTaskListResponse);
                      const availablePretasks = this.getAvailablePretasks(supertask2.pretasks ?? [], pretasks);
                      this.selectPretasks = transformSelectOptions(availablePretasks, SUPER_TASK_FIELD_MAPPING);
                      this.isLoading = false;
                      this.changeDetectorRef.detectChanges();
                    });
                },
                error: (err2: unknown) => {
                  // Show friendly message for other server errors

                  console.error('Error loading supertask:', err2);
                  const msg =
                    err2 instanceof HttpErrorResponse && err2.status
                      ? `Error loading supertask (server returned ${err2.status}).`
                      : 'Error loading supertask.';
                  this.alert.showErrorMessage(msg);
                  this.isLoading = false;
                }
              });
            return;
          }

          // For any other errors show a friendly message

          console.error('Error loading supertask:', err);
          const msg = status ? `Error loading supertask (server returned ${status}).` : 'Error loading supertask.';
          this.alert.showErrorMessage(msg);
          this.isLoading = false;
        }
      });
  }

  /**
   * Reload data
   *
   */
  refresh(): void {
    this.isLoading = true;
    this.loadData();
  }

  /**
   * Retrieves the available pre-tasks that are not assigned.
   *
   * @param assigning An array of assigned tasks with pre-task information.
   * @param  pretasks An array of all available pre-tasks.
   * @returns An array containing pre-tasks that are not assigned.
   */
  getAvailablePretasks(assigning: JPretask[], pretasks: JPretask[]) {
    // Use filter to find pre-tasks not present in the assigning array
    return pretasks.filter((pretask) => assigning.findIndex((assignedTask) => assignedTask.id === pretask.id) === -1);
  }

  /**
   * Handles the form submission for updating super tasks.
   * Validates the form, concatenates the current and new pre-task values,
   * and updates the super task with the new pre-task payload.
   */
  onSubmit() {
    if (this.updateForm.valid) {
      const pretasks: { type: string; id: number }[] = [];

      (this.updateForm.value['pretasks'] as number[]).forEach((pretask: number) => {
        pretasks.push({ type: RelationshipType.PRETASKS, id: pretask });
      });

      const responseBody = { data: pretasks };

      this.gs
        .postRelationships(SERV.SUPER_TASKS, this.editedSTIndex, RelationshipType.PRETASKS, responseBody)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.alert.showSuccessMessage('Supertask saved');
          this.refresh(); // Reload the Pretask-Select-Component
          this.superTasksPretasksTable.reload(); // reload Supertasks table
        });
    } else {
      this.updateForm.markAllAsTouched();
      this.updateForm.updateValueAndValidity();
    }
  }

  /**
   * Handles updating the supertask
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
          this.router.navigate(['tasks/supertasks']).then(() => {
            this.alert.showSuccessMessage('Supertask data has been updated successfully');
          });
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
          this.refresh(); // reload select / data in parent
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
