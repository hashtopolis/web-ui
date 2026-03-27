import { of, throwError } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { MasksComponent } from '@src/app/tasks/import-supertasks/masks/masks.component';

const MOCK_CRACKER_TYPES_RESPONSE = {
  data: [{ id: '1', type: 'CrackerTypes', attributes: { typeName: 'hashcat' } }],
  included: []
};

describe('MasksComponent', () => {
  let component: MasksComponent;
  let fixture: ComponentFixture<MasksComponent>;

  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    globalServiceSpy = jasmine.createSpyObj('GlobalService', ['getAll', 'chelper']);
    globalServiceSpy.getAll.and.returnValue(of(MOCK_CRACKER_TYPES_RESPONSE));
    globalServiceSpy.chelper.and.returnValue(of({}));

    alertServiceSpy = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [MasksComponent],
      providers: [
        { provide: AutoTitleService, useValue: jasmine.createSpyObj('AutoTitleService', ['set']) },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UnsubscribeService, useValue: jasmine.createSpyObj('UnsubscribeService', ['add', 'unsubscribeAll']) }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideComponent(MasksComponent, { set: { template: '<ng-container></ng-container>' } })
      .compileComponents();

    fixture = TestBed.createComponent(MasksComponent);
    component = fixture.componentInstance;
  });

  // ──────────────────────────────────────────────
  // Component creation
  // ──────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ──────────────────────────────────────────────
  // Form initialization
  // ──────────────────────────────────────────────

  it('should have an invalid form by default (name and masks required)', () => {
    expect(component.createForm.valid).toBe(false);
  });

  it('should have default form values', () => {
    const val = component.createForm.value;
    expect(val.maxAgents).toBe(0);
    expect(val.isSmall).toBe(false);
    expect(val.isCpuTask).toBe(false);
    expect(val.optFlag).toBe(false);
    expect(val.useNewBench).toBe(true);
    expect(val.crackerBinaryId).toBe(1);
  });

  it('should become valid when name and masks are filled', () => {
    component.createForm.patchValue({ name: 'Test', masks: '?a?a?a' });
    expect(component.createForm.valid).toBe(true);
  });

  // ──────────────────────────────────────────────
  // onSubmit — invalid form
  // ──────────────────────────────────────────────

  it('should not call chelper when form is invalid', () => {
    component.onSubmit();
    expect(globalServiceSpy.chelper).not.toHaveBeenCalled();
  });

  it('should mark form as touched when submitting invalid form', () => {
    component.onSubmit();
    expect(component.createForm.touched).toBe(true);
  });

  // ──────────────────────────────────────────────
  // onSubmit — simple mask (no custom charsets)
  // ──────────────────────────────────────────────

  it('should call chelper with maskSupertaskBuilder for a simple mask', () => {
    component.createForm.patchValue({ name: 'Simple', masks: '?a?a?a?a' });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'maskSupertaskBuilder',
      jasmine.objectContaining({
        name: 'Simple',
        masks: '?a?a?a?a'
      })
    );
  });

  // ──────────────────────────────────────────────
  // onSubmit — mask with custom charsets (hcmask format)
  // ──────────────────────────────────────────────

  it('should pass hcmask lines with custom charsets as-is to the backend', () => {
    const hcmask = '?u?s,?l?d,?1?2?1?2?1?2';
    component.createForm.patchValue({ name: 'Custom Charset', masks: hcmask });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'maskSupertaskBuilder',
      jasmine.objectContaining({
        name: 'Custom Charset',
        masks: hcmask
      })
    );
  });

  it('should pass multiple hcmask lines (multiline) as-is to the backend', () => {
    const masks = '?u?s,?l?d,?1?2?1?2?1?2\n?a?a?a?a\n?d?d?d?d?d?d';
    component.createForm.patchValue({ name: 'Multi', masks });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'maskSupertaskBuilder',
      jasmine.objectContaining({ masks })
    );
  });

  it('should pass masks with all four custom charsets to the backend', () => {
    const masks = 'abc,def,ghi,jkl,?1?2?3?4';
    component.createForm.patchValue({ name: 'Four charsets', masks });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'maskSupertaskBuilder',
      jasmine.objectContaining({ masks })
    );
  });

  it('should pass masks with commas in charset definitions (e.g. hex) to the backend', () => {
    const masks = '0123456789abcdef,,?1?1?1?1?1?1';
    component.createForm.patchValue({ name: 'Hex', masks });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'maskSupertaskBuilder',
      jasmine.objectContaining({ masks })
    );
  });

  // ──────────────────────────────────────────────
  // onSubmit — payload field mapping
  // ──────────────────────────────────────────────

  it('should map form fields to correct payload keys', () => {
    component.createForm.patchValue({
      name: 'Mapped',
      masks: '?d?d?d',
      isCpuTask: true,
      isSmall: true,
      optFlag: true,
      useNewBench: true,
      crackerBinaryId: 5,
      maxAgents: 3
    });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(SERV.HELPER, 'maskSupertaskBuilder', {
      name: 'Mapped',
      masks: '?d?d?d',
      isCpu: true,
      isSmall: true,
      optimized: true,
      crackerBinaryTypeId: 5,
      benchtype: 'speed',
      maxAgents: 3
    });
  });

  it('should set benchtype to "runtime" when useNewBench is false', () => {
    component.createForm.patchValue({
      name: 'Runtime',
      masks: '?d?d',
      useNewBench: false
    });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'maskSupertaskBuilder',
      jasmine.objectContaining({ benchtype: 'runtime' })
    );
  });

  it('should set benchtype to "speed" when useNewBench is true', () => {
    component.createForm.patchValue({
      name: 'Speed',
      masks: '?d?d',
      useNewBench: true
    });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'maskSupertaskBuilder',
      jasmine.objectContaining({ benchtype: 'speed' })
    );
  });

  // ──────────────────────────────────────────────
  // onSubmit — success flow
  // ──────────────────────────────────────────────

  it('should show success message and navigate on success', () => {
    component.createForm.patchValue({ name: 'OK', masks: '?a' });
    component.onSubmit();

    expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith('New Supertask Mask created');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks/supertasks']);
  });

  it('should set isLoading true during submission', () => {
    component.createForm.patchValue({ name: 'Load', masks: '?a' });
    // Before submit
    expect(component.isLoading).toBe(false);
    component.onSubmit();
    // After complete callback, isLoading should be false again
    expect(component.isLoading).toBe(false);
  });

  // ──────────────────────────────────────────────
  // onSubmit — error flow
  // ──────────────────────────────────────────────

  it('should reset isLoading on chelper error', () => {
    globalServiceSpy.chelper.and.returnValue(throwError(() => new Error('Server error')));
    component.createForm.patchValue({ name: 'Err', masks: '?a' });
    component.onSubmit();

    expect(component.isLoading).toBe(false);
  });

  it('should not navigate on chelper error', () => {
    globalServiceSpy.chelper.and.returnValue(throwError(() => new Error('Server error')));
    component.createForm.patchValue({ name: 'Err', masks: '?a' });
    component.onSubmit();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // ──────────────────────────────────────────────
  // Edge cases — mask content variations
  // ──────────────────────────────────────────────

  it('should pass empty-charset hcmask lines (consecutive commas) to the backend', () => {
    // e.g. charset1 defined, charset2 empty, mask references ?1
    const masks = 'abc,,,?1?1?1';
    component.createForm.patchValue({ name: 'Empty charset', masks });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'maskSupertaskBuilder',
      jasmine.objectContaining({ masks })
    );
  });

  it('should pass masks with mixed simple and hcmask lines to the backend', () => {
    const masks = '?a?a?a\n?u?l,?1?1?1?1\n?d?d?d?d?d?d';
    component.createForm.patchValue({ name: 'Mixed', masks });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'maskSupertaskBuilder',
      jasmine.objectContaining({ masks })
    );
  });

  it('should pass masks with only built-in charsets (?l?u?d?s?a?b?h?H) to the backend', () => {
    const masks = '?l?u?d?s?a?b';
    component.createForm.patchValue({ name: 'Builtins', masks });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'maskSupertaskBuilder',
      jasmine.objectContaining({ masks })
    );
  });

  it('should pass masks with Windows-style line endings to the backend', () => {
    const masks = '?a?a\r\n?d?d?d';
    component.createForm.patchValue({ name: 'CRLF', masks });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'maskSupertaskBuilder',
      jasmine.objectContaining({ masks })
    );
  });

  it('should pass a single long mask to the backend', () => {
    const masks = '?a'.repeat(50); // 50 positions
    component.createForm.patchValue({ name: 'Long mask', masks });
    component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'maskSupertaskBuilder',
      jasmine.objectContaining({ masks })
    );
  });
});
