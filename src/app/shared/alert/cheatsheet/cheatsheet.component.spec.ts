import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CheatsheetComponent } from '@src/app/shared/alert/cheatsheet/cheatsheet.component';

describe('CheatsheetComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [CheatsheetComponent], schemas: [CUSTOM_ELEMENTS_SCHEMA] });
  });

  it('provides attack modes, examples and charsets to separate table data sources', () => {
    const component = TestBed.createComponent(CheatsheetComponent).componentInstance;

    expect(component.dataSource1.data).toStrictEqual(component.attackmode);
    expect(component.dataSource2.data).toStrictEqual(component.attackex);
    expect(component.dataSource3.data).toStrictEqual(component.charsets);
    expect(component.dataSource1.data).toContainEqual({ _id: '3', name: 'Brute-force' });
    expect(component.dataSource2.data).toContainEqual({ _id: 'Dictionary', name: '-w3 -O #HL# -a 0 rockyou.txt' });
    expect(component.dataSource3.data).toContainEqual({ _id: '?d', name: '0123456789' });
    expect(component.dataSource1.data).not.toBe(component.attackmode);
    expect(component.dataSource2.data).not.toBe(component.attackex);
    expect(component.dataSource3.data).not.toBe(component.charsets);
  });

  it('renders the help sections and close button', () => {
    const fixture = TestBed.createComponent(CheatsheetComponent);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Attack Command Help');
    expect(text).toContain('Attack Modes');
    expect(text).toContain('Attack Examples');
    expect(text).toContain('Built-in charsets in Hashcat');
    expect(text).toContain('Foreign Characters Hashcat');
    expect(fixture.nativeElement.querySelector('button').textContent).toContain('Close');
  });
});
