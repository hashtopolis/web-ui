import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassStrenghtComponent } from './pass-strenght.component';

describe('PassStrenghtComponent', () => {
  let component: PassStrenghtComponent;
  let fixture: ComponentFixture<PassStrenghtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PassStrenghtComponent]
    });
    fixture = TestBed.createComponent(PassStrenghtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
