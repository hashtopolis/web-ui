import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFileComponent } from '@src/app/shared/input/file/file.component';

describe('InputFileComponent', () => {
  let component: InputFileComponent;
  let fixture: ComponentFixture<InputFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputFileComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(InputFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('propagates a value without emitting selection or touch', () => {
    const input = document.createElement('input');
    input.type = 'file';
    const files = input.files!;
    const change = vi.fn().mockName('change');
    const touched = vi.fn().mockName('touched');
    const emit = vi.spyOn(component.filesSelected, 'emit');
    component.registerOnChange(change);
    component.registerOnTouched(touched);
    component.onChangeValue(files);
    expect(component.value).toBe(files);
    expect(change).toHaveBeenCalledExactlyOnceWith(files);
    expect(touched).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });
  it('allows one file and propagates its FileList', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type=file]');
    const file = new File(['abc'], 'first.txt');
    const files = {
      0: file,
      length: 1,
      item: (i: number) => (i === 0 ? file : null)
    };
    Object.defineProperty(input, 'files', { value: files });
    const change = vi.fn().mockName('change');
    const touched = vi.fn().mockName('touched');
    const emit = vi.spyOn(component.filesSelected, 'emit');
    component.registerOnChange(change);
    component.registerOnTouched(touched);
    expect(input.multiple).toBe(false);
    input.dispatchEvent(new Event('change'));
    expect(component.fileInfoText).toBe('first.txt / Size: 3 B ');
    expect(component.value).toBe(files);
    expect(change).toHaveBeenCalledExactlyOnceWith(files);
    expect(emit).toHaveBeenCalledExactlyOnceWith(files);
    expect(touched).toHaveBeenCalledExactlyOnceWith();
  });
});
