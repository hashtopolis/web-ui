import { ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { AbstractInputComponent } from '@src/app/shared/input/abstract-input';
import { randomColor } from '@src/app/shared/utils/forms';

/**
 * Custom Input Color Picker Component.
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
    ],
    standalone: false
})
export class InputColorComponent extends AbstractInputComponent<string> {
  @ViewChild('selectInput') colorInput: ElementRef;
  @Input() defaultColor = '';
  @Input() randomColor = true;

  presetColors = [
    '#D41A29', // Red
    '#00A5ff', // Blue
    '#D000A4', // Magenta
    '#FF9000', // Orange
    '#F32E6E', // Pink
    '#D35F00', // Brown
    '#7ad54d' // Green
  ];

  constructor(private renderer: Renderer2) {
    super();
  }

  generateRandomColor() {
    this.onChangeValue(randomColor());
  }

  onChangeValue(value) {
    this.value = value;
    this.onChange(value);
    const inputElement = this.colorInput.nativeElement;
    this.renderer.setStyle(inputElement, 'background', this.value); // Using Renderer2 to modify the style
  }
}
