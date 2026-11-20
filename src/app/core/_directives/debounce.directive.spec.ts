import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DebounceDirective } from '@src/app/core/_directives/debounce.directive';

@Component({
  imports: [ReactiveFormsModule, DebounceDirective],
  template: `<form [formGroup]="form">
    <input formControlName="query" appDebounce [debounceTime]="delay" (debounceInput)="values.push($event)" />
  </form>`
})
class TestHostComponent {
  form = new FormGroup({ query: new FormControl('', { nonNullable: true }) });
  delay = 100;
  values: string[] = [];
}

describe('DebounceDirective', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
  });

  afterEach(() => vi.useRealTimers());

  it('emits the latest value only after the configured quiet period and suppresses duplicates', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    host.form.controls.query.setValue('first');
    await vi.advanceTimersByTimeAsync(99);
    expect(host.values).toStrictEqual([]);
    host.form.controls.query.setValue('second');
    await vi.advanceTimersByTimeAsync(99);
    expect(host.values).toStrictEqual([]);
    await vi.advanceTimersByTimeAsync(1);
    expect(host.values).toStrictEqual(['second']);
    host.form.controls.query.setValue('second');
    await vi.advanceTimersByTimeAsync(100);
    expect(host.values).toStrictEqual(['second']);
    host.form.controls.query.setValue('third');
    await vi.advanceTimersByTimeAsync(100);
    expect(host.values).toStrictEqual(['second', 'third']);
    fixture.destroy();
  });

  it('cancels pending emissions on destruction', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    host.form.controls.query.setValue('pending');
    fixture.destroy();
    await vi.advanceTimersByTimeAsync(100);
    expect(host.values).toStrictEqual([]);
  });
});
