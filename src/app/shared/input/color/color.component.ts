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
  /**
   * The native `<input type="color">` requires a valid 7-char hex; null/empty
   * produces an "invalid RGB value" console warning. Bound as the input's
   * value when the form value is null. The `.color-unset` CSS class then
   * masks the swatch transparently so this fallback hex is never visible.
   */
  readonly DEFAULT_NATIVE_INPUT_PLACEHOLDER = '#FFFFFF';

  readonly isLight = isColorLight;

  @Input() defaultColor?: DefaultColorMode;
  @Input() randomColor = true;

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
    this.setValue((event.target as HTMLInputElement).value);
  }

  private setValue(next: string | null): void {
    this.value = next;
    this.onChange(next);
  }

  private applyDefault(): void {
    if (this.value != null || this.defaultColor === undefined) return;
    const resolved = this.resolveDefault(this.defaultColor);
    if (resolved !== null) this.value = resolved;
  }

  private resolveDefault(mode: DefaultColorMode): string | null {
    if (mode === 'random') return randomColor();
    if (mode === true) return this.DEFAULT_NATIVE_INPUT_PLACEHOLDER;
    if (typeof mode === 'string') return mode;
    return null;
  }
}
