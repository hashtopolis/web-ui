import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mat-autocomplete',
  template: `
    <div>
      <mat-form-field>
        <input type="text" [placeholder]="placeholder" matInput [formControl]="selectedOption" [matAutocomplete]="auto">
        <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn">
          <mat-option *ngFor="let option of filteredOptions | async" [value]="option">
            {{ option.taskName }}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
    </div>
  `,
})
export class MatAutocompleteComponent implements OnInit {
  @Input() options$: Observable<any[]>; // An Observable emitting the options
  @Input() placeholder: string = 'Select or search';
  @Output() optionSelected = new EventEmitter<any>();

  selectedOption = new FormControl();
  filteredOptions: Observable<any[]> | undefined;

  constructor() {}

  ngOnInit(): void {
    this.selectedOption.valueChanges.subscribe((option) => {
      this.optionSelected.emit(option);
    });

    if (this.options$) {
      this.filteredOptions = this.selectedOption.valueChanges;
    }
  }

  displayFn(option: any): string {
    return option && option.taskName ? option.taskName : '';
  }
}
