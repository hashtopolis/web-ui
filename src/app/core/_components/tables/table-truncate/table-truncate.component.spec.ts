/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BaseModel } from '@models/base.model';

import { TableTruncateComponent } from '@components/tables/table-truncate/table-truncate.component';

import { ShowFullValueDialogComponent } from '@src/app/shared/dialog/show-full-value-dialog/show-full-value-dialog.component';

describe('TableTruncateComponent', () => {
  let fixture: ComponentFixture<TableTruncateComponent>;
  let component: TableTruncateComponent;
  let dialog: jasmine.SpyObj<MatDialog>;

  const longText = 'a'.repeat(60) + 'b'.repeat(20);

  function render(text: string | BaseModel, inputs: Partial<TableTruncateComponent> = {}) {
    fixture.componentRef.setInput('text', text);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
  }

  function viewButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('button[aria-label="Show full value"]');
  }

  beforeEach(async () => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [TableTruncateComponent],
      imports: [MatButtonModule, MatIconModule],
      providers: [{ provide: MatDialog, useValue: dialog }]
    }).compileComponents();

    fixture = TestBed.createComponent(TableTruncateComponent);
    component = fixture.componentInstance;
  });

  it('should show short text in full without a view button', () => {
    render('short value');

    expect(fixture.nativeElement.textContent).toContain('short value');
    expect(component.isTruncated).toBeFalse();
    expect(viewButton()).toBeNull();
  });

  it('should truncate long text in the middle and show a view button', () => {
    render(longText);

    expect(component.isTruncated).toBeTrue();
    expect(component.abbr).toBe('a'.repeat(54) + '…' + 'b'.repeat(10));
    expect(viewButton()).not.toBeNull();
  });

  it('should read the text from the given path of a model', () => {
    render({ id: 1, type: 'hash', hash: longText } as BaseModel, { path: 'hash' });

    expect(component.isTruncated).toBeTrue();
  });

  it('should open the full value dialog with the given title', () => {
    render(longText, { dialogTitle: 'Full hash for: list' });

    viewButton()!.click();

    expect(dialog.open).toHaveBeenCalledOnceWith(ShowFullValueDialogComponent, {
      data: { title: 'Full hash for: list', value: longText }
    });
  });

  it('should fall back to a generic dialog title', () => {
    render(longText);

    viewButton()!.click();

    expect(dialog.open).toHaveBeenCalledOnceWith(ShowFullValueDialogComponent, {
      data: { title: 'Full value', value: longText }
    });
  });
});

describe('TableTruncateComponent with a real dialog', () => {
  let fixture: ComponentFixture<TableTruncateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableTruncateComponent],
      imports: [MatButtonModule, MatIconModule, MatDialogModule, NoopAnimationsModule, ShowFullValueDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableTruncateComponent);
    fixture.componentRef.setInput('text', 'a'.repeat(80));
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
  });

  afterEach(() => {
    TestBed.inject(MatDialog).closeAll();
    fixture.nativeElement.remove();
  });

  /** Clicks an element like a mouse does, so the CDK focus monitor attributes the focus to the mouse */
  function mouseClick(element: HTMLElement): void {
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, buttons: 1 }));
    element.focus();
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, screenX: 100, screenY: 100 }));
  }

  it('should not leave a programmatic focus highlight on the view button after closing the dialog by mouse', async () => {
    const viewButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[aria-label="Show full value"]');
    mouseClick(viewButton);
    await fixture.whenStable();

    const closeButton = document.querySelector<HTMLElement>('app-show-full-value-dialog button[mat-dialog-close]');
    expect(closeButton).withContext('dialog close button').not.toBeNull();
    // let the focus monitor forget the mousedown on the view button
    await new Promise((resolve) => setTimeout(resolve, 0));
    mouseClick(closeButton!);
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(document.activeElement).toBe(viewButton);
    expect(viewButton.classList).not.toContain('cdk-program-focused');
    expect(viewButton.classList).toContain('cdk-mouse-focused');
  });
});
