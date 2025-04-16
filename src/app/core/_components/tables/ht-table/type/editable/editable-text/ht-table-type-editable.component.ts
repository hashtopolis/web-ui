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
import { HTTableColumn, HTTableEditable } from '../../../ht-table.models';

@Component({
    selector: 'ht-table-editable',
    templateUrl: './ht-table-type-editable.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class HTTableTypeEditableComponent implements OnInit {
  editable: HTTableEditable<any>;
  original: string;

  @Input() element: any;
  @Input() tableColumn: HTTableColumn;

  @Output() editableInputSaved: EventEmitter<HTTableEditable<any>> =
    new EventEmitter<HTTableEditable<any>>();
  @ViewChild('editableInput') editableInput: ElementRef;

  editMode = false;

  ngOnInit(): void {
    if (this.tableColumn.editable) {
      this.editable = this.tableColumn.editable(this.element);
      this.original = this.editable.value;
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
      this.editable.value = this.original;
    }
  }

  onFocus(event: FocusEvent): void {
    event.stopPropagation();
    this.editableInput.nativeElement.select();
  }

  onEditableInputSaved(event: MouseEvent): void {
    event.stopPropagation();
    this.editableInputSaved.emit(this.editable);
    this.editMode = false;
  }

  onEditableInputEnter(event: Event): void {
    event.stopPropagation();
    this.editableInputSaved.emit(this.editable);
    this.editMode = false;
  }

  onClose(): void {
    this.editMode = false;
    this.editable.value = this.original;
  }
}
