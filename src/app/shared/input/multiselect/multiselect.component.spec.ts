import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { InputMultiSelectComponent } from '@src/app/shared/input/multiselect/multiselect.component';
import { SelectOption } from '@src/app/shared/utils/forms';

const ITEMS: SelectOption<number>[] = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
  { id: 3, name: 'Gamma' },
  { id: 4, name: 'Delta' },
  { id: 5, name: 'Epsilon' },
  { id: 6, name: 'Zeta' }
];

describe('InputMultiSelectComponent', () => {
  let component: InputMultiSelectComponent;
  let fixture: ComponentFixture<InputMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputMultiSelectComponent],
      imports: [MatAutocompleteModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InputMultiSelectComponent);
    component = fixture.componentInstance;
    component.items = [...ITEMS];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('items input', () => {
    it('should populate filteredItems with all items on initial set', () => {
      expect(component.filteredItems.length).toBe(ITEMS.length);
    });

    it('should replace filteredItems when items are replaced', () => {
      component.items = [{ id: 10, name: 'New' }];
      expect(component.filteredItems.length).toBe(1);
      expect(component.filteredItems[0].name).toBe('New');
    });
  });

  describe('filtering', () => {
    it('should filter items by name (case-insensitive)', () => {
      component.onSearchInputChange({ target: { value: 'alpha' } } as unknown as Event);
      expect(component.filteredItems.length).toBe(1);
      expect(component.filteredItems[0].id).toBe(1);
    });

    it('should return all items when search is cleared', () => {
      component.onSearchInputChange({ target: { value: 'beta' } } as unknown as Event);
      component.onSearchInputChange({ target: { value: '' } } as unknown as Event);
      expect(component.filteredItems.length).toBe(ITEMS.length);
    });

    it('should return empty array when no items match', () => {
      component.onSearchInputChange({ target: { value: 'zzz' } } as unknown as Event);
      expect(component.filteredItems.length).toBe(0);
    });

    it('should filter by id when mergeIdAndName is true', () => {
      component.mergeIdAndName = true;
      component.onSearchInputChange({ target: { value: '2' } } as unknown as Event);
      expect(component.filteredItems.some((i) => i.id === 2)).toBeTrue();
    });
  });

  describe('addChip', () => {
    it('should add item to selectedItems', () => {
      component.addChip(ITEMS[0]);
      expect(component.selectedItems).toContain(ITEMS[0]);
    });

    it('should remove item from filteredItems after selection', () => {
      component.addChip(ITEMS[0]);
      expect(component.filteredItems.find((i) => i.id === ITEMS[0].id)).toBeUndefined();
    });

    it('should not add the same item twice', () => {
      component.addChip(ITEMS[0]);
      component.addChip(ITEMS[0]);
      expect(component.selectedItems.filter((i) => i.id === ITEMS[0].id).length).toBe(1);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      component.addChip(ITEMS[0]);
    });

    it('should remove item from selectedItems', () => {
      component.remove(ITEMS[0]);
      expect(component.selectedItems.find((i) => i.id === ITEMS[0].id)).toBeUndefined();
    });

    it('should restore item to filteredItems', () => {
      component.remove(ITEMS[0]);
      expect(component.filteredItems.find((i) => i.id === ITEMS[0].id)).toBeTruthy();
    });
  });

  describe('single-select mode', () => {
    beforeEach(() => {
      component.multiselectEnabled = false;
    });

    it('should replace previous selection when a new item is chosen', () => {
      component.addChip(ITEMS[0]);
      component.addChip(ITEMS[1]);
      expect(component.selectedItems.length).toBe(1);
      expect(component.selectedItems[0].id).toBe(ITEMS[1].id);
    });

    it('should put the previous item back into filteredItems on replacement', () => {
      component.addChip(ITEMS[0]);
      component.addChip(ITEMS[1]);
      expect(component.filteredItems.find((i) => i.id === ITEMS[0].id)).toBeTruthy();
    });
  });

  describe('writeValue', () => {
    it('should pre-select item by numeric id', () => {
      component.writeValue(1);
      expect(component.selectedItems.length).toBe(1);
      expect(component.selectedItems[0].id).toBe(1);
    });

    it('should pre-select multiple items by id array', () => {
      component.multiselectEnabled = true;
      component.writeValue([1, 2]);
      expect(component.selectedItems.length).toBe(2);
    });

    it('should reset selection when null is passed', () => {
      component.addChip(ITEMS[0]);
      component.writeValue(null);
      expect(component.selectedItems).toEqual([]);
    });

    it('should reset selection when empty array is passed', () => {
      component.addChip(ITEMS[0]);
      component.writeValue([]);
      expect(component.selectedItems).toEqual([]);
    });

    it('should restore all items to filteredItems on reset', () => {
      component.addChip(ITEMS[0]);
      component.addChip(ITEMS[1]);
      component.writeValue(null);
      expect(component.filteredItems.length).toBe(ITEMS.length);
    });
  });

  describe('viewportHeight', () => {
    it('should be itemSize × count when fewer than 5 items are available', () => {
      component.items = ITEMS.slice(0, 3);
      expect(component.viewportHeight).toBe(3 * component.itemSize);
    });

    it('should be capped at 5 rows regardless of item count', () => {
      expect(component.filteredItems.length).toBeGreaterThan(5);
      expect(component.viewportHeight).toBe(5 * component.itemSize);
    });
  });
});
