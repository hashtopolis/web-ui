// url.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * List of allowed URL protocols.
 * Modify this array to add or remove allowed protocols.
 */
const allowedProtocols = ['http:', 'https:'];

/**
 * Creates an Angular ValidatorFn that validates whether a control's value is a valid URL.
 * This validator attempts to parse the value using the browser's native URL API.
 * @returns A ValidatorFn function to use in Angular Reactive Forms.
 */
export function urlValidator(): ValidatorFn {
  // Build regex dynamically from allowedProtocols to enforce "//"
  const protocolPattern = allowedProtocols.map((protocol) => protocol.replace(':', '')).join('|');
  const doubleSlashRegex = new RegExp(`^(${protocolPattern})://.+`, 'i');

  return (control: AbstractControl): ValidationErrors | null => {
    const value: string | null = control.value?.trim();
    if (!value) {
      return null; // Let empty values be handled by Validators.required
    }

    // Ensure "//" is present
    if (!doubleSlashRegex.test(value)) {
      return { invalidUrl: { value } };
    }

    // Use the native URL API for validation
    try {
      const url = new URL(value);

      // Validate protocol
      if (allowedProtocols.includes(url.protocol)) {
        return null; // valid URL
      } else {
        return { invalidUrl: { value } };
      }
    } catch {
      return { invalidUrl: { value } };
    }
  };
}
