import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPreconfiguredTasksComponent } from './new-preconfigured-tasks.component';

describe('NewPreconfiguredTasksComponent', () => {
  let component: NewPreconfiguredTasksComponent;
  let fixture: ComponentFixture<NewPreconfiguredTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPreconfiguredTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPreconfiguredTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
