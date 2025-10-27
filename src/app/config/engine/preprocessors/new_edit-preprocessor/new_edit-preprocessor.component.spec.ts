import { of, throwError } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ValidationPatterns } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import { NewEditPreprocessorComponent } from '@src/app/config/engine/preprocessors/new_edit-preprocessor/new_edit-preprocessor.component';

describe('NewEditPreprocessorComponent', () => {
  let component: NewEditPreprocessorComponent;
  let fixture: ComponentFixture<NewEditPreprocessorComponent>;

  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['getAll', 'create', 'get', 'update']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);

    await TestBed.configureTestingModule({
      imports: [NewEditPreprocessorComponent],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: Router, useValue: mockRouter },
        { provide: AlertService, useValue: mockAlertService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } },
            paramMap: of({ get: () => null })
          }
        },
        provideHttpClient()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditPreprocessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit and loads permissions
  });

  /**
   * Helper to check page title and button text
   * @param title Title text
   * @param buttonText Button text
   */
  function expectPageTitleAndButton(title: string, buttonText: string) {
    const buttonDebugEl = fixture.debugElement.query(
      By.css('[data-testid="submit-button-newPreprocessor"]')
    );
    expect(buttonDebugEl.nativeElement.textContent).toContain(buttonText);

    const subtitleEl = fixture.nativeElement.querySelector('app-page-subtitle');
    expect(subtitleEl.textContent).toContain(title);
  }

  it('should create component and form', () => {
    expect(component).toBeTruthy();
    expect(component.newEditPreprocessorForm).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.newEditPreprocessorForm).toBeDefined();

    expect(component.newEditPreprocessorForm.get('name').value).toBeDefined();
    expect(component.newEditPreprocessorForm.get('binaryName').value).toBeDefined();
    expect(component.newEditPreprocessorForm.get('url').value).toBeDefined();

    expect(component.newEditPreprocessorForm.get('keyspaceCommand').value).toBe('--keyspace');
    expect(component.newEditPreprocessorForm.get('skipCommand').value).toBe('--skip');
    expect(component.newEditPreprocessorForm.get('limitCommand').value).toBe('--limit');
  });

  it('should not submit if form is invalid', async () => {
    const payload = {
      name: '',
      binaryName: '',
      url: '',
      keyspaceCommand: component.newEditPreprocessorForm.get('keyspaceCommand').value,
      skipCommand: component.newEditPreprocessorForm.get('skipCommand').value,
      limitCommand: component.newEditPreprocessorForm.get('limitCommand').value
    };

    component.newEditPreprocessorForm.patchValue(payload); // invalid
    await component.onSubmit();
    expect(mockGlobalService.create).not.toHaveBeenCalled();
  });

  it('should show error if create fails', async () => {
    component.newEditPreprocessorForm.patchValue({
      name: 'Test Preprocessor Fail',
      binaryName: 'Test Preprocessor',
      url: 'https://example.com/preprocessor-1.0.0.7z',
      keyspaceCommand: '--keyspace',
      skipCommand: '--skip',
      limitCommand: '--limit'
    });

    // Simulate create failure
    mockGlobalService.create.and.returnValue(throwError(() => new Error('Create failed')));

    await component.onSubmit();
    expect(mockAlertService.showErrorMessage).toHaveBeenCalledWith('Error creating preprocessor!');
  });

  it('should show required field error message if fields are empty', () => {
    component.newEditPreprocessorForm.patchValue({
      name: '',
      binaryName: '',
      url: '',
      keyspaceCommand: '--keyspace',
      skipCommand: '--skip',
      limitCommand: '--limit'
    });
    component.newEditPreprocessorForm.markAllAsTouched();
    fixture.detectChanges();

    // The help-block span should be visible if the form is invalid and touched
    const helpBlock = fixture.nativeElement.querySelector('.help-block');
    expect(helpBlock).toBeTruthy();
    expect(helpBlock.textContent).toContain('Please complete all required fields!');
  });

  it('should disable the submit button if form is invalid', () => {
    // Make form invalid by clearing required fields
    component.newEditPreprocessorForm.patchValue({
      name: '',
      binaryName: '',
      url: '',
      keyspaceCommand: '--keyspace',
      skipCommand: '--skip',
      limitCommand: '--limit'
    });
    component.newEditPreprocessorForm.markAllAsTouched();
    fixture.detectChanges();

    // Query the submit button and check if it is disabled
    const buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="submit-button-newPreprocessor"]'));
    expect(buttonDebugEl).toBeTruthy();
    const buttonInstance = buttonDebugEl.componentInstance;
    expect(buttonInstance.disabled).toBeTrue();
  });

  it('should enable the submit button if form is valid', () => {
    component.newEditPreprocessorForm.patchValue({
      name: 'Test Preprocessor',
      binaryName: 'Test Preprocessor',
      url: 'https://example.com/preprocessor-1.0.0.7z',
      keyspaceCommand: '--keyspace',
      skipCommand: '--skip',
      limitCommand: '--limit'
    });
    component.newEditPreprocessorForm.markAllAsTouched();
    fixture.detectChanges();

    // Query the submit button and check if it is enabled
    const buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="submit-button-newPreprocessor"]'));
    expect(buttonDebugEl).toBeTruthy();
    const buttonInstance = buttonDebugEl.componentInstance;
    expect(buttonInstance.disabled).toBeFalse();
  });

  it('should call the urlValidator and return an error, if the url is invalid', () => {
    component.newEditPreprocessorForm.patchValue({
      name: 'Test Preprocessor',
      binaryName: 'Test Preprocessor',
      url: 'ThisIsAnInvalidURL',
      keyspaceCommand: '--keyspace',
      skipCommand: '--skip',
      limitCommand: '--limit'
    });
    component.newEditPreprocessorForm.markAllAsTouched();
    fixture.detectChanges();

    const errors = component.newEditPreprocessorForm.get('url').errors;
    expect(errors).toBeTruthy();
    expect(errors['pattern']).toEqual({
      requiredPattern: ValidationPatterns.URL,
      actualValue: 'ThisIsAnInvalidURL'
    });
  });

  it('should call the urlValidator and return an null, if the url is valid', () => {
    component.newEditPreprocessorForm.patchValue({
      name: 'Test Preprocessor',
      binaryName: 'Test Preprocessor',
      url: 'https://example.com/preprocessor-1.0.0.7z',
      keyspaceCommand: '--keyspace',
      skipCommand: '--skip',
      limitCommand: '--limit'
    });
    component.newEditPreprocessorForm.markAllAsTouched();
    fixture.detectChanges();

    const errors = component.newEditPreprocessorForm.get('url').errors;
    expect(errors).toBeNull();
  });

  it('should display the page title "New Preprocessor" and button name "Create" in New mode', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.snapshot.paramMap.get = () => null;

    fixture = TestBed.createComponent(NewEditPreprocessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageTitle).toBe('New Preprocessor');
    expect(component.submitButtonText).toBe('Create');

    expectPageTitleAndButton('New Preprocessor', 'Create');
  });

  it('should display the page title "Edit Preprocessor" and button name "Update" in Edit mode', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.snapshot.paramMap.get = () => '9';
    mockGlobalService.get.and.returnValue(of({ data: {}, included: [] }));

    fixture = TestBed.createComponent(NewEditPreprocessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pageTitle).toBe('Edit Preprocessor');
    expect(component.submitButtonText).toBe('Update');

    expectPageTitleAndButton('Edit Preprocessor', 'Update');
  });



  it('should call create and navigate on valid form if no id is present in route', async () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);

    // simulate new-modus (no id)
    activatedRoute.snapshot.paramMap.get = () => null;

    fixture = TestBed.createComponent(NewEditPreprocessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.newEditPreprocessorForm.patchValue({
      name: 'Test Preprocessor',
      binaryName: 'Test Preprocessor',
      url: 'https://example.com/preprocessor-1.0.0.7z',
      keyspaceCommand: '--keyspace',
      skipCommand: '--skip',
      limitCommand: '--limit'
    });

    mockGlobalService.create.and.returnValue(of({}));

    await component.onSubmit();

    expect(mockGlobalService.create).toHaveBeenCalled();
    expect(mockGlobalService.update).not.toHaveBeenCalled();
  });

  it('should call update and navigate on valid form if id is present in route', async () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);

    // simulate edit-modus route with id=9
    activatedRoute.snapshot.paramMap.get = () => '9';

    mockGlobalService.get.and.returnValue(of({ data: {}, included: [] }));

    fixture = TestBed.createComponent(NewEditPreprocessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.newEditPreprocessorForm.patchValue({
      name: 'Test Preprocessor',
      binaryName: 'Test Preprocessor',
      url: 'https://example.com/preprocessor-1.0.0.7z',
      keyspaceCommand: '--keyspace',
      skipCommand: '--skip',
      limitCommand: '--limit'
    });

    mockGlobalService.update.and.returnValue(of({}));

    await component.onSubmit();

    expect(mockGlobalService.update).toHaveBeenCalled();
    expect(mockGlobalService.create).not.toHaveBeenCalled();
  });
});
