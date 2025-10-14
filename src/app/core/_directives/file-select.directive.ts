import {
  Directive,
  HostListener,
  HostBinding,
  Output,
  EventEmitter,
} from '@angular/core';

/*
 * Detects a change of event when a file is selected
 * Usage:
 *   value | fileSelect
 * Example:
 *     fileSelect >
 *   console: detects a change of event when a file is selected
*/

@Directive({
    selector: '[fileSelect]',
    standalone: false
})
export class FileSelectDirective {
  @Output() selectedFiles = new EventEmitter<FileList>();

  constructor() {}

  @HostListener('change', ['$event'])
  onChange($event) {
    this.selectedFiles.emit($event.target.files);
  }
}
