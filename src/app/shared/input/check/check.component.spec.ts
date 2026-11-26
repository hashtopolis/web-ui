import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { InputCheckComponent } from '@src/app/shared/input/check/check.component';

describe('InputCheckComponent', () => {
  let component: InputCheckComponent;
  let fixture: ComponentFixture<InputCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputCheckComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(InputCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it.each([true, false])('propagates checked state %s', (checked: boolean) => {
    const change = vi.fn().mockName('change');
    component.registerOnChange(change);
    component.onValueChange({ checked } as MatCheckboxChange);
    expect(component.value).toBe(checked);
    expect(change).toHaveBeenCalledExactlyOnceWith(checked);
  });
});
