import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  forwardRef
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AbstractControl,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface SelectField {
  _id: string;
  name: string;
}
/**
 * InputMultiSelectComponent for selecting or searching items from an array of objects.
 * Supports dynamic filtering, highlighting, and emits selection changes.
 */
@Component({
  selector: 'app-input-multiselect',
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
export class InputMultiSelectComponent implements OnInit {
  @Input() arrayOfObjects: SelectField[] = [];
  @Input() label = 'Select or search:';
  @Input() placeholder = 'Select or search';
  @Input() isLoading = false;
  @Input() mergeIdAndName = false;
  @Input() externalControl: AbstractControl;
  @Output() selectionChanged = new EventEmitter<SelectField[]>();

  itemCtrl: AbstractControl;
  highlightedValue: SafeHtml = '';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredItems: Observable<SelectField[]>;
  items: SelectField[] = [];

  @ViewChild('selectInput') selectInput: ElementRef<HTMLInputElement>;

  /**
   * Constructs the MatAutocompleteComponent.
   * @param cdr - ChangeDetectorRef for triggering change detection
   * @param sanitizer - DomSanitizer for sanitizing HTML content
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  /**
   * Initializes the MatAutocompleteComponent and sets up the observable for filtering items
   */
  ngOnInit(): void {
    this.itemCtrl = this.externalControl || this.createFormControl();

    this.setupFilteredItemsObservable();

    this.itemCtrl.valueChanges.subscribe((value: string) => {
      this.updateHighlightedValue(value, this.itemCtrl.value);
      this.cdr.markForCheck();
    });
  }

  private createFormControl(): FormControl {
    return new FormControl('', Validators.required);
  }

  /**
   * Checks if a control is an instance of FormControl.
   * @param control - The control to check.
   * @returns True if the control is a FormControl, otherwise false.
   */
  isFormControl(control: AbstractControl): control is FormControl {
    return control instanceof FormControl;
  }

  /**
   * Handles the addition of a new item.
   * @param event
   */
  public addItem(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    event.chipInput!.clear();

    this.itemCtrl.setValue(null);

    this.selectionChanged.emit(this.items);
  }

  /**
   * Handles the removal of a selected item.
   * @param item - The SelectField item to be removed.
   */
  public remove(item: SelectField): void {
    const index = this.items.indexOf(item);

    if (index >= 0) {
      this.items.splice(index, 1);

      this.selectionChanged.emit(this.items);

      this.setupFilteredItemsObservable();
    }
  }

  /**
   * Handles the selection of an option If an option is selected, it adds the selected item to the 'items' array
   * If no option is selected, it sets the selection error to true.
   * @param event - The MatAutocompleteSelectedEvent representing the selected option.
   */
  public selected(event: MatAutocompleteSelectedEvent): void {
    this.items.push(event.option.value);
    this.selectInput.nativeElement.value = '';
    this.setupFilteredItemsObservable();
    this.highlightedValue = '';
    this.selectionChanged.emit(this.items);
    this.onChange(this.items);
    this.onTouched();
  }

  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    if (value !== undefined) {
      this.items = value;
      this.cdr.detectChanges();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Sets up an observable for filtering items based on user input.
   *
   */
  private setupFilteredItemsObservable(): void {
    this.filteredItems = this.itemCtrl.valueChanges.pipe(
      startWith(null),
      map((inputValue: string | null) =>
        inputValue ? this._filter(inputValue) : this.getUnselectedItems()
      )
    );
  }

  /**
   * Gets the unselected items from the array of objects.
   * @returns An array of unselected items.
   */
  private getUnselectedItems(): SelectField[] {
    return this.arrayOfObjects.filter((item) => !this.items.includes(item));
  }

  /**
   * Filters an array of SelectField items based on a search value.
   * @param value - The search value used for filtering.
   * @returns An array of SelectField items that match the search criteria.
   */
  private _filter(value: string): SelectField[] {
    const filterValue = value.toLowerCase();
    return this.arrayOfObjects.filter((item: SelectField) => {
      const nameToSearch = this.mergeIdAndName
        ? `${item._id} ${item.name}`.toLowerCase()
        : item.name.toLowerCase();
      return nameToSearch.includes(filterValue);
    });
  }

  /**
   * Checks if a specific error is present in the FormControl.
   * @param errorName - The name of the error to check.
   * @returns True if the specified error is present, otherwise false.
   */
  public hasError = (errorName: string): boolean => {
    return this.itemCtrl.hasError(errorName);
  };

  /**
   * Gets the error message for the selection based on the current FormControl state.
   * @returns The error message or an empty string if no error is present.
   */
  public getSelectionError(): string {
    if (
      this.hasError('required') &&
      (this.itemCtrl.dirty || this.itemCtrl.touched)
    ) {
      return 'Please make a selection';
    }

    return '';
  }

  /**
   * Updates the HTML representation of a value with highlighted characters.
   * @param value - The original string value.
   * @param term - The search term used for highlighting.
   * @returns A SafeHtml object representing the HTML with highlighted characters.
   */
  public updateHighlightedValue(value: string, term: string): SafeHtml {
    if (typeof term === 'string' && typeof value === 'string') {
      const pattern = term
        .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
        .split(' ')
        .filter((t) => t.length > 0)
        .join('|');
      const regex = new RegExp(`(${pattern})`, 'gi');

      const highlightedValue = value.replace(
        regex,
        (match) => `<span class="highlight-text">${match}</span>`
      );

      return this.sanitizer.bypassSecurityTrustHtml(highlightedValue);
    } else {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }
  }
}
