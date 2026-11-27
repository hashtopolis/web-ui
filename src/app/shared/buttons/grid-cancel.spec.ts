import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { GridButtonsComponent } from '@src/app/shared/buttons/grid-cancel';

@Component({
  template: '<grid-buttons><button>Cancel</button><button>Save</button></grid-buttons>',
  standalone: false
})
class HostComponent {}

describe('GridButtonsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridButtonsComponent, HostComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('projects buttons into the grid actions container in order', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const actions: HTMLElement = fixture.nativeElement.querySelector('mat-card-actions.grid-buttons');

    expect(actions).not.toBeNull();
    expect(Array.from(actions.querySelectorAll('button'), (button) => button.textContent)).toStrictEqual([
      'Cancel',
      'Save'
    ]);
  });
});
