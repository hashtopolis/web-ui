import { FileSizePipe } from 'src/app/core/_pipes/file-size.pipe';

import { Component, EventEmitter, Injector, Input, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { AbstractInputComponent } from '../abstract-input';

/**
 * Custom Input File Component.
 *
 * Usage Example:
 * ```html
 * <input-file
 *   formControlName="fileNama"
 * ></input-file>
 * ```
 */
@Component({
  selector: 'input-file',
  templateUrl: './file.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFileComponent),
      multi: true
    },
    FileSizePipe
  ],
  standalone: false
})
export class InputFileComponent extends AbstractInputComponent<any> {
  @Input() accept = '';
  @Input() multiple = false;
  @Output() filesSelected = new EventEmitter<FileList>();
  constructor(
    injector: Injector,
    private fs: FileSizePipe
  ) {
    super(injector);
  }

  onChangeValue(value) {
    this.value = value;
    this.onChange(value);
  }

  handleFileInput(event: any): void {
    const fileToUpload = event.target.files[0];
    const fileSize = fileToUpload.size;
    const fileName = fileToUpload.name;
    $('.fileuploadspan').text(' ' + fileName + ' / Size: ' + this.fs.transform(fileSize, false));
    const files = event.target.files;
    this.filesSelected.emit(files);
  }
}
