import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSelectComponent } from '@src/app/shared/input/select/select.component';

describe('InputSelectComponent', () => {
  let component: InputSelectComponent<string | number | boolean>;
  let fixture: ComponentFixture<InputSelectComponent<string | number | boolean>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputSelectComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(InputSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('propagates selection and marks touched', () => {
    const change = vi.fn().mockName('change');
    const touched = vi.fn().mockName('touched');
    component.registerOnChange(change);
    component.registerOnTouched(touched);
    component.onChangeValue(0);
    expect(component.value).toBe(0);
    expect(change).toHaveBeenCalledExactlyOnceWith(0);
    expect(touched).toHaveBeenCalledExactlyOnceWith();
  });
  it('marks touched only when the panel closes', () => {
    const touched = vi.fn().mockName('touched');
    component.registerOnTouched(touched);
    component.onOpenedChange(true);
    expect(touched).not.toHaveBeenCalled();
    component.onOpenedChange(false);
    expect(touched).toHaveBeenCalledExactlyOnceWith();
  });
  it('renders loading and blank option states', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('isBlankOptionDisabled', true);
    fixture.componentRef.setInput('blankOptionText', 'None');
    fixture.componentRef.setInput('items', [{ id: 4, name: 'Four' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading...');
    expect(fixture.nativeElement.textContent).toContain('None');
    expect(fixture.nativeElement.textContent).toContain('Four');
  });
});
