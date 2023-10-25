import { Component, Input } from '@angular/core';

/**
 * Component for truncating and expanding text with a "More/Less" button.
 */
@Component({
  selector: 'btn-truncate-text',
  template: `
  <div class="text-container">
    <div *ngIf="!expanded">{{ text | slice:0:maxLength }}{{ text.length > maxLength ? '...' : '' }}</div>
    <div *ngIf="expanded">{{ text }}</div>
    <button *ngIf="text.length > maxLength" (click)="toggleExpansion()">
      {{ expanded ? 'Less' : 'More' }}
    </button>
  </div>
  `,
  styles: [`
    .text-container {
      position: relative;
      max-width: 200px; /* Customize as needed */
      overflow: hidden;
      margin: 0; /* Add this to remove margin */
      padding: 0; /* Add this to remove padding */
    }

    .text-container button {
      display: inline;
      background: none;
      border: none;
      color: blue;
      cursor: pointer;
      margin: 0; /* Add this to remove margin */
      padding: 0; /* Add this to remove padding */
    }
`]
})
export class ButtonTruncateTextComponent {
  /**
   * The text to be truncated and expanded.
   */
  @Input() text: string;

  /**
   * The maximum length of the text to display before truncation.
   */
  @Input() maxLength: number = 40; // Default maximum length

  /**
   * Flag to determine if the text is expanded or truncated.
   */
  expanded: boolean = false;

  /**
   * Toggles the expansion of the text.
   */
  toggleExpansion() {
    this.expanded = !this.expanded;
  }
}
