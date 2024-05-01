import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, Subscription, takeUntil } from 'rxjs';

import { ACCESS_GROUP_FIELD_MAPPING } from 'src/app/core/_constants/select.config';
import { UploadTUSService } from 'src/app/core/_services/files/files_tus.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { validateFileExt } from '../../shared/utils/util';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFileTUS } from '../../core/_models/file.model';
import { SERV } from '../../core/_services/main.config';
import { subscribe } from 'diagnostics_channel';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import {
  handleEncode,
  transformSelectOptions
} from 'src/app/shared/utils/forms';
import { MatDialog } from '@angular/material/dialog';
import { WordlisGeneratorComponent } from 'src/app/shared/wordlist-generator/wordlist-generatorcomponent';

/**
 * Represents the NewFilesComponent responsible for creating and uploading files
 */
@Component({
  selector: 'app-new-files',
  templateUrl: './new-files.component.html'
})
export class NewFilesComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new File. */
  form: FormGroup;
  submitted = false;

  /** Filtering and views. */
  filterType: number;
  whichView: string;
  viewMode = 'tab1';
  title: string;
  redirect: string;

  // Lists of Selected inputs
  selectAccessgroup: any[];

  // Upload files
  selectedFiles: FileList | null = null;
  fileName: any;
  uploadProgress = 0;
  filenames: string[] = [];
  selectedFile: '';
  fileToUpload: File | null = null;

  // Unsubcribe files
  private fileUnsubscribe = new Subject();

  /**
   * Component for handling new files.
   *
   * @constructor
   * @param {UnsubscribeService} unsubscribeService - Service for managing unsubscribing from observables.
   * @param {ChangeDetectorRef} changeDetectorRef - Reference to Angular's ChangeDetectorRef for manual change detection.
   * @param {UploadTUSService} uploadService - Service for handling file uploads using TUS protocol.
   * @param {AutoTitleService} titleService - Service for setting and managing page titles automatically.
   * @param {ActivatedRoute} route - Service for accessing the current route information.
   * @param {AlertService} alert - Service for displaying alerts to the user.
   * @param {GlobalService} gs - Service for accessing global application state.
   * @param {Router} router - Angular router service for navigating between views.
   */
  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private uploadService: UploadTUSService,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private dialog: MatDialog,
    private gs: GlobalService,
    private router: Router
  ) {
    this.getLocation();
    this.buildForm();
    titleService.set([this.title]);
  }

  /**
   * Retrieves location information based on route data.
   * Sets filterType, title, and redirect properties accordingly.
   */
  getLocation() {
    this.route.data.subscribe((data) => {
      switch (data['kind']) {
        case 'wordlist-new':
          this.filterType = 0;
          this.title = 'New Wordlist';
          this.redirect = 'wordlist';
          break;

        case 'rule-new':
          this.filterType = 1;
          this.title = 'New Rule';
          this.redirect = 'rules';
          break;

        case 'other-new':
          this.filterType = 2;
          this.title = 'New Other';
          this.redirect = 'other';
          break;
      }
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
    this.fileUnsubscribe.next(false);
    this.fileUnsubscribe.complete();
  }

  /**
   * Builds the form for creating a new Hashlist.
   */
  buildForm(): void {
    this.form = new FormGroup({
      filename: new FormControl(''),
      isSecret: new FormControl(false),
      fileType: new FormControl(this.filterType),
      accessGroupId: new FormControl(1),
      sourceType: new FormControl('import' || ''),
      sourceData: new FormControl('')
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
   * Handles the form submission for creating a new file.
   * Checks form validity and submits the form data to create a new file.
   * Navigates to the appropriate route upon successful creation.
   */
  onSubmit(): void {
    if (this.form.valid && this.submitted === false) {
      let form = this.onBeforeSubmit(this.form.value, false);

      this.submitted = true;

      if (form.status === false) {
        const createSubscription$ = this.gs
          .create(SERV.FILES, form.update)
          .subscribe(() => {
            form = this.onBeforeSubmit(this.form.value, true);
            this.alert.okAlert('New File created!', '');
            this.submitted = false;
            this.router.navigate(['/files', this.redirect]);
          });
        this.unsubscribeService.add(createSubscription$);
      }
    }
  }

  /**
   * Prepares the form data before submission.
   * Determines source data and filename based on the selected source type.
   *
   * @param {any} form - The form data to be prepared.
   * @param {boolean} status - The status indicating the form's validity.
   * @returns {{ update: { filename: string, isSecret: boolean, fileType: number, accessGroupId: number, sourceType: string, sourceData: string }, status: boolean }} Prepared form data.
   */
  onBeforeSubmit(form: any, status: boolean) {
    const sourceType = form.sourceType || 'import';
    const isInline = sourceType === 'inline';
    const fileName = isInline ? form.filename : this.fileName;
    const sourcadata = isInline ? handleEncode(form.sourceData) : this.fileName;

    /**
     * Prepared form data for submission.
     */
    const res = {
      update: {
        filename: fileName,
        isSecret: form.isSecret,
        fileType: this.filterType,
        accessGroupId: form.accessGroupId,
        sourceType: form.sourceType,
        sourceData: sourcadata
      },
      status: status
    };

    return res;
  }

  /**
   * Handles the change of file upload type.
   * Updates the view mode and resets form values based on the selected type.
   *
   * @param {string} type - The selected file upload type.
   * @param {string} view - The selected view mode.
   */
  onChangeType(type: string, view: string): void {
    /**
     * Update the view mode based on the selected type.
     * Reset form values related to file upload.
     */
    this.viewMode = view;
    this.form.patchValue({
      filename: '',
      accessGroupId: 1,
      sourceType: type,
      sourceData: ''
    });
  }

  /**
   * Handles the selection of files.
   * Updates the selected files and extracts the file name.
   *
   * @param {FileList} files - List of selected files.
   */

  onFilesSelected(files: FileList): void {
    this.selectedFiles = files;
    this.fileName = files[0].name;
  }

  showHelp(): void {
    const dialogRef = this.dialog.open(WordlisGeneratorComponent, {
      width: '90%',
      maxWidth: '100vw'
    });
    dialogRef.afterClosed().subscribe();
  }

  /**
   * Handles the upload of files.
   * Prepares form data and initiates the file upload process.
   *
   * @param {FileList | null} files - List of files to be uploaded.
   */
  onuploadFile(files: FileList | null): void {
    const form = this.onBeforeSubmit(this.form.value, false);
    const upload: Array<any> = [];
    for (let i = 0; i < files.length; i++) {
      upload.push(
        this.uploadService
          .uploadFile(files[0], files[0].name, SERV.FILES, form.update, [
            '/files',
            this.redirect
          ])
          .pipe(takeUntil(this.fileUnsubscribe))
          .subscribe((progress) => {
            this.uploadProgress = progress;
          })
      );
    }
  }
}
