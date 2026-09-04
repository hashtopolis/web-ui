import { HashListFormat } from '@constants/hashlist.config';
import { HTTP_SKIP_ERROR_HEADER_CONFIG, HttpMethod } from '@constants/http.config';
import { zHashlistResponse } from '@generated/api/zod';
import { lastValueFrom } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ServerImportFile } from '@models/file.model';
import { JHashlist } from '@models/hashlist.model';
import { JHashtype } from '@models/hashtype.model';
import { ResponseWrapper } from '@models/response.model';
import { zIdRouteParams } from '@models/routes.schema';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { UploadTUSService } from '@services/files/files_tus.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { HashSource, hashSource } from '@src/app/core/_constants/hashlist.config';
import { StaticArrayKind, StaticArrayPipe } from '@src/app/core/_pipes/static-array.pipe';
import {
  ImportCrackedHashesForm,
  getImportCrackedHashesForm
} from '@src/app/hashlists/import-cracked-hashes/import-cracked-hashes.form';
import { SelectOption } from '@src/app/shared/utils/forms';
import { handleEncode, removeFakePath } from '@src/app/shared/utils/forms';

/** Backend error payload shape carried on a failed request. */
type WithError = { error?: { title?: string; message?: string } };

/**
 * Component for import pre cracked hashes
 */
@Component({
  selector: 'app-import-cracked-hashes',
  templateUrl: './import-cracked-hashes.component.html',
  standalone: false
})
export class ImportCrackedHashesComponent implements OnInit {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  /** Form group for the new File. */
  form: FormGroup<ImportCrackedHashesForm>;

  // Edit variables
  editedHashlistIndex: number;
  hashtype: JHashtype;
  type: number; // Hashlist or Superhashlist
  protected readonly HashListFormat = HashListFormat;

  selectSource = hashSource;
  protected readonly HashSource = HashSource;

  selectedFiles: FileList | null = null;
  fileName: string;
  uploadProgress = 0;
  serverFiles: ServerImportFile[] = [];
  serverFileOptions: SelectOption[] = [];
  isLoadingServerFiles = false;
  hashesAreRequired = false;

  private destroyRef = inject(DestroyRef);
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
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      this.editedHashlistIndex = zIdRouteParams.parse(params).id;
      this.formValues();
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.getInitialization();

