import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { UploadTUSService } from '@services/files/files_tus.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { NewFilesComponent } from '@src/app/files/new-files/new-files.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { GridModule } from '@src/app/shared/grid-containers/grid.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';

// Mock services
class MockUnsubscribeService {
  unsubscribeAll = jasmine.createSpy('unsubscribeAll');
}

class MockUploadTUSService {
  uploadFile = jasmine.createSpy('uploadFile').and.returnValue(of(100));
}

class MockGlobalService {
  getAll = jasmine.createSpy('getAll').and.returnValue(of({ data: [], included: [] }));
  create = jasmine.createSpy('create').and.returnValue(of({}));
}

class MockAlertService {
  showSuccessMessage = jasmine.createSpy('showSuccessMessage');
  showErrorMessage = jasmine.createSpy('showErrorMessage');
}
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('NewFilesComponent', () => {
  let component: NewFilesComponent;
  let fixture: ComponentFixture<NewFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewFilesComponent],
      imports: [
        ReactiveFormsModule,
        InputModule,
        ButtonsModule,
        GridModule,
        PageTitleModule,
        ComponentsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        NgbProgressbarModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { data: of({ kind: 'wordlist-new' }) } },
        { provide: Router, useClass: MockRouter },
        { provide: UploadTUSService, useClass: MockUploadTUSService },
        { provide: GlobalService, useClass: MockGlobalService },
        { provide: AlertService, useClass: MockAlertService },
        { provide: UnsubscribeService, useClass: MockUnsubscribeService },
      ]
    }).compileComponents();
  });

  /**
   * Setup function to initialize the component with a specific kind of route.
   * Has to be called before each test that requires component initialization.
   * @param kind
   * @returns The initialized NewFilesComponent instance.
   */
  function setup(kind: string): NewFilesComponent {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { data: of({ kind }) }
    });

    fixture = TestBed.createComponent(NewFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  }

  it('should create NewFilesComponent', () => {
    const comp = setup('wordlist-new');
    expect(comp).toBeTruthy();
  });

  // Array for different kinds of files (wordlist, rule, other) containing expected title, redirect and fileType
  const cases: Array<{
    kind: string;
    expectedTitle: string;
    expectedRedirect: string;
    expectedFileType: number;
  }> = [
    { kind: 'wordlist-new', expectedTitle: 'New Wordlist', expectedRedirect: 'wordlist', expectedFileType: 0 },
    { kind: 'rule-new', expectedTitle: 'New Rule', expectedRedirect: 'rules', expectedFileType: 1 },
    { kind: 'other-new', expectedTitle: 'New Other', expectedRedirect: 'other', expectedFileType: 2 }
  ];

  cases.forEach(({ kind, expectedTitle, expectedRedirect, expectedFileType }) => {
    it(`should init correctly and build form for kind="${kind}"`, () => {
      setup(kind);

      // Title & redirect
      expect(component.title).toBe(expectedTitle);
      expect(component.redirect).toBe(expectedRedirect);

      // Form defaults
      const form = component.form;
      expect(form).toBeDefined();
      ['filename', 'isSecret', 'fileType', 'accessGroupId', 'sourceType', 'sourceData'].forEach((key) => {
        expect(form.get(key)).toBeTruthy();
      });
      expect(form.get('filename')!.value).toBe('');
      expect(form.get('isSecret')!.value).toBeTrue();
      expect(form.get('fileType')!.value).toBe(expectedFileType);
      expect(form.get('accessGroupId')!.value).toBe(1);
      expect(form.get('sourceType')!.value).toBe('import');
      expect(form.get('sourceData')!.value).toBe('');
    });
  });

  it('should show error if form is submitted with no uploaded file', () => {
    setup('wordlist-new');

    // Make sure no file is selected
    component.selectedFiles = null;

    // Spy on the method
    spyOn(component, 'onuploadFile').and.callThrough();

    // Find the custom button
    const buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="button-submit-upload"]'));
    expect(buttonDebugEl).toBeTruthy();

    // Trigger click
    buttonDebugEl.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Check that onuploadFile was called with current selectedFiles
    expect(component.onuploadFile).toHaveBeenCalledWith(component.selectedFiles);

    // Also test alert message for no file
    const alert = TestBed.inject(AlertService) as unknown as MockAlertService;
    expect(alert.showErrorMessage).toHaveBeenCalledWith('Please select a file to upload.');
  });

  cases.forEach(({ kind, expectedRedirect }) => {
    it(`should upload a selected file successfully for kind="${kind}"`, () => {
      setup(kind);

      // Create a mock file
      const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
      component.selectedFiles = { 0: file, length: 1, item: () => file } as FileList;
      component.fileName = file.name;

      // Spy on the alert and upload service
      const alert = TestBed.inject(AlertService) as unknown as MockAlertService;
      const uploadService = TestBed.inject(UploadTUSService) as unknown as MockUploadTUSService;

      // Trigger upload
      component.onuploadFile(component.selectedFiles);

      // Check progress and loading state
      expect(component.uploadProgress).toBe(100);
      expect(component.isCreatingLoading).toBeFalse();

      // Alert should not show error
      expect(alert.showErrorMessage).not.toHaveBeenCalled();

      // Ensure upload was called with the correct arguments
      expect(uploadService.uploadFile).toHaveBeenCalledWith(
        file,
        file.name,
        SERV.FILES,
        {
          filename: file.name,
          isSecret: true,
          fileType: component.form.get('fileType')!.value,
          accessGroupId: 1,
          sourceType: 'import',
          sourceData: file.name
        },
        ['/files', expectedRedirect] // redirect path
      );
    });
  });

  it('should unsubscribe on destroy', () => {
    const comp = setup('wordlist-new');
    const unsubscribe = fixture.debugElement.injector.get(UnsubscribeService) as unknown as MockUnsubscribeService;
    comp.ngOnDestroy();
    expect(unsubscribe.unsubscribeAll).toHaveBeenCalled();
  });
});
