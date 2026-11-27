import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextComponent } from '@src/app/shared/input/text/text.component';

describe('InputTextComponent', () => {
  let component: InputTextComponent;
  let fixture: ComponentFixture<InputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputTextComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(InputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it.each(['hello', ''])('propagates input value %s', (value: string) => {
    const change = vi.fn().mockName('change');
    component.registerOnChange(change);
    const field: HTMLInputElement = fixture.nativeElement.querySelector('input');
    field.value = value;
    field.dispatchEvent(new Event('input'));
    expect(component.value).toBe(value);
    expect(change).toHaveBeenCalledExactlyOnceWith(value);
  });
  it('marks the control touched on blur', () => {
    const touched = vi.fn().mockName('touched');
    component.registerOnTouched(touched);
    fixture.nativeElement.querySelector('input').dispatchEvent(new Event('blur'));
    expect(touched).toHaveBeenCalledExactlyOnceWith();
  });
  it('toggles password visibility and emits the new state', () => {
    const emit = vi.spyOn(component.ShowPasswordEmit, 'emit');
    fixture.componentRef.setInput('inputType', 'email');
    fixture.detectChanges();
    expect(component.resolvedInputType).toBe('email');
    fixture.componentRef.setInput('showPasswordToggle', true);
    fixture.detectChanges();
    expect(component.resolvedInputType).toBe('text');
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(component.resolvedInputType).toBe('password');
    expect(emit).toHaveBeenCalledExactlyOnceWith(false);
    expect(fixture.nativeElement.querySelector('input').type).toBe('password');
  });
});
