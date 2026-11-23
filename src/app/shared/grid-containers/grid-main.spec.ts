import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { GridMainComponent } from '@src/app/shared/grid-containers/grid-main';

@Component({ template: '<grid-main [narrow]="narrow"><span>Projected content</span></grid-main>', standalone: false })
class HostComponent {
  narrow = false;
}

describe('GridMainComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridMainComponent, HostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  it('projects content into the card', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement.querySelector('grid-main');
    expect(host.classList.contains('grid-main--narrow')).toBe(false);
    expect(host.querySelector('mat-card-content span')?.textContent).toBe('Projected content');
  });

  it('toggles the narrow host class', () => {
    const fixture = TestBed.createComponent(GridMainComponent);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.classList.contains('grid-main--narrow')).toBe(false);
    fixture.componentRef.setInput('narrow', true);
    fixture.detectChanges();
    expect(host.classList.contains('grid-main--narrow')).toBe(true);
    fixture.componentRef.setInput('narrow', false);
    fixture.detectChanges();
    expect(host.classList.contains('grid-main--narrow')).toBe(false);
  });
});
