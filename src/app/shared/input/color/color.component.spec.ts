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
    // NOTE: deliberately not calling detectChanges() here. Tests that exercise
    // the ngOnInit microtask need to set @Input()s before lifecycle fires.
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('defaultColor', () => {
    it('does not emit any value when defaultColor is omitted', async () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(onChange).not.toHaveBeenCalled();
      expect(component.isUnset).toBeTrue();
      expect(component.colorClass).toBe('unset');
    });

    it('emits a random hex when defaultColor is "random"', async () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);
      component.defaultColor = 'random';
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.value).toMatch(HEX_PATTERN);
      expect(onChange).toHaveBeenCalledWith(component.value);
    });

    it('emits white when defaultColor is true', async () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);
      component.defaultColor = true;
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.value).toBe('#FFFFFF');
      expect(onChange).toHaveBeenCalledWith('#FFFFFF');
    });

    it('emits the provided hex string verbatim', async () => {
      component.defaultColor = '#FF0000';
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.value).toBe('#FF0000');
    });

    it('does not override a value already supplied by the form', async () => {
      component.defaultColor = 'random';
      component.writeValue('#3366FF');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.value).toBe('#3366FF');
    });

    it('does not re-apply the default after the user clears the color', async () => {
      component.defaultColor = '#00FF00';
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.value).toBe('#00FF00');

      component.clearColor();
      await fixture.whenStable();
      expect(component.value).toBeNull();
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
