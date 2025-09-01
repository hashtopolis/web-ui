import { of, throwError } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import { NewPreprocessorComponent } from '@src/app/config/engine/preprocessors/new-preprocessor/new-preprocessor/new-preprocessor.component';

describe('NewPreprocessorComponent', () => {
  let component: NewPreprocessorComponent;
  let fixture: ComponentFixture<NewPreprocessorComponent>;

  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['getAll', 'create']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);

    await TestBed.configureTestingModule({
      imports: [NewPreprocessorComponent],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: Router, useValue: mockRouter },
        { provide: AlertService, useValue: mockAlertService },
        provideHttpClient()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPreprocessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit and loads permissions
  });

  it('should create component and form', () => {
    expect(component).toBeTruthy();
    expect(component.newPreprocessorForm).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.newPreprocessorForm).toBeDefined();

    expect(component.newPreprocessorForm.get('name').value).toBeDefined();
    expect(component.newPreprocessorForm.get('binaryName').value).toBeDefined();
    expect(component.newPreprocessorForm.get('url').value).toBeDefined();

    expect(component.newPreprocessorForm.get('keyspaceCommand').value).toBe('--keyspace');
    expect(component.newPreprocessorForm.get('skipCommand').value).toBe('--skip');
    expect(component.newPreprocessorForm.get('limitCommand').value).toBe('--limit');
  });

  it('should not submit if form is invalid', async () => {
    const payload = {
      name: '',
      binaryName: '',
      url: '',
      keyspaceCommand: component.newPreprocessorForm.get('keyspaceCommand').value,
      skipCommand: component.newPreprocessorForm.get('skipCommand').value,
      limitCommand: component.newPreprocessorForm.get('limitCommand').value
    };

    component.newPreprocessorForm.patchValue(payload); // invalid
    await component.onSubmit();
    expect(mockGlobalService.create).not.toHaveBeenCalled();
  });

  it('should call create and navigate on valid form', async () => {
    component.newPreprocessorForm.patchValue({
      name: 'Test Preprocessor',
      binaryName: 'Test Preprocessor',
      url: 'https://example.com/preprocessor-1.0.0.7z',
      keyspaceCommand: '--keyspace',
      skipCommand: '--skip',
      limitCommand: '--limit'
    });
    component.newPreprocessorForm.updateValueAndValidity();

    // Simulate successful create
    mockGlobalService.create.and.returnValue(of({}));

    await component.onSubmit();

    const payload = {
      name: component.newPreprocessorForm.get('name').value,
      binaryName: component.newPreprocessorForm.get('binaryName').value,
      url: component.newPreprocessorForm.get('url').value,
      keyspaceCommand: component.newPreprocessorForm.get('keyspaceCommand').value,
      skipCommand: component.newPreprocessorForm.get('skipCommand').value,
      limitCommand: component.newPreprocessorForm.get('limitCommand').value
    };

    expect(mockGlobalService.create).toHaveBeenCalledWith(SERV.PREPROCESSORS, payload);
    expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Preprocessor created!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['config/engine/preprocessors']);
  });

  it('should show error if create fails', async () => {
    component.newPreprocessorForm.patchValue({
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
    component.newPreprocessorForm.patchValue({
      name: '',
      binaryName: '',
      url: '',
      keyspaceCommand: '--keyspace',
      skipCommand: '--skip',
      limitCommand: '--limit'
    });
    component.newPreprocessorForm.markAllAsTouched();
    fixture.detectChanges();

    // The help-block span should be visible if the form is invalid and touched
    const helpBlock = fixture.nativeElement.querySelector('.help-block');
    expect(helpBlock).toBeTruthy();
    expect(helpBlock.textContent).toContain('Please complete all required fields!');
  });

  it('should disable the submit button if form is invalid', () => {
    // Make form invalid by clearing required fields
    component.newPreprocessorForm.patchValue({
      name: '',
      binaryName: '',
      url: '',
      keyspaceCommand: '--keyspace',
      skipCommand: '--skip',
      limitCommand: '--limit'
    });
    component.newPreprocessorForm.markAllAsTouched();
    fixture.detectChanges();

    // Query the submit button and check if it is disabled
    const buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="submit-button-newPreprocessor"]'));
    expect(buttonDebugEl).toBeTruthy();
    const buttonInstance = buttonDebugEl.componentInstance;
    expect(buttonInstance.disabled).toBeTrue();
  });

  it('should enable the submit button if form is valid', () => {
    component.newPreprocessorForm.patchValue({
      name: 'Test Preprocessor',
      binaryName: 'Test Preprocessor',
      url: 'https://example.com/preprocessor-1.0.0.7z',
      keyspaceCommand: '--keyspace',
      skipCommand: '--skip',
      limitCommand: '--limit'
    });
    component.newPreprocessorForm.markAllAsTouched();
    fixture.detectChanges();

    // Query the submit button and check if it is enabled
    const buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="submit-button-newPreprocessor"]'));
    expect(buttonDebugEl).toBeTruthy();
    const buttonInstance = buttonDebugEl.componentInstance;
    expect(buttonInstance.disabled).toBeFalse();
  });
});
