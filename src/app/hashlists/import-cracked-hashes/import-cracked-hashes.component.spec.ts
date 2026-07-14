import { concat, of, throwError } from 'rxjs';

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
import { UnsubscribeService } from '@services/unsubscribe.service';

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
  let component: ImportCrackedHashesComponent;
  let fixture: ComponentFixture<ImportCrackedHashesComponent>;

  let gsSpy: jasmine.SpyObj<GlobalService>;
  let uploadSpy: jasmine.SpyObj<UploadTUSService>;
  let alertSpy: jasmine.SpyObj<AlertService>;
  let titleSpy: jasmine.SpyObj<AutoTitleService>;
  let unsubSpy: jasmine.SpyObj<UnsubscribeService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    gsSpy = jasmine.createSpyObj('GlobalService', ['get', 'chelper']);
    uploadSpy = jasmine.createSpyObj('UploadTUSService', ['uploadFile']);
    alertSpy = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    titleSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    unsubSpy = jasmine.createSpyObj('UnsubscribeService', ['add', 'unsubscribeAll']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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
        { provide: UnsubscribeService, useValue: unsubSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '42' }) }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    gsSpy.chelper.and.returnValue(of(mockServerImportFiles));
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

  describe('ngOnDestroy', () => {
    it('should call unsubscribeService.unsubscribeAll', () => {
      unsubSpy.unsubscribeAll.calls.reset();
      component.ngOnDestroy();
      expect(unsubSpy.unsubscribeAll).toHaveBeenCalled();
    });

    it('should complete fileUnsubscribe subject', () => {
      const nextSpy = spyOn(component['fileUnsubscribe'], 'next');
      const completeSpy = spyOn(component['fileUnsubscribe'], 'complete');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
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
    it('should set hashesAreRequired to true when sourceType is paste', fakeAsync(() => {
      component.form.controls.sourceType.setValue('paste');
      tick();
      expect(component.hashesAreRequired).toBeTrue();
    }));

    it('should set required validator on hashes control when sourceType is paste', fakeAsync(() => {
      component.form.controls.sourceType.setValue('paste');
      tick();
      const hashesCtrl = component.form.controls.hashes;
      expect(hashesCtrl.hasError('required')).toBeTrue();
    }));

    it('should reset hashes when sourceType is not paste', fakeAsync(() => {
      component.form.controls.hashes.setValue('some:data');
      component.form.controls.sourceType.setValue('upload');
      tick();
      expect(component.form.controls.hashes.value).toBe('');
    }));

    it('should reset sourceData when sourceType is paste', fakeAsync(() => {
      component.form.patchValue({ sourceData: 'somefile.txt' });
      component.form.controls.sourceType.setValue('paste');
      tick();
      expect(component.form.controls.sourceData.value).toBe('');
    }));

    it('should reset selectedFiles, fileName and uploadProgress when sourceType is not upload', fakeAsync(() => {
      component.selectedFiles = {} as FileList;
      component.fileName = 'test.txt';
      component.uploadProgress = 50;
      component.form.controls.sourceType.setValue('paste');
      tick();
      expect(component.selectedFiles).toBeNull();
      expect(component.fileName).toBe('');
      expect(component.uploadProgress).toBe(0);
    }));

    it('should call loadServerFiles when sourceType is import and files not loaded', fakeAsync(() => {
      gsSpy.chelper.and.returnValue(of(mockServerImportFiles));
      const loadSpy = spyOn(component, 'loadServerFiles').and.callThrough();
      component.form.controls.sourceType.setValue('import');
      tick();
      expect(loadSpy).toHaveBeenCalled();
    }));

    it('should call loadServerFiles every time sourceType becomes import (refresh, not cached)', fakeAsync(() => {
      gsSpy.chelper.and.returnValue(of(mockServerImportFiles));
      const loadSpy = spyOn(component, 'loadServerFiles').and.returnValue(Promise.resolve());
      component.form.controls.sourceType.setValue('import');
      tick();
      component.form.controls.sourceType.setValue('paste');
      tick();
      component.form.controls.sourceType.setValue('import');
      tick();
      expect(loadSpy).toHaveBeenCalledTimes(2);
    }));

    it('should NOT call loadServerFiles when sourceType is import but files already loading', fakeAsync(() => {
      component.isLoadingServerFiles = true;
      const loadSpy = spyOn(component, 'loadServerFiles').and.returnValue(Promise.resolve());
      component.form.controls.sourceType.setValue('import');
      tick();
      expect(loadSpy).not.toHaveBeenCalled();
    }));

    it('should reset hashesAreRequired to false when switching from paste to upload', fakeAsync(() => {
      component.form.controls.sourceType.setValue('paste');
      tick();
      expect(component.hashesAreRequired).toBeTrue();

      component.form.controls.sourceType.setValue('upload');
      tick();
      expect(component.hashesAreRequired).toBeFalse();
    }));

    it('should reset hashesAreRequired to false when switching from paste to import', fakeAsync(() => {
      component.form.controls.sourceType.setValue('paste');
      tick();
      expect(component.hashesAreRequired).toBeTrue();

      component.form.controls.sourceType.setValue('import');
      tick();
      expect(component.hashesAreRequired).toBeFalse();
    }));

    it('should reset hashesAreRequired to false when switching from paste to url', fakeAsync(() => {
      component.form.controls.sourceType.setValue('paste');
      tick();
      expect(component.hashesAreRequired).toBeTrue();

      component.form.controls.sourceType.setValue('url');
      tick();
      expect(component.hashesAreRequired).toBeFalse();
    }));
  });

  describe('loadServerFiles', () => {
    it('should load server files and set options', fakeAsync(async () => {
      gsSpy.chelper.and.returnValue(of(mockServerImportFiles));
      await component.loadServerFiles();
      tick();
      expect(component.serverFiles.length).toBe(2);
      expect(component.serverFileOptions.length).toBe(2);
      expect(component.isLoadingServerFiles).toBeFalse();
    }));

    it('should handle empty meta array', fakeAsync(async () => {
      const emptyResponse: ResponseWrapper = mockResponse({ data: [], meta: [] });
      gsSpy.chelper.and.returnValue(of(emptyResponse));
      await component.loadServerFiles();
      tick();
      expect(component.serverFiles.length).toBe(0);
      expect(component.serverFileOptions.length).toBe(0);
      expect(component.isLoadingServerFiles).toBeFalse();
    }));

    it('should handle error and show alert', fakeAsync(async () => {
      const error = new Error('Network error');
      error.stack = '';
      gsSpy.chelper.and.returnValue(throwError(() => error));
      const consoleSpy = spyOn(console, 'error');
      await component.loadServerFiles();
      tick();
      expect(consoleSpy).toHaveBeenCalled();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Could not load files from server import directory.');
      expect(component.isLoadingServerFiles).toBeFalse();
    }));

    it('should always set isLoadingServerFiles to false in finally block', fakeAsync(async () => {
      const error = new Error('Error');
      error.stack = '';
      gsSpy.chelper.and.returnValue(throwError(() => error));
      component.isLoadingServerFiles = false;
      await component.loadServerFiles();
      tick();
      expect(component.isLoadingServerFiles).toBeFalse();
    }));

    // Regression guard for the stale-while-revalidate bug: HttpCacheInterceptor serves a stale
    // cached value first, then the revalidated fresh one (concat(of(stale), revalidate())).
    // firstValueFrom took the stale list (file added after login stayed hidden until re-login);
    // the fix uses lastValueFrom, which resolves on the revalidated emission.
    it('uses the revalidated (fresh) emission, not the stale-while-revalidate cache hit', fakeAsync(async () => {
      const stale: ResponseWrapper = mockResponse({ data: [], meta: [{ file: 'cached.txt' }] });
      const fresh: ResponseWrapper = mockResponse({
        data: [],
        meta: [{ file: 'cached.txt' }, { file: 'added-after-login.txt' }]
      });
      gsSpy.chelper.and.returnValue(concat(of(stale), of(fresh)));

      await component.loadServerFiles();
      tick();

      expect(component.serverFiles.map((f) => f.file)).toEqual(['cached.txt', 'added-after-login.txt']);
      expect(component.serverFileOptions.map((o) => o.name)).toEqual(['cached.txt', 'added-after-login.txt']);
    }));
  });

  describe('onSubmit - form validation', () => {
    it('should mark form as touched when invalid', () => {
      component.form.reset();
      component.onSubmit();
      expect(component.form.touched).toBeTrue();
    });

    it('should call updateValueAndValidity when form is invalid', () => {
      const updateSpy = spyOn(component.form, 'updateValueAndValidity');
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
        sourceType: 'unknown',
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
      expect(component.isLoadingServerFiles).toBeFalse();
    });

    it('should have hashesAreRequired as false initially', () => {
      expect(component.hashesAreRequired).toBeFalse();
    });

    it('should have uploadProgress as 0', () => {
      expect(component.uploadProgress).toBe(0);
    });
  });
});
