import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRowComponent } from '@src/app/shared/grid-containers/form-row/form-row.component';

describe('FormRowComponent', () => {
  let fixture: ComponentFixture<FormRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [FormRowComponent] }).compileComponents();
    fixture = TestBed.createComponent(FormRowComponent);
    fixture.detectChanges();
  });

  it('defaults to two columns and fill mode', () => {
    const host: HTMLElement = fixture.nativeElement;
    expect(host.style.getPropertyValue('--form-row-cols')).toBe('2');
    expect(host.classList.contains('row-fill')).toBe(true);
    expect(host.classList.contains('row-align-left')).toBe(false);
  });

  it.each([1, 2, 3, 4] as const)('sets %i columns and disables fill mode', (columns: 1 | 2 | 3 | 4) => {
    fixture.componentRef.setInput('columns', columns);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.style.getPropertyValue('--form-row-cols')).toBe(String(columns));
    expect(host.classList.contains('row-fill')).toBe(false);
  });

  it('aligns left with default or explicit columns and restores fill when cleared', () => {
    fixture.componentRef.setInput('align', 'left');
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.classList.contains('row-align-left')).toBe(true);
    expect(host.classList.contains('row-fill')).toBe(false);
    fixture.componentRef.setInput('columns', 3);
    fixture.detectChanges();
    expect(host.style.getPropertyValue('--form-row-cols')).toBe('3');
    expect(host.classList.contains('row-align-left')).toBe(true);
    fixture.componentRef.setInput('columns', undefined);
    fixture.componentRef.setInput('align', undefined);
    fixture.detectChanges();
    expect(host.classList.contains('row-align-left')).toBe(false);
    expect(host.classList.contains('row-fill')).toBe(true);
  });
});
