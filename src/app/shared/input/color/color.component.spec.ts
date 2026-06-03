import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InputColorComponent } from '@src/app/shared/input/color/color.component';

// Values are stored/emitted as bare hex (the backend format); the `#` is only added for display.
const BARE_HEX_PATTERN = /^[0-9a-f]{6}$/i;

describe('InputColorComponent', () => {
  let component: InputColorComponent;
  let fixture: ComponentFixture<InputColorComponent>;

  const nativeInput = (): HTMLInputElement => fixture.debugElement.query(By.css('input[type="color"]')).nativeElement;
  const swatchText = (): HTMLElement => fixture.debugElement.query(By.css('.color-value')).nativeElement;

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
    it('does not emit on registration when no defaultColor is configured', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);
      expect(component.value).toBeFalsy();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('clearColor', () => {
    it('sets value to empty string and emits empty string via onChange', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);
      component.value = '#FF0000';

      component.clearColor();

      expect(component.value).toBe('');
      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  describe('generateRandomColor', () => {
    it('emits a bare 6-character hex via onChange', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.generateRandomColor();

      expect(component.value).toMatch(BARE_HEX_PATTERN);
      expect(onChange).toHaveBeenCalledWith(component.value);
    });
  });

  describe('onValueChange', () => {
    it('reads the native picker value and stores it as bare hex via onChange', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);
      const event = { target: { value: '#123456' } } as unknown as Event;

      component.onValueChange(event);

      expect(component.value).toBe('123456');
      expect(onChange).toHaveBeenCalledWith('123456');
    });
  });

  describe('defaultColor', () => {
    it('applies the default visually but does not emit when registerOnChange runs after a null writeValue', () => {
      component.defaultColor = 'random';
      component.writeValue(null);
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      expect(component.value).toMatch(BARE_HEX_PATTERN);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not apply the default when the form provided a non-null value', () => {
      component.defaultColor = 'random';
      component.writeValue('#abc123');
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      expect(component.value).toBe('#abc123');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('uses a literal hex string as the default, stored bare', () => {
      component.defaultColor = '#3366FF';
      component.writeValue(null);
      component.registerOnChange(jasmine.createSpy('onChange'));

      expect(component.value).toBe('3366FF');
    });
  });

  describe('template bindings', () => {
    it('falls the native input back to DEFAULT_NATIVE_INPUT_PLACEHOLDER when value is null', () => {
      component.writeValue(null);
      fixture.detectChanges();

      expect(nativeInput().value).toBe(component.DEFAULT_NATIVE_INPUT_PLACEHOLDER.toLowerCase());
    });

    it('binds the actual hex to the native input when value is set', () => {
      component.writeValue('#3366ff');
      fixture.detectChanges();

      expect(nativeInput().value).toBe('#3366ff');
    });

    it('normalizes a bare 6-char hex value to #rrggbb for the native input and swatch (regression: bare hex rendered black)', () => {
      component.writeValue('ff0000');
      fixture.detectChanges();

      expect(nativeInput().value).toBe('#ff0000');
      expect(nativeInput().classList).not.toContain('color-unset');
      expect(swatchText().textContent?.trim()).toBe('#ff0000');
    });

    it('marks the input with .color-unset when value is null', () => {
      component.writeValue(null);
      fixture.detectChanges();

      expect(nativeInput().classList).toContain('color-unset');
    });

    it('removes .color-unset when value is set', () => {
      component.writeValue('#3366ff');
      fixture.detectChanges();

      expect(nativeInput().classList).not.toContain('color-unset');
    });

    it('applies color-value-on-light to the swatch text for a light color', () => {
      component.writeValue('#FFFFFF');
      fixture.detectChanges();

      expect(swatchText().classList).toContain('color-value-on-light');
      expect(swatchText().classList).not.toContain('color-value-on-dark');
    });

    it('applies color-value-on-dark to the swatch text for a dark color', () => {
      component.writeValue('#000000');
      fixture.detectChanges();

      expect(swatchText().classList).toContain('color-value-on-dark');
      expect(swatchText().classList).not.toContain('color-value-on-light');
    });

    it('renders "No color" placeholder text when value is null', () => {
      component.writeValue(null);
      fixture.detectChanges();

      expect(swatchText().textContent?.trim()).toBe('No color');
    });

    it('renders the hex string as swatch text when value is set', () => {
      component.writeValue('#3366ff');
      fixture.detectChanges();

      expect(swatchText().textContent?.trim()).toBe('#3366ff');
    });
  });
});
