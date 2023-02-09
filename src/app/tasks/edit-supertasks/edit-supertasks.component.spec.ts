import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupertasksComponent } from './edit-supertasks.component';

describe('EditSupertasksComponent', () => {
  let component: EditSupertasksComponent;
  let fixture: ComponentFixture<EditSupertasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSupertasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSupertasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
