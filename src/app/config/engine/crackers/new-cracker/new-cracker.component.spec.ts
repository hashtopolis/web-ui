import { of, throwError } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { CrackerBinaryRoleService } from '@services/roles/binaries/cracker-binary-role.service';
import { AlertService } from '@services/shared/alert.service';

import { NewCrackerComponent } from '@src/app/config/engine/crackers/new-cracker/new-cracker.component';

describe('NewCrackerComponent', () => {
  let component: NewCrackerComponent;
  let fixture: ComponentFixture<NewCrackerComponent>;

  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockRoleService: jasmine.SpyObj<CrackerBinaryRoleService>;

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['getAll', 'create']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    mockRoleService = jasmine.createSpyObj('CrackerBinaryRoleService', ['hasRole']);

    await TestBed.configureTestingModule({
      imports: [NewCrackerComponent],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: Router, useValue: mockRouter },
        { provide: AlertService, useValue: mockAlertService },
        { provide: CrackerBinaryRoleService, useValue: mockRoleService },
        provideHttpClient()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit and loads permissions
  });

  it('should create component and form', () => {
    expect(component).toBeTruthy();
    expect(component.newCrackerForm).toBeTruthy();
  });

  it('should have exactly two selectable options in input-select-binaryTypeName', () => {
    fixture.detectChanges();
    const selectDebugEl = fixture.debugElement.query(By.css('[data-testid="input-select-binaryTypeName"]'));
    expect(selectDebugEl).toBeTruthy();

    // Check property 'items' of InputSelectComponent
    const inputSelectInstance = selectDebugEl.componentInstance;
    expect(inputSelectInstance.items.length).toBe(2);
    expect(inputSelectInstance.items[0].name).toBe('Hashcat');
    expect(inputSelectInstance.items[1].name).toBe('Generic Cracker');
  });

  it('should have exactly two selectable options in input-select-chunkingAvailable', () => {
    fixture.detectChanges();
    const selectDebugEl = fixture.debugElement.query(By.css('[data-testid="input-select-chunkingAvailable"]'));
    expect(selectDebugEl).toBeTruthy();

    // Check property 'items' of InputSelectComponent
    const inputSelectInstance = selectDebugEl.componentInstance;
    expect(inputSelectInstance.items.length).toBe(2);
    expect(inputSelectInstance.items[0].name).toBe('Yes');
    expect(inputSelectInstance.items[1].name).toBe('No');
  });

  it('should not submit if form is invalid', async () => {
    component.newCrackerForm.patchValue({ typeName: '', isChunkingAvailable: undefined }); // invalid
    await component.onSubmit();
    expect(mockGlobalService.create).not.toHaveBeenCalled();
  });

  it('should call create and navigate on valid form', async () => {
    component.newCrackerForm.patchValue({
      typeName: 'Hashcat',
      isChunkingAvailable: true
    });

    component.newCrackerForm.updateValueAndValidity();

    // Simulate successful create
    mockGlobalService.create.and.returnValue(of({}));

    await component.onSubmit();

    const payload = {
      typeName: component.newCrackerForm.get('typeName').value,
      isChunkingAvailable: component.newCrackerForm.get('isChunkingAvailable').value
    };

    expect(mockGlobalService.create).toHaveBeenCalledWith(SERV.CRACKERS_TYPES, payload);
    expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Cracker type created!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['config/engine/crackers']);
  });

  it('should show error if create fails', async () => {
    component.newCrackerForm.patchValue({
      typeName: 'hashcat',
      isChunkingAvailable: false
    });

    // Simulate create failure
    mockGlobalService.create.and.returnValue(
      throwError(() => new Error('An error occurred while creating the Cracker type.'))
    );

    await component.onSubmit();
    expect(mockAlertService.showErrorMessage).toHaveBeenCalledWith(
      'An error occurred while creating the Cracker type.'
    );
  });

  it('should show required field error message if fields are empty', () => {
    component.newCrackerForm.patchValue({
      typeName: '',
      isChunkingAvailable: undefined
    });
    component.newCrackerForm.markAllAsTouched();
    fixture.detectChanges();

    // The help-block span should be visible if the form is invalid and touched
    const helpBlock = fixture.nativeElement.querySelector('.help-block');
    expect(helpBlock).toBeTruthy();
    expect(helpBlock.textContent).toContain('Please complete all required fields!');
  });

  it('should disable the submit button if form is invalid', () => {
    // Make form invalid by clearing required fields
    component.newCrackerForm.patchValue({
      typeName: '',
      isChunkingAvailable: undefined
    });
    mockRoleService.hasRole.and.returnValue(true);
    component.newCrackerForm.markAllAsTouched();
    fixture.detectChanges();

    // Query the submit button and check if it is disabled
    const buttonDebugEl = fixture.debugElement.query(By.css('[data-testid="submit-button-newCracker"]'));
    expect(buttonDebugEl).toBeTruthy();
    const buttonInstance = buttonDebugEl.componentInstance;
    expect(buttonInstance.disabled).toBeTrue();
  });
});
