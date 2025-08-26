import { Subject, firstValueFrom, takeUntil } from 'rxjs';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { JAccessGroup } from '@models/access-group.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { UploadTUSService } from '@services/files/files_tus.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { ACCESS_GROUP_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { NewFilesForm, PreparedFormData, getNewFilesForm } from '@src/app/files/new-files/new-files.form';
import { SelectOption, handleEncode, transformSelectOptions } from '@src/app/shared/utils/forms';
import { WordlistGeneratorComponent } from '@src/app/shared/wordlist-generator/wordlist-generator.component';

/**
 * Represents the NewFilesComponent responsible for creating and uploading files
 */
@Component({
  selector: 'app-new-files',
  templateUrl: './new-files.component.html',
  standalone: false
})
export class NewFilesComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new File. */
  form: FormGroup<NewFilesForm>;
  submitted = false;

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  /** Filtering and views. */
  filterType: number;
  viewMode = 'tab1';
  title: string;
  redirect: string;

  // Lists of Selected inputs
  selectAccessgroup: SelectOption[];

  // Upload files
  selectedFiles: FileList | null = null;
  fileName: string;
  uploadProgress = 0;

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
   * @param dialog
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
    this.titleService.set([this.title]);
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
  ngOnInit() {
    void this.loadData();
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
  buildForm() {
    this.form = getNewFilesForm();
    this.form.patchValue({ fileType: this.filterType });
  }

  /**
   * Loads data, specifically access groups, for the component.
   */
  async loadData() {
    this.isLoading = true;

    try {
      const response: ResponseWrapper = await firstValueFrom(this.gs.getAll(SERV.ACCESS_GROUPS));

      const accessGroups = new JsonAPISerializer().deserialize<JAccessGroup[]>({
        data: response.data,
        included: response.included
      });

      this.selectAccessgroup = transformSelectOptions(accessGroups, ACCESS_GROUP_FIELD_MAPPING);
    } catch (error) {
      console.error('Error fetching access groups:', error);
    } finally {
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * TODO: Unused until the API has a way to handle file uploads via URL
   * Handles the form submission for creating a new file.
   * Checks form validity and submits the form data to create a new file.
   * Navigates to the appropriate route upon successful creation.
   */
  async onSubmit(): Promise<void> {
    if (this.form.valid && !this.submitted) {
      const form = this.onBeforeSubmit(this.form.value, false);
      this.isCreatingLoading = true;
      this.submitted = true;

      if (form.status === false) {
        try {
          // Await the response from the API call
          await firstValueFrom(this.gs.create(SERV.FILES, form.update));

          // After successful creation, update form and show alert
          this.onBeforeSubmit(this.form.value, true);
          this.alert.showSuccessMessage('New File created');
          this.isCreatingLoading = false;
          this.submitted = false;

          // Navigate after successful creation
          void this.router.navigate(['/files', this.redirect]);
        } catch (error) {
          // Handle errors if needed (e.g., show an error message or log)
          this.isCreatingLoading = false;
          this.submitted = false;
          console.error('Error creating file:', error);
        }
      }
    }
  }

  /**
   * Prepares the form data before submission.
   * Determines source data and filename based on the selected source type.
   *
   * @param form The form data to be prepared.
   * @param status The status indicating the form's validity.
   * @returns Prepared form data.
   */
  onBeforeSubmit(form: FormGroup<NewFilesForm>['value'], status: boolean): PreparedFormData {
    const sourceType = form.sourceType || 'import';
    const isInline = sourceType === 'inline';
    const fileName = isInline ? form.filename : this.fileName;
    const sourceData = isInline ? handleEncode(form.sourceData) : this.fileName;

    // Prepared form data for submission
    return {
      update: {
        filename: fileName,
        isSecret: form.isSecret,
        fileType: this.filterType,
        accessGroupId: form.accessGroupId,
        sourceType: form.sourceType,
        sourceData: sourceData
      },
      status: status
    };
  }

  /**
   * TODO: Unused until the API has a way to handle file uploads via URL
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
    const dialogRef = this.dialog.open(WordlistGeneratorComponent, {
      width: 'auto',
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
    if (!files || files.length === 0) {
      this.alert.showErrorMessage('Please select a file to upload.');
      return;
    }
    const form = this.onBeforeSubmit(this.form.value, false);
    this.isCreatingLoading = true;
    for (let i = 0; i < files.length; i++) {
      this.uploadService
        .uploadFile(files[0], files[0].name, SERV.FILES, form.update, ['/files', this.redirect])
        .pipe(takeUntil(this.fileUnsubscribe))
        .subscribe((progress) => {
          this.uploadProgress = progress;
          this.changeDetectorRef.detectChanges();
          if (this.uploadProgress === 100) {
            this.isCreatingLoading = false;
          }
        });
    }
  }
}
