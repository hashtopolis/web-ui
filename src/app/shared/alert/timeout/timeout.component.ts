import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-timeout',
  templateUrl: './timeout.component.html'
})
export class TimeoutComponent {
  @Input() message: any;
  @Input() timeoutMax: number;
  @Input() timeoutCountdown: number;
  @Input() timedOut: boolean;
  @Output() close = new EventEmitter<void>();

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  onClose() {
    this.close.emit();
  }
}

