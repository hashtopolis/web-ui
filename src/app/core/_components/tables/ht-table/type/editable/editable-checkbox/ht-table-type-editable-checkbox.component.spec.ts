import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BaseModel } from '@models/base.model';

import { HTTableColumn, HTTableEditable } from '@components/tables/ht-table/ht-table.models';
import { HTTableTypeEditableCheckboxComponent } from '@components/tables/ht-table/type/editable/editable-checkbox/ht-table-type-editable-checkbox.component';

describe('HTTableTypeEditableCheckboxComponent', () => {
  let fixture: ComponentFixture<HTTableTypeEditableCheckboxComponent>;
  let component: HTTableTypeEditableCheckboxComponent;

  const element: BaseModel = { id: 1, type: 'task' };

  function editable(overrides: Partial<HTTableEditable<BaseModel>> = {}): HTTableEditable<BaseModel> {
    return { data: element, value: 'true', action: 'toggle', ...overrides };
  }

  function column(checkbox?: HTTableColumn['checkbox']): HTTableColumn {
    return checkbox ? { id: 1, dataKey: 'isActive', checkbox } : { id: 1, dataKey: 'isActive' };
  }

  function render(tableColumn: HTTableColumn, data: BaseModel = element) {
    fixture.componentRef.setInput('element', data);
    fixture.componentRef.setInput('tableColumn', tableColumn);
    fixture.detectChanges();
  }

  // ngModel writes its value and disabled state asynchronously, so DOM checks need a second render.
  async function renderStable(tableColumn: HTTableColumn) {
    render(tableColumn);
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function checkboxInput(): HTMLInputElement | null {
    return fixture.nativeElement.querySelector('.editable-checkbox input[type="checkbox"]');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HTTableTypeEditableCheckboxComponent],
      imports: [FormsModule, MatCheckboxModule, MatTooltipModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HTTableTypeEditableCheckboxComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnChanges', () => {
    it('should build the checkbox from the column and remember its original value', async () => {
      const checkboxFn = vi
        .fn()
        .mockName('HTTableColumn.checkbox')
        .mockReturnValue(editable({ value: 'true' }));

      await renderStable(column(checkboxFn));

      expect(checkboxFn).toHaveBeenCalledExactlyOnceWith(element);
      expect(component.checkbox).toStrictEqual(editable({ value: 'true' }));
      expect(component.original).toBe('true');
      expect(checkboxInput()?.checked).toBe(true);
    });

    it('should recompute the checkbox when the element changes', () => {
      const otherElement: BaseModel = { id: 2, type: 'task' };
      const checkboxFn = vi
        .fn()
        .mockName('HTTableColumn.checkbox')
        .mockImplementation((data: BaseModel) => editable({ data, value: data.id === 1 ? 'true' : 'false' }));
      const tableColumn = column(checkboxFn);
      render(tableColumn);

      render(tableColumn, otherElement);

      expect(checkboxFn).toHaveBeenLastCalledWith(otherElement);
      expect(component.checkbox.data).toBe(otherElement);
      expect(component.original).toBe('false');
    });

    it('should render nothing when the column has no checkbox function', () => {
      const tableColumn = column();

      render(tableColumn);

      expect(component.checkbox).toBeUndefined();
      expect(fixture.nativeElement.querySelector('.editable-container')).toBeNull();
    });
  });

  describe('onEditableInputSaved', () => {
    it('should emit the toggled value when the user clicks the checkbox', async () => {
      await renderStable(column(() => editable({ value: 'false' })));
      const savedSpy = vi.fn().mockName('editableCheckboxSaved');
      component.editableCheckboxSaved.subscribe(savedSpy);
      component.onSelect();

      checkboxInput()!.click();

      expect(savedSpy).toHaveBeenCalledExactlyOnceWith(editable({ value: 'true' }));
      expect(component.editMode).toBe(false);
    });

    it('should store false as string and emit the same checkbox object', () => {
      render(column(() => editable({ value: 'true' })));
      const savedSpy = vi.fn().mockName('editableCheckboxSaved');
      component.editableCheckboxSaved.subscribe(savedSpy);

      component.onEditableInputSaved(false);

      expect(component.checkbox.value).toBe('false');
      expect(savedSpy).toHaveBeenCalledExactlyOnceWith(component.checkbox);
    });
  });

  describe('onClose', () => {
    it('should leave edit mode and restore the original value', () => {
      render(column(() => editable({ value: 'true' })));
      component.onSelect();
      component.checkbox.value = 'false';

      component.onClose();

      expect(component.editMode).toBe(false);
      expect(component.checkbox.value).toBe('true');
    });
  });

  describe('parseCheckboxValue', () => {
    it.each([
      ['true', true],
      [true, true],
      ['false', false],
      [false, false]
    ])('should parse %o as %o', (value, expected) => {
      const result = component.parseCheckboxValue(value);

      expect(result).toBe(expected);
    });

    it.each(['', 'TRUE', '1', 'undefined'])('should treat the invalid value %o as false', (value) => {
      const result = component.parseCheckboxValue(value);

      expect(result).toBe(false);
    });
  });
});
