import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCrackerComponent } from './new-cracker.component';

describe('NewCrackerComponent', () => {
  let component: NewCrackerComponent;
  let fixture: ComponentFixture<NewCrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
