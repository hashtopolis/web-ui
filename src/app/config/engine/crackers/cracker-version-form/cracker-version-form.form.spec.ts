import { HttpErrorResponse } from '@angular/common/http';

import { CrackerSource } from '@models/cracker-binary.model';

import {
  applyCrackerSource,
  buildCreatePayload,
  buildUpdatePayload,
  buildUploadFilename,
  extractErrorMessage,
  getCrackerVersionForm,
  isSevenZipFilename
} from '@src/app/config/engine/crackers/cracker-version-form/cracker-version-form.form';

function fileList(name: string): FileList {
  const dt = new DataTransfer();
  dt.items.add(new File(['7z'], name));
  return dt.files;
}

describe('cracker-version-form helpers', () => {
  it('starts with External link and only downloadUrl enabled', () => {
    const form = getCrackerVersionForm();
    expect(form.controls.source.value).toBe(CrackerSource.EXTERNAL_LINK);
    expect(form.controls.downloadUrl.enabled).toBeTrue();
    expect(form.controls.file.enabled).toBeFalse();
    expect(form.controls.sourceUrl.enabled).toBeFalse();
    expect(form.controls.importFile.enabled).toBeFalse();
  });

  it('applyCrackerSource enables exactly the control of the chosen source', () => {
    const form = getCrackerVersionForm();
    applyCrackerSource(form, CrackerSource.SERVER_IMPORT);
    expect(form.controls.importFile.enabled).toBeTrue();
    expect(form.controls.downloadUrl.enabled).toBeFalse();
  });

  it('validates required fields and max lengths', () => {
    const form = getCrackerVersionForm();
    form.patchValue({
      binaryName: 'x'.repeat(51),
      version: 'y'.repeat(21),
      accessGroupId: 1,
      downloadUrl: 'https://e.com/a.7z'
    });
    expect(form.controls.binaryName.hasError('maxlength')).toBeTrue();
    expect(form.controls.version.hasError('maxlength')).toBeTrue();
    form.patchValue({ binaryName: 'hashcat', version: '7.1.2' });
    expect(form.valid).toBeTrue();
  });

  it('rejects non http(s) urls for external link and server download', () => {
    const form = getCrackerVersionForm();
    form.controls.downloadUrl.setValue('ftp://e.com/a.7z');
    expect(form.controls.downloadUrl.valid).toBeFalse();
    applyCrackerSource(form, CrackerSource.SERVER_DOWNLOAD);
    form.controls.sourceUrl.setValue('file:///etc/passwd');
    expect(form.controls.sourceUrl.valid).toBeFalse();
  });

  it('rejects uploads that are not .7z', () => {
    const form = getCrackerVersionForm();
    applyCrackerSource(form, CrackerSource.UPLOAD);
    form.controls.file.setValue(fileList('hashcat.zip'));
    expect(form.controls.file.hasError('sevenZip')).toBeTrue();
    form.controls.file.setValue(fileList('hashcat.7z'));
    expect(form.controls.file.valid).toBeTrue();
  });

  it('isSevenZipFilename matches case insensitively', () => {
    expect(isSevenZipFilename('a.7Z')).toBeTrue();
    expect(isSevenZipFilename('a.7z.part')).toBeFalse();
  });

  it('buildUploadFilename is safe for the backend import check and stable per file', () => {
    const file = { size: 2, lastModified: 1700000000000 };
    expect(buildUploadFilename(3, file)).toBe('cracker-3-1700000000000-2.7z');
    expect(buildUploadFilename(3, { ...file })).toBe(buildUploadFilename(3, file));
  });

  describe('buildCreatePayload', () => {
    function baseForm() {
      const form = getCrackerVersionForm();
      form.patchValue({ binaryName: 'hashcat', version: '7.1.2', accessGroupId: 4 });
      return form;
    }

    it('external link sends downloadUrl only', () => {
      const form = baseForm();
      form.controls.downloadUrl.setValue('https://e.com/h.7z');
      expect(buildCreatePayload(form, 1)).toEqual({
        crackerBinaryTypeId: 1,
        binaryName: 'hashcat',
        version: '7.1.2',
        accessGroupId: 4,
        downloadUrl: 'https://e.com/h.7z'
      });
    });

    it('upload sends sourceType import with the uploaded name', () => {
      const form = baseForm();
      applyCrackerSource(form, CrackerSource.UPLOAD);
      expect(buildCreatePayload(form, 1, 'cracker-1-5.7z')).toEqual({
        crackerBinaryTypeId: 1,
        binaryName: 'hashcat',
        version: '7.1.2',
        accessGroupId: 4,
        sourceType: 'import',
        sourceData: 'cracker-1-5.7z'
      });
    });

    it('server download sends sourceType url', () => {
      const form = baseForm();
      applyCrackerSource(form, CrackerSource.SERVER_DOWNLOAD);
      form.controls.sourceUrl.setValue('https://e.com/h.7z');
      expect(buildCreatePayload(form, 1)).toEqual(
        jasmine.objectContaining({ sourceType: 'url', sourceData: 'https://e.com/h.7z' })
      );
    });

    it('server import sends sourceType import with the chosen file', () => {
      const form = baseForm();
      applyCrackerSource(form, CrackerSource.SERVER_IMPORT);
      form.controls.importFile.setValue('hashcat-7.1.2.7z');
      expect(buildCreatePayload(form, 1)).toEqual(
        jasmine.objectContaining({ sourceType: 'import', sourceData: 'hashcat-7.1.2.7z' })
      );
    });

    it('does not leak values of a previously selected source', () => {
      const form = baseForm();
      applyCrackerSource(form, CrackerSource.SERVER_DOWNLOAD);
      form.controls.sourceUrl.setValue('https://old.example/h.7z');
      applyCrackerSource(form, CrackerSource.EXTERNAL_LINK);
      form.controls.downloadUrl.setValue('https://e.com/h.7z');
      const payload = buildCreatePayload(form, 1);
      expect(payload.sourceType).toBeUndefined();
      expect(payload.sourceData).toBeUndefined();
    });
  });

  describe('buildUpdatePayload', () => {
    it('contains only dirty fields', () => {
      const form = getCrackerVersionForm();
      form.patchValue({ binaryName: 'hashcat', version: '7.1.2', accessGroupId: 1, downloadUrl: 'https://e.com/h.7z' });
      form.controls.version.setValue('7.1.3');
      form.controls.version.markAsDirty();
      expect(buildUpdatePayload(form, false)).toEqual({ version: '7.1.3' });
    });

    it('never contains downloadUrl for binaries stored on the server', () => {
      const form = getCrackerVersionForm();
      form.controls.downloadUrl.setValue('https://changed.example/h.7z');
      form.controls.downloadUrl.markAsDirty();
      expect(buildUpdatePayload(form, true)).toEqual({});
    });

    it('contains a changed downloadUrl for external binaries', () => {
      const form = getCrackerVersionForm();
      form.controls.downloadUrl.setValue('https://new.example/h.7z');
      form.controls.downloadUrl.markAsDirty();
      expect(buildUpdatePayload(form, false)).toEqual({ downloadUrl: 'https://new.example/h.7z' });
    });
  });

  describe('extractErrorMessage', () => {
    it('reads the JSON:API error title', () => {
      const err = new HttpErrorResponse({
        status: 400,
        error: { title: 'The provided archive is not a valid 7z archive!' }
      });
      expect(extractErrorMessage(err)).toBe('The provided archive is not a valid 7z archive!');
    });

    it('falls back to message and plain strings, else null', () => {
      expect(extractErrorMessage({ error: { message: 'm' } })).toBe('m');
      expect(extractErrorMessage('plain')).toBe('plain');
      expect(extractErrorMessage(undefined)).toBeNull();
    });
  });
});
