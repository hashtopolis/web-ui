import { Observable, Subject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnChanges,
  SimpleChanges,
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
export class InputMultiSelectComponent
  extends AbstractInputComponent<number | number[]>
  implements AfterViewInit, OnChanges
{
  @Input() label = 'Select or search:';
  @Input() placeholder = 'Select or search';
  @Input() isLoading = false;
  @Input() set items(value: SelectOption[]) {
    // Keep an immutable copy to avoid mutating parent inputs
    this._items = value ? [...value] : [];
    this.availableItems = [...this._items];
    this.itemsSubject.next(this.availableItems);
  }
  get items(): SelectOption[] {
    return this._items;
  }
  @Input() multiselectEnabled = true;
  @Input() mergeIdAndName = false;
  @Input() initialHashlistId: string | number;

  @ViewChild('selectInput', { read: MatInput }) selectInput: MatInput;

  private searchInputSubject = new Subject<string>();
  private itemsSubject = new Subject<SelectOption[]>();
  private maxItems = 50;
  private _items: SelectOption[] = [];
  private availableItems: SelectOption[] = [];

  filteredItems: Observable<SelectOption[]>;
  searchTerm = '';

  // Visual chips
  selectedItems: SelectOption[] = [];

  // Validation model (dummy, never displayed)
  chipGridValidation: SelectOption[] = [];

  readonly separatorKeysCodes: number[] = [COMMA, ENTER]; // ENTER and COMMA key codes

  constructor(
    injector: Injector,
    private sanitizer: DomSanitizer
  ) {
    super(injector);
    this.filteredItems = combineLatest([
      this.searchInputSubject.pipe(startWith('')),
      this.itemsSubject.pipe(startWith(this.availableItems))
    ]).pipe(
      map(([searchTerm]) => {
        return searchTerm ? this._filter(searchTerm) : this.getUnselectedItems();
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && !changes['items'].firstChange) {
      // Already handled by setter, just refresh search
      this.searchInputSubject.next(this.searchTerm);
    }
  }

  ngAfterViewInit(): void {
    // Check if initialHashlistId is provided
    if (this.initialHashlistId != null) {
      // Find the preselected item based on initialHashlistId
      const preselectedItem = this.availableItems.find((item) => item.id === this.initialHashlistId);

      // If the preselected item is found, add it to selectedItems
      if (preselectedItem) {
        this.selectedItems.push(preselectedItem);

        // Optionally, remove the preselected item from the available items
        this.availableItems = this.availableItems.filter((i) => i.id !== preselectedItem.id);
        this.itemsSubject.next(this.availableItems);
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
      this.availableItems = this.availableItems.filter((i) => i.id !== item.id);
      this.itemsSubject.next(this.availableItems);

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
      this.availableItems = [...this.availableItems, item];
      this.searchInputSubject.next(this.searchTerm);
      this.itemsSubject.next(this.availableItems);

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
  onSearchInputChange(event?: Event): void {
    if (event) {
      const target = event.target as HTMLInputElement;
      this.searchTerm = target.value;
    }
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
    for (const item of this.availableItems) {
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
      // For single-select, put back the previous one (if any) then clear selection
      if (this.selectedItems.length > 0) {
        this.availableItems = [...this.availableItems, this.selectedItems[0]];
      }
      this.selectedItems = [];
    }

    // Remove selected option from available list
    this.availableItems = this.availableItems.filter((i) => i.id !== event.option.value.id);

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
    for (const item of this.availableItems) {
      if (!this.selectedItems.find((s) => s.id === item.id)) {
        results.push(item);
        if (results.length === this.maxItems) {
          break;
        }
      }
    }
    return results;
  }

  override writeValue(newValue: number | number[] | null): void {
    // Reset visual selection to reflect external form writes (e.g., reset())
    if (!newValue || (Array.isArray(newValue) && newValue.length === 0)) {
      this.selectedItems = [];
      this.chipGridValidation = [];
      // Restore available items from the latest input set
      this.availableItems = [...this._items];
      this.itemsSubject.next(this.availableItems);
      this.searchTerm = '';
      this.searchInputSubject.next(this.searchTerm);
      this.value = this.multiselectEnabled ? [] : null;
    } else {
      // Convert number/number[] to SelectOption/SelectOption[]
      const ids = Array.isArray(newValue) ? newValue : [newValue];
      const selectedOptions = ids
        .map((id) => this._items.find((item) => Number(item.id) === Number(id)))
        .filter((item): item is SelectOption => item !== undefined);

      this.selectedItems = selectedOptions;
      this.chipGridValidation = [...this.selectedItems];

      // Remove selected items from available
      const selectedIds = new Set(ids.map((id) => Number(id)));
      this.availableItems = this._items.filter((item) => !selectedIds.has(Number(item.id)));
      this.itemsSubject.next(this.availableItems);

      this.value = this.multiselectEnabled ? ids : ids[0];
    }
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
