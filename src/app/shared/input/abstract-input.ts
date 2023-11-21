import { Directive, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive()
export class AbstractInputComponent<T> implements OnInit, ControlValueAccessor {
  @ViewChild('inputField')
  inputField: ElementRef;

  @Input()
  title: string;

  @Input()
  disabled = false;

  @Input()
  error: string;

  value: T;

  @Input()
  inputId: string;

  @Input()
  hint: string;

  @Input()
  tooltip: string;

  constructor() {}

  ngOnInit(): void {
    if (!this.inputId) {
      this.inputId = 'input_' + Math.random().toString(36).substr(2, 9);
      console.warn(
        'Input ID not provided. Generated a unique ID:',
        this.inputId
      );
    }
  }

  onChange = (newValue: T) => {};

  onTouched = () => {};

  writeValue(newValue: any): void {
    this.value = newValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  focus() {
    if (this.inputField && this.inputField.nativeElement) {
      this.inputField.nativeElement.focus();
    }
  }
}
