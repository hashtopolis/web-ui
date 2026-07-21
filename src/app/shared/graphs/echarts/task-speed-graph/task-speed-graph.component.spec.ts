import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedStat } from '@src/app/core/_models/speed-stat.model';
import { TaskSpeedGraphComponent } from '@src/app/shared/graphs/echarts/task-speed-graph/task-speed-graph.component';

describe('TaskSpeedGraphComponent', () => {
  let component: TaskSpeedGraphComponent;
  let fixture: ComponentFixture<TaskSpeedGraphComponent>;

  const speedStat = (time: number, speed: number, agentId = 1): SpeedStat =>
    ({ id: time, type: 'speed', agentId, taskId: 1, speed, time }) as SpeedStat;

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
    const option = drawWith([speedStat(100, 5_000_000), speedStat(110, 800_000)]);
    const plotted = option.series[0].data.map((point: { value: [number, number] }) => point.value[1]);

    expect(plotted).toEqual([5, 0.8]);
    expect(option.yAxis[0].name).toBe('MH/s');
  });

  it('places the Max/Min markers on the true extremes with the shared unit', () => {
    const option = drawWith([speedStat(100, 5_000_000), speedStat(110, 800_000)]);
    const markPoints = option.series[0].markPoint.data as { name: string; coord: [number, number]; value: string }[];
    const max = markPoints.find((point) => point.name === 'Max');
    const min = markPoints.find((point) => point.name === 'Min');

    expect(max?.coord[1]).toBe(5);
    expect(max?.value).toBe('5 MH/s');
    expect(min?.coord[1]).toBe(0.8);
    expect(min?.value).toBe('0.8 MH/s');
  });

  it('sums all agents into a single total even when their timestamps do not line up', () => {
    // Agent 1 (t=100) and agent 2 (t=105) both fall in the same 10s bucket: one 6 MH/s total, not two lines.
    const option = drawWith([speedStat(100, 3_000_000, 1), speedStat(105, 3_000_000, 2)]);
    const plotted = option.series[0].data.map((point: { value: [number, number] }) => point.value[1]);

    expect(plotted).toEqual([6]);
  });

  it('keeps only the latest sample per agent within a bucket, never double-counting one agent', () => {
    // The same agent reports twice inside one 10s bucket; the later 4 MH/s wins instead of summing to 7.
    const option = drawWith([speedStat(100, 3_000_000, 1), speedStat(105, 4_000_000, 1)]);
    const plotted = option.series[0].data.map((point: { value: [number, number] }) => point.value[1]);

    expect(plotted).toEqual([4]);
  });

  it('carries an agent through a bucket it skipped so the total has no false dip', () => {
    // Agent 1 reports at 100 and 120 but skips the 110 bucket; agent 2 reports in all three.
    // The 110 bucket must still show the full 8 MH/s (5 carried + 3), not drop to 3.
    const option = drawWith([
      speedStat(100, 5_000_000, 1),
      speedStat(120, 5_000_000, 1),
      speedStat(100, 3_000_000, 2),
      speedStat(110, 3_000_000, 2),
      speedStat(120, 3_000_000, 2)
    ]);
    const plotted = option.series[0].data.map((point: { value: [number, number] }) => point.value[1]);

    expect(plotted).toEqual([8, 8, 8]);
  });

  it('drops an agent from the total once it stops reporting past the activity window', () => {
    // Agent 1 runs the whole time; agent 2 stops after t=110. Beyond the 60s window the total falls to agent 1 alone.
    const running = [];
    for (let t = 100; t <= 300; t += 10) {
      running.push(speedStat(t, 5_000_000, 1));
    }
    const option = drawWith([...running, speedStat(100, 3_000_000, 2), speedStat(110, 3_000_000, 2)]);
    const plotted = option.series[0].data.map((point: { value: [number, number] }) => point.value[1]);

    expect(plotted[0]).toBe(8); // both agents active
    expect(plotted[plotted.length - 1]).toBe(5); // agent 2 long gone
  });

  it('picks the unit from the fastest point even across several orders of magnitude', () => {
    // Fastest is 2.5 GH/s, so a 20 MH/s point must render proportionally tiny on a GH/s axis, not tower over it.
    const option = drawWith([speedStat(100, 2_500_000_000), speedStat(110, 20_000_000)]);
    const plotted = option.series[0].data.map((point: { value: [number, number] }) => point.value[1]);

    expect(option.yAxis[0].name).toBe('GH/s');
    expect(plotted).toEqual([2.5, 0.02]);
  });

  it('rounds each plotted value to two decimals', () => {
    const option = drawWith([speedStat(100, 1_234_000_000)]);

    expect(option.series[0].data[0].value[1]).toBe(1.23);
  });

  it('plots against a time axis and defaults the zoom to the most recent 30 minutes', () => {
    // One hour of data: the initial view starts 30 minutes before the last record.
    const option = drawWith([speedStat(0, 1_000_000, 1), speedStat(3600, 2_000_000, 1)]);
    const [slider] = option.dataZoom;

    expect(option.xAxis[0].type).toBe('time');
    expect(slider.startValue).toBe(30 * 60 * 1000);
    expect(slider.endValue).toBe(3600 * 1000);
  });

  it('shows the whole range when it is shorter than the default window', () => {
    const option = drawWith([speedStat(100, 1_000_000, 1), speedStat(200, 2_000_000, 1)]);
    const [slider] = option.dataZoom;

    expect(slider.startValue).toBe(100 * 1000);
    expect(slider.endValue).toBe(200 * 1000);
  });

  it('applies the recent-window bounds to both the slider and the inside (wheel/drag) zoom', () => {
    const option = drawWith([speedStat(0, 1_000_000, 1), speedStat(3600, 2_000_000, 1)]);
    const [slider, inside] = option.dataZoom;

    expect(slider.type).toBe('slider');
    expect(inside.type).toBe('inside');
    expect(inside.startValue).toBe(slider.startValue);
    expect(inside.endValue).toBe(slider.endValue);
  });

  it('spans the x-axis over the full data range so zooming out still shows everything', () => {
    const option = drawWith([speedStat(0, 1_000_000, 1), speedStat(3600, 2_000_000, 1)]);

    expect(option.xAxis[0].min).toBe(0);
    expect(option.xAxis[0].max).toBe(3600 * 1000);
  });

  it('falls back to the H/s unit for sub-kH/s totals', () => {
    const option = drawWith([speedStat(100, 500, 1)]);
    const plotted = option.series[0].data.map((point: { value: [number, number] }) => point.value[1]);

    expect(option.yAxis[0].name).toBe('H/s');
    expect(plotted).toEqual([500]);
  });

  it('breaks the line where reporting pauses longer than the activity window', () => {
    // A 900s silence (>> the 60s window) leaves every bucket in between with no active agent.
    const option = drawWith([speedStat(100, 5_000_000, 1), speedStat(1000, 5_000_000, 1)]);
    const times = option.series[0].data.map((point: { value: [number, number] }) => point.value[0]);

    expect(times).toContain(100 * 1000);
    expect(times).toContain(1000 * 1000);
    expect(times).not.toContain(500 * 1000); // the silent middle produces no point
  });

  it('places both Max and Min markers on the sole point when there is only one sample', () => {
    const option = drawWith([speedStat(100, 5_000_000, 1)]);
    const markPoints = option.series[0].markPoint.data as { name: string; coord: [number, number]; value: string }[];
    const max = markPoints.find((point) => point.name === 'Max');
    const min = markPoints.find((point) => point.name === 'Min');

    expect(max?.coord[1]).toBe(5);
    expect(min?.coord[1]).toBe(5);
    expect(max?.value).toBe('5 MH/s');
    expect(min?.value).toBe('5 MH/s');
  });

  it('formats the axis tooltip as "<time>: <summed speed> <unit>"', () => {
    const option = drawWith([speedStat(100, 3_000_000, 1), speedStat(105, 3_000_000, 2)]);
    const tooltip = Array.isArray(option.tooltip) ? option.tooltip[0] : option.tooltip;
    const html = tooltip.formatter([{ data: { value: [100 * 1000, 6], unit: 'MH/s' } }]);

    expect(html).toContain('<strong>6 MH/s</strong>');
    expect(html).toContain('00:01:40'); // 100s after the UTC epoch
  });

  it('renders no tooltip for a mark-point style param without a [time, value] pair', () => {
    const option = drawWith([speedStat(100, 3_000_000, 1)]);
    const tooltip = Array.isArray(option.tooltip) ? option.tooltip[0] : option.tooltip;

    expect(tooltip.formatter({ data: { value: '3 MH/s' } })).toBe('');
    expect(tooltip.formatter([])).toBe('');
  });

  it('labels the time axis with a UTC HH:MM:SS formatter', () => {
    const option = drawWith([speedStat(100, 3_000_000, 1)]);

    expect(option.xAxis[0].axisLabel.formatter(100 * 1000)).toBe('00:01:40');
  });

  it('draws on ngAfterViewInit when speeds are already present (initial load path)', () => {
    // Fresh component whose speeds are set before the first render, mirroring the real @Input binding.
    const freshFixture = TestBed.createComponent(TaskSpeedGraphComponent);
    const fresh = freshFixture.componentInstance;
    fresh.speeds = [speedStat(100, 5_000_000, 1), speedStat(105, 3_000_000, 2)];
    freshFixture.detectChanges(); // triggers ngAfterViewInit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const option = (fresh as any).chart.getOption();
    expect(option.series[0].data.length).toBe(1);
    expect(option.series[0].data[0].value[1]).toBe(8); // 5 + 3 MH/s, summed
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
