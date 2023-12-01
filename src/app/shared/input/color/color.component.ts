import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  forwardRef
} from '@angular/core';
import { randomColor } from '../../../shared/utils/forms';
import { AbstractInputComponent } from '../abstract-input';
import { ChangeDetectorRef } from '@angular/core';
import { Renderer2 } from '@angular/core';

/**
 * Custom Input Color Picker Component.
 *
 * This component provides an input field with an integrated color picker.
 * Users can select a color either through the input or the color picker.
 *
 * Usage Example:
 * ```html
    <input-color
      formControlName="name"
      title="Label Name"
    ></input-color>
 * ```
 */
@Component({
  selector: 'input-color',
  templateUrl: './color.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputColorComponent),
      multi: true
    }
  ]
})
export class InputColorComponent extends AbstractInputComponent<string> {
  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    super();
  }
  @ViewChild('selectInput') colorInput: ElementRef;
  @Input() defaultColor = '';
  @Input() randomColor = true;

  /**
   * List of preset colors for the color picker.
   */
  presetColors = [
    '#D41A29', //Red
    '#00A5ff', //Blue
    '#D000A4', //Magenta
    '#FF9000', //Orange
    '#F32E6E', //Pink
    '#D35F00', //Brown
    '#7ad54d' //Green
  ];

  generateRandomColor() {
    this.onChangeValue(randomColor());
    // this.cdr.detectChanges();
  }

  onChangeValue(value) {
    this.value = value;
    this.onChange(value);

    const inputElement = this.colorInput.nativeElement;
    this.renderer.setStyle(inputElement, 'background', this.value);
  }
}
