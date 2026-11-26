import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNumberComponent } from '@src/app/shared/input/number/number.component';

describe('InputNumberComponent', () => {
  let component: InputNumberComponent;
  let fixture: ComponentFixture<InputNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputNumberComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(InputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it.each([
    ['12.5', 12.5],
    ['0', 0],
    ['', null]
  ])('propagates %s as %s', (input: string, expected: number | null) => {
    const change = vi.fn().mockName('change');
    component.registerOnChange(change);
    const field = document.createElement('input');
    field.value = input;
    field.addEventListener('input', (event) => component.onValueChange(event));
    field.dispatchEvent(new Event('input'));
    expect(component.value).toBe(expected);
    expect(change).toHaveBeenCalledExactlyOnceWith(expected);
  });
});
