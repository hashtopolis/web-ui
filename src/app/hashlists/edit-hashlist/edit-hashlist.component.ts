import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JAccessGroup } from '@models/access-group.model';
import { JHashlist } from '@models/hashlist.model';
import { JHashtype } from '@models/hashtype.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsavedChangesService } from '@services/shared/unsaved-changes.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { ACCESS_GROUP_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { CanComponentDeactivate } from '@src/app/core/_guards/pendingchanges.guard';
import { StaticArrayPipe } from '@src/app/core/_pipes/static-array.pipe';
import { getEditHashlistForm } from '@src/app/hashlists/edit-hashlist/edit-hashlist.form';
import { transformSelectOptions } from '@src/app/shared/utils/forms';

/**
 * Represents the EditHashlistComponent responsible for editing a new hashlists.
 */
@Component({
  selector: 'app-edit-hashlist',
  templateUrl: './edit-hashlist.component.html',
  standalone: false
})
export class EditHashlistComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new File. */
  updateForm: FormGroup;

  // Edit variables
  editedHashlistIndex: number;
  editedHashlist: any; // Change to Model
  hashtype: JHashtype;
  type: any; // Hashlist or SuperHashlist

  // Lists of Selected inputs
  selectAccessgroup: any[];

  // To Remove for use tabes
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();

  /**
   * Constructor for the YourComponent class.
   * Initializes and injects required services and dependencies.
   * Calls necessary methods to set up the component.
   * @param unsavedChangesService
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
    this.titleService.set(['Edit Hashlist']);
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
    this.updateForm = getEditHashlistForm();
  }

  /**
   * Loads data, specifically access groups, for the component.
   */
  loadData() {
    const accedgroupSubscription$ = this.gs.getAll(SERV.ACCESS_GROUPS).subscribe((response: ResponseWrapper) => {
      const accessGroups = new JsonAPISerializer().deserialize<JAccessGroup[]>({
        data: response.data,
        included: response.included
      });
      this.selectAccessgroup = transformSelectOptions(accessGroups, ACCESS_GROUP_FIELD_MAPPING);
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
        .update(SERV.HASHLISTS, this.editedHashlistIndex, this.updateForm.value['updateData'])
        .subscribe(() => {
          this.alert.okAlert('Hashlist saved!', '');
          this.updateForm.reset(); // success, we reset form
          const path = this.type === 3 ? '/hashlists/superhashlist' : '/hashlists/hashlist';
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
        include: ['tasks,hashlists,hashType']
      })
      .subscribe((response: ResponseWrapper) => {
        const hashlist = new JsonAPISerializer().deserialize<JHashlist>({
          data: response.data,
          included: response.included
        });
        this.editedHashlist = hashlist;
        this.type = hashlist.format;
        this.hashtype = hashlist.hashType;
        this.updateForm.setValue({
          hashlistId: hashlist.id,
          accessGroupId: hashlist.accessGroupId,
          useBrain: hashlist.useBrain,
          format: this.format.transform(hashlist.format, 'formats'),
          hashCount: hashlist.hashCount,
          cracked: hashlist.cracked,
          remaining: hashlist.hashCount - hashlist.cracked,
          updateData: {
            name: hashlist.name,
            notes: hashlist.notes,
            isSecret: hashlist.isSecret,
            accessGroupId: hashlist.accessGroupId
          }
        });
      });
    this.unsubscribeService.add(updateSubscription$);
  }

  // Actions; Import Cracked Hashes, Export left Hashes and Generate Wordlist

  importCrackedHashes() {
    this.router.navigate(['/hashlists/hashlist/' + this.editedHashlistIndex + '/import-cracked-hashes']);
  }

  exportLeftHashes() {
    const payload = { hashlistId: this.editedHashlistIndex };
    const helperExportedLeftSubscription$ = this.gs.chelper(SERV.HELPER, 'exportLeftHashes', payload).subscribe(() => {
      this.alert.okAlert('Exported Left Hashes!', '');
    });

    this.unsubscribeService.add(helperExportedLeftSubscription$);
  }

  exportWordlist() {
    const payload = { hashlistId: this.editedHashlistIndex };
    const helperExportedWordlistSubscription$ = this.gs
      .chelper(SERV.HELPER, 'exportWordlist', payload)
      .subscribe(() => {
        this.alert.okAlert('Exported Wordlist!', '');
      });

    this.unsubscribeService.add(helperExportedWordlistSubscription$);
  }

  //Report data
  prepareReport() {
    let sum = 0;
    const workflow = [];
    let preCommand;
    const files = [];
    this.editedHashlist.tasks.forEach((item) => {
      if (item.keyspace && typeof item.keyspace === 'number') {
        sum += item.keyspace;
      }
      if (item.preprocessorCommand) {
        preCommand.push({
          subtitle: `Preprocessor Command: ${item.preprocessorCommand}`
        });
      }

      // Extract file names using regular expressions
      const fileNames = item.attackCmd.match(/\b\w+\.\w+\b/g);

      if (fileNames && fileNames.length > 0) {
        fileNames.forEach((fileName) => {
          files.push({
            text: `File: ${fileName}`,
            margin: [0, 0, 0, 5]
          });
        });
      }
      workflow.push({
        subtitle: `Command: ${item.attackCmd}`,
        ...preCommand,
        ul: [
          {
            text: `Keyspace: ${item.keyspace} (Progress: ${((item.keyspaceProgress / item.keyspace) * 100).toFixed(
              2
            )}%)`,
            margin: [0, 0, 0, 5]
          },
          {
            text: `Cracked entries: ${item.taskId}`,
            margin: [0, 0, 0, 5]
          },
          ...files
        ]
      });
    });

    const report = [
      {
        title: 'Input Fields',
        table: {
          tableColumns: ['Name', 'Notes', 'Hash Mode', 'Hash Count', 'Retrieved', 'Total Keyspace explored'],
          tableValues: [
            this.editedHashlist.name,
            this.editedHashlist.notes,
            this.editedHashlist.hashType.hashTypeId,
            this.editedHashlist.hashCount,
            this.editedHashlist.cracked,
            sum
          ]
        }
      },
      { break: 1 },
      {
        title: 'WorkFlow Completed'
      },
      { break: 1 },
      ...workflow
    ];
    return report;
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
