import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCrackersComponent } from './new-crackers.component';

describe('NewCrackersComponent', () => {
  let component: NewCrackersComponent;
  let fixture: ComponentFixture<NewCrackersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCrackersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCrackersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
