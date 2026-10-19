import { HashSource } from '@constants/hashlist.config';
import { HttpHeaderName } from '@constants/http.config';
import { EMPTY, concat, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { UploadTUSService } from '@services/files/files_tus.service';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { StaticArrayPipe } from '@src/app/core/_pipes/static-array.pipe';
import { ImportCrackedHashesComponent } from '@src/app/hashlists/import-cracked-hashes/import-cracked-hashes.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { mockResponse } from '@src/app/testing/mock-response';

const mockServerImportFiles: ResponseWrapper = mockResponse({
  data: [],
  meta: [{ file: 'cracked1.txt' }, { file: 'cracked2.txt' }]
});

describe('ImportCrackedHashesComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  let component: ImportCrackedHashesComponent;
  let fixture: ComponentFixture<ImportCrackedHashesComponent>;

  let gsSpy: MockedObject<GlobalService>;
  let uploadSpy: MockedObject<UploadTUSService>;
  let alertSpy: MockedObject<AlertService>;
  let titleSpy: MockedObject<AutoTitleService>;
  let routerSpy: MockedObject<Router>;

  beforeEach(async () => {
    gsSpy = {
      get: vi.fn().mockName('GlobalService.get'),
      chelper: vi.fn().mockName('GlobalService.chelper')
    } as MockedObject<GlobalService>;
    uploadSpy = {
      uploadFile: vi.fn().mockName('UploadTUSService.uploadFile')
    } as MockedObject<UploadTUSService>;
    alertSpy = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage')
    } as MockedObject<AlertService>;
    titleSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;
    routerSpy = {
      navigate: vi.fn().mockName('Router.navigate')
    } as MockedObject<Router>;

    await TestBed.configureTestingModule({
      declarations: [ImportCrackedHashesComponent],
      imports: [
        ReactiveFormsModule,
        InputModule,
        ButtonsModule,
        ComponentsModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatIconModule
      ],
      providers: [
        StaticArrayPipe,
        { provide: GlobalService, useValue: gsSpy },
        { provide: UploadTUSService, useValue: uploadSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: AutoTitleService, useValue: titleSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '42' }) }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // ngOnInit loads the hashlist through gs.get, which these specs never answer. Without a return value
    // the subscription throws, and RxJS rethrows that error from a timer that the fake clock would run
    // inside the next test. An observable that never emits leaves the component in the same state.
    gsSpy.get.mockReturnValue(EMPTY);
    gsSpy.chelper.mockReturnValue(of(mockServerImportFiles));
    fixture = TestBed.createComponent(ImportCrackedHashesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title on construction', () => {
    expect(titleSpy.set).toHaveBeenCalledWith(['Import Cracked Hashes']);
  });

  it('should build form on construction', () => {
    expect(component.form).toBeDefined();
    expect(component.selectSource).toBeDefined();
    expect(component.selectSource.length).toBe(4);
  });

  describe('resetHashesValidator', () => {
    it('should clear validators, reset value and update validity', () => {
      component.resetHashesValidator();
      const hashesCtrl = component.form.controls.hashes;
      expect(hashesCtrl.value).toBe('');
    });
  });

  describe('onFilesSelected', () => {
    it('should set selectedFiles, fileName and sourceData', () => {
      const file = new File(['hash:password'], 'cracked.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fileList = dataTransfer.files;

      component.onFilesSelected(fileList);

      expect(component.selectedFiles).toBe(fileList);
      expect(component.fileName).toBe('cracked.txt');
      expect(component.form.controls.sourceData.value).toBe('cracked.txt');
    });
  });

  describe('sourceType getter', () => {
    it('should return current sourceType value', () => {
      component.form.patchValue({ sourceType: 'paste' });
      expect(component.sourceType).toBe('paste');
    });

    it('should return upload when set', () => {
      component.form.patchValue({ sourceType: 'upload' });
      expect(component.sourceType).toBe('upload');
    });

    it('should return import when set', () => {
      component.form.patchValue({ sourceType: 'import' });
      expect(component.sourceType).toBe('import');
    });

    it('should return url when set', () => {
      component.form.patchValue({ sourceType: 'url' });
      expect(component.sourceType).toBe('url');
    });
  });

  describe('sourceType change behavior', () => {
    it('should set hashesAreRequired to true when sourceType is paste', async () => {
      component.form.controls.sourceType.setValue('paste');
      await vi.advanceTimersByTimeAsync(0);
      expect(component.hashesAreRequired).toBe(true);
    });

    it('should set required validator on hashes control when sourceType is paste', async () => {
      component.form.controls.sourceType.setValue('paste');
      await vi.advanceTimersByTimeAsync(0);
      const hashesCtrl = component.form.controls.hashes;
      expect(hashesCtrl.hasError('required')).toBe(true);
    });

    it('should reset hashes when sourceType is not paste', async () => {
      component.form.controls.hashes.setValue('some:data');
      component.form.controls.sourceType.setValue('upload');
      await vi.advanceTimersByTimeAsync(0);
      expect(component.form.controls.hashes.value).toBe('');
    });

    it('should reset sourceData when sourceType is paste', async () => {
      component.form.patchValue({ sourceData: 'somefile.txt' });
      component.form.controls.sourceType.setValue('paste');
      await vi.advanceTimersByTimeAsync(0);
      expect(component.form.controls.sourceData.value).toBe('');
    });

    it('should reset selectedFiles, fileName and uploadProgress when sourceType is not upload', async () => {
      component.selectedFiles = {} as FileList;
      component.fileName = 'test.txt';
      component.uploadProgress = 50;
      component.form.controls.sourceType.setValue('paste');
      await vi.advanceTimersByTimeAsync(0);
      expect(component.selectedFiles).toBeNull();
      expect(component.fileName).toBe('');
      expect(component.uploadProgress).toBe(0);
    });

    it('should call loadServerFiles when sourceType is import and files not loaded', async () => {
      gsSpy.chelper.mockReturnValue(of(mockServerImportFiles));
      const loadSpy = vi.spyOn(component, 'loadServerFiles');
      component.form.controls.sourceType.setValue('import');
      await vi.advanceTimersByTimeAsync(0);
      expect(loadSpy).toHaveBeenCalled();
    });

    it('should call loadServerFiles every time sourceType becomes import (refresh, not cached)', async () => {
      gsSpy.chelper.mockReturnValue(of(mockServerImportFiles));
      const loadSpy = vi.spyOn(component, 'loadServerFiles').mockResolvedValue();
      component.form.controls.sourceType.setValue('import');
      await vi.advanceTimersByTimeAsync(0);
      component.form.controls.sourceType.setValue('paste');
      await vi.advanceTimersByTimeAsync(0);
      component.form.controls.sourceType.setValue('import');
      await vi.advanceTimersByTimeAsync(0);
      expect(loadSpy).toHaveBeenCalledTimes(2);
    });

    it('should NOT call loadServerFiles when sourceType is import but files already loading', async () => {
      component.isLoadingServerFiles = true;
      const loadSpy = vi.spyOn(component, 'loadServerFiles').mockResolvedValue();
      component.form.controls.sourceType.setValue('import');
      await vi.advanceTimersByTimeAsync(0);
      expect(loadSpy).not.toHaveBeenCalled();
    });

    it('should reset hashesAreRequired to false when switching from paste to upload', async () => {
      component.form.controls.sourceType.setValue('paste');
      await vi.advanceTimersByTimeAsync(0);
      expect(component.hashesAreRequired).toBe(true);

      component.form.controls.sourceType.setValue('upload');
      await vi.advanceTimersByTimeAsync(0);
      expect(component.hashesAreRequired).toBe(false);
    });

    it('should reset hashesAreRequired to false when switching from paste to import', async () => {
      component.form.controls.sourceType.setValue('paste');
      await vi.advanceTimersByTimeAsync(0);
      expect(component.hashesAreRequired).toBe(true);

      component.form.controls.sourceType.setValue('import');
      await vi.advanceTimersByTimeAsync(0);
      expect(component.hashesAreRequired).toBe(false);
    });

    it('should reset hashesAreRequired to false when switching from paste to url', async () => {
      component.form.controls.sourceType.setValue('paste');
      await vi.advanceTimersByTimeAsync(0);
      expect(component.hashesAreRequired).toBe(true);

      component.form.controls.sourceType.setValue('url');
      await vi.advanceTimersByTimeAsync(0);
      expect(component.hashesAreRequired).toBe(false);
    });
  });

  describe('loadServerFiles', () => {
    it('should load server files and set options', async () => {
      gsSpy.chelper.mockReturnValue(of(mockServerImportFiles));
      await component.loadServerFiles();
      await vi.advanceTimersByTimeAsync(0);
      expect(component.serverFiles.length).toBe(2);
      expect(component.serverFileOptions.length).toBe(2);
      expect(component.isLoadingServerFiles).toBe(false);
    });

    it('should handle empty meta array', async () => {
      const emptyResponse: ResponseWrapper = mockResponse({ data: [], meta: [] });
      gsSpy.chelper.mockReturnValue(of(emptyResponse));
      await component.loadServerFiles();
      await vi.advanceTimersByTimeAsync(0);
      expect(component.serverFiles.length).toBe(0);
      expect(component.serverFileOptions.length).toBe(0);
      expect(component.isLoadingServerFiles).toBe(false);
    });

    it('should handle error and show alert', async () => {
      const error = new Error('Network error');
      error.stack = '';
      gsSpy.chelper.mockReturnValue(throwError(() => error));
      const consoleSpy = vi.spyOn(console, 'error').mockReturnValue(undefined);
      await component.loadServerFiles();
      await vi.advanceTimersByTimeAsync(0);
      expect(consoleSpy).toHaveBeenCalled();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Could not load files from server import directory.');
      expect(component.isLoadingServerFiles).toBe(false);
    });

    it('should always set isLoadingServerFiles to false in finally block', async () => {
      const error = new Error('Error');
      error.stack = '';
      gsSpy.chelper.mockReturnValue(throwError(() => error));
      component.isLoadingServerFiles = false;
      await component.loadServerFiles();
      await vi.advanceTimersByTimeAsync(0);
      expect(component.isLoadingServerFiles).toBe(false);
    });

    // Regression guard for the stale-while-revalidate bug: HttpCacheInterceptor serves a stale
    // cached value first, then the revalidated fresh one (concat(of(stale), revalidate())).
    // firstValueFrom took the stale list (file added after login stayed hidden until re-login);
    // the fix uses lastValueFrom, which resolves on the revalidated emission.
    it('uses the revalidated (fresh) emission, not the stale-while-revalidate cache hit', async () => {
      const stale: ResponseWrapper = mockResponse({ data: [], meta: [{ file: 'cached.txt' }] });
      const fresh: ResponseWrapper = mockResponse({
        data: [],
        meta: [{ file: 'cached.txt' }, { file: 'added-after-login.txt' }]
      });
      gsSpy.chelper.mockReturnValue(concat(of(stale), of(fresh)));

      await component.loadServerFiles();
      await vi.advanceTimersByTimeAsync(0);

      expect(component.serverFiles.map((f) => f.file)).toEqual(['cached.txt', 'added-after-login.txt']);
      expect(component.serverFileOptions.map((o) => o.name)).toEqual(['cached.txt', 'added-after-login.txt']);
    });
  });

  describe('onSubmit - form validation', () => {
    it('should mark form as touched when invalid', () => {
      component.form.reset();
      component.onSubmit();
      expect(component.form.touched).toBe(true);
    });

    it('should call updateValueAndValidity when form is invalid', () => {
      const updateSpy = vi.spyOn(component.form, 'updateValueAndValidity').mockReturnValue(undefined);
      component.form.reset();
      component.onSubmit();
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('onSubmit - sourceType upload', () => {
    beforeEach(() => {
      component.form.patchValue({
        fieldSeparator: ':',
        conflictResolution: false
      });
    });

    it('should show error when no file selected', () => {
      component.form.patchValue({ sourceType: 'upload' });
      component.selectedFiles = null;
      component.onSubmit();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Please select a file to upload.');
    });

    it('should show error when files length is 0', () => {
      component.form.patchValue({ sourceType: 'upload' });
      component.selectedFiles = { length: 0 } as FileList;
      component.onSubmit();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Please select a file to upload.');
    });
  });

  describe('onSubmit - sourceType paste', () => {
    beforeEach(() => {
      component.form.patchValue({
        fieldSeparator: ':',
        conflictResolution: false
      });
    });

    it('should show error when hashes are only whitespace', () => {
      component.form.patchValue({
        sourceType: 'paste',
        hashes: '   '
      });
      component.onSubmit();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Please paste hashes to import.');
    });

    it('should show error when hashes do not contain separator', () => {
      component.form.patchValue({
        sourceType: 'paste',
        hashes: 'hashpassword#adf'
      });
      component.onSubmit();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('The hash must contain the specified separator!');
    });
  });

  describe('submitImport error handling', () => {
    it('should surface the backend error, skip the global dialog and clear loading when the import fails', async () => {
      gsSpy.chelper.mockReturnValue(
        throwError(() => ({ status: 400, error: { title: 'Cracked hash file has too many lines!' } }))
      );
      component.form.patchValue({
        sourceType: 'paste',
        fieldSeparator: ':',
        conflictResolution: false,
        hashes: 'hash:password'
      });

      component.onSubmit();
      await vi.advanceTimersByTimeAsync(0);

      // The component handles the error itself, so it tells the interceptor to skip the modal.
      const call = vi.mocked(gsSpy.chelper).mock.lastCall!;
      expect(call[1]).toBe('importCrackedHashes');
      const httpOptions = call[4];
      expect(httpOptions?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');

      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith(
        'Failed to import cracked hashes: Cracked hash file has too many lines!'
      );
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      expect(component.isCreatingLoading).toBe(false);
    });
  });

  describe('onSubmit - sourceType import', () => {
    beforeEach(() => {
      component.form.patchValue({
        fieldSeparator: ':',
        conflictResolution: false
      });
    });

    it('should show error when sourceData is empty', () => {
      component.form.patchValue({
        sourceType: 'import',
        sourceData: ''
      });
      component.onSubmit();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Please select a file from the server import directory.');
    });

    it('should show error when sourceData is whitespace only', () => {
      component.form.patchValue({
        sourceType: 'import',
        sourceData: '   '
      });
      component.onSubmit();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Please select a file from the server import directory.');
    });
  });

  describe('onSubmit - sourceType url', () => {
    beforeEach(() => {
      component.form.patchValue({
        fieldSeparator: ':',
        conflictResolution: false
      });
    });

    it('should show error when URL is empty', () => {
      component.form.patchValue({
        sourceType: 'url',
        sourceData: ''
      });
      component.onSubmit();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Please provide a URL to download cracked hashes from.');
    });

    it('should show error when URL is whitespace only', () => {
      component.form.patchValue({
        sourceType: 'url',
        sourceData: '  '
      });
      component.onSubmit();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Please provide a URL to download cracked hashes from.');
    });
  });

  describe('onSubmit - unknown source type', () => {
    it('should show error when sourceType is unknown', () => {
      component.form.patchValue({
        sourceType: 'unknown' as HashSource,
        fieldSeparator: ':'
      });
      component.onSubmit();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Unknown source type selected.');
    });
  });

  describe('buildForm', () => {
    it('should create a new form instance', () => {
      const oldForm = component.form;
      component.buildForm();
      expect(component.form).not.toBe(oldForm);
      expect(component.form).toBeDefined();
    });
  });

  describe('default values', () => {
    it('should have empty serverFiles array', () => {
      expect(component.serverFiles).toEqual([]);
    });

    it('should have empty serverFileOptions array', () => {
      expect(component.serverFileOptions).toEqual([]);
    });

    it('should have isLoadingServerFiles as false', () => {
      expect(component.isLoadingServerFiles).toBe(false);
    });

    it('should have hashesAreRequired as false initially', () => {
      expect(component.hashesAreRequired).toBe(false);
    });

    it('should have uploadProgress as 0', () => {
      expect(component.uploadProgress).toBe(0);
    });
  });
});
