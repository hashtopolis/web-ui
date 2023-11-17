import { AbstractControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef
} from '@angular/core';
import { AbstractInputComponent } from '../abstract-input';

/**
 * Custom Input Color Picker Component.
 *
 * This component provides an input field with an integrated color picker.
 * Users can select a color either through the input or the color picker.
 *
 * Usage Example:
 * ```html
 * <app-input-color
 *   [externalControl]="form.get('color')"
 *   [heading]="'Label Name'"
 *   [color]="'#FFFFFF'" //Default color
 *   (colorChange)="onColorChange($event)"
 * ></app-input-color>
 * ```
 */
@Component({
  selector: 'app-input-color',
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
  constructor() {
    super();
  }

  @Input() defaultColor = '#FFFFFF';

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

  onChangeValue(value) {
    this.value = value;
    this.onChange(value);
  }
}
