import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GlobalService } from 'src/app/core/_services/main.service';
import { ResponseWrapper } from 'src/app/core/_models/response.model';
import { SERV } from '../../core/_services/main.config';
import { SUPER_TASK_FIELD_MAPPING } from 'src/app/core/_constants/select.config';
import { transformSelectOptions } from 'src/app/shared/utils/forms';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { JPretask } from '@src/app/core/_models/pretask.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { JSuperTask } from '@src/app/core/_models/supertask.model';

declare let options: any;
declare let defaultOptions: any;
declare let parser: any;

@Component({
  selector: 'app-edit-supertasks',
  templateUrl: './edit-supertasks.component.html'
})
export class EditSupertasksComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new SuperTask. */
  updateForm: FormGroup;
  etForm: FormGroup; //estimation time form
  viewForm: FormGroup; //Supertask details

  /** List of PreTasks. */
  selectPretasks: any[];

  /** Select Options Mapping */
  selectSuperTaskMap = {
    fieldMapping: SUPER_TASK_FIELD_MAPPING
  };

  // Edit
  editedSTIndex: number;
  editedST: any; // Change to Model
  assignPretasks: any;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer
  ) {
    this.onInitialize();
    this.buildForm();
    titleService.set(['Edit SuperTasks']);
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
      benchmarka0: new FormControl(null || 0),
      benchmarka3: new FormControl(null || 0)
    });
  }

  /**
   * Loads data, specifically hashlists, for the component.
   */
  loadData(): void {
    console.log(this.editedSTIndex);

    const params = new RequestParamBuilder().addInclude('pretasks').create();

    const loadSTSubscription$ = this.gs
      .get(SERV.SUPER_TASKS.URL, this.editedSTIndex, params)
      .subscribe((response: ResponseWrapper) => {
        const responseData = { data: response.data, included: response.included };
        const supertask = this.serializer.deserialize<JSuperTask>(responseData);

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
        const loadPTSubscription$ = this.gs.getAll(SERV.PRETASKS).subscribe((response: ResponseWrapper) => {
          const responseData = { data: response.data, included: response.included };
          const pretasks = this.serializer.deserialize<JPretask[]>(responseData);

          const availablePretasks = this.getAvailablePretasks(supertask.pretasks, pretasks);

          const transformedOptions = transformSelectOptions(availablePretasks, this.selectSuperTaskMap);
          this.selectPretasks = transformedOptions;
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        });
        this.unsubscribeService.add(loadPTSubscription$);
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
   * @param {Array} assigning - An array of assigned tasks with pre-task information.
   * @param {Array} pretasks - An array of all available pre-tasks.
   * @returns {Array} - An array containing pre-tasks that are not assigned.
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
      const concat = []; // We get the current values and then concat with the new value
      for (let i = 0; i < this.assignPretasks.length; i++) {
        concat.push(this.assignPretasks[i].pretaskId);
      }
      const payload = concat.concat(this.updateForm.value['pretasks']);

      const updateSubscription$ = this.gs
        .update(SERV.SUPER_TASKS.URL, this.editedSTIndex, { pretasks: payload }, SERV.SUPER_TASKS.RESOURCE)
        .subscribe(() => {
          this.alert.okAlert('SuperTask saved!', '');
          this.updateForm.reset(); // success, we reset form
          this.onRefresh();
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
    this.alert.deleteConfirmation('', 'Supertasks').then((confirmed) => {
      if (confirmed) {
        // Deletion
        const deleteSubscription$ = this.gs.delete(SERV.SUPER_TASKS.URL, this.editedSTIndex).subscribe(() => {
          // Successful deletion
          this.alert.okAlert(`Deleted Supertask`, '');
          this.router.navigate(['/tasks/supertasks']);
        });
        this.unsubscribeService.add(deleteSubscription$);
      } else {
        // Handle cancellation
        this.alert.okAlert(`Supertask is safe!`, '');
      }
    });
  }

  onRefresh() {
    window.location.reload();
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
          options = defaultOptions;
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
