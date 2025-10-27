import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AlertService } from '@services/shared/alert.service';

import { GridModule } from '@src/app/shared/grid-containers/grid.module';
import { WordlistGeneratorComponent } from '@src/app/shared/wordlist-generator/wordlist-generator.component';
import { Wordpolis } from '@src/app/shared/wordlist-generator/wordpolis-wrapper';

// Mock AlertService
class MockAlertService {
  showErrorMessage = jasmine.createSpy('showErrorMessage');
}

describe('WordlistGeneratorComponent', () => {
  let component: WordlistGeneratorComponent;
  let fixture: ComponentFixture<WordlistGeneratorComponent>;
  let alertService: MockAlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WordlistGeneratorComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        GridModule
      ],
      providers: [{ provide: AlertService, useClass: MockAlertService }]
    }).compileComponents();

    fixture = TestBed.createComponent(WordlistGeneratorComponent);
    component = fixture.componentInstance;
    alertService = TestBed.inject(AlertService) as unknown as MockAlertService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be initialized with defaults', () => {
    expect(component.form.controls.filename.value).toBe('wordlist.txt');
    expect(component.form.controls.names.length).toBe(1);
    expect(component.form.controls.sparetext.length).toBe(1);
  });

  it('should be invalid if filename is empty', () => {
    component.form.controls.filename.setValue('');
    expect(component.form.controls.filename.valid).toBeFalse();
    expect(component.form.controls.filename.errors).toEqual({ required: true });
  });

  it('should be invalid if names, specialdates and sparetext are all empty', () => {
    expect(component.form.valid).toBeFalse();
    expect(component.form.errors).toEqual({ atLeastOneRequired: true });
  });

  it('should be valid if at least one field is filled', () => {
    const namesArray = component.form.get('names') as FormArray;
    namesArray.at(0).setValue('John Doe');
    expect(component.form.valid).toBeTrue();
  });

  it('should be valid with a proper filename and at least one field filled', () => {
    component.form.controls.filename.setValue('mywordlist.txt');
    const namesArray = component.form.get('names') as FormArray;
    namesArray.at(0).setValue('Alice');

    expect(component.form.valid).toBeTrue();
    expect(component.form.controls.filename.errors).toBeNull();
    expect(component.form.errors).toBeNull();
  });

  it('should add and remove controls in names FormArray', () => {
    const namesArray = component.form.controls.names;
    expect(namesArray.length).toBe(1);
    component.addControl('names');
    expect(namesArray.length).toBe(2);
    component.removeItem('names', 1);
    expect(namesArray.length).toBe(1);
  });

  it('should call generateCandidates with the correct values when form is valid', () => {
    const wordpolisSpy = spyOn(Wordpolis, 'generateCandidates').and.returnValue(undefined);

    component.form.controls.names.at(0).setValue('test');
    component.form.controls.specialdates.setValue('2025-08-21');
    component.form.controls.sparetext.at(0).setValue('extra');
    component.form.controls.useSpecCharacters.setValue(true);
    component.form.controls.usePermutations.setValue(true);
    component.form.controls.isCapitalize.setValue(true);
    component.form.controls.filename.setValue('file.txt');

    component.onSubmit();

    expect(wordpolisSpy).toHaveBeenCalledOnceWith(
      component.form.controls.names.value,
      component.form.controls.specialdates.value,
      component.form.controls.sparetext.value,
      {
        useSpecialchars: true,
        usePermutations: true,
        isCapitalize: true,
        isAlternated: false,
        isUppercase: false,
        isLowercase: false,
        isSimilarVowels: false,
        isSimilarConsonant: false,
        isSimilarSpecialchars: false,
        filename: 'file.txt'
      }
    );

    expect(alertService.showErrorMessage).not.toHaveBeenCalled();
  });

  it('should call AlertService on error during submit', () => {
    spyOn(Wordpolis, 'generateCandidates').and.throwError('test error');
    component.form.controls.names.at(0).setValue('test');
    component.form.controls.filename.setValue('file.txt');
    component.onSubmit();
    expect(alertService.showErrorMessage).toHaveBeenCalled();
  });
});
