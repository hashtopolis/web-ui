import { HttpHeaderName } from '@constants/http.config';
import { zConfigResponse, zGetAccessGroupsHelperApiResponse, zHashTypeListResponse } from '@generated/api/zod';
import { concat, of, throwError } from 'rxjs';
import type { Mock, MockedObject } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { UploadTUSService } from '@services/files/files_tus.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { FileSizePipe } from '@src/app/core/_pipes/file-size.pipe';
import { NewHashlistComponent } from '@src/app/hashlists/new-hashlist/new-hashlist.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { PageSubTitleComponent } from '@src/app/shared/page-headers/page-subtitle/page-subtitle.component';
import { mockResponse, mockValidResponse } from '@src/app/testing/mock-response';

const mockAccessGroups: ResponseWrapper = mockValidResponse(zGetAccessGroupsHelperApiResponse, {
  data: [
    {
      id: 1,
      type: 'accessGroup',
      attributes: {
        groupName: 'Admin'
      }
    },
    {
      id: 2,
      type: 'accessGroup',
      attributes: {
        groupName: 'User'
      }
    }
  ]
});

const mockHashtypes: ResponseWrapper = mockValidResponse(zHashTypeListResponse, {
  data: [
    {
      id: 2500,
      type: 'hashType',
      attributes: {
        description: 'MD5',
        isSalted: true,
        isSlowHash: false
      }
    },
    {
      id: 0,
      type: 'hashType',
      attributes: {
        description: 'SHA1',
        isSalted: false,
        isSlowHash: false
      }
    },
    {
      id: 16800,
      type: 'hashType',
      attributes: {
        description: 'WPA/WPA2',
        isSalted: true,
        isSlowHash: true
      }
    }
  ]
});

const mockConfigs: ResponseWrapper = mockValidResponse(zConfigResponse, {
  data: {
    id: 66,
    type: 'config',
    attributes: {
      configSectionId: 1,
      item: 'Enable Brain',
      value: '1'
    }
  }
});

