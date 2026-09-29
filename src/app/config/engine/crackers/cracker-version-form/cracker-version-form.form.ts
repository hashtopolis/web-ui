/**
 * This module contains the form and pure helpers to create and edit a cracker version (binary)
 */
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { CrackerSource } from '@models/cracker-binary.model';
import { AccessGroupId, CrackerBinaryTypeId } from '@models/id.types';

import { urlValidator } from '@src/app/core/_validators/url.validator';
import { SelectOption } from '@src/app/shared/utils/forms';

/** Maximum lengths of the backend columns */
export const BINARY_NAME_MAX_LENGTH = 50;
export const VERSION_MAX_LENGTH = 20;

/**
 * Interface definition for the cracker version form
 * @prop binaryName     Binary base name without os dependent extension
 * @prop version        Version of the binary
 * @prop accessGroupId  Access group the binary belongs to
 * @prop source         Where the archive comes from (create only)
 * @prop downloadUrl    External download url (source external link, and edit of external binaries)
 * @prop file           Archive to upload (source upload)
 * @prop sourceUrl      Url the server downloads the archive from (source server download)
 * @prop importFile     Filename in the server import directory (source server import)
 */
export interface CrackerVersionForm {
  binaryName: FormControl<string>;
  version: FormControl<string>;
  accessGroupId: FormControl<AccessGroupId | null>;
  source: FormControl<CrackerSource>;
  downloadUrl: FormControl<string>;
  file: FormControl<FileList | null>;
  sourceUrl: FormControl<string>;
  importFile: FormControl<string | null>;
}

/** Select options for the source of a new cracker version */
export const CRACKER_SOURCE_OPTIONS: SelectOption<CrackerSource>[] = [
  { id: CrackerSource.EXTERNAL_LINK, name: 'External link' },
  { id: CrackerSource.UPLOAD, name: 'Upload' },
  { id: CrackerSource.SERVER_DOWNLOAD, name: 'Server download' },
  { id: CrackerSource.SERVER_IMPORT, name: 'Server import' }
];

/** The form control holding the archive reference for each source */
const SOURCE_CONTROLS = {
  [CrackerSource.EXTERNAL_LINK]: 'downloadUrl',
  [CrackerSource.UPLOAD]: 'file',
  [CrackerSource.SERVER_DOWNLOAD]: 'sourceUrl',
  [CrackerSource.SERVER_IMPORT]: 'importFile'
} as const satisfies Record<CrackerSource, keyof CrackerVersionForm>;

/**
 * Check if a filename has the .7z extension
 * @param name Filename to check
 */
export function isSevenZipFilename(name: string): boolean {
  return /\.7z$/i.test(name);
}

/** Validator requiring the selected file to be a .7z archive */
function sevenZipFileValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const files = control.value as FileList | null;
    if (!files || files.length === 0) {
      return null;
    }
    return isSevenZipFilename(files[0].name) ? null : { sevenZip: true };
  };
}

/**
 * Get empty instance of the cracker version form, with source external link
 * @return Form group of CrackerVersionForm
 */
export const getCrackerVersionForm = (): FormGroup<CrackerVersionForm> => {
  const form = new FormGroup<CrackerVersionForm>({
    binaryName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(BINARY_NAME_MAX_LENGTH)]
    }),
    version: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(VERSION_MAX_LENGTH)]
    }),
    accessGroupId: new FormControl<AccessGroupId | null>(null, [Validators.required]),
    source: new FormControl<CrackerSource>(CrackerSource.EXTERNAL_LINK, { nonNullable: true }),
    downloadUrl: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, urlValidator()] }),
    file: new FormControl<FileList | null>(null, [Validators.required, sevenZipFileValidator()]),
    sourceUrl: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, urlValidator()] }),
    importFile: new FormControl<string | null>(null, [Validators.required])
  });
  applyCrackerSource(form, CrackerSource.EXTERNAL_LINK);
  return form;
};

/**
 * Select the given source and enable its control while disabling the controls of all
 * other sources, so only the active one is validated and part of form.value
 * @param form   Cracker version form
 * @param source Selected source
 */
