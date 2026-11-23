import type { MockedObject } from 'vitest';

import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ButtonSubmitComponent, ButtonSubmitType } from '@src/app/shared/buttons/button-submit';

describe('ButtonSubmitComponent', () => {
  let location: MockedObject<Pick<Location, 'back'>>;

  beforeEach(() => {
    location = { back: vi.fn().mockName('back') };
    TestBed.configureTestingModule({
      declarations: [ButtonSubmitComponent],
      providers: [{ provide: Location, useValue: location }],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('renders the default submit button and label', () => {
    const fixture = TestBed.createComponent(ButtonSubmitComponent);
    fixture.componentRef.setInput('name', 'Save');
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.type).toBe('submit');
    expect(button.classList.contains('btn-submit--primary')).toBe(true);
    expect(button.textContent?.trim()).toBe('Save');
    expect(button.disabled).toBe(false);
    button.click();
    expect(location.back).not.toHaveBeenCalled();
  });

  it.each([
    [ButtonSubmitType.Cancel, false],
    [ButtonSubmitType.CancelDialog, false],
    [ButtonSubmitType.Delete, true]
  ])('renders %s as an outlined button', (type: ButtonSubmitType, danger: boolean) => {
    const fixture = TestBed.createComponent(ButtonSubmitComponent);
    fixture.componentRef.setInput('type', type);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.type).toBe('button');
    expect(button.getAttribute('matButton')).toBe('outlined');
    expect(button.classList.contains('btn-submit--danger')).toBe(danger);
    button.click();
    if (type === ButtonSubmitType.Cancel) {
      expect(location.back).toHaveBeenCalledExactlyOnceWith();
    } else {
      expect(location.back).not.toHaveBeenCalled();
    }
  });

  it.each(['disabled', 'loading'])('disables the button when %s is set', (input: string) => {
    const fixture = TestBed.createComponent(ButtonSubmitComponent);
    fixture.componentRef.setInput('type', ButtonSubmitType.Cancel);
    fixture.componentRef.setInput(input, true);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('mat-spinner') !== null).toBe(input === 'loading');
    button.click();
    expect(location.back).not.toHaveBeenCalled();
    fixture.componentRef.setInput(input, false);
    fixture.detectChanges();
    expect(button.disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeNull();
  });

  it('prevents and stops a click passed directly when disabled', () => {
    const fixture = TestBed.createComponent(ButtonSubmitComponent);
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('type', ButtonSubmitType.Cancel);
    fixture.detectChanges();
    const event = new Event('click', { cancelable: true });
    const stop = vi.spyOn(event, 'stopImmediatePropagation').mockImplementation(() => {});

    fixture.componentInstance.onClick(event);

    expect(event.defaultPrevented).toBe(true);
    expect(stop).toHaveBeenCalledExactlyOnceWith();
    expect(location.back).not.toHaveBeenCalled();
  });
});
