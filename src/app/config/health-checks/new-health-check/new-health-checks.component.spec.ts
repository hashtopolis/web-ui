import { of } from 'rxjs';

import { zCrackerBinaryListResponse, zCrackerBinaryTypeListResponse } from '@generated/api/zod';

import { Component, Input, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { NewHealthChecksComponent } from '@src/app/config/health-checks/new-health-check/new-health-checks.component';
import { HealthCheckHashType, HealthCheckType } from '@src/app/core/_constants/healthchecks.config';
import { mockValidResponse } from '@src/app/testing/mock-response';

const CRACKER_TYPES_RESPONSE = mockValidResponse(zCrackerBinaryTypeListResponse, {
  data: [
    {
      id: 1,
      type: 'crackerBinaryType',
      attributes: { typeName: 'hashcat', isChunkingAvailable: true },
      relationships: { crackerVersions: { data: [{ type: 'crackerBinary', id: 12 }] } }
    }
  ],
  included: [
    {
      id: 12,
      type: 'crackerBinary',
      attributes: {
        crackerBinaryTypeId: 1,
        binaryName: 'hashcat',
        version: '7.1.2',
        downloadUrl: '',
        filename: null,
        accessGroupId: 1
      }
    }
  ]
});

const CRACKER_VERSIONS_RESPONSE = mockValidResponse(zCrackerBinaryListResponse, {
  data: [
    {
      id: 12,
      type: 'crackerBinary',
      attributes: {
        crackerBinaryTypeId: 1,
        binaryName: 'hashcat',
        version: '7.1.2',
        downloadUrl: '',
        filename: null,
        accessGroupId: 1
      }
    }
  ]
});

@Component({ selector: 'app-page', template: '<ng-content></ng-content>', standalone: false })
class StubPageComponent {
  @Input() title: string;
}

@Component({ selector: 'grid-main', template: '<ng-content></ng-content>', standalone: false })
class StubGridMainComponent {
  @Input() narrow: boolean;
}

@Component({ selector: 'app-form-row', template: '<ng-content></ng-content>', standalone: false })
class StubFormRowComponent {}

@Component({
  selector: 'input-select',
  template: '',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => StubInputSelectComponent), multi: true }],
  standalone: false
})
class StubInputSelectComponent implements ControlValueAccessor {
  @Input() title: string;
  @Input() items: unknown[];
  writeValue(): void {}
  registerOnChange(): void {}
  registerOnTouched(): void {}
  setDisabledState(): void {}
}

@Component({ selector: 'grid-buttons', template: '<ng-content></ng-content>', standalone: false })
class StubGridButtonsComponent {}

@Component({ selector: 'button-submit', template: '', standalone: false })
class StubButtonSubmitComponent {
  @Input() name: string;
  @Input() disabled: boolean;
  @Input() loading: boolean;
  @Input() type: string;
}

describe('NewHealthChecksComponent', () => {
  let fixture: ComponentFixture<NewHealthChecksComponent>;
  let component: NewHealthChecksComponent;
  let getAll: ReturnType<typeof vi.fn>;
  let create: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;
  let showSuccessMessage: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getAll = vi.fn().mockName('GlobalService.getAll').mockReturnValue(of(CRACKER_TYPES_RESPONSE));
    create = vi.fn().mockName('GlobalService.create').mockReturnValue(of({}));
    navigate = vi.fn().mockName('Router.navigate');
    showSuccessMessage = vi.fn().mockName('AlertService.showSuccessMessage');

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        NewHealthChecksComponent,
        StubPageComponent,
        StubGridMainComponent,
        StubFormRowComponent,
        StubInputSelectComponent,
        StubGridButtonsComponent,
        StubButtonSubmitComponent
      ],
      providers: [
        { provide: GlobalService, useValue: { getAll, create } },
        { provide: AutoTitleService, useValue: { set: vi.fn() } },
        { provide: AlertService, useValue: { showSuccessMessage } },
        { provide: Router, useValue: { navigate } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewHealthChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the create form and its four selection fields', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('app-page')?.getAttribute('title')).toBe('Create Health Check');
    expect(host.querySelector('form')).toBeTruthy();
    expect(Array.from(host.querySelectorAll('input-select')).map((select) => select.getAttribute('title'))).toEqual([
      'Attack',
      'Hashtype',
      'Binary',
      'Binary Version'
    ]);
    expect(host.querySelectorAll('button-submit').length).toBe(2);
  });

  it('starts with the default attack and hash type and requires a binary version', () => {
    expect(component.form.controls.checkType.value).toBe(HealthCheckType.BRUTE_FORCE);
    expect(component.form.controls.hashtypeId.value).toBe(HealthCheckHashType.MD5);
    expect(component.form.controls.crackerBinaryId.valid).toBe(false);
  });

  it('loads cracker types and maps them to select options', () => {
    expect(getAll).toHaveBeenCalledWith(SERV.CRACKERS_TYPES, { include: ['crackerVersions'] });
    expect(component.selectCrackertype).toEqual([{ id: 1, name: 'hashcat' }]);
  });

  it('creates a health check, shows success, and navigates back after valid submission', () => {
    getAll.mockClear();
    getAll.mockReturnValueOnce(of(CRACKER_VERSIONS_RESPONSE));

    component.form.setValue({
      checkType: HealthCheckType.BRUTE_FORCE,
      hashtypeId: HealthCheckHashType.BCRYPT,
      crackerBinaryId: '',
      crackerBinaryType: '1'
    });

    expect(getAll).toHaveBeenCalledWith(SERV.CRACKERS, {
      filter: [{ field: 'crackerBinaryTypeId', operator: 'eq', value: '1' }]
    });
    expect(component.selectCrackerversions).toEqual([{ id: 12, name: '7.1.2' }]);
    expect(component.form.controls.crackerBinaryId.value).toBe(12);

    component.onSubmit();

    expect(create).toHaveBeenCalledWith(SERV.HEALTH_CHECKS, {
      checkType: HealthCheckType.BRUTE_FORCE,
      hashtypeId: HealthCheckHashType.BCRYPT,
      crackerBinaryId: 12
    });
    expect(showSuccessMessage).toHaveBeenCalledWith('New Health Check created');
    expect(navigate).toHaveBeenCalledWith(['/config/health-checks']);
  });

  it('does not submit an invalid form and marks it touched', () => {
    component.form.controls.crackerBinaryId.setValue('');

    component.onSubmit();

    expect(create).not.toHaveBeenCalled();
    expect(component.form.controls.crackerBinaryId.touched).toBe(true);
  });
});
