import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { TableComponent } from '@src/app/shared/table/table.component';

@Component({
  template: `<app-table
    ><span class="projected">{{ content }}</span></app-table
  >`,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager
})
class TestHostComponent {
  content = 'Table content';
}

describe('TableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent, TestHostComponent],
      imports: [MatCardModule]
    }).compileComponents();
  });

  it('projects content inside an outlined Material card', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('mat-card.app-table-card');
    const content = card.querySelector('mat-card-content.app-table-card__content');
    expect(card.classList.contains('mat-mdc-card-outlined')).toBe(true);
    expect(content.querySelector('.projected').textContent).toBe('Table content');
  });

  it('updates projected content when the host changes', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.content = 'Updated content';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.projected').textContent).toBe('Updated content');
  });
});
