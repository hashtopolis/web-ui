import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}
@Component({
  selector: 'app-pass-strenght',
  templateUrl: './pass-strenght.component.html',
  standalone: false
})
export class PassStrenghtComponent implements OnChanges {
  @Input() passwordToCheck: string = '';

  bars = [1, 2, 3, 4]; // Array to create 4 bars

  strength: PasswordStrength = {
    score: 0,
    label: 'Enter password',
    color: '#666666'
  };

  ngOnChanges(): void {
    this.evaluatePassword();
  }

  private evaluatePassword(): void {
    if (!this.passwordToCheck) {
      this.strength = {
        score: 0,
        label: 'Enter password',
        color: '#666666'
      };
      return;
    }

    const score = this.calculatePasswordScore(this.passwordToCheck);

    if (score <= 2) {
      this.strength = {
        score: 1,
        label: 'Weak',
        color: '#ff4444'
      };
    } else if (score <= 4) {
      this.strength = {
        score: 2,
        label: 'Fair',
        color: '#ff8800'
      };
    } else if (score <= 6) {
      this.strength = {
        score: 3,
        label: 'Good',
        color: '#ffbb00'
      };
    } else {
      this.strength = {
        score: 4,
        label: 'Excellent',
        color: '#00cc44'
      };
    }
  }

  private calculatePasswordScore(password: string): number {
    let score = 0;

    // Length criteria
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character variety
    if (/[a-z]/.test(password)) score++; // lowercase
    if (/[A-Z]/.test(password)) score++; // uppercase
    if (/[0-9]/.test(password)) score++; // numbers
    if (/[^A-Za-z0-9]/.test(password)) score++; // special characters

    // Additional complexity
    if (password.length >= 16) score++;
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)) score++;

    return score;
  }
}
