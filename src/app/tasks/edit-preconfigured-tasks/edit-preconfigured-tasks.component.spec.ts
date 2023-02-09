import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPreconfiguredTasksComponent } from './edit-preconfigured-tasks.component';

describe('EditPreconfiguredTasksComponent', () => {
  let component: EditPreconfiguredTasksComponent;
  let fixture: ComponentFixture<EditPreconfiguredTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPreconfiguredTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPreconfiguredTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
