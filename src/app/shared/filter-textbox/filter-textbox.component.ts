import { Component, Output, EventEmitter } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cm-filter-textbox',
  templateUrl: './filter-textbox.component.html'
})
export class FilterTextboxComponent {
    faMagnifyingGlass=faMagnifyingGlass;

    model: { filter: string } = { filter: '' };

    @Output()
    changed: EventEmitter<string> = new EventEmitter<string>();

    filterChanged(event: any) {
      event.preventDefault();
      this.changed.emit(this.model.filter); // Raise changed event
    }
}
