import type { MockedObject } from 'vitest';

import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { AppModule } from '@src/app/app.module';
import {
  MAX_SEARCH_LENGTH,
  MAX_SEARCH_SIZE
} from '@src/app/core/_components/tables/search-hash-table/search-hash-table.constants';
import { SearchHashComponent } from '@src/app/hashlists/search-hash/search-hash.component';
import { ComponentsModule } from '@src/app/shared/components.module';

@Component({
  selector: 'search-hash-table',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockSearchHashTableComponent {
  @Input() search: string[] = [];
}

describe('SearchHashComponent', () => {
  let component: SearchHashComponent;
  let fixture: ComponentFixture<SearchHashComponent>;
  let alertServiceSpy: MockedObject<Pick<AlertService, 'showErrorMessage'>>;
  let titleServiceSpy: MockedObject<Pick<AutoTitleService, 'set'>>;

  const submitHashes = (hashes: string): void => {
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    textarea.value = hashes;
    textarea.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    alertServiceSpy = {
      showErrorMessage: vi.fn<AlertService['showErrorMessage']>().mockName('AlertService.showErrorMessage')
    };
    titleServiceSpy = {
      set: vi.fn<AutoTitleService['set']>().mockName('AutoTitleService.set')
    };

    await TestBed.configureTestingModule({
      declarations: [SearchHashComponent, MockSearchHashTableComponent],
      imports: [ReactiveFormsModule, ComponentsModule],
      providers: [
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: AutoTitleService, useValue: titleServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    AppModule.injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(SearchHashComponent);
    component = fixture.componentInstance;
  });

  it('should set the page title and initialize a required hashes control', () => {
    fixture.detectChanges();

    expect(component.pageTitle).toBe('Search Hash');
    expect(component.form.controls['hashes'].value).toBe('');
    expect(component.form.controls['hashes'].hasError('required')).toBe(true);
  });

  it('should not render the results table before a search', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-table'))).toBeNull();
    expect(fixture.debugElement.query(By.directive(MockSearchHashTableComponent))).toBeNull();
  });

  it('should pass submitted hashes to the results table and reset the form', () => {
    fixture.detectChanges();

    submitHashes('hash-one \n hash-two\t hash-three');

    expect(component.searchResults).toStrictEqual(['hash-one', 'hash-two', 'hash-three']);
    const table = fixture.debugElement.query(By.css('app-table'));
    expect(table).not.toBeNull();
    const searchTable = table.query(By.directive(MockSearchHashTableComponent));
    expect(searchTable).not.toBeNull();
    expect(searchTable.injector.get(MockSearchHashTableComponent).search).toBe(component.searchResults);
    expect(component.form.controls['hashes'].value).toBeNull();
    expect(fixture.nativeElement.querySelector('textarea').value).toBe('');
    expect(alertServiceSpy.showErrorMessage).not.toHaveBeenCalled();
  });

  it('should update the existing results table when another search is submitted', () => {
    fixture.detectChanges();
    submitHashes('hash-one');
    const searchTable = fixture.debugElement
      .query(By.directive(MockSearchHashTableComponent))
      .injector.get(MockSearchHashTableComponent);

    submitHashes('hash-two\nhash-three');

    expect(
      fixture.debugElement.query(By.directive(MockSearchHashTableComponent)).injector.get(MockSearchHashTableComponent)
    ).toBe(searchTable);
    expect(searchTable.search).toStrictEqual(['hash-two', 'hash-three']);
    expect(searchTable.search).toBe(component.searchResults);
    expect(alertServiceSpy.showErrorMessage).not.toHaveBeenCalled();
  });

  it('should accept exactly the maximum number of hashes', () => {
    fixture.detectChanges();
    const hashes = Array.from({ length: MAX_SEARCH_LENGTH }, (_, index) => `hash-${index}`);
    component.form.controls['hashes'].setValue(hashes.join(' '));

    component.onSubmit();

    expect(component.searchResults).toStrictEqual(hashes);
    expect(alertServiceSpy.showErrorMessage).not.toHaveBeenCalled();
  });

  it('should report an error when the number of hashes exceeds the maximum', () => {
    fixture.detectChanges();
    const hashes = Array.from({ length: MAX_SEARCH_LENGTH + 1 }, (_, index) => `hash-${index}`);
    component.form.controls['hashes'].setValue(hashes.join(' '));

    component.onSubmit();

    expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledExactlyOnceWith(
      `You have exceeded the maximum hash search size of ${MAX_SEARCH_LENGTH} hashes. You have entered ${MAX_SEARCH_LENGTH + 1} hashes. Please reduce your hash list.`
    );
    expect(component.searchResults).toStrictEqual([]);
    expect(component.form.controls['hashes'].value).toBe(hashes.join(' '));
  });

  it('should accept an input exactly at the maximum request size', () => {
    fixture.detectChanges();
    const hash = 'a'.repeat(MAX_SEARCH_SIZE);
    component.form.controls['hashes'].setValue(hash);

    component.onSubmit();

    expect(component.searchResults).toStrictEqual([hash]);
    expect(alertServiceSpy.showErrorMessage).not.toHaveBeenCalled();
  });

  it('should report an error when the request size exceeds the maximum', () => {
    fixture.detectChanges();
    const hash = 'a'.repeat(MAX_SEARCH_SIZE + 1);
    component.form.controls['hashes'].setValue(hash);

    component.onSubmit();

    expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledExactlyOnceWith(
      `You have exceeded the maximum request limit size of ${MAX_SEARCH_SIZE} characters. Your current input size is ${MAX_SEARCH_SIZE + 1} characters. Please reduce your search input.`
    );
    expect(component.searchResults).toStrictEqual([]);
    expect(component.form.controls['hashes'].value).toBe(hash);
  });

  it('should remove the results table when a subsequent search contains only whitespace', () => {
    fixture.detectChanges();
    submitHashes('hash-one');
    expect(fixture.debugElement.query(By.css('app-table'))).not.toBeNull();
    expect(fixture.debugElement.query(By.directive(MockSearchHashTableComponent))).not.toBeNull();

    submitHashes(' \n\t ');

    expect(component.searchResults).toStrictEqual([]);
    expect(fixture.debugElement.query(By.css('app-table'))).toBeNull();
    expect(fixture.debugElement.query(By.directive(MockSearchHashTableComponent))).toBeNull();
    expect(component.form.controls['hashes'].value).toBeNull();
    expect(alertServiceSpy.showErrorMessage).not.toHaveBeenCalled();
  });

  it('should mark the form as touched when the required input is missing', () => {
    fixture.detectChanges();

    component.onSubmit();

    expect(component.form.controls['hashes'].touched).toBe(true);
    expect(component.form.invalid).toBe(true);
    expect(component.searchResults).toStrictEqual([]);
    expect(alertServiceSpy.showErrorMessage).not.toHaveBeenCalled();
  });
});
