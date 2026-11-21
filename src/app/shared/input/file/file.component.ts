import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, forwardRef, inject } from '@angular/core';
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
  styleUrls: ['./file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFileComponent),
      multi: true
    },
    FileSizePipe
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
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
    const files = input.files;
    if (!files || files.length === 0) {
      return;
    }
    this.fileInfoText = this.buildFileInfoText(Array.from(files));
    this.filesSelected.emit(files);
    this.value = files;
    this.onChange(files);
    this.onTouched();
  }

  /**
   * Builds the label shown next to the button: name and size for a single file,
   * count, names and total size when several files are selected.
   */
  private buildFileInfoText(files: File[]): string {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const size = this.fs.transform(totalSize, false);
    if (files.length === 1) {
      return `${files[0].name} / Size: ${size}`;
    }
    const names = files.map((file) => file.name).join(', ');
    return `${files.length} files (${names}) / Total size: ${size}`;
  }
}