describe('NewHashlistComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  let component: NewHashlistComponent;
  let fixture: ComponentFixture<NewHashlistComponent>;

  let gsSpy: MockedObject<GlobalService>;
  let uploadSpy: MockedObject<UploadTUSService>;
  let alertSpy: MockedObject<AlertService>;
  let titleSpy: MockedObject<AutoTitleService>;
  let routerSpy: MockedObject<Router>;
  let dialogSpy: MockedObject<MatDialog>;

  beforeEach(async () => {
    gsSpy = {
      getAll: vi.fn().mockName('GlobalService.getAll'),
      get: vi.fn().mockName('GlobalService.get'),
      create: vi.fn().mockName('GlobalService.create'),
      ghelper: vi.fn().mockName('GlobalService.ghelper'),
      chelper: vi.fn().mockName('GlobalService.chelper')
    } as MockedObject<GlobalService>;
    Object.defineProperty(gsSpy, 'userId', { get: () => 1 });
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
    dialogSpy = {
      open: vi.fn().mockName('MatDialog.open')
    } as MockedObject<MatDialog>;

    await TestBed.configureTestingModule({
      declarations: [NewHashlistComponent, PageSubTitleComponent],
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
        FileSizePipe,
        { provide: GlobalService, useValue: gsSpy },
        { provide: UploadTUSService, useValue: uploadSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: AutoTitleService, useValue: titleSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    gsSpy.ghelper.mockReturnValue(of(mockAccessGroups));
    gsSpy.chelper.mockReturnValue(of({ meta: [] }));
    vi.when(gsSpy.getAll).calledWith(SERV.HASHTYPES).thenReturn(of(mockHashtypes));
    vi.when(gsSpy.get as Mock)
      .calledWith(SERV.CONFIGS, 66)
      .thenReturn(of(mockConfigs));
    dialogSpy.open.mockReturnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<unknown>);

    fixture = TestBed.createComponent(NewHashlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(titleSpy.set).toHaveBeenCalledWith(['New Hashlist']);
  });

  describe('Load server data', () => {
    it('should load access groups and hashtypes', () => {
      expect(component.hashtypes.length).toBe(3);
      expect(component.selectAccessgroup.length).toBe(2);
      expect(component.selectHashtypes.length).toBe(3);
      expect(component.isLoadingAccessGroups).toBe(false);
      expect(component.isLoadingHashtypes).toBe(false);
    });

    it('should load config and set brainenabled, keeping useBrain false by default', () => {
      expect(component.brainenabled).toBe(1);
      expect(component.form.controls.useBrain.value).toBe(false);
    });

    it('should auto-select the first access group when accessGroupId is null', () => {
      expect(component.form.controls.accessGroupId.value).toBe(1);
    });

    it('should not override an existing accessGroupId value', () => {
      component.form.controls.accessGroupId.setValue(2);
      expect(component.form.controls.accessGroupId.value).toBe(2);
    });
  });

  describe('Form changes', () => {
    it('should patch isSalted and format when hashTypeId changes', () => {
      // Simulate user changing the hashTypeId
      component.form.controls.hashTypeId.setValue('2500');

      // Allow Angular to process the valueChanges subscription (synchronously here)
      expect(component.form.controls.isSalted.value).toBe(true);
      expect(component.form.controls.format.value).toBe(1);
    });

    it('onFilesSelected should set fileName and selectedFiles', () => {
      const file = new File(['content'], 'hashes.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fileList = dataTransfer.files;

      component.onFilesSelected(fileList);

      expect(component.fileName).toBe('hashes.txt');
      expect(component.selectedFiles).toBe(fileList);
    });
    it('should keep submit button enabled when form is invalid', async () => {
      expect(component.form.invalid).toBe(true);

      let buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));
      let button = buttonDebugEl.query(By.css('button'));
      expect(button.nativeElement.disabled).toBe(false);

      component.form.patchValue({
        name: 'test',
        hashTypeId: '2500',
        accessGroupId: 1,
        format: 0,
        sourceType: 'upload',
        sourceData: 'hashes'
      });

      component.form.updateValueAndValidity();
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(0);
      fixture.detectChanges();

      expect(component.form.valid).toBe(true);

      // Re-query the button to get the updated DOM
      buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));
      button = buttonDebugEl.query(By.css('button'));
      expect(button.nativeElement.disabled).toBe(false);
    });
  });

  describe('Form submission', () => {
    it('should call uploadFile and update progress', async () => {
      const file = new File(['file contents'], 'hashes.txt', { type: 'text/plain' });

      // Use DataTransfer to get real FileList
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      component.selectedFiles = dataTransfer.files;

      // Patch form with required values and sourceType 'upload'
      component.form.patchValue({
        name: 'Test Hashlist',
        hashTypeId: '2500',
        accessGroupId: 1,
        format: 0,
        sourceType: 'upload'
      });

      uploadSpy.uploadFile.mockReturnValue(of(0, 50, 100));

      component.onSubmit();

      await vi.advanceTimersByTimeAsync(0);

      const expectedPayload = {
        ...component.form.value,
        sourceType: 'import',
        sourceData: 'hashes.txt'
      };

      expect(uploadSpy.uploadFile).toHaveBeenCalledWith(file, 'hashes.txt', SERV.HASHLISTS, expectedPayload, [
        '/hashlists/hashlist'
      ]);

      expect(component.uploadProgress).toBe(100);
      expect(component.isCreatingLoading).toBe(false);
    });

    it('should show the backend error message when the upload/creation fails', async () => {
      const file = new File(['file contents'], 'hashes.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      component.selectedFiles = dataTransfer.files;

      component.form.patchValue({
        name: 'Test Hashlist',
        hashTypeId: '2500',
        accessGroupId: 1,
        format: 0,
        sourceType: 'upload'
      });

      uploadSpy.uploadFile.mockReturnValue(
        throwError(() => ({ status: 400, error: { title: 'The hashlist contains too many lines.' } }))
      );

      component.onSubmit();
      await vi.advanceTimersByTimeAsync(0);

      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith(
        'Failed to create Hashlist: The hashlist contains too many lines.'
      );
      expect(component.uploadProgress).toBe(0);
      expect(component.isCreatingLoading).toBe(false);
    });

    it('should submit form with "paste" sourceType and base64-encode sourceData', async () => {
      gsSpy.create.mockReturnValue(of(mockResponse()));
      component.form.patchValue({
        name: 'Test Hashlist',
        hashTypeId: '0',
        accessGroupId: 1,
        format: 0,
        sourceType: 'paste',
        sourceData: 'some data'
      });
      component.onSubmit();
      await vi.advanceTimersByTimeAsync(0);

      const expectedEncoded = btoa('some data');
      expect(gsSpy.create).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ sourceData: expectedEncoded }),
        expect.anything()
      );
      expect(component.form.controls.sourceData.value).toBe('some data');
      expect(alertSpy.showSuccessMessage).toHaveBeenCalledWith('New Hashlist created');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/hashlists/hashlist']);
    });

    it('should surface the backend error and skip the global dialog when "import" creation fails', async () => {
      gsSpy.create.mockReturnValue(
        throwError(() => ({ status: 400, error: { title: 'Hashlist has too many lines!' } }))
      );
      component.form.patchValue({
        name: 'Test Hashlist',
        hashTypeId: '0',
        accessGroupId: 1,
        format: 0,
        sourceType: 'import',
        sourceData: 'valid-1-line.txt'
      });

      component.onSubmit();
      await vi.advanceTimersByTimeAsync(0);

      // The component handles the error itself, so it tells the interceptor to skip the modal.
      const httpOptions = vi.mocked(gsSpy.create).mock.lastCall![2];
      expect(httpOptions?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');

      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Failed to create Hashlist: Hashlist has too many lines!');
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      expect(component.isCreatingLoading).toBe(false);
    });

    it('should skip the global error dialog when loading server import files', async () => {
      component.loadServerFiles();
      await vi.advanceTimersByTimeAsync(0);

      // loadServerFiles shows its own toast on failure, so it tells the interceptor to skip the modal.
      const call = vi.mocked(gsSpy.chelper).mock.lastCall!;
      expect(call[1]).toBe('importFile');
      const httpOptions = call[4];
      expect(httpOptions?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');
    });
  });

  it('should NOT submit if sourceType is upload and no file selected', () => {
    component.form.patchValue({
      name: 'Test Hashlist',
      hashTypeId: '2500',
      accessGroupId: 1,
      format: 0,
      sourceType: 'upload'
    });
    component.selectedFiles = null; // No files selected

    component.onSubmit();

    expect(uploadSpy.uploadFile).not.toHaveBeenCalled();
    expect(alertSpy.showErrorMessage).toHaveBeenCalled();
  });

  it('should NOT submit if sourceType is paste and sourceData is empty', () => {
    component.form.patchValue({
      name: 'Test Hashlist',
      hashTypeId: '2500',
      accessGroupId: 1,
      format: 0,
      sourceType: 'paste',
      sourceData: ''
    });

    component.onSubmit();

    expect(gsSpy.create).not.toHaveBeenCalled();
    expect(alertSpy.showErrorMessage).toHaveBeenCalled();
  });

  describe('Hashcat Brain opt-in', () => {
    it('should show the "Use Hashcat Brain" checkbox when brain is globally enabled', () => {
      fixture.detectChanges();
      const checkbox = fixture.debugElement.query(By.css('input-check[formcontrolname="useBrain"]'));
      expect(checkbox).not.toBeNull();
    });

    it('should NOT render brain mode selector when useBrain is false', () => {
      component.form.controls.useBrain.setValue(false);
      fixture.detectChanges();
      const modeSelect = fixture.debugElement.query(By.css('input-select[formcontrolname="brainFeatures"]'));
      expect(modeSelect).toBeNull();
    });

    it('should render brain mode selector when useBrain is true', () => {
      component.form.controls.useBrain.setValue(true);
      component['changeDetectorRef'].detectChanges();
      const modeSelect = fixture.debugElement.query(By.css('input-select[formcontrolname="brainFeatures"]'));
      expect(modeSelect).not.toBeNull();
    });

    it('should NOT show brain section when brain is globally disabled', async () => {
      const disabledConfig: ResponseWrapper = mockValidResponse(zConfigResponse, {
        data: {
          id: 66,
          type: 'config',
          attributes: { configSectionId: 1, item: 'Enable Brain', value: '0' }
        }
      });
      vi.when(gsSpy.get as Mock)
        .calledWith(SERV.CONFIGS, 66)
        .thenReturn(of(disabledConfig));

      fixture = TestBed.createComponent(NewHashlistComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(0);
      fixture.detectChanges();

      expect(component.brainenabled).toBe(0);
      const checkbox = fixture.debugElement.query(By.css('input-check[formcontrolname="useBrain"]'));
      expect(checkbox).toBeNull();
    });
  });

  describe('Access group scoping', () => {
    it('should fetch access groups via the getAccessGroups helper, not getAll', () => {
      expect(gsSpy.ghelper).toHaveBeenCalledWith(SERV.HELPER, 'getAccessGroups');
      expect(gsSpy.getAll).not.toHaveBeenCalledWith(SERV.ACCESS_GROUPS);
    });
  });

  describe('loadServerFiles', () => {
    // Regression guard for the stale-while-revalidate bug: HttpCacheInterceptor serves a stale
    // cached value first, then the revalidated fresh one (concat(of(stale), revalidate())).
    // firstValueFrom took the stale list; the fix uses lastValueFrom, which resolves on the fresh one.
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

  describe('Deprecated format handling', () => {
    it('should return true for deprecated formats 1 (HCCAPX/PMKID) and 2 (Binary)', () => {
      expect(component.isFormatDeprecated(1)).toBe(true);
      expect(component.isFormatDeprecated(2)).toBe(true);
      expect(component.isFormatDeprecated(0)).toBe(false);
      expect(component.isFormatDeprecated(3)).toBe(false);
    });

    it('should disable submit button when deprecated format is selected', async () => {
      component.form.patchValue({
        name: 'Test Hashlist',
        hashTypeId: '2500',
        accessGroupId: 1,
        format: 1,
        sourceType: 'upload'
      });
      component.form.updateValueAndValidity();
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(0);
      fixture.detectChanges();

      const buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));
      const button = buttonDebugEl.query(By.css('button'));
      expect(button.nativeElement.disabled).toBe(true);
    });

    it('should enable submit button when non-deprecated format is selected', async () => {
      component.form.patchValue({
        name: 'Test Hashlist',
        hashTypeId: '0',
        accessGroupId: 1,
        format: 0,
        sourceType: 'upload'
      });
      component.form.updateValueAndValidity();
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(0);
      fixture.detectChanges();

      const buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));
      const button = buttonDebugEl.query(By.css('button'));
      expect(button.nativeElement.disabled).toBe(false);
    });
  });
});
