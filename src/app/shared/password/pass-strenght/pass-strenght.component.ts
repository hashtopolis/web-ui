import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';

export const PasswordStrengthVal = {
  1: 'Poor',
  2: 'Not Good',
  3: 'Average',
  4: 'Good'
};

export enum PasswordStrengthColors {
  '#DDDDDD',
  '#8b0000',
  '#ff4500',
  '#FFA500',
  '#9ACD32'
}

@Component({
  selector: 'app-pass-strenght',
  template: `
  <div class="strength">
    <ul class="strengthBar mt-2">
      <li class="strength-point" [style.background-color]="bar0"></li>
      <li class="strength-point" [style.background-color]="bar1"></li>
      <li class="strength-point" [style.background-color]="bar2"></li>
      <li class="strength-point" [style.background-color]="bar3"></li>
    </ul>

    <p class="text-center mb-0 str-margin" [style.color]="messageColor" *ngIf="passwordToCheck?.length">{{ message }}</p>
  </div>
`,
})
export class PassStrenghtComponent implements OnChanges {

  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;
  @Input() public passwordToCheck: string;
  @Output() passwordStrength = new EventEmitter<boolean>();

  message: string;
  messageColor: string;

  checkStrength(password: string) {

    let force = 0;

    // Identify if password contains
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const lowerLetters = /[a-z]+/.test(password);
    const upperLetters = /[A-Z]+/.test(password);
    const numbers = /[0-9]+/.test(password);
    const special = regex.test(password);

    // Get boolean
    const flags = [lowerLetters, upperLetters, numbers, special];

    // See how many flags are in the password
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    // 5
    force += 2 * password.length + (password.length >= 10 ? 1 : 0);
    force += passedMatches * 10;

    // 6
    force = password.length <= 6 ? Math.min(force, 10) : force;

    // 7
    force = passedMatches === 1 ? Math.min(force, 10) : force;
    force = passedMatches === 2 ? Math.min(force, 20) : force;
    force = passedMatches === 3 ? Math.min(force, 30) : force;
    force = passedMatches === 4 ? Math.min(force, 40) : force;
    return force;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes['passwordToCheck'].currentValue;

    this.setBarColors(5, PasswordStrengthColors[0]);

    if (password) {
      const pwdStrength = this.checkStrength(password);

      pwdStrength === 40 ? this.passwordStrength.emit(true) : this.passwordStrength.emit(false);

      const color = this.getColor(pwdStrength);
      this.setBarColors(color.index, color.color);

      switch (pwdStrength) {
        case 10:
          this.message = 'Poor';
          break;
        case 20:
          this.message = 'Not Good';
          break;
        case 30:
          this.message = 'Average';
          break;
        case 40:
          this.message = 'Good';
          break;
      }
    } else {
      this.message = '';
    }
  }

  private getColor(strength: number) {
    let index = 0;

    if (strength === 10) {
      index = 0;
    } else if (strength === 20) {
      index = 1;
    } else if (strength === 30) {
      index = 2;
    } else if (strength === 40) {
      index = 3;
    } else {
      index = 4;
    }

    this.messageColor = PasswordStrengthColors[index+1];

    return {
      index: index + 1,
      color: PasswordStrengthColors[index+1],
    };
  }

  private setBarColors(count: number, color: string) {
    for (let n = 0; n < count; n++) {
      (this as any)['bar' + n] = color;
    }
  }
}
