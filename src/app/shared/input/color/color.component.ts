import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { AbstractInputComponent } from '@src/app/shared/input/abstract-input';
import { isColorLight, randomColor } from '@src/app/shared/utils/forms';

/**
 * `'random'` generates a fresh color via `randomColor()`; `true` selects white;
 * any other string is used verbatim as a hex.
 */
export type DefaultColorMode = 'random' | true | HexColor;

type HexColor = `#${string}`;

const DEFAULT_COLOR = '#FFFFFF';

/**
 * The three contrast/visibility states the overlay text can be in. The string
 * values are appended to `color-value-` to derive the SCSS class name.
 */
const ColorClass = {
  // no color
  Unset: 'unset',
  // light color
  OnLight: 'on-light',
  // dark color
  OnDark: 'on-dark'
} as const;
type ColorClass = (typeof ColorClass)[keyof typeof ColorClass];

/**
 * Simple native color picker component.
 */
@Component({
  selector: 'input-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputColorComponent),
      multi: true
    }
  ],
  standalone: false
})
export class InputColorComponent extends AbstractInputComponent<string | null> {
  @Input() defaultColor?: DefaultColorMode;
  @Input() randomColor = true;

  isUnset = true;
  colorClass: ColorClass = ColorClass.Unset;
  // The native <input type="color"> requires a valid 7-char hex; empty/null
  // values produce an "invalid RGB value" console warning.
  // The default color is set just to make sure this error does not occur.
  // If the default color is shown is still dependent on defaultColor input
  inputValue = DEFAULT_COLOR;

  override writeValue(newValue: string | null): void {
    super.writeValue(newValue);
    this.updateDerivedState();
  }

  override registerOnChange(fn: (value: string | null) => void): void {
    super.registerOnChange(fn);
    this.applyDefault();
  }

  generateRandomColor() {
    this.setValue(randomColor());
  }

  clearColor() {
    this.setValue(null);
  }

  onValueChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.setValue(target.value);
  }

  private setValue(next: string | null): void {
    this.value = next;
    this.updateDerivedState();
    this.onChange(this.value);
  }

  private updateDerivedState(): void {
    this.isUnset = !this.value;
    this.inputValue = this.value || DEFAULT_COLOR;
    this.colorClass = this.isUnset
      ? ColorClass.Unset
      : isColorLight(this.value)
        ? ColorClass.OnLight
        : ColorClass.OnDark;
  }

  private applyDefault(): void {
    if (this.value != null || this.defaultColor === undefined) return;
    const resolved = this.resolveDefault(this.defaultColor);
    if (resolved !== null) this.setValue(resolved);
  }

  private resolveDefault(mode: DefaultColorMode): string | null {
    if (mode === 'random') return randomColor();
    if (mode === true) return DEFAULT_COLOR;
    if (typeof mode === 'string') return mode;
    return null;
  }
}
