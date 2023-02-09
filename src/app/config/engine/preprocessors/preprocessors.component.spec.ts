import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprocessorsComponent } from './preprocessors.component';

describe('PreprocessorsComponent', () => {
  let component: PreprocessorsComponent;
  let fixture: ComponentFixture<PreprocessorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreprocessorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreprocessorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
