import { Component, EventEmitter, Input, Output, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { FileSizePipe } from '@src/app/core/_pipes/file-size.pipe';
import { AbstractInputComponent } from '@src/app/shared/input/abstract-input';

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
export class InputFileComponent extends AbstractInputComponent<FileList> {
  @Input() accept = '';
  @Input() multiple = false;
  fileInfoText = '';
  @Output() filesSelected = new EventEmitter<FileList>();
  private fs = inject(FileSizePipe);

  onChangeValue(value: FileList) {
    this.value = value;
    this.onChange(value);
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fileToUpload = input.files![0];
    const fileSize = fileToUpload.size;
    const fileName = fileToUpload.name;
    this.fileInfoText = fileName + ' / Size: ' + this.fs.transform(fileSize, false);
    const files = input.files!;
    this.filesSelected.emit(files);
    this.value = files;
    this.onChange(files);
    this.onTouched();
  }
}
