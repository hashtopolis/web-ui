import { Observable, Subject, combineLatest, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatInput } from '@angular/material/input';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { AbstractInputComponent } from '@src/app/shared/input/abstract-input';
import { SelectOption, extractIds } from '@src/app/shared/utils/forms';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class InputMultiSelectComponent extends AbstractInputComponent<number | number[]> implements AfterViewInit {
  @Input() label = 'Select or search:';
  @Input() placeholder = 'Select or search';
  @Input() isLoading = false;
  @Input() items: SelectOption[] = [];
  @Input() multiselectEnabled = true;
  @Input() mergeIdAndName = false;
  @Input() initialHashlistId: string | number;

  @ViewChild('selectInput', { read: MatInput }) selectInput: MatInput;

  private searchInputSubject = new Subject<string>();
  private maxItems = 50;
  filteredItems: Observable<SelectOption[]>;
  searchTerm = '';

  // Visual chips
  selectedItems: SelectOption[] = [];

  // Validation model (dummy, never displayed)
  chipGridValidation: SelectOption[] = [];

  readonly separatorKeysCodes: number[] = [COMMA, ENTER]; // ENTER and COMMA key codes

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
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
      const preselectedItem = this.items.find((item) => item.id === this.initialHashlistId);

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

  public addChip(item: SelectOption): void {
    if (!this.selectedItems.find((i) => i.id === item.id)) {
      // Update visual array
      if (this.multiselectEnabled) {
        this.selectedItems.push(item);
      } else {
        this.selectedItems = [item];
      }

      // Update validation array
      this.chipGridValidation = [...this.selectedItems];

      // Remove item from available list
      const index = this.items.findIndex((i) => i.id === item.id);
      if (index !== -1) this.items.splice(index, 1);

      // Update filtered items
      this.searchInputSubject.next(this.searchTerm);

      // Notify Angular forms
      this.onChangeValue(this.selectedItems);
    }
  }

  public remove(item: SelectOption): void {
    const index = this.selectedItems.findIndex((i) => i.id === item.id);
    if (index >= 0) {
      this.selectedItems.splice(index, 1);
      this.chipGridValidation = [...this.selectedItems];

      // Put back to available items
      this.items.push(item);
      this.searchInputSubject.next(this.searchTerm);

      this.onChangeValue(this.selectedItems);
    }
  }

  // When typing a separator key (ENTER, COMMA)
  onInputChipAdd(event: MatChipInputEvent) {
    const value = event.value?.trim();
    if (!value) return;

    this.addChip({ id: value, name: value });
    event.chipInput.clear();
    this.searchTerm = '';
    if (this.selectInput) {
      try {
        this.selectInput.value = '';
      } catch {
        // noop
      }
    }
  }

  // When selecting from autocomplete
  onAutocompleteSelect(selected: SelectOption) {
    this.addChip(selected);
    this.searchTerm = '';
    this.searchInputSubject.next(this.searchTerm);
    if (this.selectInput) {
      try {
        this.selectInput.value = '';
      } catch {
        // ignore
      }
    }
    this.cdr.markForCheck();
  }

  /**
   * Handles the change in the input value and triggers the corresponding change events.
   *
   * @param value - The new value of the input.
   * @returns {void}
   */
  /**
   * Handles the change in the input value and triggers the corresponding change events.
   *
   * @param value - The new value of the input.
   * @returns {void}
   */
  onChangeValue(value: SelectOption | SelectOption[]): void {
    if (!this.multiselectEnabled) {
      if (Array.isArray(value)) {
        this.value = extractIds(value, 'id')[0];
      } else if (value) {
        this.value = extractIds([value], 'id')[0]; // wrap in array
      } else {
        this.value = null; // or handle empty case
      }
    } else {
      if (Array.isArray(value)) {
        this.value = extractIds(value, 'id');
      } else if (value) {
        this.value = extractIds([value], 'id');
      } else {
        this.value = [];
      }
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
   * Filters the items based on the provided search value.
   *
   * @param {string} value - The search value to filter the items.
   * @returns {SelectOption[]} - The filtered array of items.
   */
  private _filter(value: string | SelectOption): SelectOption[] {
    // If a SelectOption is passed by accident, convert to string
    const searchString = typeof value === 'string' ? value : (value.name ?? '');
    const filterValue = searchString.toLowerCase();

    const results: SelectOption[] = [];
    for (const item of this.items) {
      const nameToSearch = this.mergeIdAndName ? `${item.id} ${item.name}`.toLowerCase() : item.name.toLowerCase();
      if (nameToSearch.includes(filterValue)) {
        results.push(item);
        if (results.length === this.maxItems) {
          break;
        }
      }
    }
    return results;
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

    if (this.selectInput) {
      try {
        this.selectInput.value = '';
      } catch {
        // ignore
      }
    }
    this.cdr.markForCheck();

    // Notify about the change
    this.onChangeValue(this.selectedItems);
    // this.onTouched();
  }

  /**
   * Gets the unselected items from the available items list.
   *
   * @returns {SelectOption[]} - The array of unselected items.
   */
  private getUnselectedItems(): SelectOption[] {
    const results: SelectOption[] = [];
    for (const item of this.items) {
      if (!this.selectedItems.includes(item)) {
        results.push(item);
        if (results.length === this.maxItems) {
          break;
        }
      }
    }
    return results;
  }

  /**
   * Utility to escape HTML entities
   * @param text
   * @returns sanitized Text
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
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
      const escapedValue = this.escapeHtml(value);
      const escapedTerm = this.escapeHtml(term);

      const regex = new RegExp(`(${escapedTerm})`, 'ig');
      const highlighted = escapedValue.replace(regex, '<span class="highlight-text">$1</span>');

      return this.sanitizer.bypassSecurityTrustHtml(highlighted);
    }

    return this.sanitizer.bypassSecurityTrustHtml(this.escapeHtml(value));
  }
}
