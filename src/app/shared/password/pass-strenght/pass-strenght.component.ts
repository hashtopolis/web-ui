import { Component, Input, OnChanges } from '@angular/core';
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
    color: 'var(--subtle-foreground)'
  };

  ngOnChanges(): void {
    this.evaluatePassword();
  }

  private evaluatePassword(): void {
    if (!this.passwordToCheck) {
      this.strength = {
        score: 0,
        label: 'Enter password',
        color: 'var(--subtle-foreground)'
      };
      return;
    }

    const score = this.calculatePasswordScore(this.passwordToCheck);

    if (score <= 2) {
      this.strength = {
        score: 1,
        label: 'Weak',
        color: 'var(--destructive)'
      };
    } else if (score <= 4) {
      this.strength = {
        score: 2,
        label: 'Fair',
        color: 'color-mix(in oklch, var(--destructive), var(--warning))'
      };
    } else if (score <= 6) {
      this.strength = {
        score: 3,
        label: 'Good',
        color: 'var(--warning)'
      };
    } else {
      this.strength = {
        score: 4,
        label: 'Excellent',
        color: 'var(--success)'
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
