import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreconfiguredTasksComponent } from './preconfigured-tasks.component';

describe('PreconfiguredTasksComponent', () => {
  let component: PreconfiguredTasksComponent;
  let fixture: ComponentFixture<PreconfiguredTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreconfiguredTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreconfiguredTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
