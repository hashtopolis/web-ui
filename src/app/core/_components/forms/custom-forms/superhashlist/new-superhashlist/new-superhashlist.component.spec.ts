import { HashListFormat } from '@constants/hashlist.config';
import { zHashlistListResponse } from '@generated/api/zod';
import { mockValidResponse } from '@src/app/testing/mock-response';
import { Subject, of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { NewSuperhashlistComponent } from '@src/app/core/_components/forms/custom-forms/superhashlist/new-superhashlist/new-superhashlist.component';

@Component({
  selector: 'input-text, input-multiselect',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockFormInputComponent),
      multi: true
    }
  ],
  standalone: false
})
class MockFormInputComponent implements ControlValueAccessor {
  @Input() items: unknown[] = [];
  @Input() isLoading = false;

  value: unknown;

  private onChange: (value: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: unknown): void {
    this.value = value;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

// Fixtures
const HASHLISTS_RESPONSE = mockValidResponse(zHashlistListResponse, {
  data: [
    {
      id: 1,
      type: 'hashlist',
      attributes: {
        accessGroupId: 1,
        brainFeatures: 0,
        format: HashListFormat.TEXT,
        separator: ':',
        name: 'First hashlist',
        hashTypeId: 1000,
        isHexSalt: false,
        isSecret: false,
        isSalted: false,
        useBrain: false,
        hashCount: 10,
        cracked: 2,
        notes: '',
        isArchived: false
      }
    },
    {
      id: 2,
      type: 'hashlist',
      attributes: {
        accessGroupId: 1,
        brainFeatures: 0,
        format: HashListFormat.TEXT,
        separator: ':',
        name: 'Second hashlist',
        hashTypeId: 1000,
        isHexSalt: false,
        isSecret: false,
        isSalted: false,
        useBrain: false,
        hashCount: 5,
        cracked: 0,
        notes: '',
        isArchived: false
      }
    },
    {
      id: 3,
      type: 'hashlist',
      attributes: {
        accessGroupId: 1,
        brainFeatures: 0,
        format: HashListFormat.TEXT,
        separator: ':',
        name: 'Different hash type',
        hashTypeId: 2000,
        isHexSalt: false,
        isSecret: false,
        isSalted: false,
        useBrain: false,
        hashCount: 1,
        cracked: 0,
        notes: '',
        isArchived: false
      }
    }
  ]
});

describe('NewSuperhashlistComponent', () => {
  // Mocks
  let fixture: ComponentFixture<NewSuperhashlistComponent>;
  let component: NewSuperhashlistComponent;
  let globalService: MockedObject<GlobalService>;
  let alertService: MockedObject<AlertService>;
  let router: MockedObject<Router>;
  let titleService: MockedObject<AutoTitleService>;

  beforeEach(async () => {
    globalService = {
      getAll: vi.fn().mockName('GlobalService.getAll'),
      chelper: vi.fn().mockName('GlobalService.chelper')
    } as MockedObject<GlobalService>;
    globalService.getAll.mockReturnValue(of(HASHLISTS_RESPONSE));
    globalService.chelper.mockReturnValue(of({} as ResponseWrapper));

    alertService = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage')
    } as MockedObject<AlertService>;
    router = {
      navigate: vi.fn().mockName('Router.navigate')
    } as MockedObject<Router>;
    titleService = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;

    await TestBed.configureTestingModule({
      declarations: [NewSuperhashlistComponent, MockFormInputComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AlertService, useValue: alertService },
        { provide: AutoTitleService, useValue: titleService },
        { provide: GlobalService, useValue: globalService },
        { provide: Router, useValue: router }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NewSuperhashlistComponent);
    component = fixture.componentInstance;
  });

  it('initializes the required form controls and page title', () => {
    expect(component.form.controls.name.value).toBe('');
    expect(component.form.controls.name.hasError('required')).toBe(true);
    expect(component.form.controls.hashlistIds.value).toBeNull();
    expect(component.form.controls.hashlistIds.hasError('required')).toBe(true);
    expect(component.isLoading).toBe(true);
    expect(titleService.set).toHaveBeenCalledExactlyOnceWith(['New Superhashlist']);
  });

  it('loads unarchived text hashlists and maps them to select options', () => {
    fixture.detectChanges();

    expect(globalService.getAll).toHaveBeenCalledExactlyOnceWith(SERV.HASHLISTS, {
      filter: [
        { field: 'isArchived', operator: 'eq', value: false },
        { field: 'format', operator: 'eq', value: HashListFormat.TEXT }
      ]
    });
    expect(component.selectHashlists).toStrictEqual([
      { id: 1, name: 'First hashlist' },
      { id: 2, name: 'Second hashlist' },
      { id: 3, name: 'Different hash type' }
    ]);
    expect(component.isLoading).toBe(false);

    const multiselect = fixture.debugElement.query(By.css('input-multiselect'))
      .componentInstance as MockFormInputComponent;
    expect(multiselect.items).toEqual(component.selectHashlists);
    expect(multiselect.isLoading).toBe(false);
  });

  it('remains loading until the hashlist response arrives and supports an empty result', () => {
    const response$ = new Subject<ResponseWrapper>();
    globalService.getAll.mockReturnValue(response$);
    fixture.detectChanges();

    expect(component.isLoading).toBe(true);
    const multiselect = fixture.debugElement.query(By.css('input-multiselect'))
      .componentInstance as MockFormInputComponent;
    expect(multiselect.isLoading).toBe(true);

    response$.next(mockValidResponse(zHashlistListResponse, { data: [] }));
    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.selectHashlists).toEqual([]);
    expect(component.form.controls.hashlistIds.hasError('required')).toBe(true);
    expect(multiselect.items).toEqual([]);
    expect(multiselect.isLoading).toBe(false);
  });

  it('accepts multiple selected hashlists with the same hash type', () => {
    fixture.detectChanges();
    component.form.controls.name.setValue('Combined list');

    component.form.controls.hashlistIds.setValue([1, 2]);

    expect(component.form.controls.hashlistIds.valid).toBe(true);
    expect(component.form.valid).toBe(true);
  });

  it('accepts a single selected hashlist', () => {
    fixture.detectChanges();
    component.form.controls.name.setValue('Single list');

    component.form.controls.hashlistIds.setValue([1]);

    expect(component.form.controls.hashlistIds.valid).toBe(true);
    expect(component.form.valid).toBe(true);
  });

  it('rejects selected hashlists with different hash types', () => {
    fixture.detectChanges();
    component.form.controls.name.setValue('Mixed list');

    component.form.controls.hashlistIds.setValue([1, 3]);

    expect(component.form.controls.hashlistIds.getError('mixedHashTypes')).toBe(true);
    expect(component.form.valid).toBe(false);
  });

  it('revalidates a mixed selection made before hashlists have loaded', () => {
    const response$ = new Subject<ResponseWrapper>();
    globalService.getAll.mockReturnValue(response$);
    fixture.detectChanges();
    component.form.controls.name.setValue('Early mixed list');

    component.form.controls.hashlistIds.setValue([1, 3]);

    expect(component.form.controls.hashlistIds.hasError('mixedHashTypes')).toBe(false);
    expect(component.form.valid).toBe(true);

    response$.next(HASHLISTS_RESPONSE);

    expect(component.form.controls.hashlistIds.getError('mixedHashTypes')).toBe(true);
    expect(component.form.valid).toBe(false);
  });

  it('submits a valid form, shows success, and navigates to the superhashlist page', () => {
    fixture.detectChanges();
    component.form.setValue({ name: 'Combined list', hashlistIds: [1, 2] });

    component.onSubmit();

    expect(globalService.chelper).toHaveBeenCalledExactlyOnceWith(SERV.HELPER, 'createSuperHashlist', {
      name: 'Combined list',
      hashlistIds: [1, 2]
    });
    expect(alertService.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('New Superhashlist created');
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['hashlists/superhashlist']);
  });

  it('does not submit invalid values and marks all controls as touched', () => {
    component.onSubmit();

    expect(globalService.chelper).not.toHaveBeenCalled();
    expect(component.form.controls.name.touched).toBe(true);
    expect(component.form.controls.hashlistIds.touched).toBe(true);
    expect(alertService.showSuccessMessage).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
