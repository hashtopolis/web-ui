import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextAreaComponent } from '@src/app/shared/input/text-area/text-area.component';

describe('InputTextAreaComponent', () => {
  let component: InputTextAreaComponent;
  let fixture: ComponentFixture<InputTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputTextAreaComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(InputTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it.each(['hello', ''])('propagates input value %s', (value: string) => {
    const change = vi.fn().mockName('change');
    component.registerOnChange(change);
    const field: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    field.value = value;
    field.dispatchEvent(new Event('input'));
    expect(component.value).toBe(value);
    expect(change).toHaveBeenCalledExactlyOnceWith(value);
  });
  it('marks the control touched on blur', () => {
    const touched = vi.fn().mockName('touched');
    component.registerOnTouched(touched);
    fixture.nativeElement.querySelector('textarea').dispatchEvent(new Event('blur'));
    expect(touched).toHaveBeenCalledExactlyOnceWith();
  });
  it('applies row-aligned styling when requested', () => {
    fixture.componentRef.setInput('rowAligned', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.field-stack').classList.contains('field-stack--row-aligned')).toBe(
      true
    );
  });
});
