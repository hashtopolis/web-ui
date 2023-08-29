import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCrackersComponent } from './edit-crackers.component';

describe('EditCrackersComponent', () => {
  let component: EditCrackersComponent;
  let fixture: ComponentFixture<EditCrackersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCrackersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCrackersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
