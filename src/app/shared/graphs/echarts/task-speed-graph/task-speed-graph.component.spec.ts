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

  it('sums the speeds of agents reporting at the same timestamp', () => {
    // Two agents at t=100 (3 MH/s each) collapse into one 6 MH/s point; t=200 stays separate.
    const option = drawWith([
      speedStat(100, 3_000_000),
      speedStat(100, 3_000_000),
      speedStat(200, 1_000_000)
    ]);
    const plotted = option.series[0].data.map((point: { value: [string, number] }) => point.value[1]);

    expect(plotted).toEqual([6, 1]);
  });

  it('picks the unit from the fastest point even across several orders of magnitude', () => {
    // Fastest is 2.5 GH/s, so a 20 MH/s point must render proportionally tiny on a GH/s axis, not tower over it.
    const option = drawWith([speedStat(100, 2_500_000_000), speedStat(200, 20_000_000)]);
    const plotted = option.series[0].data.map((point: { value: [string, number] }) => point.value[1]);

    expect(option.yAxis[0].name).toBe('GH/s');
    expect(plotted).toEqual([2.5, 0.02]);
  });

  it('rounds each plotted value to two decimals', () => {
    const option = drawWith([speedStat(100, 1_234_000_000)]);

    expect(option.series[0].data[0].value[1]).toBe(1.23);
  });

  it('clears the chart when the speeds input becomes empty', () => {
    drawWith([speedStat(100, 5_000_000)]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chart = (component as any).chart;
    spyOn(chart, 'clear').and.callThrough();

    component.speeds = [];
    component.ngOnChanges({ speeds: new SimpleChange([speedStat(100, 5_000_000)], [], false) });

    expect(chart.clear).toHaveBeenCalled();
  });
});
