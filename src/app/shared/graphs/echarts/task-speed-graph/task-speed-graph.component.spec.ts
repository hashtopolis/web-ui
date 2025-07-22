import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSpeedGraphComponent } from '@src/app/shared/graphs/echarts/task-speed-graph/task-speed-graph.component';

describe('TaskSpeedGraphComponent', () => {
  let component: TaskSpeedGraphComponent;
  let fixture: ComponentFixture<TaskSpeedGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskSpeedGraphComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskSpeedGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