export function applyCrackerSource(form: FormGroup<CrackerVersionForm>, source: CrackerSource): void {
  if (form.controls.source.value !== source) {
    form.controls.source.setValue(source, { emitEvent: false });
  }
  for (const [key, controlName] of Object.entries(SOURCE_CONTROLS)) {
    const control = form.controls[controlName];
    if (key === source) {
      control.enable({ emitEvent: false });
    } else {
      control.disable({ emitEvent: false });
    }
  }
}

/**
 * Name the archive is uploaded under via TUS. The backend import only accepts plain
 * basenames and renames the archive anyway. The name is derived from the file so a
 * resumed TUS upload of the same file ends up under the name the create request uses.
 * @param typeId Cracker binary type id
 * @param file   Selected archive (size and last modification identify it, like the TUS fingerprint)
 */
export function buildUploadFilename(typeId: CrackerBinaryTypeId, file: Pick<File, 'size' | 'lastModified'>): string {
  return `cracker-${typeId}-${file.lastModified}-${file.size}.7z`;
}

/** Attributes sent to POST /ui/crackers */
export type CrackerBinaryCreatePayload = {
  crackerBinaryTypeId: CrackerBinaryTypeId;
  binaryName: string;
  version: string;
  accessGroupId: AccessGroupId;
  downloadUrl?: string;
  sourceType?: 'import' | 'url';
  sourceData?: string;
};

/**
 * Build the create payload for the active source
 * @param form            Valid cracker version form
 * @param typeId          Cracker binary type the version belongs to
 * @param uploadFilename  Name the archive was uploaded under (source upload only)
 */
export function buildCreatePayload(
  form: FormGroup<CrackerVersionForm>,
  typeId: CrackerBinaryTypeId,
  uploadFilename?: string
): CrackerBinaryCreatePayload {
  const value = form.getRawValue();
  const payload: CrackerBinaryCreatePayload = {
    crackerBinaryTypeId: typeId,
    binaryName: value.binaryName,
    version: value.version,
    accessGroupId: value.accessGroupId as AccessGroupId
  };
  switch (value.source) {
    case CrackerSource.EXTERNAL_LINK:
      return { ...payload, downloadUrl: value.downloadUrl.trim() };
    case CrackerSource.UPLOAD:
      return { ...payload, sourceType: 'import', sourceData: uploadFilename ?? '' };
    case CrackerSource.SERVER_DOWNLOAD:
      return { ...payload, sourceType: 'url', sourceData: value.sourceUrl.trim() };
    case CrackerSource.SERVER_IMPORT:
      return { ...payload, sourceType: 'import', sourceData: value.importFile ?? '' };
  }
}

/**
 * Build the patch payload from the dirty controls only. The backend rejects any request
 * containing downloadUrl for binaries stored on the server, even with an unchanged value.
 * @param form              Cracker version form in edit mode
 * @param isStoredOnServer  True if the binary has a filename (archive stored on the server)
 */
export function buildUpdatePayload(
  form: FormGroup<CrackerVersionForm>,
  isStoredOnServer: boolean
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  const { binaryName, version, accessGroupId, downloadUrl } = form.controls;
  if (binaryName.dirty) payload['binaryName'] = binaryName.value;
  if (version.dirty) payload['version'] = version.value;
  if (accessGroupId.dirty) payload['accessGroupId'] = accessGroupId.value;
  if (!isStoredOnServer && downloadUrl.dirty) payload['downloadUrl'] = downloadUrl.value.trim();
  return payload;
}

/**
 * Extract the backend reason from a failed request
 * @param error Error thrown by HttpClient or the TUS service
 * @return The message, or null if none could be found
 */
export function extractErrorMessage(error: unknown): string | null {
  if (typeof error === 'string') {
    return error;
  }
  const e = (typeof error === 'object' && error !== null ? error : null) as {
    error?: { title?: string; message?: string };
    message?: string;
  } | null;
  return e?.error?.title || e?.error?.message || e?.message || null;
}
