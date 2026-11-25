import type { MockedObject } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { provideDisabledMaterialAnimations } from '@src/app/testing/material-animations';

interface Row {
  id: number;
  name: string;
}

describe('TableDialogComponent', () => {
  let fixture: ComponentFixture<TableDialogComponent<Row>>;
  let mockDialogRef: MockedObject<MatDialogRef<TableDialogComponent<Row>>>;

  const rows: Row[] = [
    { id: 1, name: 'alpha' },
    { id: 2, name: 'beta' }
  ];

  const baseData = (overrides: Partial<DialogData<Row>> = {}): DialogData<Row> => ({
    title: 'Delete items',
    rows,
    action: 'delete',
    ...overrides
  });

  function render(data: DialogData<Row>): HTMLElement {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: data });
    fixture = TestBed.createComponent(TableDialogComponent<Row>);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const title = (el: HTMLElement) => el.querySelector('[mat-dialog-title]') as HTMLElement;
  const actions = (el: HTMLElement) => el.querySelector('mat-dialog-actions') as HTMLElement;
  const buttons = (el: HTMLElement) => [...el.querySelectorAll('mat-dialog-actions button')] as HTMLButtonElement[];
  const listItems = (el: HTMLElement) =>
    [...el.querySelectorAll('mat-dialog-content li')].map((li) => li.textContent?.trim());

  beforeEach(async () => {
    mockDialogRef = {
      close: vi.fn().mockName('MatDialogRef.close')
    } as MockedObject<MatDialogRef<TableDialogComponent<Row>>>;

    await TestBed.configureTestingModule({
      declarations: [TableDialogComponent],
      imports: [MatDialogModule, MatButtonModule, MatIconModule],
      providers: [
        provideDisabledMaterialAnimations(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: baseData() }
      ]
    }).compileComponents();
  });

  describe('title', () => {
    it('shows the given title', () => {
      const data = baseData({ title: 'Archive tasks' });

      const el = render(data);

      expect(title(el).textContent?.trim()).toBe('Archive tasks');
    });

    it('falls back to "Confirm" when the title is empty', () => {
      const data = baseData({ title: '' });

      const el = render(data);

      expect(title(el).textContent?.trim()).toBe('Confirm');
    });

    it('shows the icon when one is given', () => {
      const data = baseData({ icon: 'warning' });

      const el = render(data);

      expect(title(el).querySelector('mat-icon')?.textContent?.trim()).toBe('warning');
    });

    it('shows no icon when none is given', () => {
      const data = baseData();

      const el = render(data);

      expect(title(el).querySelector('mat-icon')).toBeNull();
    });
  });

  describe('content', () => {
    it('lists the listAttribute value of every row', () => {
      const data = baseData({ listAttribute: 'name' });

      const el = render(data);

      expect(listItems(el)).toStrictEqual(['alpha', 'beta']);
    });

    it('renders no list when listAttribute is not set', () => {
      const data = baseData();

      const el = render(data);

      expect(el.querySelector('mat-dialog-content ul')).toBeNull();
    });

    it('renders no list when rows are empty', () => {
      const data = baseData({ listAttribute: 'name', rows: [] });

      const el = render(data);

      expect(el.querySelector('mat-dialog-content ul')).toBeNull();
    });

    it('renders an empty entry for a row without the listAttribute property', () => {
      const data = baseData({ listAttribute: 'unknown' });

      const el = render(data);

      expect(listItems(el)).toStrictEqual(['', '']);
    });

    it('shows the body when given', () => {
      const data = baseData({ body: 'This cannot be undone.' });

      const el = render(data);

      expect(el.querySelector('mat-dialog-content p')?.textContent?.trim()).toBe('This cannot be undone.');
    });

    it('renders no body paragraph when the body is missing', () => {
      const data = baseData();

      const el = render(data);

      expect(el.querySelector('mat-dialog-content p')).toBeNull();
    });
  });

  describe('actions', () => {
    it('uses the default button labels when none are given', () => {
      const data = baseData();

      const el = render(data);

      expect(buttons(el).map((b) => b.textContent?.trim())).toStrictEqual(['Cancel', 'Continue']);
    });

    it('uses the custom button labels when given', () => {
      const data = baseData({ cancelLabel: 'Keep', okLabel: 'Delete' });

      const el = render(data);

      expect(buttons(el).map((b) => b.textContent?.trim())).toStrictEqual(['Keep', 'Delete']);
    });

    it('closes with the rows and the action when the confirm button is clicked', () => {
      const el = render(baseData());
      const [, confirmButton] = buttons(el);

      confirmButton.click();

      expect(mockDialogRef.close).toHaveBeenCalledExactlyOnceWith({ data: rows, action: 'delete' });
    });

    it('closes without an action when the cancel button is clicked', () => {
      const el = render(baseData());
      const [cancelButton] = buttons(el);

      cancelButton.click();

      expect(mockDialogRef.close).toHaveBeenCalledExactlyOnceWith('');
    });

    it('styles the actions as dangerous when warn is set', () => {
      const data = baseData({ warn: true });

      const el = render(data);

      expect(actions(el).classList.contains('dialog-actions--danger')).toBe(true);
      expect(buttons(el)[1].classList.contains('mat-warn')).toBe(true);
    });

    it('uses the primary style when warn is not set', () => {
      const data = baseData();

      const el = render(data);

      expect(actions(el).classList.contains('dialog-actions--danger')).toBe(false);
      expect(buttons(el)[1].classList.contains('mat-primary')).toBe(true);
    });
  });
});
