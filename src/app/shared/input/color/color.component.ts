import { Component, ElementRef, Input, ViewChild, forwardRef, Injector } from '@angular/core';

import { AbstractInputComponent } from '@src/app/shared/input/abstract-input';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { randomColor } from '@src/app/shared/utils/forms';

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
export class InputColorComponent extends AbstractInputComponent<string> {
  @Input() defaultColor = '#FFFFFF';
  @Input() randomColor = true;

  constructor(injector: Injector) {
    super(injector);
  }

  generateRandomColor() {
    this.value = randomColor();
    this.onChange(this.value);
  }

  // Ensure we never return an empty color
  getDisplayColor(): string {
    if (!this.value) {
      this.value = this.defaultColor;
    }
    return this.value;
  }
}
