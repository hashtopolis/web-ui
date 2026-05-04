import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputColorComponent } from '@src/app/shared/input/color/color.component';

const HEX_PATTERN = /^#[0-9a-f]{6}$/i;

describe('InputColorComponent', () => {
  let component: InputColorComponent;
  let fixture: ComponentFixture<InputColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputColorComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InputColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('starts unset and does not emit a value', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);
      expect(onChange).not.toHaveBeenCalled();
      expect(component.isUnset).toBeTrue();
      expect(component.colorClass).toBe('unset');
    });
  });

  describe('clearColor', () => {
    it('sets value to null and emits null via onChange', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);
      component.value = '#FF0000';

      component.clearColor();

      expect(component.value).toBeNull();
      expect(onChange).toHaveBeenCalledWith(null);
    });
  });

  describe('generateRandomColor', () => {
    it('emits a 7-character hex via onChange', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.generateRandomColor();

      expect(component.value).toMatch(HEX_PATTERN);
      expect(onChange).toHaveBeenCalledWith(component.value);
    });
  });

  describe('onValueChange', () => {
    it('reads value from the input element and emits via onChange', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);
      const event = { target: { value: '#123456' } } as unknown as Event;

      component.onValueChange(event);

      expect(component.value).toBe('#123456');
      expect(onChange).toHaveBeenCalledWith('#123456');
    });
  });

  describe('derived state', () => {
    it('marks unset when writeValue receives null', () => {
      component.writeValue(null);
      expect(component.isUnset).toBeTrue();
      expect(component.colorClass).toBe('unset');
    });

    it('classifies a light color as on-light', () => {
      component.writeValue('#FFFFFF');
      expect(component.isUnset).toBeFalse();
      expect(component.colorClass).toBe('on-light');
    });

    it('classifies a dark color as on-dark', () => {
      component.writeValue('#000000');
      expect(component.colorClass).toBe('on-dark');
    });

    it('falls back inputValue to white when value is null', () => {
      component.writeValue(null);
      expect(component.inputValue).toBe('#FFFFFF');
    });

    it('mirrors inputValue from value when set', () => {
      component.writeValue('#3366FF');
      expect(component.inputValue).toBe('#3366FF');
    });
  });
});
