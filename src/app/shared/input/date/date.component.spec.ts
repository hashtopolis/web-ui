import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { InputDateComponent } from '@src/app/shared/input/date/date.component';

describe('InputDateComponent', () => {
  let component: InputDateComponent;
  let fixture: ComponentFixture<InputDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputDateComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(InputDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it.each([new Date(2024, 0, 2), null])('propagates date %s', (value: Date | null) => {
    const change = vi.fn().mockName('change');
    component.registerOnChange(change);
    component.onDateChange({ value } as MatDatepickerInputEvent<Date>);
    expect(component.value).toBe(value);
    expect(change).toHaveBeenCalledExactlyOnceWith(value);
  });
});
