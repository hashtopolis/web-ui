import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs';

import { SUPER_TASK_FIELD_MAPPING } from 'src/app/core/_constants/select.config';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';
import { ListResponseWrapper } from 'src/app/core/_models/response.model';
import { transformSelectOptions } from 'src/app/shared/utils/forms';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { ChangeDetectorRef } from '@angular/core';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

declare let options: any;
declare let defaultOptions: any;
declare let parser: any;

@Component({
  selector: 'app-edit-supertasks',
  templateUrl: './edit-supertasks.component.html'
})
export class EditSupertasksComponent implements OnInit {
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
  pretasks: any = [];
  pretasksFiles: any = [];
  assignPretasks: any;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
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
    this.loadTableData();
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
    this.viewForm = new FormGroup({
      supertaskId: new FormControl({ value: '', disabled: true }),
      supertaskName: new FormControl({ value: '', disabled: true })
    });

    this.updateForm = new FormGroup({
      pretasks: new FormControl('')
    });

    this.etForm = new FormGroup({
      benchmarka0: new FormControl(null || 0),
      benchmarka3: new FormControl(null || 0)
    });
  }

  /**
   * Loads data, specifically hashlists, for the component.
   */
  loadData(): void {
    const loadSTSubscription$ = this.gs
      .get(SERV.SUPER_TASKS, this.editedSTIndex, { expand: 'pretasks' })
      .subscribe((res) => {
        this.assignPretasks = res.pretasks;
        this.viewForm = new FormGroup({
          supertaskId: new FormControl({
            value: res['supertaskId'],
            disabled: true
          }),
          supertaskName: new FormControl({
            value: res['supertaskName'],
            disabled: true
          })
        });
        const loadPTSubscription$ = this.gs
          .getAll(SERV.PRETASKS)
          .subscribe((htypes: ListResponseWrapper<any>) => {
            const response = this.getAvailablePretasks(
              res.pretasks,
              htypes.values
            );
            const transformedOptions = transformSelectOptions(
              response,
              this.selectSuperTaskMap
            );
            this.selectPretasks = transformedOptions;
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
          });
        this.unsubscribeService.add(loadPTSubscription$);
      });
    this.unsubscribeService.add(loadSTSubscription$);
  }

  /**
   * Retrieves the available pre-tasks that are not assigned.
   *
   * @param {Array} assigning - An array of assigned tasks with pre-task information.
   * @param {Array} pretasks - An array of all available pre-tasks.
   * @returns {Array} - An array containing pre-tasks that are not assigned.
   */
  getAvailablePretasks(assigning, pretasks) {
    // Use filter to find pre-tasks not present in the assigning array
    return pretasks.filter(
      (pretask) =>
        assigning.findIndex(
          (assignedTask) => assignedTask.pretaskId === pretask.pretaskId
        ) === -1
    );
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
        .update(SERV.SUPER_TASKS, this.editedSTIndex, { pretasks: payload })
        .subscribe(() => {
          this.alert.okAlert('SuperTask saved!', '');
          this.updateForm.reset(); // success, we reset form
          this.onRefresh();
          // this.router.navigate(['/tasks/supertasks']);
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
        const deleteSubscription$ = this.gs
          .delete(SERV.SUPER_TASKS, this.editedSTIndex)
          .subscribe(() => {
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

  //To delete
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  loadTableData() {
    const matchObjectFiles = [];
    this.gs
      .getAll(SERV.SUPER_TASKS, {
        expand: 'pretasks',
        filter: 'supertaskId=' + this.editedSTIndex + ''
      })
      .subscribe((result) => {
        this.gs
          .getAll(SERV.PRETASKS, { expand: 'pretaskFiles' })
          .subscribe((pretasks: any) => {
            this.pretasks = result.values.map((mainObject) => {
              for (
                let i = 0;
                i < Object.keys(result.values[0].pretasks).length;
                i++
              ) {
                matchObjectFiles.push(
                  pretasks.values.find(
                    (element: any) =>
                      element?.pretaskId === mainObject.pretasks[i]?.pretaskId
                  )
                );
              }
              return { ...mainObject, matchObjectFiles };
            });
            this.dtTrigger.next(void 0);
          });
      });

    this.dtOptions[0] = {
      dom: 'Bfrtip',
      scrollY: '700px',
      scrollCollapse: true,
      paging: false,
      autoWidth: false,
      searching: false,
      buttons: {
        dom: {
          button: {
            className:
              'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt'
          }
        },
        buttons: []
      }
    };
  }

  onRefresh() {
    window.location.reload();
  }

  /**
   * Calculates the total runtime of a supertask based on benchmark values and keyspace sizes.
   * Updates the HTML content to display the total runtime of the supertask.
   */
  keyspaceTimeCalc() {
    if (
      this.etForm.value.benchmarka0 !== 0 &&
      this.etForm.value.benchmarka3 !== 0
    ) {
      let totalSecondsSupertask = 0;
      let unknown_runtime_included = 0;
      const benchmarka0 = this.etForm.value.benchmarka0;
      const benchmarka3 = this.etForm.value.benchmarka3;

      // Iterate over each task in the supertask
      $('.taskInSuper').each(function (index) {
        // Extract keyspace size from the table cell
        const keyspace_size = $(this).find('td:nth-child(4)').text();
        let seconds = null;
        let runtime = null;

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

        // Update the HTML content with the calculated runtime
        $(this).find('td:nth-child(5)').html(runtime);
      });

      // Reduce total runtime to a human-readable format
      let seconds = totalSecondsSupertask;
      const days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      const hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      const mins = Math.floor(seconds / 60);
      seconds -= mins * 60;

      let totalRuntimeSupertask =
        days + 'd, ' + hrs + 'h, ' + mins + 'm, ' + seconds + 's';

      // Append additional information if unknown runtime is included
      if (unknown_runtime_included === 1) {
        totalRuntimeSupertask += ', plus additional unknown runtime';
      }

      // Update the HTML content with the total runtime of the supertask
      $('.runtimeOfSupertask').html(totalRuntimeSupertask);
    }
  }
}
