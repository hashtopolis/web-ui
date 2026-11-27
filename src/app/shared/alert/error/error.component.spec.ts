import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ErrorModalComponent } from '@src/app/shared/alert/error/error.component';

describe('ErrorModalComponent', () => {
  it('exposes and renders the injected error status and message', () => {
    const data = { status: 503, message: 'Service unavailable' };
    TestBed.configureTestingModule({
      declarations: [ErrorModalComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: data }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    const fixture = TestBed.createComponent(ErrorModalComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.data).toBe(data);
    expect(fixture.componentInstance.status).toBe(503);
    expect(fixture.componentInstance.message).toBe('Service unavailable');
    expect(fixture.nativeElement.textContent).toContain('Status Code: 503');
    expect(fixture.nativeElement.querySelector('.err-msg').textContent).toContain('Service unavailable');
    expect(fixture.nativeElement.querySelector('button').textContent).toContain('Close');
  });
});
