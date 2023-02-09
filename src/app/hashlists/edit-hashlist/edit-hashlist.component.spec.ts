import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHashlistComponent } from './edit-hashlist.component';

describe('EditHashlistComponent', () => {
  let component: EditHashlistComponent;
  let fixture: ComponentFixture<EditHashlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditHashlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHashlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
