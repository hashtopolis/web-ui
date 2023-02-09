import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTasksComponent } from './new-tasks.component';

describe('NewTasksComponent', () => {
  let component: NewTasksComponent;
  let fixture: ComponentFixture<NewTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
