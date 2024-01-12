import { StaticArrayPipe } from 'src/app/core/_pipes/static-array.pipe';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';

import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { transformSelectOptions } from 'src/app/shared/utils/forms';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { ChangeDetectorRef } from '@angular/core';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import {
  CanComponentDeactivate,
  PendingChangesGuard
} from 'src/app/core/_guards/pendingchanges.guard';
import { OnDestroy } from '@angular/core';
import { UnsavedChangesService } from 'src/app/core/_services/shared/unsaved-changes.service';
import { ACCESS_GROUP_FIELD_MAPPING } from 'src/app/core/_constants/select.config';

/**
 * Represents the EditHashlistComponent responsible for editing a new hashlists.
 */
@Component({
  selector: 'app-edit-hashlist',
  templateUrl: './edit-hashlist.component.html'
})
export class EditHashlistComponent
  implements OnInit, OnDestroy, CanComponentDeactivate
{
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new File. */
  updateForm: FormGroup;

  // Edit variables
  editedHashlistIndex: number;
  editedHashlist: any; // Change to Model
  hashtype: any;
  type: any; // Hashlist or SuperHashlist
  hashlist: any;

  // Lists of Selected inputs
  selectAccessgroup: any[];
  alltasks: any; //Change to Interface

  // To Remove for use tabes
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger1: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  dtOptions1: any = {};

  /**
   * Constructor for the YourComponent class.
   * Initializes and injects required services and dependencies.
   * Calls necessary methods to set up the component.
   * @param {UnsubscribeService} unsubscribeService - Service for managing subscriptions.
   * @param {ChangeDetectorRef} changeDetectorRef - Reference to the Angular change detector.
   * @param {AutoTitleService} titleService - Service for managing page titles.
   * @param {StaticArrayPipe} format - Angular pipe for formatting static arrays.
   * @param {ActivatedRoute} route - The activated route, representing the route associated with this component.
   * @param {AlertService} alert - Service for displaying alerts.
   * @param {GlobalService} gs - Service for global application functionality.
   * @param {Router} router - Angular router service for navigation.
   */
  constructor(
    private unsavedChangesService: UnsavedChangesService,
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private format: StaticArrayPipe,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.getInitialization();
    this.buildForm();
    titleService.set(['Edit Hashlist']);
  }

  /**
   * Initializes the form based on route parameters.
   */
  getInitialization() {
    this.route.params.subscribe((params: Params) => {
      this.editedHashlistIndex = +params['id'];
      this.updateFormValues();
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
   * Builds the form for creating a new Hashlist.
   */
  buildForm(): void {
    this.updateForm = new FormGroup({
      hashlistId: new FormControl({ value: '', disabled: true }),
      accessGroupId: new FormControl(''),
      hashTypeId: new FormControl({ value: '', disabled: true }),
      useBrain: new FormControl({ value: '', disabled: true }),
      format: new FormControl({ value: '', disabled: true }),
      hashCount: new FormControl({ value: '', disabled: true }),
      cracked: new FormControl({ value: '', disabled: true }),
      remaining: new FormControl({ value: '', disabled: true }),
      updateData: new FormGroup({
        name: new FormControl(''),
        notes: new FormControl(''),
        isSecret: new FormControl(''),
        accessGroupId: new FormControl('')
      })
    });
  }

  /**
   * Loads data, specifically access groups, for the component.
   */
  loadData() {
    const fieldAccess = {
      fieldMapping: ACCESS_GROUP_FIELD_MAPPING
    };
    const accedgroupSubscription$ = this.gs
      .getAll(SERV.ACCESS_GROUPS)
      .subscribe((response: any) => {
        const transformedOptions = transformSelectOptions(
          response.values,
          fieldAccess
        );
        this.selectAccessgroup = transformedOptions;
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
    this.unsubscribeService.add(accedgroupSubscription$);
  }

  /**
   * Handles the form submission.
   * If the form is valid, it updates the hashlist using the provided data.
   * @returns {void}
   */
  onSubmit() {
    if (this.updateForm.valid) {
      const createSubscription$ = this.gs
        .update(
          SERV.HASHLISTS,
          this.editedHashlistIndex,
          this.updateForm.value['updateData']
        )
        .subscribe(() => {
          this.alert.okAlert('Hashlist saved!', '');
          this.updateForm.reset(); // success, we reset form
          const path =
            this.type === 3
              ? '/hashlists/superhashlist'
              : '/hashlists/hashlist';
          this.router.navigate([path]);
        });
      this.unsubscribeService.add(createSubscription$);
    }
  }

  /**
   * Updates the form values based on the hashlist data retrieved from the server.
   * Fetches hashlist data, initializes form controls, and updates the form group.
   * @returns {void}
   */
  private updateFormValues() {
    const updateSubscription$ = this.gs
      .get(SERV.HASHLISTS, this.editedHashlistIndex, {
        expand: 'tasks,hashlists,hashType'
      })
      .subscribe((result) => {
        this.getTasks();
        this.editedHashlist = result;
        this.type = result['format'];
        this.hashtype = result['hashType'];
        this.hashlist = result['hashlists'];
        this.updateForm = new FormGroup({
          hashlistId: new FormControl({
            value: result['hashlistId'],
            disabled: true
          }),
          accessGroupId: new FormControl({
            value: result['accessGroupId'],
            disabled: true
          }),
          useBrain: new FormControl({
            value: result['useBrain'] == true ? 'Yes' : 'No',
            disabled: true
          }),
          format: new FormControl({
            value: this.format.transform(result['format'], 'formats'),
            disabled: true
          }),
          hashCount: new FormControl({
            value: result['hashCount'],
            disabled: true
          }),
          cracked: new FormControl({
            value: result['cracked'],
            disabled: true
          }),
          remaining: new FormControl({
            value: result['hashCount'] - result['cracked'],
            disabled: true
          }),
          updateData: new FormGroup({
            name: new FormControl(result['name']),
            notes: new FormControl(result['notes']),
            isSecret: new FormControl(result['isSecret']),
            accessGroupId: new FormControl(result['accessGroupId'])
          })
        });

        this.dtTrigger1.next(null);
      });
    this.unsubscribeService.add(updateSubscription$);

    this.dtOptions1 = {
      dom: 'Bfrtip',
      scrollX: true,
      bStateSave: true,
      destroy: true,
      buttons: []
    };
  }

  // TABLE SECTION BELOW
  getTasks(): void {
    const params = {
      expand: 'crackerBinary,crackerBinaryType,hashlist',
      filter: 'isArchived=false'
    };
    const taskh = [];
    this.gs.getAll(SERV.TASKS, params).subscribe((tasks: any) => {
      for (let i = 0; i < tasks.values.length; i++) {
        const firtprep = tasks.values[i].hashlist;
        for (let i = 0; i < firtprep.length; i++) {
          const match = firtprep[i].hashlistId == this.editedHashlistIndex;
          if (match === true) {
            taskh.push(tasks.values[i]);
          }
        }
      }
      this.alltasks = taskh;
      this.dtTrigger.next(null);
    });

    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 25,
      lengthMenu: [
        [10, 25, 50, 100, 250, -1],
        [10, 25, 50, 100, 250, 'All']
      ],
      bStateSave: true,
      destroy: true,
      buttons: []
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }

  canDeactivate(): boolean {
    const hasUnsavedChanges = this.updateForm.dirty;

    if (hasUnsavedChanges) {
      console.log('EditTasksComponent - Setting unsaved changes to true');
      this.unsavedChangesService.setUnsavedChanges(true);
    } else {
      console.log('EditTasksComponent - No unsaved changes');
    }

    return !hasUnsavedChanges;
  }
}
