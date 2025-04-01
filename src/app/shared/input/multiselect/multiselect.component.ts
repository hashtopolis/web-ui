import { Observable, Subject, combineLatest, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild, forwardRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { AbstractInputComponent } from '@src/app/shared/input/abstract-input';
import { extractIds } from '@src/app/shared/utils/forms';

import { SelectField } from '@models/input.model';

/**
 * InputMultiSelectComponent for selecting or searching items from an array of objects.
 * Supports dynamic filtering, highlighting, and emits selection changes.
 */
@Component({
  selector: 'input-multiselect',
  templateUrl: 'multiselect.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMultiSelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputMultiSelectComponent extends AbstractInputComponent<any> implements AfterViewInit {
  @Input() label = 'Select or search:';
  @Input() placeholder = 'Select or search';
  @Input() isLoading = false;
  @Input() items: SelectField[] = [];
  @Input() multiselectEnabled = true;
  @Input() mergeIdAndName = false;
  @Input() initialHashlistId: any;

  @ViewChild('selectInput', { read: MatInput }) selectInput: MatInput;

  private searchInputSubject = new Subject<string>();
  filteredItems: Observable<any[]>;
  selectedItems: SelectField[] = [];
  searchTerm = '';

  readonly separatorKeysCodes: number[] = [COMMA, ENTER]; // ENTER and COMMA key codes

  constructor(private sanitizer: DomSanitizer) {
    super();
    this.filteredItems = combineLatest([
      this.searchInputSubject.pipe(
        startWith('') // Emit an empty string as the initial value
      ),
      of(this.items) // Emit the items array as an initial value
    ]).pipe(
      map(([searchTerm]) => {
        return searchTerm ? this._filter(searchTerm) : this.getUnselectedItems();
      })
    );
  }

  ngAfterViewInit(): void {
    // Check if initialHashlistId is provided
    if (this.initialHashlistId != null) {
      // Find the preselected item based on initialHashlistId
      const preselectedItem = this.items.find(
        (item) => item.id === this.initialHashlistId
      );

      // If the preselected item is found, add it to selectedItems
      if (preselectedItem) {
        this.selectedItems.push(preselectedItem);

        // Optionally, remove the preselected item from the available items
        const index = this.items.indexOf(preselectedItem);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      }
    }
  }

  /**
   * Handles the change in the input value and triggers the corresponding change events.
   *
   * @param {any} value - The new value of the input.
   * @returns {void}
   */
  /**
   * Handles the change in the input value and triggers the corresponding change events.
   *
   * @param {any} value - The new value of the input.
   * @returns {void}
   */
  onChangeValue(value): void {
    if (!this.multiselectEnabled) {
      this.value = Array.isArray(value) ? extractIds(value, 'id')[0] : extractIds(value, 'id')[0];
    } else {
      this.value = Array.isArray(value) ? extractIds(value, 'id') : extractIds(value, 'id');
    }

    this.onChange(this.value);
  }

  /**
   * Handles the change in the search input and updates the search input subject.
   *
   * @returns {void}
   */
  onSearchInputChange(): void {
    this.searchInputSubject.next(this.searchTerm);
  }

  /**
   * Removes the specified item from the selected items.
   *
   * @param {SelectField} item - The item to be removed.
   * @returns {void}
   */
  public remove(item: SelectField): void {
    const index = this.selectedItems.indexOf(item);

    if (index >= 0) {
      // Add the removed item back to the unselected items
      this.items.push(item);

      this.items.sort((a, b) => parseInt(a.id) - parseInt(b.id));

      // Remove the item from the selected items
      this.selectedItems.splice(index, 1);

      // Update the filteredItems observable
      this.searchInputSubject.next(this.searchTerm);

      // Notify about the change
      this.onChangeValue(this.selectedItems);
      // this.onTouched();
    }
  }

  /**
   * Filters the items based on the provided search value.
   *
   * @param {string} value - The search value to filter the items.
   * @returns {SelectField[]} - The filtered array of items.
   */
  private _filter(value: string): SelectField[] {
    const filterValue = value.toLowerCase();
    return this.items.filter((item: SelectField) => {
      const nameToSearch = this.mergeIdAndName ? `${item.id} ${item.name}`.toLowerCase() : item.name.toLowerCase();
      return nameToSearch.includes(filterValue);
    });
  }

  /**
   * Handles the selection of an item from the autocomplete dropdown.
   *
   * @param {MatAutocompleteSelectedEvent} event - The event containing information about the selected item.
   * @returns {void}
   */
  public selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.multiselectEnabled) {
      // If an element has already been selected, it must be added to the list again
      if (this.selectedItems.length > 0) {
        this.items.push(this.selectedItems[0]);
        this.items.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      }

      // For single-select, clear the selected items before adding the new one
      this.selectedItems = [];
      // If single-select, remove the selected item from the unselected items
      const index = this.items.indexOf(event.option.value);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    } else {
      // For multi-select, remove the selected item from the items array
      const index = this.items.indexOf(event.option.value);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    }

    this.searchTerm = ''; // Reset the search term
    this.selectedItems.push(event.option.value);

    // Update the filteredItems observable
    this.searchInputSubject.next(this.searchTerm);

    // Notify about the change
    this.onChangeValue(this.selectedItems);
    // this.onTouched();
  }

  /**
   * Gets the unselected items from the available items list.
   *
   * @returns {SelectField[]} - The array of unselected items.
   */
  private getUnselectedItems(): SelectField[] {
    return this.items.filter((item) => !this.selectedItems.includes(item));
  }

  /**
   * Updates the provided string by highlighting the matching term.
   *
   * @param {string} value - The original string to be highlighted.
   * @param {string} term - The term to be highlighted in the string.
   * @returns {SafeHtml} - The sanitized HTML with the highlighted term.
   */
  public updateHighlightedValue(value: string, term: string): SafeHtml {
    if (typeof term === 'string' && typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      const lowerTerm = term.toLowerCase();

      const index = lowerValue.indexOf(lowerTerm);

      if (index >= 0) {
        const highlightedValue =
          value.substring(0, index) +
          `<span class="highlight-text">${value.substring(index, term.length)}</span>` +
          value.substring(index + term.length);

        return this.sanitizer.bypassSecurityTrustHtml(highlightedValue);
      }
    }

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
