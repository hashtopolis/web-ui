import { ApplicationRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';

import { HashtypeDetectorComponent } from '@src/app/shared/hashtype-detector/hashtype-detector.component';

describe('HashtypeDetectorComponent', () => {
  let fixture: ComponentFixture<HashtypeDetectorComponent>;
  let component: HashtypeDetectorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HashtypeDetectorComponent],
      imports: [MatTableModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(HashtypeDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initializes an empty data source and column definitions', () => {
    expect(component.dataSource.data).toStrictEqual([]);
    expect(component.displayedColumns).toStrictEqual(['id', 'description', 'example']);
    expect(component.flattenData()).toStrictEqual([]);
  });

  it('flattens options from all matches in order', () => {
    const options = [
      { id: 1, description: 'First' },
      { id: 2, description: 'Second', example: 'abc' }
    ];
    component.type = [
      { regex: 'first', rAttack: 'a', options: [options[0]] },
      { regex: 'empty', rAttack: 'b', options: [] },
      { regex: 'second', rAttack: 'c', options: [options[1]] }
    ];
    expect(component.flattenData()).toStrictEqual(options);
  });

  it('detects a hash and replaces the data source with its options', () => {
    const tick = vi.spyOn(TestBed.inject(ApplicationRef), 'tick').mockImplementation(() => {});
    component.onSearch('5d41402abc4b2a76b9719d911017c592');
    expect(Array.isArray(component.type)).toBe(true);
    expect(component.dataSource.data.length).toBeGreaterThan(0);
    expect(component.dataSource.data).toStrictEqual(component.flattenData());
    expect(tick).toHaveBeenCalledExactlyOnceWith();
    fixture.detectChanges();
    const rows = Array.from(fixture.nativeElement.querySelectorAll('mat-row')) as HTMLElement[];
    expect(rows).toHaveLength(component.dataSource.data.length);
    rows.forEach((row, index) => {
      const cells = Array.from(row.querySelectorAll('mat-cell'), (cell) => cell.textContent?.trim());
      const option = component.dataSource.data[index];
      expect(cells).toStrictEqual([String(option.id), option.description, option.example ?? '']);
    });
  });

  it.each(['', 'not a valid hash!'])('shows an error for an unmatched search: %s', (value: string) => {
    const tick = vi.spyOn(TestBed.inject(ApplicationRef), 'tick').mockImplementation(() => {});
    component.onSearch(value);
    expect(component.type).toBe(false);
    expect(component.flattenData()).toStrictEqual([]);
    expect(tick).not.toHaveBeenCalled();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Error. No hash type found.');
    expect(fixture.nativeElement.querySelector('mat-table')).toBeNull();
  });
});
