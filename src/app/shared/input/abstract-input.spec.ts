import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, NgControl, Validators } from '@angular/forms';

import { AbstractInputComponent } from '@src/app/shared/input/abstract-input';

@Component({ template: '', standalone: false })
class TestInput extends AbstractInputComponent<string> {
  get detector(): ChangeDetectorRef {
    return this.cdr;
  }
}

describe('AbstractInputComponent', () => {
  let fixture: ComponentFixture<TestInput>;
  let component: TestInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [TestInput] }).compileComponents();
    fixture = TestBed.createComponent(TestInput);
    component = fixture.componentInstance;
  });

  it('generates an id only when none is supplied', () => {
    component.ngOnInit();
    expect(component.inputId).toMatch(/^input_[a-z0-9]+$/);
    component.inputId = 'provided';
    component.ngOnInit();
    expect(component.inputId).toBe('provided');
  });

  it('writes values without notifying the registered change callback', () => {
    const change = vi.fn().mockName('change');
    component.registerOnChange(change);
    component.writeValue('hello');
    expect(component.value).toBe('hello');
    component.writeValue(null);
    expect(component.value).toBeNull();
    expect(change).not.toHaveBeenCalled();
    component.onChange('next');
    expect(change).toHaveBeenCalledExactlyOnceWith('next');
  });

  it('marks for check when touched or disabled', () => {
    const cdr = component.detector;
    const mark = vi.spyOn(cdr, 'markForCheck');
    const touched = vi.fn().mockName('touched');
    component.registerOnTouched(touched);
    component.onTouched();
    expect(touched).toHaveBeenCalledExactlyOnceWith();
    component.setDisabledState!(true);
    expect(component.disabled).toBe(true);
    component.setDisabledState!(false);
    expect(component.disabled).toBe(false);
    expect(mark).toHaveBeenCalledTimes(3);
  });

  it('focuses an available field and tolerates a missing field', () => {
    expect(() => component.focus()).not.toThrow();
    const field = document.createElement('input');
    const focus = vi.spyOn(field, 'focus');
    component.inputField = new ElementRef(field);
    component.focus();
    expect(focus).toHaveBeenCalledExactlyOnceWith();
  });

  it('reflects this control’s validation and touched state', async () => {
    const control = new FormControl('', Validators.required);
    vi.spyOn(component, 'ngControl', 'get').mockReturnValue({ control } as unknown as NgControl);
    component.ngDoCheck();
    expect(component.hasError).toBe(false);
    expect(component.isTouched).toBe(false);
    expect(component.errors).toStrictEqual({ required: true });
    control.markAsTouched();
    component.ngDoCheck();
    expect(component.hasError).toBe(true);
    expect(component.isTouched).toBe(true);
    control.setValue('valid');
    component.ngDoCheck();
    expect(component.hasError).toBe(false);
    expect(component.errors).toBeNull();
    await fixture.whenStable();
  });

  it('handles a missing control', () => {
    expect(component.ngControl).toBeNull();
    component.ngDoCheck();
    expect(component.hasError).toBe(false);
    expect(component.errors).toBeNull();
  });
});
