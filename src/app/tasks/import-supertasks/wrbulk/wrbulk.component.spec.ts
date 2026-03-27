import { of, throwError } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { UiSettings } from '@models/config-ui.schema';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UIConfigService } from '@services/shared/storage.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { WrbulkComponent } from '@src/app/tasks/import-supertasks/wrbulk/wrbulk.component';

const MOCK_CRACKER_TYPES_RESPONSE = {
  data: [{ id: '1', type: 'CrackerTypes', attributes: { typeName: 'hashcat' } }],
  included: []
};

describe('WrbulkComponent', () => {
  let component: WrbulkComponent;
  let fixture: ComponentFixture<WrbulkComponent>;

  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let uiServiceSpy: jasmine.SpyObj<UIConfigService>;

  beforeEach(async () => {
    globalServiceSpy = jasmine.createSpyObj('GlobalService', ['getAll', 'chelper']);
    globalServiceSpy.getAll.and.returnValue(of(MOCK_CRACKER_TYPES_RESPONSE));
    globalServiceSpy.chelper.and.returnValue(of({}));

    alertServiceSpy = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    uiServiceSpy = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
    uiServiceSpy.getUISettings.and.returnValue({
      hashlistAlias: '#HL#',
      chunktime: 600,
      statustimer: 5
    } as unknown as UiSettings);

    await TestBed.configureTestingModule({
      declarations: [WrbulkComponent],
      providers: [
        { provide: AutoTitleService, useValue: jasmine.createSpyObj('AutoTitleService', ['set']) },
        { provide: UIConfigService, useValue: uiServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UnsubscribeService, useValue: jasmine.createSpyObj('UnsubscribeService', ['add', 'unsubscribeAll']) }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideComponent(WrbulkComponent, { set: { template: '<ng-container></ng-container>' } })
      .compileComponents();

    fixture = TestBed.createComponent(WrbulkComponent);
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

  it('should have an invalid form by default (name required)', () => {
    // attackCmd starts with '#HL#' from uiSettings, but name is empty
    expect(component.createForm.valid).toBe(false);
  });

  it('should initialize attackCmd with hashlistAlias from UIConfigService', () => {
    expect(component.createForm.value.attackCmd).toBe('#HL#');
  });

  it('should have default form values', () => {
    const val = component.createForm.value;
    expect(val.maxAgents).toBe(0);
    expect(val.isSmall).toBe(false);
    expect(val.isCpuTask).toBe(false);
    expect(val.useNewBench).toBe(true);
    expect(val.crackerBinaryId).toBe(1);
    expect(val.baseFiles).toEqual([]);
    expect(val.iterFiles).toEqual([]);
  });

  // ──────────────────────────────────────────────
  // onSubmit — invalid form
  // ──────────────────────────────────────────────

  it('should not call chelper when form is invalid', async () => {
    await component.onSubmit();
    expect(globalServiceSpy.chelper).not.toHaveBeenCalled();
  });

  it('should mark form as touched when submitting invalid form', async () => {
    await component.onSubmit();
    expect(component.createForm.touched).toBe(true);
  });

  // ──────────────────────────────────────────────
  // onSubmit — client-side validations
  // ──────────────────────────────────────────────

  it('should show error if crackerBinaryId is falsy (0)', async () => {
    component.createForm.patchValue({
      name: 'Test',
      attackCmd: '#HL# -a 0 FILE dict.txt',
      crackerBinaryId: 0,
      iterFiles: [1]
    });
    await component.onSubmit();

    expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith('Invalid cracker type ID!');
    expect(globalServiceSpy.chelper).not.toHaveBeenCalled();
  });

  it('should show error if attackCmd does not contain hashlist alias', async () => {
    component.createForm.patchValue({
      name: 'Test',
      attackCmd: '-a 0 FILE dict.txt',
      iterFiles: [1]
    });
    await component.onSubmit();

    expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith('Command line must contain hashlist alias (#HL#)!');
    expect(globalServiceSpy.chelper).not.toHaveBeenCalled();
  });

  it('should show error if attackCmd does not contain FILE placeholder', async () => {
    component.createForm.patchValue({
      name: 'Test',
      attackCmd: '#HL# -a 0 dict.txt',
      iterFiles: [1]
    });
    await component.onSubmit();

    expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith('No placeholder (FILE) for the iteration!');
    expect(globalServiceSpy.chelper).not.toHaveBeenCalled();
  });

  it('should show error if no iter files are selected', async () => {
    component.createForm.patchValue({
      name: 'Test',
      attackCmd: '#HL# -a 0 FILE',
      iterFiles: []
    });
    await component.onSubmit();

    expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith('You need to select at least one iteration file!');
    expect(globalServiceSpy.chelper).not.toHaveBeenCalled();
  });

  it('should accumulate multiple validation errors without stopping at the first', async () => {
    component.createForm.patchValue({
      name: 'Test',
      attackCmd: 'no-alias-no-file',
      crackerBinaryId: 0,
      iterFiles: []
    });
    await component.onSubmit();

    // All four checks should fire
    expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledTimes(4);
  });

  // ──────────────────────────────────────────────
  // onSubmit — valid submission calls chelper
  // ──────────────────────────────────────────────

  it('should call chelper with bulkSupertaskBuilder on valid form', async () => {
    component.createForm.patchValue({
      name: 'Bulk Test',
      attackCmd: '#HL# -a 0 FILE',
      baseFiles: [1, 2],
      iterFiles: [3, 4]
    });
    await component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'bulkSupertaskBuilder',
      jasmine.objectContaining({
        name: 'Bulk Test',
        command: '#HL# -a 0 FILE',
        basefiles: [1, 2],
        iterfiles: [3, 4]
      })
    );
  });

  it('should map form fields to correct payload keys', async () => {
    component.createForm.patchValue({
      name: 'Mapped',
      attackCmd: '#HL# -a 0 FILE',
      isCpuTask: true,
      isSmall: true,
      useNewBench: true,
      crackerBinaryId: 5,
      maxAgents: 3,
      baseFiles: [10],
      iterFiles: [20]
    });
    await component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(SERV.HELPER, 'bulkSupertaskBuilder', {
      name: 'Mapped',
      command: '#HL# -a 0 FILE',
      isCpu: true,
      isSmall: true,
      crackerBinaryTypeId: 5,
      benchtype: 'speed',
      maxAgents: 3,
      basefiles: [10],
      iterfiles: [20]
    });
  });

  it('should set benchtype to "runtime" when useNewBench is false', async () => {
    component.createForm.patchValue({
      name: 'Runtime',
      attackCmd: '#HL# FILE',
      useNewBench: false,
      iterFiles: [1]
    });
    await component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'bulkSupertaskBuilder',
      jasmine.objectContaining({ benchtype: 'runtime' })
    );
  });

  it('should set benchtype to "speed" when useNewBench is true', async () => {
    component.createForm.patchValue({
      name: 'Speed',
      attackCmd: '#HL# FILE',
      useNewBench: true,
      iterFiles: [1]
    });
    await component.onSubmit();

    expect(globalServiceSpy.chelper).toHaveBeenCalledWith(
      SERV.HELPER,
      'bulkSupertaskBuilder',
      jasmine.objectContaining({ benchtype: 'speed' })
    );
  });

  // ──────────────────────────────────────────────
  // onSubmit — success flow
  // ──────────────────────────────────────────────

  it('should show success message and navigate on success', async () => {
    component.createForm.patchValue({
      name: 'OK',
      attackCmd: '#HL# FILE',
      iterFiles: [1]
    });
    await component.onSubmit();

    expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith('New Supertask Wordlist/Rules Bulk created');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks/supertasks']);
  });

  // ──────────────────────────────────────────────
  // onSubmit — error flow
  // ──────────────────────────────────────────────

  it('should reset isLoading on chelper error', async () => {
    globalServiceSpy.chelper.and.returnValue(throwError(() => new Error('Server error')));
    component.createForm.patchValue({
      name: 'Err',
      attackCmd: '#HL# FILE',
      iterFiles: [1]
    });
    await component.onSubmit();

    expect(component.isLoading).toBe(false);
  });

  it('should not navigate on chelper error', async () => {
    globalServiceSpy.chelper.and.returnValue(throwError(() => new Error('Server error')));
    component.createForm.patchValue({
      name: 'Err',
      attackCmd: '#HL# FILE',
      iterFiles: [1]
    });
    await component.onSubmit();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // ──────────────────────────────────────────────
  // getFormData
  // ──────────────────────────────────────────────

  it('should return current form data from getFormData()', () => {
    component.createForm.patchValue({
      attackCmd: '#HL# -a 0 FILE',
      baseFiles: [1],
      iterFiles: [2]
    });

    expect(component.getFormData()).toEqual({
      attackCmd: '#HL# -a 0 FILE',
      files: [1],
      otherFiles: [2]
    });
  });

  // ──────────────────────────────────────────────
  // onUpdateForm
  // ──────────────────────────────────────────────

  it('should update attackCmd and baseFiles on CMD event', () => {
    component.onUpdateForm({
      type: 'CMD',
      attackCmd: '#HL# -a 0 dict.txt FILE',
      files: [10, 20]
    });

    expect(component.createForm.value.attackCmd).toBe('#HL# -a 0 dict.txt FILE');
    expect(component.createForm.value.baseFiles).toEqual([10, 20]);
  });

  it('should update iterFiles on non-CMD event', () => {
    component.onUpdateForm({
      type: 'ITER',
      otherFiles: [30, 40]
    });

    expect(component.createForm.value.iterFiles).toEqual([30, 40]);
  });
});
