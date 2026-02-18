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
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Directive()
export class AbstractInputComponent<T> implements OnInit, DoCheck, ControlValueAccessor {
  @ViewChild('inputField')
  inputField: ElementRef;

  @Input()
  title: string;

  @Input()
  disabled = false;

  @Input()
  error: boolean | string;

  @Input()
  isRequired: boolean;

  value: T;

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

  // Track previous state for change detection
  private previousTouched = false;
  private previousInvalid = false;

  // Public properties for template binding (instead of getters)
  hasError = false;
  isTouched = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any = null;

  // Lazy getter to avoid circular dependency
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
      // console.warn(
      //   'Input ID not provided. Generated a unique ID:',
      //   this.inputId
      // );
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
      // Trigger change detection when the control is touched
      this.cdr.markForCheck();
    };
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  ngDoCheck(): void {
    // Check if control state has changed
    const control = this.ngControl?.control;
    if (control) {
      const currentTouched = control.touched;
      const currentInvalid = control.invalid;

      // Update error state properties for template binding
      const newHasError = !!(control && control.invalid && (control.dirty || control.touched));
      const newIsTouched = currentTouched;
      const newErrors = control.errors || null;

      // Always update the properties
      const hasChanges =
        this.hasError !== newHasError ||
        this.isTouched !== newIsTouched ||
        currentTouched !== this.previousTouched ||
        currentInvalid !== this.previousInvalid;

      this.hasError = newHasError;
      this.isTouched = newIsTouched;
      this.errors = newErrors;

      // If state changed, trigger change detection
      if (hasChanges) {
        this.previousTouched = currentTouched;
        this.previousInvalid = currentInvalid;
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      }
    }
  }

  focus() {
    if (this.inputField && this.inputField.nativeElement) {
      this.inputField.nativeElement.focus();
    }
  }
}
