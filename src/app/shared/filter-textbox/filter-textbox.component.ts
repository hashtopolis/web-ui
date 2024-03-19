import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Custom filter textbox component for filtering data.
 *
 * This component includes an input field for typing a filter string
 * and emits a changed event when the filter value is updated.
 */
@Component({
  selector: 'cm-filter-textbox',
  templateUrl: './filter-textbox.component.html'
})
export class FilterTextboxComponent {
  /** The model containing the filter string. */
  model: { filter: string } = { filter: '' };

  /** EventEmitter for notifying when the filter value changes. */
  @Output()
  changed: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Handles the change event of the filter input.
   *
   * @param event - The input event triggering the filter change.
   */
  filterChanged(event: any): void {
    event.preventDefault();
    this.changed.emit(this.model.filter); // Raise changed event
  }
}
