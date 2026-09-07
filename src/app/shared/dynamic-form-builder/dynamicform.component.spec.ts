import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { GlobalService } from '@services/main.service';
import { FieldType, MetadataFormField } from '@services/metadata.service';

import { DynamicFormComponent } from '@src/app/shared/dynamic-form-builder/dynamicform.component';
import { InputModule } from '@src/app/shared/input/input.module';

describe('DynamicFormComponent validation state', () => {
  let fixture: ComponentFixture<DynamicFormComponent>;
  let component: DynamicFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicFormComponent],
      imports: [CommonModule, ReactiveFormsModule, InputModule],
      providers: [provideNoopAnimations(), { provide: GlobalService, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    component.isCreateMode = true;
    component.showPageWrapper = false;
    component.buttonText = 'Create';
    component.formMetadata = [
      {
        name: 'first',
        label: 'First',
        type: FieldType.Text,
        validators: [Validators.required]
      },
      {
        name: 'second',
        label: 'Second',
        type: FieldType.Text,
        validators: [Validators.required]
      }
    ] as MetadataFormField[];
    fixture.detectChanges();
  });

  it('does not mark sibling controls as touched when one field is blurred', fakeAsync(() => {
    const firstInput = fixture.debugElement.query(By.css('input#dynform-first')).nativeElement as HTMLInputElement;
    firstInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.form.controls['first'].touched).toBeTrue();
    expect(component.form.controls['second'].touched).toBeFalse();
    const fields = fixture.debugElement.queryAll(By.css('.field-stack'));
    expect(fields[0].nativeElement.classList).toContain('is-invalid');
    expect(fields[1].nativeElement.classList).not.toContain('is-invalid');
  }));

  it('marks every control as touched when the invalid form is submitted', fakeAsync(() => {
    component.onSubmit();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.form.controls['first'].touched).toBeTrue();
    expect(component.form.controls['second'].touched).toBeTrue();
    const fields = fixture.debugElement.queryAll(By.css('.field-stack'));
    expect(fields[0].nativeElement.classList).toContain('is-invalid');
    expect(fields[1].nativeElement.classList).toContain('is-invalid');
  }));
});
