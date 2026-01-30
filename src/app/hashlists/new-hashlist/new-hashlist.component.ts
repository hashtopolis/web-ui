/**
 * This module contains the component class to create a new hashlist
 */
import { Subject, Subscription, firstValueFrom, takeUntil } from 'rxjs';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { JAccessGroup } from '@models/access-group.model';
import { JConfig } from '@models/configs.model';
import { JHashtype } from '@models/hashtype.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { UploadTUSService } from '@services/files/files_tus.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { hashSource, hashcatbrainFormat, hashlistFormat } from '@src/app/core/_constants/hashlist.config';
import { ACCESS_GROUP_FIELD_MAPPING, HASHTYPE_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { FileSizePipe } from '@src/app/core/_pipes/file-size.pipe';
import { NewHashlistForm, getNewHashlistForm } from '@src/app/hashlists/new-hashlist/new-hashlist.form';
import { HashtypeDetectorComponent } from '@src/app/shared/hashtype-detector/hashtype-detector.component';
import { SelectOption, handleEncode, removeFakePath, transformSelectOptions } from '@src/app/shared/utils/forms';

@Component({
  selector: 'app-new-hashlist',
  templateUrl: './new-hashlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FileSizePipe],
  standalone: false
})
export class NewHashlistComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoadingAccessGroups = true;
  isLoadingHashtypes = true;

  /** Form group for the new SuperHashlist. */
  form: FormGroup<NewHashlistForm>;

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  // Lists of Selected inputs
  selectAccessgroup: SelectOption[];
  selectHashtypes: SelectOption[];
  selectFormat = hashlistFormat;
  selectSource = hashSource;

  // Lists of Hashtypes
  hashtypes: JHashtype[];

  //Hashcat Brain Mode
  brainenabled: number;
  selectFormatbrain = hashcatbrainFormat;

  // Upload Hashlists
  selectedFiles: FileList | null = null;
  fileName: string;
  uploadProgress = 0;

  saltSubscription = new Subscription();

  // Unsubcribe
  private fileUnsubscribe = new Subject();

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private uploadService: UploadTUSService,
    private titleService: AutoTitleService,
    private alert: AlertService,
    private gs: GlobalService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.buildForm();
    this.titleService.set(['New Hashlist']);
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.loadData();

    const isSaltedCtrl = this.form.get('isSalted');
    const isHexSaltCtrl = this.form.get('isHexSalt');
    const separatorCtrl = this.form.get('separator');

    // Disable separator if not salted
    if (isSaltedCtrl?.value) {
      separatorCtrl?.enable();
      isHexSaltCtrl?.enable();
    } else {
      separatorCtrl?.disable();
      isHexSaltCtrl?.disable();
    }

    // Check for changes and enable/disable
    this.saltSubscription.add(
      isSaltedCtrl!.valueChanges.subscribe((val: boolean) => {
        if (val) {
          separatorCtrl?.enable();
          isHexSaltCtrl?.enable();
        } else {
          separatorCtrl?.disable();
          isHexSaltCtrl?.disable();
        }
      })
    );
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
    this.fileUnsubscribe.next(false);
    this.fileUnsubscribe.complete();
    this.saltSubscription.unsubscribe();
  }

  /**
   * Builds the form for creating a new Hashlist.
   */
  buildForm(): void {
    this.form = getNewHashlistForm();

    //subscribe to changes to handle select salted hashes
    this.form.get('hashTypeId').valueChanges.subscribe((newvalue) => {
      this.handleSelectedItems(Number(newvalue));
    });
  }

  /**
   * Loads data, Access Groups and Hashtypes, for the component.
   */
  loadData(): void {
    this.loadConfigs();
    const accessGroupSubscription = this.gs.getAll(SERV.ACCESS_GROUPS).subscribe((response: ResponseWrapper) => {
      const accessGroups = new JsonAPISerializer().deserialize<JAccessGroup[]>({
        data: response.data,
        included: response.included
      });
      this.selectAccessgroup = transformSelectOptions(accessGroups, ACCESS_GROUP_FIELD_MAPPING);
      this.isLoadingAccessGroups = false;
      this.changeDetectorRef.detectChanges();
    });
    this.unsubscribeService.add(accessGroupSubscription);

    const hashtypesSubscription$ = this.gs.getAll(SERV.HASHTYPES).subscribe((response: ResponseWrapper) => {
      this.hashtypes = new JsonAPISerializer().deserialize<JHashtype[]>({
        data: response.data,
        included: response.included
      });
      this.selectHashtypes = transformSelectOptions(this.hashtypes, HASHTYPE_FIELD_MAPPING);
      this.isLoadingHashtypes = false;
      this.changeDetectorRef.detectChanges();
    });
    this.unsubscribeService.add(hashtypesSubscription$);
  }

  get sourceType() {
    return this.form.get('sourceType').value;
  }

  /**
   * Load configurations
   * ToDO. id could change
   */
  loadConfigs() {
    const configSubscription$ = this.gs.get(SERV.CONFIGS, 66).subscribe((response: ResponseWrapper) => {
      const config = new JsonAPISerializer().deserialize<JConfig>({ data: response.data, included: response.included });
      this.brainenabled = Number(config.value);
      this.form.patchValue({ useBrain: !!this.brainenabled });
      this.changeDetectorRef.detectChanges();
    });
    this.unsubscribeService.add(configSubscription$);
  }

  /**
   * Handles the file upload process and creates the hashlist
   * @param  files - The list of files to be uploaded.
   */
  onuploadFile(files: FileList | null): void {
    this.isCreatingLoading = true;
    // Represents the modified form data without the fake path prefix.
    const newForm = { ...this.form.value };

    // Modify the sourceData key if it exists
    if (newForm.sourceData) {
      newForm.sourceData = removeFakePath(newForm.sourceData);
    }

    this.uploadService
      .uploadFile(files[0], files[0].name, SERV.HASHLISTS, newForm, ['/hashlists/hashlist'])
      .pipe(takeUntil(this.fileUnsubscribe))
      .subscribe((progress) => {
        this.uploadProgress = progress;
        this.changeDetectorRef.detectChanges();
        if (this.uploadProgress === 100) {
          this.isCreatingLoading = false;
        }
      });
  }

  /**
   * Handle Input and return file size
   * @param files List of files
   */
  onFilesSelected(files: FileList): void {
    this.selectedFiles = files;
    this.fileName = files[0].name;
  }

  /**
   * Create Hashlist in case without file upload
   */
  async onSubmit() {
    if (!this.form.valid) {
      return; // form invalid, stop early
    }

    const sourceType = this.form.get('sourceType').value;

    // Validate required input based on sourceType
    if (sourceType === 'import') {
      if (!this.selectedFiles || this.selectedFiles.length === 0) {
        this.alert.showErrorMessage('Please select a hash file to upload.');
        return; // stop submission
      }
    } else if (sourceType === 'paste') {
      const sourceData = this.form.get('sourceData').value;
      if (!sourceData || sourceData.trim() === '') {
        this.alert.showErrorMessage('Please paste your hashes.');
        return; // stop submission
      } else if (this.form.get('isSalted').value) {
        if (!this.form.get('separator').value) {
          this.alert.showErrorMessage('Salt separator cannot be empty when hashes are salted!');
          return; // stop submission
        } else {
          const hashLines = sourceData.split('\n');
          for (const line of hashLines) {
            const parts = line.split(this.form.get('separator').value);
            if (parts.length < 2) {
              this.alert.showErrorMessage(
                `Each line must contain a hash and a salt separated by '${this.form.get('separator').value}'.`
              );
              return; // stop submission
            }
          }
        }
      }
    } else {
      this.alert.showErrorMessage('Unknown source type selected.');
      return; // stop submission
    }

    // Proceed with existing logic now that input is validated
    if (sourceType === 'paste') {
      this.form.patchValue({
        sourceData: handleEncode(this.form.get('sourceData').value)
      });
      this.isCreatingLoading = true;

      try {
        await firstValueFrom(this.gs.create(SERV.HASHLISTS, this.form.getRawValue()));
        this.alert.showSuccessMessage('New HashList created');
        this.router.navigate(['/hashlists/hashlist']);
      } catch (error) {
        console.error('Error creating Hashlist', error);
        this.alert.showErrorMessage('Failed to create hashlist.');
      } finally {
        this.isCreatingLoading = false;
      }
    } else {
      this.onuploadFile(this.selectedFiles);
    }
  }

  // Open Modal Hashtype Detector
  openHelpDialog(): void {
    this.dialog.open(HashtypeDetectorComponent, { width: '100%' });
  }

  /**
   * Handles changes in the hashTypeId form control and adjusts form values accordingly.
   * @param hashTypeId - The new value of the hashTypeId form control.
   */
  handleSelectedItems(hashTypeId: number): void {
    const filter = this.hashtypes.filter((hashtype) => hashtype.id === hashTypeId);
    const salted = filter.length > 0 ? filter[0]['isSalted'] : false;

    if (hashTypeId === 2500 || hashTypeId === 16800 || hashTypeId === 16801) {
      this.form.patchValue({
        format: Number(1),
        isSalted: salted
      });
    } else {
      this.form.patchValue({
        isSalted: salted
      });
    }
  }
}
