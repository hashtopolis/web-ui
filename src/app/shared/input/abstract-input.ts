import {
  ChangeDetectorRef,
  Directive,
  DoCheck,
  ElementRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';

@Directive()
export class AbstractInputComponent<T> implements OnInit, DoCheck, ControlValueAccessor {
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

  private previousTouched = false;
  private previousInvalid = false;

  hasError = false;
  isTouched = false;
  errors: ValidationErrors | null = null;

  get ngControl(): NgControl | null {
    try {
      return this.injector.get(NgControl, null);
    } catch {
      return null;
    }
  }

  ngOnInit(): void {
    if (!this.inputId) {
      this.inputId = 'input_' + Math.random().toString(36).substr(2, 9);
    }
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

  ngDoCheck(): void {
    const control = this.ngControl?.control;
    if (control) {
      const currentTouched = control.touched;
      const currentInvalid = control.invalid;
      const isFormTouched = !!(control.parent?.touched || control.root?.touched);
      const shouldShowValidation = control.dirty || currentTouched || isFormTouched;

      const newHasError = !!(control && control.invalid && shouldShowValidation);
      const newIsTouched = shouldShowValidation;
      const newErrors = control.errors || null;

      const hasChanges =
        this.hasError !== newHasError ||
        this.isTouched !== newIsTouched ||
        currentTouched !== this.previousTouched ||
        currentInvalid !== this.previousInvalid;

      this.hasError = newHasError;
      this.isTouched = newIsTouched;
      this.errors = newErrors;

      if (hasChanges) {
        this.previousTouched = currentTouched;
        this.previousInvalid = currentInvalid;
        setTimeout(() => this.cdr.detectChanges(), 0);
      }
    }
  }

  focus() {
    if (this.inputField && this.inputField.nativeElement) {
      this.inputField.nativeElement.focus();
    }
  }
}
