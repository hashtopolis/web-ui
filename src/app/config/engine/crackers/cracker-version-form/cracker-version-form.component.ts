import { HTTP_SKIP_ERROR_HEADER_CONFIG, HttpMethod, HttpStatus } from '@constants/http.config';
import { zCrackerBinaryResponse, zGetAccessGroupsHelperApiResponse } from '@generated/api/zod';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { z } from 'zod';

import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';

import { JAccessGroup } from '@models/access-group.model';
import { CrackerSource, JCrackerBinary, isHashcatCrackerBinary } from '@models/cracker-binary.model';
import { ServerImportFile } from '@models/file.model';
import { AccessGroupId, CrackerBinaryId, CrackerBinaryTypeId } from '@models/id.types';
import { ResponseWrapper } from '@models/response.model';
import { FormRouteType, zIdRouteParams } from '@models/routes.schema';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { UploadTUSService } from '@services/files/files_tus.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { CrackerBinaryRoleService } from '@services/roles/binaries/cracker-binary-role.service';
import { HashTypesRoleService } from '@services/roles/config/hashtypes-role.service';
import { AlertService } from '@services/shared/alert.service';
import { ConfigService } from '@services/shared/config.service';

import { CrackerHashtypesComponent } from '@src/app/config/engine/crackers/cracker-hashtypes/cracker-hashtypes.component';
import {
  CRACKER_SOURCE_OPTIONS,
  CrackerBinaryCreatePayload,
  applyCrackerSource,
  buildCreatePayload,
  buildUpdatePayload,
  buildUploadFilename,
  extractErrorMessage,
  getCrackerVersionForm,
  isSevenZipFilename
} from '@src/app/config/engine/crackers/cracker-version-form/cracker-version-form.form';
import { ACCESS_GROUP_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { GridModule } from '@src/app/shared/grid-containers/grid.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

/** Route data of the cracker version create and edit routes */
export const zCrackerVersionRouteData = z.object({
  type: z.enum(FormRouteType)
});

const CRACKERS_PAGE = ['/config/engine/crackers'];

/**
 * Create and edit page of a cracker version (cracker binary).
 * Create: `engine/crackers/:id/new` with :id = cracker binary type id.
 * Edit:   `engine/crackers/:id/edit` with :id = cracker binary id.
 */
@Component({
  selector: 'app-cracker-version-form',
  imports: [
    ButtonsModule,
    ComponentsModule,
    CrackerHashtypesComponent,
    GridModule,
    InputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    PageTitleModule,
    ReactiveFormsModule
  ],
  templateUrl: './cracker-version-form.component.html'
})
export class CrackerVersionFormComponent implements OnInit {
  protected readonly CrackerSource = CrackerSource;
  protected readonly sourceOptions = CRACKER_SOURCE_OPTIONS;

  form = getCrackerVersionForm();
  mode: FormRouteType = FormRouteType.Create;
  pageTitle = 'New Cracker Version';

  /** Type id (create) or binary id (edit) from the route */
  typeId: CrackerBinaryTypeId | null = null;
  binaryId: CrackerBinaryId | null = null;
  binary: JCrackerBinary | null = null;

  isLoading = true;
  isSubmitting = false;
  isDownloading = false;
  isLoadingServerFiles = false;
  uploadProgress = 0;
  canEdit = false;

  selectAccessGroups: SelectOption<AccessGroupId>[] = [];
  serverFileOptions: SelectOption<string>[] = [];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gs = inject(GlobalService);
  private cs = inject(ConfigService);
  private alert = inject(AlertService);
  private uploadService = inject(UploadTUSService);
  private confirmDialog = inject(ConfirmDialogService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  protected roleService = inject(CrackerBinaryRoleService);
  private hashtypesRoleService = inject(HashTypesRoleService);

  private readonly skipErrorDialog = { headers: new HttpHeaders(HTTP_SKIP_ERROR_HEADER_CONFIG) };

  /** True if the loaded binary's archive is stored on the server */
  get isStoredOnServer(): boolean {
    return this.binary?.filename != null;
  }

  /** True if the loaded binary is a hashcat version, its hashtypes are determined by the background scan */
  get isHashcat(): boolean {
    return this.binary !== null && isHashcatCrackerBinary(this.binary);
  }

  /** The hashtypes section needs the hashtype read permission for the include */
  get canReadHashtypes(): boolean {
    return this.hashtypesRoleService.hasRole('read');
  }

  get source(): CrackerSource {
    return this.form.controls.source.value;
  }

  async ngOnInit(): Promise<void> {
    this.mode = zCrackerVersionRouteData.parse(this.route.snapshot.data).type;
    const id = zIdRouteParams.parse(this.route.snapshot.params).id;
    this.canEdit = this.roleService.hasRole(this.mode === 'create' ? 'create' : 'update');

    this.form.controls.source.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((source) => {
      applyCrackerSource(this.form, source);
      this.uploadProgress = 0;
      if (source !== CrackerSource.UPLOAD) {
        // a file chosen earlier would otherwise be uploaded although the file input shows none
        this.form.controls.file.reset(null, { emitEvent: false });
      }
      if (source === CrackerSource.SERVER_IMPORT) {
        void this.loadServerFiles();
      }
    });

    if (this.mode === 'create') {
      this.typeId = id;
      await this.loadAccessGroups();
    } else {
      this.binaryId = id;
      await this.loadAccessGroups();
      if (!(await this.loadBinary(id))) {
        return;
      }
    }
    this.isLoading = false;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Load the access groups of the current user. In create mode the first group is preselected.
   */
  private async loadAccessGroups(): Promise<void> {
    try {
      const response = await lastValueFrom<ResponseWrapper>(this.gs.ghelper(SERV.HELPER, 'getAccessGroups'));
      const accessGroups: JAccessGroup[] = new JsonAPISerializer().deserialize(
        response,
        zGetAccessGroupsHelperApiResponse
      );
      this.selectAccessGroups = transformSelectOptions(accessGroups, ACCESS_GROUP_FIELD_MAPPING);
      if (this.mode === 'create' && this.selectAccessGroups.length > 0) {
        this.form.controls.accessGroupId.setValue(this.selectAccessGroups[0].id);
      }
    } catch (error) {
      console.error('Error loading access groups', error);
      this.alert.showErrorMessage('Failed to load access groups');
    }
  }

  /**
   * Load the .7z files of the server import directory
   */
  async loadServerFiles(): Promise<void> {
    this.isLoadingServerFiles = true;
    this.changeDetectorRef.detectChanges();
    try {
      const response = await lastValueFrom(
        this.gs.chelper<ResponseWrapper<ServerImportFile[]>>(
          SERV.HELPER,
          'importFile',
          undefined,
          HttpMethod.GET,
          this.skipErrorDialog
        )
      );
      this.serverFileOptions = (response.meta || [])
        .filter((file) => isSevenZipFilename(file.file))
        .map((file) => ({ id: file.file, name: file.file }));
    } catch (error) {
      console.error('Error fetching server import files:', error);
      this.alert.showErrorMessage('Could not load files from server import directory.');
    } finally {
      this.isLoadingServerFiles = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Load the binary to edit and patch the form
   * @return false if loading failed and the page must not render
   */
  private async loadBinary(id: CrackerBinaryId): Promise<boolean> {
    try {
      const params = new RequestParamBuilder().addInclude('crackerBinaryType').create();
      const response = await lastValueFrom<ResponseWrapper>(this.gs.get(SERV.CRACKERS, id, params));
      // Cast: relationship includes aren't schema-typed yet (same as edit-tasks), the deserializer
      // resolves them to never, JCrackerBinary's hand-typed crackerBinaryType is authoritative.
      const binary = new JsonAPISerializer().deserialize(
        response,
        zCrackerBinaryResponse,
        params
      ) as unknown as JCrackerBinary;
      this.binary = binary;
      const typeName = binary.crackerBinaryType?.typeName ?? binary.binaryName;
      this.pageTitle = `Edit ${typeName} version ${binary.version}`;
      this.form.patchValue({
        binaryName: binary.binaryName,
        version: binary.version,
        accessGroupId: binary.accessGroupId,
        downloadUrl: binary.downloadUrl ?? ''
      });
      applyCrackerSource(this.form, CrackerSource.EXTERNAL_LINK);
      if (this.isStoredOnServer) {
        this.form.controls.downloadUrl.disable({ emitEvent: false });
      }
      if (!this.canEdit) {
        this.form.disable({ emitEvent: false });
      }
      this.form.markAsPristine();
      return true;
    } catch (error: unknown) {
      const status = error instanceof HttpErrorResponse ? error.status : undefined;
      if (status === HttpStatus.FORBIDDEN) {
        void this.router.navigateByUrl('/forbidden');
      } else if (status === HttpStatus.NOT_FOUND) {
        void this.router.navigateByUrl('/not-found');
      } else {
        this.alert.showErrorMessage(
          status ? `Error loading cracker version (server returned ${status}).` : 'Error loading cracker version.'
        );
      }
      return false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }
    if (this.mode === 'create') {
      await this.create();
    } else {
      await this.update();
    }
  }

  private async create(): Promise<void> {
    const typeId = this.typeId as CrackerBinaryTypeId;
    this.isSubmitting = true;

    if (this.source !== CrackerSource.UPLOAD) {
      await this.submitCreate(buildCreatePayload(this.form, typeId), false);
      return;
    }

    const file = (this.form.controls.file.value as FileList)[0];
    const uploadFilename = buildUploadFilename(typeId, file);
    try {
      // The version is created here after the upload, not by the TUS service, so leaving
      // the page during the upload (unsubscribe) never creates it in the background.
      await new Promise<void>((resolve, reject) => {
        this.uploadService
          .uploadFile(file, uploadFilename, SERV.CRACKERS, null, null)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (progress) => {
              this.uploadProgress = progress;
              this.changeDetectorRef.detectChanges();
            },
            error: reject,
            complete: resolve
          });
      });
    } catch (error) {
      console.error('Error uploading cracker archive', error);
      this.uploadProgress = 0;
      const reason = extractErrorMessage(error);
      this.alert.showErrorMessage(reason ? `Failed to upload the archive: ${reason}` : 'Failed to upload the archive.');
      this.isSubmitting = false;
      return;
    }
    await this.submitCreate(buildCreatePayload(this.form, typeId, uploadFilename), true);
  }

  /**
   * Send the create request. On success the page stays busy until the redirect,
   * so a second click cannot create a duplicate.
   * @param payload     Create payload
   * @param afterUpload True if the archive was uploaded to the import directory before
   */
  private async submitCreate(payload: CrackerBinaryCreatePayload, afterUpload: boolean): Promise<void> {
    try {
      await firstValueFrom(this.gs.create(SERV.CRACKERS, payload, this.skipErrorDialog));
      this.onCreated();
    } catch (error) {
      this.showCreateError(error, afterUpload);
      this.isSubmitting = false;
    }
  }

  private onCreated(): void {
    this.alert.showSuccessMessage('Cracker version created!');
    void this.router.navigate(CRACKERS_PAGE);
  }

  private showCreateError(error: unknown, afterUpload: boolean): void {
    console.error('Error creating cracker version', error);
    const reason = extractErrorMessage(error);
    let message = reason ? `Failed to create cracker version: ${reason}` : 'Failed to create cracker version.';
    if (afterUpload) {
      message += ' The uploaded archive remains in the server import directory.';
    }
    this.alert.showErrorMessage(message);
    this.changeDetectorRef.detectChanges();
  }

  /** Save changes of an existing binary, sending only the changed fields */
  private async update(): Promise<void> {
    const payload = buildUpdatePayload(this.form, this.isStoredOnServer);
    if (Object.keys(payload).length === 0) {
      this.alert.showInfoMessage('No changes to save.');
      return;
    }
    this.isSubmitting = true;
    try {
      await firstValueFrom(this.gs.update(SERV.CRACKERS, this.binaryId as CrackerBinaryId, payload));
      this.alert.showSuccessMessage('Cracker version saved!');
      void this.router.navigate(CRACKERS_PAGE);
    } catch (error) {
      // the global error dialog shows the backend reason, keep the form for a retry
      console.error('Error updating cracker version', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  /** Download url of the archive stored on the server */
  get downloadUrl(): string {
    return `${this.cs.getEndpoint().replace('/api/v2', '')}/api/download.php/crackerBinary/${this.binaryId}`;
  }

  /** Download the archive stored on the server */
  async onDownload(): Promise<void> {
    if (!this.binary?.filename || this.isDownloading) {
      return;
    }
    this.isDownloading = true;
    try {
      await firstValueFrom(
        this.gs.downloadFromUrl(this.downloadUrl, this.binary.filename, this.skipErrorDialog.headers)
      );
    } catch (error: unknown) {
      const status = error instanceof HttpErrorResponse ? error.status : undefined;
      if (status === HttpStatus.NOT_FOUND) {
        this.alert.showErrorMessage('The archive of this cracker version is not present on the server.');
      } else if (status === HttpStatus.FORBIDDEN) {
        this.alert.showErrorMessage('You have no access to this cracker version.');
      } else {
        this.alert.showErrorMessage('Failed to download the cracker version.');
      }
    } finally {
      this.isDownloading = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  /** Delete the binary after confirmation */
  onDelete(): void {
    if (!this.binary || this.binaryId === null) {
      return;
    }
    const binaryId = this.binaryId;
    this.confirmDialog
      .confirmDeletion('Cracker version', `${this.binary.binaryName} ${this.binary.version}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) {
          this.alert.showInfoMessage('Cracker version is safe!');
          return;
        }
        this.gs
          .delete(SERV.CRACKERS, binaryId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            void this.router
              .navigate(CRACKERS_PAGE)
              .then(() => this.alert.showSuccessMessage('Deleted cracker version'));
          });
      });
  }
}
