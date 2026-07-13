import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedStat } from '@src/app/core/_models/speed-stat.model';
import { TaskSpeedGraphComponent } from '@src/app/shared/graphs/echarts/task-speed-graph/task-speed-graph.component';

describe('TaskSpeedGraphComponent', () => {
  let component: TaskSpeedGraphComponent;
  let fixture: ComponentFixture<TaskSpeedGraphComponent>;

  const speedStat = (time: number, speed: number): SpeedStat =>
    ({ id: time, type: 'speed', agentId: 1, taskId: 1, speed, time }) as SpeedStat;

  const drawWith = (speeds: SpeedStat[]) => {
    component.speeds = speeds;
    component.ngOnChanges({ speeds: new SimpleChange([], speeds, false) });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (component as any).chart.getOption();
  };

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

  it('scales every point by one shared unit chosen from the fastest speed', () => {
    const option = drawWith([speedStat(100, 5_000_000), speedStat(200, 800_000)]);
    const plotted = option.series[0].data.map((point: { value: [string, number] }) => point.value[1]);

    expect(plotted).toEqual([5, 0.8]);
    expect(option.yAxis[0].name).toBe('MH/s');
  });

  it('places the Max/Min markers on the true extremes with the shared unit', () => {
    const option = drawWith([speedStat(100, 5_000_000), speedStat(200, 800_000)]);
    const markPoints = option.series[0].markPoint.data as { name: string; coord: [string, number]; value: string }[];
    const max = markPoints.find((point) => point.name === 'Max');
    const min = markPoints.find((point) => point.name === 'Min');

    expect(max?.coord[1]).toBe(5);
    expect(max?.value).toBe('5 MH/s');
    expect(min?.coord[1]).toBe(0.8);
    expect(min?.value).toBe('0.8 MH/s');
  });
});
