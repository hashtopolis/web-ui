import type { MockedObject } from 'vitest';

import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { AppModule } from '@src/app/app.module';
import {
  MAX_SEARCH_LENGTH,
  MAX_SEARCH_SIZE
} from '@src/app/core/_components/tables/search-hash-table/search-hash-table.constants';
import { SearchHashComponent } from '@src/app/hashlists/search-hash/search-hash.component';

describe('SearchHashComponent', () => {
  let component: SearchHashComponent;
  let fixture: ComponentFixture<SearchHashComponent>;
  let alertServiceSpy: MockedObject<AlertService>;
  let titleServiceSpy: MockedObject<AutoTitleService>;

  beforeEach(async () => {
    alertServiceSpy = {
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage')
    } as MockedObject<AlertService>;
    titleServiceSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;

    await TestBed.configureTestingModule({
      declarations: [SearchHashComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: AutoTitleService, useValue: titleServiceSpy }
      ]
    })
      .overrideComponent(SearchHashComponent, { set: { template: '' } })
      .compileComponents();

    AppModule.injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(SearchHashComponent);
    component = fixture.componentInstance;
  });

  it('should set the page title and initialize a required hashes control', () => {
    fixture.detectChanges();

    expect(titleServiceSpy.set).toHaveBeenCalledWith(['Search Hash']);
    expect(component.pageTitle).toBe('Search Hash');
    expect(component.form.controls['hashes'].value).toBe('');
    expect(component.form.controls['hashes'].hasError('required')).toBe(true);
    expect(component.isCreatingLoading).toBe(false);
  });

  it('should build a fresh form with a required hashes control', () => {
    fixture.detectChanges();
    component.form.controls['hashes'].setValue('previous hash');

    component.buildForm();

    expect(component.form.controls['hashes'].value).toBe('');
    expect(component.form.controls['hashes'].hasError('required')).toBe(true);
  });

  it('should expose search results through its getter and setter', () => {
    const results = ['hash-one', 'hash-two'];

    component.searchResults = results;

    expect(component.searchResults).toBe(results);
  });

  it('should split valid input into hashes, refresh the view, and reset the form', () => {
    fixture.detectChanges();
    component.form.controls['hashes'].setValue('hash-one \n hash-two\t hash-three');

    component.onSubmit();

    expect(component.searchResults).toEqual(['hash-one', 'hash-two', 'hash-three']);
    expect(component.isCreatingLoading).toBe(false);
    expect(component.form.controls['hashes'].value).toBeNull();
    expect(alertServiceSpy.showErrorMessage).not.toHaveBeenCalled();
  });

  it('should accept exactly the maximum number of hashes', () => {
    fixture.detectChanges();
    const hashes = Array.from({ length: MAX_SEARCH_LENGTH }, (_, index) => `hash-${index}`);
    component.form.controls['hashes'].setValue(hashes.join(' '));

    component.onSubmit();

    expect(component.searchResults).toEqual(hashes);
    expect(alertServiceSpy.showErrorMessage).not.toHaveBeenCalled();
  });

  it('should report an error when the number of hashes exceeds the maximum', () => {
    fixture.detectChanges();
    const hashes = Array.from({ length: MAX_SEARCH_LENGTH + 1 }, (_, index) => `hash-${index}`);
    component.form.controls['hashes'].setValue(hashes.join(' '));

    component.onSubmit();

    expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith(
      `You have exceeded the maximum hash search size of ${MAX_SEARCH_LENGTH} hashes. You have entered ${MAX_SEARCH_LENGTH + 1} hashes. Please reduce your hash list.`
    );
    expect(component.searchResults).toEqual([]);
    expect(component.form.controls['hashes'].value).toBe(hashes.join(' '));
    expect(component.isCreatingLoading).toBe(false);
  });

  it('should accept an input exactly at the maximum request size', () => {
    fixture.detectChanges();
    const hash = 'a'.repeat(MAX_SEARCH_SIZE);
    component.form.controls['hashes'].setValue(hash);

    component.onSubmit();

    expect(component.searchResults).toEqual([hash]);
    expect(alertServiceSpy.showErrorMessage).not.toHaveBeenCalled();
  });

  it('should report an error when the request size exceeds the maximum', () => {
    fixture.detectChanges();
    const hash = 'a'.repeat(MAX_SEARCH_SIZE + 1);
    component.form.controls['hashes'].setValue(hash);

    component.onSubmit();

    expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith(
      `You have exceeded the maximum request limit size of ${MAX_SEARCH_SIZE} characters. Your current input size is ${MAX_SEARCH_SIZE + 1} characters. Please reduce your search input.`
    );
    expect(component.searchResults).toEqual([]);
    expect(component.form.controls['hashes'].value).toBe(hash);
    expect(component.isCreatingLoading).toBe(false);
  });

  it('should submit whitespace-only input as an empty result list', () => {
    fixture.detectChanges();
    component.form.controls['hashes'].setValue(' \n\t ');

    component.onSubmit();

    expect(component.searchResults).toEqual([]);
    expect(component.form.controls['hashes'].value).toBeNull();
    expect(alertServiceSpy.showErrorMessage).not.toHaveBeenCalled();
  });

  it('should mark the form as touched when the required input is missing', () => {
    fixture.detectChanges();

    component.onSubmit();

    expect(component.form.controls['hashes'].touched).toBe(true);
    expect(component.form.invalid).toBe(true);
    expect(component.searchResults).toEqual([]);
    expect(alertServiceSpy.showErrorMessage).not.toHaveBeenCalled();
  });
});
