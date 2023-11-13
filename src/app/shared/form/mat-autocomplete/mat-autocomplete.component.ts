import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mat-autocomplete',
  templateUrl: 'mat-autocomplete.component.html'
})
export class MatAutocompleteComponent implements OnInit {
  @Input() options$: Observable<any[]>; // An Observable emitting the options
  @Input() placeholder = 'Select or search';
  @Output() optionSelected = new EventEmitter<any>();

  selectedOption = new FormControl();
  filteredOptions: Observable<any[]> | undefined;

  constructor() {}

  /**
   * Angular lifecycle hook: ngOnInit
   * Initializes the component after Angular has initialized its data-bound properties.
   * Subscribes to changes in the selected option value and emits the selected option using the 'optionSelected' event.
   * Sets up the filteredOptions if an Observable of options ('options$') is provided.
   */
  ngOnInit(): void {
    // Subscribe to changes in the selected option value
    this.selectedOption.valueChanges.subscribe((option) => {
      // Emit the selected option using the 'optionSelected' event
      this.optionSelected.emit(option);
    });

    // Check if an Observable of options is provided
    if (this.options$) {
      // If options$ is available, bind the filteredOptions to the selectedOption value changes
      this.filteredOptions = this.selectedOption.valueChanges;
    }
  }

  /**
   * Custom display function to determine the display text for the selected option.
   * @param option - The option for which the display text is generated.
   * @returns The display text for the selected option, or an empty string if the option is falsy.
   */
  displayFn(option: any): string {
    return option && option.taskName ? option.taskName : '';
  }
}
