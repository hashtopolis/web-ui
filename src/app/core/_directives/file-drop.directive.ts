import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

/*
 * Detects when a file is hovered or dropped
 * Usage:
 *   value | fileDrop
 * Example:
 *     fileDrop >
 *   console: detects when a file is hovered or dropped
 */

@Directive({
  selector: '[appFileDrop]',
  standalone: false
})
export class FileDropDirective {
  constructor() {}

  @Input() private allowed_extensions: Array<string> = [];
  @Output() private filesChangeEmiter: EventEmitter<File[]> = new EventEmitter();
  @Output() selectedFiles = new EventEmitter<FileList>();
  @Output() private filesInvalidEmiter: EventEmitter<File[]> = new EventEmitter();
  @HostBinding('style.background') private background: string;

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    const target = evt.target as HTMLInputElement;
    this.filesChangeEmiter.emit(target?.files ? Array.from(target.files) : []);
  }
}
