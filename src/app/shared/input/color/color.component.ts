import { Component, Input, ViewEncapsulation, forwardRef } from '@angular/core';
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
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class InputColorComponent extends AbstractInputComponent<string> {
  /**
   * The native `<input type="color">` requires a valid 7-char hex; empty
   * produces an "invalid RGB value" console warning. Bound as the input's
   * value when the form value is empty. The `.color-unset` CSS class then
   * masks the swatch transparently so this fallback hex is never visible.
   */
  readonly DEFAULT_NATIVE_INPUT_PLACEHOLDER = '#FFFFFF';

  readonly isLight = isColorLight;

  @Input() defaultColor?: DefaultColorMode;
  @Input() randomColor = true;

  /**
   * Hashtopolis stores task colors as bare 6-char hex (e.g. `ff0000`), but
   * `<input type="color">`, CSS `background`, and `isColorLight()` all need a
   * 7-char `#rrggbb`. Expose a normalized `#`-prefixed form for display while
   * keeping the stored/emitted value bare. Returns '' for empty/malformed input
   * so the `.color-unset` fallback kicks in instead of rendering black.
   */
  get nativeColor(): string {
    const hex = (this.value ?? '').trim().replace(/^#/, '');
    return /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex) ? `#${hex}` : '';
  }

  override registerOnChange(fn: (value: string) => void): void {
    super.registerOnChange(fn);
    this.applyDefault();
  }

  generateRandomColor() {
    this.setValue(this.stripHash(randomColor()));
  }

  clearColor() {
    this.setValue('');
  }

  onValueChange(event: Event): void {
    // The native picker always emits a `#rrggbb`; store it bare to match the backend format.
    this.setValue(this.stripHash((event.target as HTMLInputElement).value));
  }

  /** Drop a leading `#` so values are stored/emitted as bare hex. */
  private stripHash(value: string): string {
    return (value ?? '').replace(/^#/, '');
  }

  private setValue(next: string): void {
    this.value = next;
    this.onChange(next);
  }

  private applyDefault(): void {
    if (this.value || this.defaultColor === undefined) return;
    const resolved = this.resolveDefault(this.defaultColor);
    if (resolved) this.value = this.stripHash(resolved);
  }

  private resolveDefault(mode: DefaultColorMode): string {
    if (mode === 'random') return randomColor();
    if (mode === true) return this.DEFAULT_NATIVE_INPUT_PLACEHOLDER;
    if (typeof mode === 'string') return mode;
    return '';
  }
}
