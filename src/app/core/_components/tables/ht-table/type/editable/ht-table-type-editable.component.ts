import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { HTTableColumn, HTTableEditable } from '../../ht-table.models';

@Component({
  selector: 'ht-table-editable',
  templateUrl: './ht-table-type-editable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HTTableTypeEditableComponent implements OnInit {
  editable: HTTableEditable;

  @Input() element: any;
  @Input() tableColumn: HTTableColumn;

  @Output() editableInputSaved: EventEmitter<HTTableEditable> =
    new EventEmitter<HTTableEditable>();
  @ViewChild('editableInput') editableInput: ElementRef;

  editMode = false;

  ngOnInit(): void {
    if (this.tableColumn.editable) {
      this.editable = this.tableColumn.editable(this.element);
    }
  }

  onSelect(event: MouseEvent): void {
    event.stopPropagation();

    this.editMode = true;

    setTimeout(() => {
      if (this.editableInput) {
        this.editableInput.nativeElement.focus();
      }
    }, 100);
  }

  onBlur(event: FocusEvent): void {
    const targetElement = event.relatedTarget as HTMLElement;
    if (!targetElement || targetElement.tagName.toLowerCase() !== 'button') {
      event.stopPropagation();
      this.editMode = false;
    }
  }

  onFocus(event: FocusEvent): void {
    event.stopPropagation();
  }

  onEditableInputSaved(event: MouseEvent): void {
    event.stopPropagation();
    this.editableInputSaved.emit(this.editable);
    this.editMode = false;
  }
}
