import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

/*
 * Detects a change of event when a file is selected
 * Usage:
 *   value | fileSelect
 * Example:
 *     fileSelect >
 *   console: detects a change of event when a file is selected
 */

@Directive({
  selector: '[appFileSelect]',
  standalone: false
})
export class FileSelectDirective {
  @Output() selectedFiles = new EventEmitter<FileList>();

  constructor() {}

  @HostListener('change', ['$event'])
  onChange($event: Event) {
    this.selectedFiles.emit(($event.target as HTMLInputElement).files!);
  }
}
