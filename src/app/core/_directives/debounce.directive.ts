import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDebounce][formControlName]',
  standalone: true
})
export class DebounceDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 500;
  @Output() debounceInput = new EventEmitter<string>();

  private subscription: Subscription;

  constructor(private ngControl: NgControl) {}

  ngOnInit() {
    this.subscription = this.ngControl.valueChanges
      .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
      .subscribe((value) => {
        this.debounceInput.emit(value);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
