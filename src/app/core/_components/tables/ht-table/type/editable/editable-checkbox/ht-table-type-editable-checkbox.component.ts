import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BaseModel } from '@models/base.model';

import { HTTableColumn, HTTableEditable } from '@components/tables/ht-table/ht-table.models';

@Component({
  selector: 'ht-table-editable-checkbox',
  templateUrl: './ht-table-type-editable-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class HTTableTypeEditableCheckboxComponent implements OnInit {
  checkbox: HTTableEditable<BaseModel>;
  original: string;

  @Input() element: BaseModel;
  @Input() tableColumn: HTTableColumn;

  @Output() editableCheckboxSaved: EventEmitter<HTTableEditable<BaseModel>> = new EventEmitter<
    HTTableEditable<BaseModel>
  >();

  editMode = false;

  ngOnInit(): void {
    if (this.tableColumn.checkbox) {
      this.checkbox = this.tableColumn.checkbox(this.element);
      this.original = this.checkbox.value;
    }
  }

  onSelect(): void {
    this.editMode = true;
  }

  onEditableInputSaved(checked: boolean): void {
    event?.stopPropagation();
    this.checkbox.value = checked.toString();
    this.editableCheckboxSaved.emit(this.checkbox);
    this.editMode = false;
  }

  parseCheckboxValue(value: string | boolean): boolean {
    if (value === 'true' || value === true) {
      return true;
    } else if (value === 'false' || value === false) {
      return false;
    } else {
      return false;
    }
  }

  onClose(): void {
    this.editMode = false;
    this.checkbox.value = this.original;
  }
}
