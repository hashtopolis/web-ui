import { Directive, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';

import { AlertService } from '@src/app/core/_services/shared/alert.service';

/**
 * Returns copied clipboard string
 * Usage:
 *   value | copyButton
 * Example:
 *     copyButton
 * @returns Copied String
 **/

@Directive({
  selector: '[appCopyButton]',
  standalone: false
})
export class CopyButtonDirective {
  private alert = inject(AlertService);

  @Input('appCopyButton')
  public payload: string;

  @Output()
  public copied: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.payload) return;

    const listener = (e: ClipboardEvent) => {
      const clipboard = e.clipboardData;
      if (clipboard) {
        clipboard.setData('text', this.payload.toString());
      }
      e.preventDefault();
      this.copied.emit(this.payload);
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
    this.alert.showSuccessMessage('Copied');
  }
}
