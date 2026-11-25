import type { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BaseModel } from '@models/base.model';

import { HTTableColumn, HTTableEditable } from '@components/tables/ht-table/ht-table.models';
import { HTTableTypeEditableComponent } from '@components/tables/ht-table/type/editable/editable-text/ht-table-type-editable.component';

describe('HTTableTypeEditableComponent', () => {
  let fixture: ComponentFixture<HTTableTypeEditableComponent>;
  let component: HTTableTypeEditableComponent;
  let savedSpy: Mock;

  const element: BaseModel = { id: 1, type: 'task' };

  function editable(overrides: Partial<HTTableEditable<BaseModel>> = {}): HTTableEditable<BaseModel> {
    return { data: element, value: 'original', action: 'rename', ...overrides };
  }

  function column(editableFn?: HTTableColumn['editable']): HTTableColumn {
    return editableFn ? { id: 1, dataKey: 'name', editable: editableFn } : { id: 1, dataKey: 'name' };
  }

  function render(tableColumn: HTTableColumn) {
    fixture.componentRef.setInput('element', element);
    fixture.componentRef.setInput('tableColumn', tableColumn);
    fixture.detectChanges();
  }

  // ngModel writes its value to the input asynchronously, so the DOM needs a second render.
  async function enterEditMode() {
    container().click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function container(): HTMLElement {
    return fixture.nativeElement.querySelector('.editable-container');
  }

  function input(): HTMLInputElement | null {
    return fixture.nativeElement.querySelector('input.editable-input');
  }

  function button(label: 'Update Value' | 'Cancel'): HTMLButtonElement {
    return fixture.nativeElement.querySelector(`button[aria-label="${label}"]`);
  }

  function displayedText(): string | undefined {
    return fixture.nativeElement.querySelector('.editable-text span')?.textContent;
  }

  function typeIntoInput(value: string) {
    const inputElement = input()!;
    inputElement.value = value;
    inputElement.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HTTableTypeEditableComponent],
      imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HTTableTypeEditableComponent);
    component = fixture.componentInstance;
    savedSpy = vi.fn().mockName('editableInputSaved');
    component.editableInputSaved.subscribe(savedSpy);
  });

  describe('ngOnInit', () => {
    it('should build the editable from the column, remember the original value and show it', () => {
      const editableFn = vi.fn().mockName('HTTableColumn.editable').mockReturnValue(editable());

      render(column(editableFn));

      expect(editableFn).toHaveBeenCalledExactlyOnceWith(element);
      expect(component.editable).toStrictEqual(editable());
      expect(component.original).toBe('original');
      expect(component.editMode).toBe(false);
      expect(displayedText()).toBe('original');
      expect(input()).toBeNull();
    });

    it('should show the display text instead of the value when one is given', () => {
      const tableColumn = column(() => editable({ value: '10', display: '10 s' }));

      render(tableColumn);

      expect(displayedText()).toBe('10 s');
      expect(component.original).toBe('10');
    });

    it('should hide the value outside edit mode when the editable is hidden', () => {
      const tableColumn = column(() => editable({ hidden: true }));

      render(tableColumn);

      expect(displayedText()).toBeUndefined();
      expect(container()).not.toBeNull();
    });
  });

  describe('onSelect', () => {
    it('should enter edit mode and show the input with the current value', async () => {
      render(column(() => editable()));

      await enterEditMode();

      expect(component.editMode).toBe(true);
      expect(input()?.value).toBe('original');
      expect(displayedText()).toBeUndefined();
    });

    it('should not let the click reach the table row', () => {
      render(column(() => editable()));
      const rowClickSpy = vi.fn().mockName('rowClick');
      fixture.nativeElement.addEventListener('click', rowClickSpy);

      container().click();

      expect(rowClickSpy).not.toHaveBeenCalled();
    });

    it('should focus and select the input once the delay has passed', async () => {
      render(column(() => editable()));
      vi.useFakeTimers();
      try {
        container().click();
        fixture.detectChanges();
        const selectSpy = vi.spyOn(input()!, 'select');

        await vi.advanceTimersByTimeAsync(99);
        const focusedBeforeDelay = document.activeElement === input();
        await vi.advanceTimersByTimeAsync(1);

        expect(focusedBeforeDelay).toBe(false);
        expect(document.activeElement).toBe(input());
        expect(selectSpy).toHaveBeenCalledExactlyOnceWith();
      } finally {
        vi.useRealTimers();
      }
    });

    it('should not fail when the input is gone before the delay has passed', async () => {
      render(column(() => editable()));
      vi.useFakeTimers();
      try {
        // Without a render the input never exists, like when edit mode is left within the delay.
        component.onSelect(new MouseEvent('click'));

        // An error thrown in the timer callback would be rethrown here and fail the test.
        await vi.advanceTimersByTimeAsync(100);

        expect(vi.getTimerCount()).toBe(0);
        expect(component.editMode).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('onBlur', () => {
    it('should leave edit mode and discard changes when focus leaves to nowhere', async () => {
      render(column(() => editable()));
      await enterEditMode();
      typeIntoInput('changed');

      input()!.dispatchEvent(new FocusEvent('blur', { relatedTarget: null }));
      fixture.detectChanges();

      expect(component.editMode).toBe(false);
      expect(component.editable.value).toBe('original');
      expect(displayedText()).toBe('original');
      expect(savedSpy).not.toHaveBeenCalled();
    });

    it('should leave edit mode and discard changes when focus moves to an element that is no button', async () => {
      render(column(() => editable()));
      await enterEditMode();
      typeIntoInput('changed');

      input()!.dispatchEvent(new FocusEvent('blur', { relatedTarget: document.createElement('div') }));

      expect(component.editMode).toBe(false);
      expect(component.editable.value).toBe('original');
    });

    it('should keep edit mode and changes when focus moves to a button, so save and cancel still work', async () => {
      render(column(() => editable()));
      await enterEditMode();
      typeIntoInput('changed');

      input()!.dispatchEvent(new FocusEvent('blur', { relatedTarget: button('Update Value') }));

      expect(component.editMode).toBe(true);
      expect(component.editable.value).toBe('changed');
    });
  });

  describe('onEditableInputSaved', () => {
    it('should emit the edited value and leave edit mode when the save button is clicked', async () => {
      render(column(() => editable()));
      await enterEditMode();
      typeIntoInput('changed');

      button('Update Value').click();
      fixture.detectChanges();

      expect(savedSpy).toHaveBeenCalledExactlyOnceWith(editable({ value: 'changed' }));
      expect(component.editMode).toBe(false);
      expect(displayedText()).toBe('changed');
    });

    it('should emit an empty value when the input was cleared', async () => {
      render(column(() => editable()));
      await enterEditMode();
      typeIntoInput('');

      button('Update Value').click();

      expect(savedSpy).toHaveBeenCalledExactlyOnceWith(editable({ value: '' }));
    });
  });

  describe('onEditableInputEnter', () => {
    it('should emit the edited value and leave edit mode when enter is pressed', async () => {
      render(column(() => editable()));
      await enterEditMode();
      typeIntoInput('changed');

      input()!.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      fixture.detectChanges();

      expect(savedSpy).toHaveBeenCalledExactlyOnceWith(editable({ value: 'changed' }));
      expect(component.editMode).toBe(false);
      expect(input()).toBeNull();
    });

    it('should not emit for keys other than enter', async () => {
      render(column(() => editable()));
      await enterEditMode();

      input()!.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));

      expect(savedSpy).not.toHaveBeenCalled();
      expect(component.editMode).toBe(true);
    });
  });

  describe('onClose', () => {
    it('should leave edit mode and restore the original value without emitting', async () => {
      render(column(() => editable()));
      await enterEditMode();
      typeIntoInput('changed');

      button('Cancel').click();
      fixture.detectChanges();

      expect(component.editMode).toBe(false);
      expect(component.editable.value).toBe('original');
      expect(displayedText()).toBe('original');
      expect(savedSpy).not.toHaveBeenCalled();
    });
  });
});
