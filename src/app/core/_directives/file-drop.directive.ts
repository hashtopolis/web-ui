import {
  Directive,
  HostListener,
  HostBinding,
  Output,
  Input,
  EventEmitter
} from '@angular/core';

/*
 * Detects when a file is hovered or dropped
 * Usage:
 *   value | fileDrop
 * Example:
 *     fileDrop >
 *   console: detects when a file is hovered or dropped
*/

@Directive({
  selector: '[fileDrop]'
})
export class FileDropDirective {

  constructor() { }

  @Input() private allowed_extensions: Array<string> = [];
  @Output() private filesChangeEmiter: EventEmitter<File[]> = new EventEmitter();
  @Output() selectedFiles = new EventEmitter<FileList>();
  @Output() private filesInvalidEmiter: EventEmitter<File[]> = new EventEmitter();
  @HostBinding('style.background') private background;

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee'
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files;
    let valid_files : Array<File> = files;
    console.log(valid_files)
    console.log(evt);
    this.filesChangeEmiter.emit(evt.target.files);
  }
}
