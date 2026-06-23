import { of, throwError } from 'rxjs';

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
import { UnsubscribeService } from '@services/unsubscribe.service';

import { FileSizePipe } from '@src/app/core/_pipes/file-size.pipe';
import { NewHashlistComponent } from '@src/app/hashlists/new-hashlist/new-hashlist.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { PageSubTitleComponent } from '@src/app/shared/page-headers/page-subtitle/page-subtitle.component';
import { mockResponse } from '@src/app/testing/mock-response';

const mockAccessGroups: ResponseWrapper = mockResponse({
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

const mockHashtypes: ResponseWrapper = mockResponse({
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

const mockConfigs: ResponseWrapper = mockResponse({
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
  let component: NewHashlistComponent;
  let fixture: ComponentFixture<NewHashlistComponent>;

  let gsSpy: jasmine.SpyObj<GlobalService>;
  let uploadSpy: jasmine.SpyObj<UploadTUSService>;
  let alertSpy: jasmine.SpyObj<AlertService>;
  let titleSpy: jasmine.SpyObj<AutoTitleService>;
  let unsubSpy: jasmine.SpyObj<UnsubscribeService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    gsSpy = jasmine.createSpyObj('GlobalService', ['getAll', 'get', 'create', 'ghelper', 'chelper']);
    Object.defineProperty(gsSpy, 'userId', { get: () => 1 });
    uploadSpy = jasmine.createSpyObj('UploadTUSService', ['uploadFile']);
    alertSpy = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    titleSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    unsubSpy = jasmine.createSpyObj('UnsubscribeService', ['add', 'unsubscribeAll']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

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
        { provide: UnsubscribeService, useValue: unsubSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    gsSpy.ghelper.and.returnValue(of(mockAccessGroups));
    gsSpy.chelper.and.returnValue(of({ meta: [] }));
    gsSpy.getAll.withArgs(SERV.HASHTYPES).and.returnValue(of(mockHashtypes));
    (gsSpy.get as jasmine.Spy).withArgs(SERV.CONFIGS, 66).and.returnValue(of(mockConfigs));
    dialogSpy.open.and.returnValue({
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
      expect(component.isLoadingAccessGroups).toBeFalse();
      expect(component.isLoadingHashtypes).toBeFalse();
    });

    it('should load config and patch form for brainenabled', () => {
      expect(component.brainenabled).toBe(1);
      expect(component.form.controls.useBrain.value).toBeTrue();
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
    it('should keep submit button enabled when form is invalid', fakeAsync(() => {
      expect(component.form.invalid).toBeTrue();

      let buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));
      let button = buttonDebugEl.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeFalse();

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
      tick();
      fixture.detectChanges();

      expect(component.form.valid).toBeTrue();

      // Re-query the button to get the updated DOM
      buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));
      button = buttonDebugEl.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeFalse();
    }));
  });

  describe('Form submission', () => {
    it('should call uploadFile and update progress', fakeAsync(() => {
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

      uploadSpy.uploadFile.and.returnValue(of(0, 50, 100));

      component.onSubmit();

      tick();

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
    }));

    it('should show the backend error message when the upload/creation fails', fakeAsync(() => {
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

      uploadSpy.uploadFile.and.returnValue(
        throwError(() => ({ status: 400, error: { title: 'The hashlist contains too many lines.' } }))
      );

      component.onSubmit();
      tick();

      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith(
        'Failed to create hashlist: The hashlist contains too many lines.'
      );
      expect(component.uploadProgress).toBe(0);
      expect(component.isCreatingLoading).toBe(false);
    }));

    it('should submit form with "paste" sourceType and base64-encode sourceData', fakeAsync(() => {
      gsSpy.create.and.returnValue(of(mockResponse()));
      component.form.patchValue({
        name: 'Test Hashlist',
        hashTypeId: '0',
        accessGroupId: 1,
        format: 0,
        sourceType: 'paste',
        sourceData: 'some data'
      });
      component.onSubmit();
      tick();

      const expectedEncoded = btoa('some data');
      expect(gsSpy.create).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({ sourceData: expectedEncoded }),
        jasmine.anything()
      );
      expect(component.form.controls.sourceData.value).toBe('some data');
      expect(alertSpy.showSuccessMessage).toHaveBeenCalledWith('New HashList created');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/hashlists/hashlist']);
    }));

    it('should surface the backend error and skip the global dialog when "import" creation fails', fakeAsync(() => {
      gsSpy.create.and.returnValue(
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
      tick();

      // The component handles the error itself, so it tells the interceptor to skip the modal.
      const httpOptions = gsSpy.create.calls.mostRecent().args[2];
      expect(httpOptions?.headers?.get('X-Skip-Error-Dialog')).toBe('true');

      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Failed to create hashlist: Hashlist has too many lines!');
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      expect(component.isCreatingLoading).toBe(false);
    }));
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

  it('ngOnDestroy should unsubscribe properly', () => {
    const nextSpy = spyOn(component['fileUnsubscribe'], 'next');
    const completeSpy = spyOn(component['fileUnsubscribe'], 'complete');

    component.ngOnDestroy();

    expect(unsubSpy.unsubscribeAll).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  describe('Access group scoping', () => {
    it('should fetch access groups via the getAccessGroups helper, not getAll', () => {
      expect(gsSpy.ghelper).toHaveBeenCalledWith(SERV.HELPER, 'getAccessGroups');
      expect(gsSpy.getAll).not.toHaveBeenCalledWith(SERV.ACCESS_GROUPS);
    });
  });
});