    const sourceTypeControl = this.form.controls.sourceType;
    sourceTypeControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((sourceType: HashSource) => {
      this.hashesAreRequired = false;
      this.resetHashesValidator();
      // Reload every time 'import' is selected so newly placed server files
      // appear without a re-login; the loading flag guards against overlap.
      if (sourceType === HashSource.IMPORT && !this.isLoadingServerFiles) {
        void this.loadServerFiles();
      }

      if (sourceType !== HashSource.UPLOAD) {
        this.selectedFiles = null;
        this.fileName = '';
        this.uploadProgress = 0;
      }

      if (sourceType === HashSource.PASTE) {
        this.hashesAreRequired = true;

        // set required validator now that control is visible
        const ctrl = this.form.controls.hashes;
        ctrl.setValidators([Validators.required]);
        ctrl.updateValueAndValidity();
        this.form.patchValue({ sourceData: '' });
      } else {
        this.form.patchValue({ hashes: '' });
      }
    });
  }

  /**
   * Resets the action filter control by clearing validators, resetting the value, and updating validity.
   */
  resetHashesValidator(): void {
    const ctrl = this.form.controls.hashes;
    ctrl.clearValidators();
    ctrl.setValue('');
    ctrl.updateValueAndValidity();
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
    } else {
      const separator: string = this.form.controls.fieldSeparator.value;
      const sourceData: string = this.form.controls.hashes.value;
      const conflictResolution: number = this.form.controls.conflictResolution.value ? 1 : 0;

      const sourceType = this.form.controls.sourceType.value;

      if (sourceType === HashSource.UPLOAD) {
        if (!this.selectedFiles || this.selectedFiles.length === 0) {
          this.alert.showErrorMessage('Please select a file to upload.');
          return;
        }
        this.uploadAndImport(this.selectedFiles);
        return;
      }

      if (sourceType === HashSource.PASTE) {
        const hashes = this.form.controls.hashes.value;
        if (!hashes || hashes.trim() === '') {
          this.alert.showErrorMessage('Please paste hashes to import.');
          return;
        } else if (!sourceData.includes(separator)) {
          this.alert.showErrorMessage('The hash must contain the specified separator!');
          return;
        }
        this.submitImport({
          sourceType: sourceType,
          hashlistId: this.editedHashlistIndex,
          separator: separator,
          sourceData: handleEncode(hashes),
          overwrite: conflictResolution
        });
        return;
      }

      if (sourceType === HashSource.IMPORT) {
        const sourceData = this.form.controls.sourceData.value;
        if (!sourceData || sourceData.trim() === '') {
          this.alert.showErrorMessage('Please select a file from the server import directory.');
          return;
        }
        this.submitImport({
          sourceType: sourceType,
          hashlistId: this.editedHashlistIndex,
          separator: separator,
          sourceData,
          overwrite: conflictResolution
        });
        return;
      }

      if (sourceType === HashSource.URL) {
        const sourceData = this.form.controls.sourceData.value;
        if (!sourceData || sourceData.trim() === '') {
          this.alert.showErrorMessage('Please provide a URL to download cracked hashes from.');
          return;
        }
        this.submitImport({
          sourceType: sourceType,
          hashlistId: this.editedHashlistIndex,
          separator: separator,
          sourceData,
          overwrite: conflictResolution
        });
        return;
      }

      this.alert.showErrorMessage('Unknown source type selected.');
    }
  }

  onFilesSelected(files: FileList): void {
    this.selectedFiles = files;
    this.fileName = files[0].name;
    this.form.patchValue({ sourceData: files[0].name });
  }

  get sourceType() {
    return this.form.controls.sourceType.value;
  }

  async loadServerFiles(): Promise<void> {
    this.isLoadingServerFiles = true;
    try {
      // Surface a single toast on failure; skip the global error dialog to avoid double messaging.
      const httpOptions = { headers: new HttpHeaders(HTTP_SKIP_ERROR_HEADER_CONFIG) };
      const response = await lastValueFrom(
        this.gs.chelper<ResponseWrapper<ServerImportFile[]>>(
          SERV.HELPER,
          'importFile',
          undefined,
          HttpMethod.GET,
          httpOptions
        )
      );
      this.serverFiles = response.meta || [];
      this.serverFileOptions = this.serverFiles.map((file) => ({ id: file.file, name: file.file }));
    } catch (error) {
      console.error('Error fetching server import files:', error);
      this.alert.showErrorMessage('Could not load files from server import directory.');
    } finally {
      this.isLoadingServerFiles = false;
    }
  }

  private async uploadAndImport(files: FileList | null): Promise<void> {
    if (!files || files.length === 0) {
      this.alert.showErrorMessage('Please select a file to upload.');
      return;
    }

    const filename = removeFakePath(this.fileName || files[0].name);
    const alreadyExists = await this.fileExistsInServerImportDir(filename);
    if (alreadyExists) {
      this.submitImport({
        sourceType: HashSource.IMPORT,
        hashlistId: this.editedHashlistIndex,
        separator: this.form.controls.fieldSeparator.value,
        sourceData: filename,
        overwrite: this.form.controls.conflictResolution.value ? 1 : 0
      });
      return;
    }

    this.isCreatingLoading = true;

    this.uploadService
      .uploadFile(files[0], files[0].name, SERV.HASHLISTS)
      .pipe(takeUntilDestroyed(this.destroyRef))
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
            sourceType: HashSource.IMPORT,
            hashlistId: this.editedHashlistIndex,
            separator: this.form.controls.fieldSeparator.value,
            sourceData: filename,
            overwrite: this.form.controls.conflictResolution.value ? 1 : 0
          });
        }
      });
  }

  private async fileExistsInServerImportDir(filename: string): Promise<boolean> {
    if (!filename) {
      return false;
    }

    try {
      const response = await lastValueFrom(
        this.gs.chelper<ResponseWrapper<ServerImportFile[]>>(SERV.HELPER, 'importFile', undefined, HttpMethod.GET)
      );
      const files = response.meta || [];
      this.serverFiles = files;
      this.serverFileOptions = files.map((file) => ({ id: file.file, name: file.file }));
      return files.some((file) => file.file === filename);
    } catch {
      return false;
    }
  }

  private submitImport(payload: {
    sourceType: string;
    hashlistId: number;
    separator: string;
    sourceData: string;
    overwrite: number;
  }): void {
    this.isCreatingLoading = true;
    // Surface a single toast on failure; skip the global error dialog to avoid double messaging.
    const httpOptions = { headers: new HttpHeaders(HTTP_SKIP_ERROR_HEADER_CONFIG) };
    this.gs
      .chelper(SERV.HELPER, 'importCrackedHashes', payload, HttpMethod.POST, httpOptions)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ResponseWrapper) => {
          this.alert.showSuccessMessage(
            `Processed pre-cracked hashes: ${response.meta.totalLines} total lines, ${response.meta.newCracked} new cracked hashes, ${response.meta.alreadyCracked} were already cracked, ${response.meta.invalid} invalid lines, ${response.meta.notFound} not matching entries (0s)!`
          );
          const path = this.type === HashListFormat.SUPERHASHLIST ? '/hashlists/superhashlist' : '/hashlists/hashlist';
          this.router.navigate([path]);
        },
        error: (error) => {
          this.isCreatingLoading = false;
          const detail = (error as WithError)?.error?.title;
          this.alert.showErrorMessage(
            detail ? `Failed to import cracked hashes: ${detail}` : 'Failed to import cracked hashes.'
          );
        },
        complete: () => {
          this.isCreatingLoading = false;
        }
      });
  }

  /**
   * Sets form values after fetching hashlist details.
   * @returns {void}
   */
  private formValues() {
    this.gs
      .get(SERV.HASHLISTS, this.editedHashlistIndex, {
        include: ['tasks,hashlists,hashType']
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: ResponseWrapper) => {
        const hashlist: JHashlist = new JsonAPISerializer().deserialize(response, zHashlistResponse);
        this.type = hashlist.format ?? HashListFormat.TEXT;
        this.hashtype = hashlist.hashType!;

        this.form.setValue({
          name: hashlist.name,
          hashlistFormat: this.format.transform(hashlist.format, StaticArrayKind.FORMATS),
          fieldSeparator: ':',
          isSalted: hashlist.isSalted,
          hashCount: hashlist.hashCount,
          sourceType: HashSource.PASTE,
          sourceData: '',
          hashes: '',
          conflictResolution: false
        });

        this.isLoading = false; // Set isLoading to false after data is loaded
      });
  }
}
