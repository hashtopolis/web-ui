import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-timeout',
  templateUrl: './error.component.html'
})
export class ErrorModalComponent {
  @Input() message: any;
  @Input() status?: number;
  @Output() close = new EventEmitter<void>();

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  onClose() {
    this.close.emit();
  }
}

