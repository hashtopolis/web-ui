import { TestBed } from '@angular/core/testing';

import { FixedAlertComponent } from '@src/app/shared/alert/fixed-alert/fixed-alert.component';

describe('FixedAlertComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [FixedAlertComponent] });
  });

  it('renders an empty status by default', () => {
    const fixture = TestBed.createComponent(FixedAlertComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.message).toBe('');
    expect(fixture.nativeElement.querySelector('output.fixed-alert').textContent).toBe('');
  });

  it('updates the status when its message input changes', () => {
    const fixture = TestBed.createComponent(FixedAlertComponent);
    fixture.componentRef.setInput('message', 'First alert');
    fixture.detectChanges();
    const status = fixture.nativeElement.querySelector('output.fixed-alert');
    expect(status.textContent).toBe('First alert');

    fixture.componentRef.setInput('message', 'Updated alert');
    fixture.detectChanges();
    expect(status.textContent).toBe('Updated alert');
  });
});
