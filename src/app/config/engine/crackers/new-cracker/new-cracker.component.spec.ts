import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCrackerComponent } from '@src/app/config/engine/crackers/new-cracker/new-cracker.component';

describe('NewCrackerComponent', () => {
  let component: NewCrackerComponent;
  let fixture: ComponentFixture<NewCrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCrackerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NewCrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
