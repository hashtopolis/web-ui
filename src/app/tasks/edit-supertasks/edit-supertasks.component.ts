import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JPretask } from '@models/pretask.model';
import { ResponseWrapper } from '@models/response.model';
import { JSuperTask } from '@models/supertask.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { PretasksTableComponent } from '@components/tables/pretasks-table/pretasks-table.component';

import { SUPER_TASK_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { transformSelectOptions } from '@src/app/shared/utils/forms';

declare let options;

@Component({
  selector: 'app-edit-supertasks',
  templateUrl: './edit-supertasks.component.html',
  standalone: false
})
export class EditSupertasksComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new SuperTask. */
  updateForm: FormGroup;
  etForm: FormGroup; //estimation time form
  viewForm: FormGroup; //Supertask details

  /** List of PreTasks. */
  selectPretasks;

  // Edit
  private _editedSTIndex: number;
  @Input()
  set editedSTIndex(value: number) {
    if (value !== this._editedSTIndex) {
      this._editedSTIndex = value;
      this.refresh(); // Reload the Pretask-Select-Component
    }
  }
  get editedSTIndex(): number {
    if (this._editedSTIndex === undefined) {
      return 0;
    } else {
      return this._editedSTIndex;
    }
  }

  assignPretasks: JPretask[] = [];
  editName: string;

  @ViewChild('superTasksPretasksTable') superTasksPretasksTable: PretasksTableComponent;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer,
    private confirmDialog: ConfirmDialogService,
    protected roleService: SupertasksRoleService
  ) {
    this.onInitialize();
    this.buildForm();
    this.titleService.set(['Edit SuperTasks']);
  }

  /**
   * Initializes the component by extracting and setting the user ID,
   */
  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedSTIndex = +params['id'];
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Builds the form for creating a new SuperHashlist.
   */
  buildForm(): void {
    // Form details
    this.viewForm = new FormGroup({
      supertaskId: new FormControl({ value: '', disabled: true }),
      supertaskName: new FormControl({ value: '', disabled: true })
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

    const loadSTSubscription$ = this.gs
      .get(SERV.SUPER_TASKS, this.editedSTIndex, params)
      .subscribe((response: ResponseWrapper) => {
        const responseData = { data: response.data, included: response.included };
        const supertask = this.serializer.deserialize<JSuperTask>(responseData);
        this.editName = supertask.supertaskName;
        this.assignPretasks = supertask.pretasks;
        this.viewForm = new FormGroup({
          supertaskId: new FormControl({
            value: supertask.id,
            disabled: true
          }),
          supertaskName: new FormControl({
            value: supertask.supertaskName,
            disabled: true
          })
        });

        if (this.roleService.hasRole('editSupertaskPreTasks')) {
          const loadPTSubscription$ = this.gs.getAll(SERV.PRETASKS).subscribe((response: ResponseWrapper) => {
            const responseData = { data: response.data, included: response.included };
            const pretasks = this.serializer.deserialize<JPretask[]>(responseData);

            const availablePretasks = this.getAvailablePretasks(supertask.pretasks, pretasks);

            this.selectPretasks = transformSelectOptions(availablePretasks, SUPER_TASK_FIELD_MAPPING);
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
          });
          this.unsubscribeService.add(loadPTSubscription$);
        }
      });
    this.unsubscribeService.add(loadSTSubscription$);
  }

  /**
   * Reload data
   *
   */
  refresh(): void {
    this.isLoading = true;
    this.onInitialize();
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
      const pretasks = [];

      this.updateForm.value['pretasks'].forEach((pretask) => {
        pretasks.push({ type: RelationshipType.PRETASKS, id: pretask });
      });

      const responseBody = { data: pretasks };

      const updateSubscription$ = this.gs
        .postRelationships(SERV.SUPER_TASKS, this.editedSTIndex, RelationshipType.PRETASKS, responseBody)
        .subscribe(() => {
          this.alert.showSuccessMessage('SuperTask saved');
          this.refresh(); // Reload the Pretask-Select-Component
          this.superTasksPretasksTable.reload(); // reload SuperTasks table
        });
      this.unsubscribeService.add(updateSubscription$);
    }
  }

  /**
   * Handles the deletion of a super task. Displays a confirmation dialog,
   * and if confirmed, triggers the deletion of the super task.
   * Navigates to the super tasks page after successful deletion.
   */
  onDelete() {
    this.confirmDialog.confirmDeletion('Supertask', this.editName).subscribe((confirmed) => {
      if (confirmed) {
        this.unsubscribeService.add(
          this.gs.delete(SERV.SUPER_TASKS, this.editedSTIndex).subscribe(() => {
            this.router
              .navigate(['/tasks/supertasks'])
              .then(() => this.alert.showSuccessMessage(`Succesfully deleted Supertask: ${this.editedSTIndex}`));
          })
        );
      }
    });
  }

  /**
   * Calculates the total runtime of a supertask based on benchmark values and keyspace sizes.
   * Updates the HTML content to display the total runtime of the supertask.
   */
  keyspaceTimeCalc() {
    if (this.etForm.value.benchmarka0 !== 0 && this.etForm.value.benchmarka3 !== 0) {
      let totalSecondsSupertask = 0;
      let unknown_runtime_included = 0;
      const benchmarka0 = this.etForm.value.benchmarka0;
      const benchmarka3 = this.etForm.value.benchmarka3;

      // Iterate over each task in the supertask

      $('.hashtopolis-table').each((index, table) => {
        // Find the header row and get the column index with the label "Attack Runtime"
        const headerRow = $(table).find('tr').first();
        const attackEstimatedKeyspaceColumnIndex = headerRow
          .find('th .mat-sort-header-content:contains("Estimated Keyspace")')
          .closest('th')
          .index();

        // Get the number of rows in the table
        const numRows = $(table).find('tr').length;

        // Iterate through each row
        for (let i = 0; i < numRows; i++) {
          // Extract the value from the "Attack Runtime" column
          const keyspace_size_raw = $(table).find('tr').eq(i).find('td').eq(attackEstimatedKeyspaceColumnIndex).text();

          // Extract keyspace size from the table cell
          let seconds = null;
          let runtime = null;

          // Remove special characters and convert to a valid number
          const keyspace_size = parseFloat(keyspace_size_raw.replace(/[^0-9.-]/g, ''));

          // Set default options for the attack
          options.ruleFiles = [];
          options.posArgs = [];
          options.unrecognizedFlag = [];

          // Check if keyspace size is available
          if (keyspace_size === null || !keyspace_size) {
            unknown_runtime_included = 1;
            runtime = 'Unknown';
          } else if (options.attackType === 3) {
            // Calculate seconds based on benchmarka3 for attackType 3
            seconds = Math.floor(Number(keyspace_size) / Number(benchmarka3));
          } else if (options.attackType === 0) {
            // Calculate seconds based on benchmarka0 for attackType 0
            seconds = Math.floor(Number(keyspace_size) / Number(benchmarka0));
          }

          // Convert seconds to human-readable runtime format
          if (Number.isInteger(seconds)) {
            totalSecondsSupertask += seconds;
            const days = Math.floor(seconds / (3600 * 24));
            seconds -= days * 3600 * 24;
            const hrs = Math.floor(seconds / 3600);
            seconds -= hrs * 3600;
            const mins = Math.floor(seconds / 60);
            seconds -= mins * 60;

            runtime = days + 'd, ' + hrs + 'h, ' + mins + 'm, ' + seconds + 's';
          } else {
            unknown_runtime_included = 1;
            runtime = 'Unknown';
          }
          // Update the "Attack Runtime" column with the calculated runtime
          const attackRuntimeColumnIndex = headerRow
            .find('th .mat-sort-header-content:contains("Attack Runtime")')
            .closest('th')
            .index();
          const attackRuntimeCell = $(table).find('tr').eq(i).find('td').eq(attackRuntimeColumnIndex);
          attackRuntimeCell.html(runtime);
        }
      });

      // Reduce total runtime to a human-readable format
      let seconds = totalSecondsSupertask;
      const days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      const hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      const mins = Math.floor(seconds / 60);
      seconds -= mins * 60;

      let totalRuntimeSupertask = days + 'd, ' + hrs + 'h, ' + mins + 'm, ' + seconds + 's';

      // Append additional information if unknown runtime is included
      if (unknown_runtime_included === 1) {
        totalRuntimeSupertask += ', plus additional unknown runtime';
      }

      // Update the HTML content with the total runtime of the supertask
      $('.runtimeOfSupertask').html(totalRuntimeSupertask);
    }
  }
}
