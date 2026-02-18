import { Subject, firstValueFrom, takeUntil } from 'rxjs';

import { Component, OnInit, inject } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ServerImportFile } from '@models/file.model';
import { JHashlist } from '@models/hashlist.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { UploadTUSService } from '@services/files/files_tus.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { hashSource } from '@src/app/core/_constants/hashlist.config';
import { StaticArrayPipe } from '@src/app/core/_pipes/static-array.pipe';
import {
  ImportCrackedHashesForm,
  getImportCrackedHashesForm
} from '@src/app/hashlists/import-cracked-hashes/import-cracked-hashes.form';
import { SelectOption } from '@src/app/shared/utils/forms';
import { handleEncode, removeFakePath } from '@src/app/shared/utils/forms';

/**
 * Component for import pre cracked hashes
 */
@Component({
  selector: 'app-import-cracked-hashes',
  templateUrl: './import-cracked-hashes.component.html',
  standalone: false
})
export class ImportCrackedHashesComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  /** Form group for the new File. */
  form: FormGroup<ImportCrackedHashesForm>;

  // Edit variables
  editedHashlistIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hashtype: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any; // Hashlist or SuperHashlist

  selectSource = hashSource;

  selectedFiles: FileList | null = null;
  fileName: string;
  uploadProgress = 0;
  serverFiles: ServerImportFile[] = [];
  serverFileOptions: SelectOption[] = [];
  isLoadingServerFiles = false;
  hasLoadedServerFiles = false;

  private fileUnsubscribe = new Subject();

  private unsubscribeService = inject(UnsubscribeService);
  private titleService = inject(AutoTitleService);
  private format = inject(StaticArrayPipe);
  private route = inject(ActivatedRoute);
  private uploadService = inject(UploadTUSService);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);

  constructor() {
    this.buildForm();
    this.titleService.set(['Import Cracked Hashes']);
  }

  /**
   * Initializes the form based on route parameters.
   */
  getInitialization() {
    this.route.params.subscribe((params: Params) => {
      this.editedHashlistIndex = +params['id'];
      this.formValues();
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.getInitialization();

    const sourceTypeControl = this.form.get('sourceType');
    if (sourceTypeControl) {
      const sourceTypeSubscription$ = sourceTypeControl.valueChanges.subscribe((sourceType: string) => {
        if (sourceType === 'import' && !this.hasLoadedServerFiles && !this.isLoadingServerFiles) {
          void this.loadServerFiles();
        }

        if (sourceType !== 'upload') {
          this.selectedFiles = null;
          this.fileName = '';
          this.uploadProgress = 0;
        }

        if (sourceType === 'paste') {
          this.form.patchValue({ sourceData: '' });
        } else {
          this.form.patchValue({ hashes: '' });
        }
      });

      this.unsubscribeService.add(sourceTypeSubscription$);
    }
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
    this.form = getImportCrackedHashesForm();
  }

  /**
   * Handles the form submission.
   * If the form is valid, it updates the hashlist using the provided data.
   * @returns {void}
   */
  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }

    const sourceType = this.form.get('sourceType').value;

    if (sourceType === 'upload') {
      if (!this.selectedFiles || this.selectedFiles.length === 0) {
        this.alert.showErrorMessage('Please select a file to upload.');
        return;
      }
      this.uploadAndImport(this.selectedFiles);
      return;
    }

    if (sourceType === 'paste') {
      const hashes = this.form.get('hashes').value;
      if (!hashes || hashes.trim() === '') {
        this.alert.showErrorMessage('Please paste hashes to import.');
        return;
      }
      this.submitImport({
        hashlistId: this.editedHashlistIndex,
        separator: this.form.get('separator').value,
        sourceData: handleEncode(hashes)
      });
      return;
    }

    if (sourceType === 'import') {
      const sourceData = this.form.get('sourceData').value;
      if (!sourceData || sourceData.trim() === '') {
        this.alert.showErrorMessage('Please select a file from the server import directory.');
        return;
      }
      this.submitImport({
        hashlistId: this.editedHashlistIndex,
        separator: this.form.get('separator').value,
        sourceData
      });
      return;
    }

    if (sourceType === 'url') {
      const sourceData = this.form.get('sourceData').value;
      if (!sourceData || sourceData.trim() === '') {
        this.alert.showErrorMessage('Please provide a URL to download cracked hashes from.');
        return;
      }
      this.submitImport({
        hashlistId: this.editedHashlistIndex,
        separator: this.form.get('separator').value,
        sourceData
      });
      return;
    }

    this.alert.showErrorMessage('Unknown source type selected.');
  }

  onFilesSelected(files: FileList): void {
    this.selectedFiles = files;
    this.fileName = files[0].name;
    this.form.patchValue({ sourceData: files[0].name });
  }

  get sourceType() {
    return this.form.get('sourceType').value;
  }

  async loadServerFiles(): Promise<void> {
    this.isLoadingServerFiles = true;
    try {
      const response: ResponseWrapper = await firstValueFrom(
        this.gs.chelper(SERV.HELPER, 'importFile', undefined, 'GET')
      );
      this.serverFiles = (response.meta as ServerImportFile[]) || [];
      this.serverFileOptions = this.serverFiles.map((file) => ({ id: file.file, name: file.file }));
      this.hasLoadedServerFiles = true;
    } catch (error) {
      console.error('Error fetching server import files:', error);
      this.alert.showErrorMessage('Could not load files from server import directory.');
    } finally {
      this.isLoadingServerFiles = false;
    }
  }

  private uploadAndImport(files: FileList | null): void {
    if (!files || files.length === 0) {
      this.alert.showErrorMessage('Please select a file to upload.');
      return;
    }

    this.isCreatingLoading = true;

    this.uploadService
      .uploadFile(files[0], files[0].name, SERV.HASHLISTS)
      .pipe(takeUntil(this.fileUnsubscribe))
      .subscribe({
        next: (progress) => {
          this.uploadProgress = progress;
        },
        error: () => {
          this.isCreatingLoading = false;
          this.alert.showErrorMessage('Failed to upload file.');
        },
        complete: () => {
          this.submitImport({
            hashlistId: this.editedHashlistIndex,
            separator: this.form.get('separator').value,
            sourceData: removeFakePath(this.fileName || files[0].name)
          });
        }
      });
  }

  private submitImport(payload: { hashlistId: number; separator: string; sourceData: string }): void {
    this.isCreatingLoading = true;
    const createSubscription$ = this.gs.chelper(SERV.HELPER, 'importCrackedHashes', payload).subscribe({
      next: () => {
        this.alert.showSuccessMessage('Imported Cracked Hashes');
        const path = this.type === 3 ? '/hashlists/superhashlist' : '/hashlists/hashlist';
        this.router.navigate([path]);
      },
      error: () => {
        this.alert.showErrorMessage('Failed to import cracked hashes.');
      },
      complete: () => {
        this.isCreatingLoading = false;
      }
    });
    this.unsubscribeService.add(createSubscription$);
  }

  /**
   * Sets form values after fetching hashlist details.
   * @returns {void}
   */
  private formValues() {
    const updateSubscription$ = this.gs
      .get(SERV.HASHLISTS, this.editedHashlistIndex, {
        include: ['tasks,hashlists,hashType']
      })
      .subscribe((response: ResponseWrapper) => {
        const hashlist = new JsonAPISerializer().deserialize<JHashlist>({
          data: response.data,
          included: response.included
        });
        this.type = hashlist.format;
        this.hashtype = hashlist.hashType;

        this.form.setValue({
          name: hashlist.name,
          format: this.format.transform(hashlist.format, 'formats'),
          isSalted: hashlist.isSalted,
          hashCount: hashlist.hashCount,
          separator: hashlist.separator || ':',
          sourceType: 'paste',
          sourceData: '',
          hashes: ''
        });

        this.isLoading = false; // Set isLoading to false after data is loaded
      });
    this.unsubscribeService.add(updateSubscription$);
  }
}
