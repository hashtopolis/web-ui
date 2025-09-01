import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPreprocessorComponent } from '@src/app/config/engine/preprocessors/new-preprocessor/new-preprocessor/new-preprocessor.component';

describe('NewPreprocessorComponent', () => {
  let component: NewPreprocessorComponent;
  let fixture: ComponentFixture<NewPreprocessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPreprocessorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPreprocessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
