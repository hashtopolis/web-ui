import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-pass-match',
    template: `
  <div>
    @if (confirmPassword?.length) {
      <p class="text-left mb-0">{{ message }}</p>
    }
  </div>
  `,
    standalone: false
})
export class PassMatchComponent implements OnChanges {

  @Input() public newPassword: string;
  @Input() public confirmPassword: string;

  message: string;

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {

    const confirmpass = changes['confirmPassword'].currentValue;

    if (confirmpass) {

      this.message = (confirmpass === this.newPassword) ? 'Match' : 'No Match';

    }else{

      this.message = '';

    }

  }

}
