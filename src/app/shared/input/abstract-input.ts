import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';

@Directive()
export class AbstractInputComponent<T> implements OnInit, ControlValueAccessor {
  @ViewChild('inputField')
  inputField: ElementRef;

  @Input()
  title: string;

  @Input()
  disabled = false;

  @Input()
  readonly = false;

  @Input()
  linkTo?: string | unknown[];

  @Input()
  error: boolean | string;

  @Input()
  isRequired: boolean;

  @Input()
  set value(v: T | null) {
    this._value = v as T;
  }
  get value(): T {
    return this._value;
  }
  private _value: T;

  @Input()
  inputId: string;

  @Input()
  hint: string;

  @Input()
  tooltip: string;

  onChange: (value: T) => void = () => {};

  onTouched = () => {};

  protected cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);

  ngControl: NgControl | null = null;

  get isTouched(): boolean {
    const control = this.ngControl?.control;
    if (!control) {
      return false;
    }
    return control.dirty || control.touched;
  }

  get hasError(): boolean {
    const control = this.ngControl?.control;
    if (!control) {
      return false;
    }
    return control.invalid && this.isTouched;
  }

  get errors(): ValidationErrors | null {
    return this.ngControl?.control?.errors ?? null;
  }

  ngOnInit(): void {
    if (!this.inputId) {
      this.inputId = 'input_' + Math.random().toString(36).substr(2, 9);
    }
    this.ngControl = this.injector.get(NgControl, null);
  }

  writeValue(newValue: T | null): void {
    this.value = newValue as T;
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = () => {
      fn();
      this.cdr.markForCheck();
    };
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  focus() {
    if (this.inputField && this.inputField.nativeElement) {
      this.inputField.nativeElement.focus();
    }
  }
}
