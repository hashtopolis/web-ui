import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ShowFullValueDialogComponent } from '@src/app/shared/dialog/show-full-value-dialog/show-full-value-dialog.component';
import { provideDisabledMaterialAnimations } from '@src/app/testing/material-animations';

describe('ShowFullValueDialogComponent', () => {
  let fixture: ComponentFixture<ShowFullValueDialogComponent>;
  let close: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    close = vi.fn().mockName('close');
    await TestBed.configureTestingModule({
      imports: [ShowFullValueDialogComponent],
      providers: [
        provideDisabledMaterialAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Full value', value: 'first line\nsecond line' } },
        { provide: MatDialogRef, useValue: { close } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ShowFullValueDialogComponent);
    fixture.detectChanges();
  });

  it('renders the title and complete value', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent.trim()).toBe('Full value');
    expect(fixture.nativeElement.querySelector('p').textContent).toBe('first line\nsecond line');
  });

  it('closes the dialog from the close button', () => {
    fixture.nativeElement.querySelector('button').click();
    expect(close).toHaveBeenCalledExactlyOnceWith('');
  });
});
