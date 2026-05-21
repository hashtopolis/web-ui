import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapChartComponent } from './heatmap-chart.component';

describe('HeatmapChartComponent', () => {
  let component: HeatmapChartComponent;
  let fixture: ComponentFixture<HeatmapChartComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockChart: jasmine.SpyObj<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatmapChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeatmapChartComponent);
    component = fixture.componentInstance;

    mockChart = jasmine.createSpyObj('chart', ['setOption', 'getOption', 'dispose']);
    mockChart.getOption.and.returnValue({});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component['chart'] = mockChart as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('zero-value days', () => {
    it('should set outOfRange transparent so days with 0 cracks show no color', () => {
      component.data = [['2026-01-15', 5]];
      component['setOption']();

      const opts = mockChart.setOption.calls.mostRecent().args[0];
      expect(opts.visualMap.outOfRange).toEqual({ color: 'transparent' });
    });

    it('should start pieces from gte:1 so zero-value days fall outside the range', () => {
      component.data = [['2026-01-15', 5]];
      component['setOption']();

      const opts = mockChart.setOption.calls.mostRecent().args[0];
      expect(opts.visualMap.pieces[0].gte).toBe(1);
    });
  });

  describe('today X marker', () => {
    it('should keep today in series data even when crack count is zero', () => {
      const todayStr = new Date().toISOString().slice(0, 10);
      component.data = [
        ['2026-01-15', 10],
        [todayStr, 0]
      ];
      component['setOption']();

      const opts = mockChart.setOption.calls.mostRecent().args[0];
      const dates = (opts.series[0].data as [string, number][]).map((d) => d[0]);
      expect(dates).toContain(todayStr);
    });
  });

  describe('label color', () => {
    it('should use dark text color in light mode', () => {
      component.data = [['2026-01-15', 5]];
      component.isDarkMode = false;
      component['setOption']();

      const opts = mockChart.setOption.calls.mostRecent().args[0];
      expect(opts.series[0].label.color).toBe('#333333');
    });

    it('should use light text color in dark mode', () => {
      component.data = [['2026-01-15', 5]];
      component.isDarkMode = true;
      component['setOption']();

      const opts = mockChart.setOption.calls.mostRecent().args[0];
      expect(opts.series[0].label.color).toBe('#ffffff');
    });
  });

  describe('dynamic pieces scale', () => {
    it('should scale piece thresholds proportionally to max value', () => {
      component.data = [['2026-01-15', 1000]];
      component['setOption']();

      const opts = mockChart.setOption.calls.mostRecent().args[0];
      const pieces = opts.visualMap.pieces;
      // max=1000 → rawStep=200, niceStep=200, step=200
      expect(pieces[0].lte).toBe(200);
      expect(pieces[1].lte).toBe(400);
      expect(pieces[2].lte).toBe(600);
      expect(pieces[3].lte).toBe(800);
    });

    it('should use minimum step of 2 when data values are small', () => {
      component.data = [['2026-01-15', 3]];
      component['setOption']();

      const opts = mockChart.setOption.calls.mostRecent().args[0];
      // max falls back to 10 minimum → step = 2
      expect(opts.visualMap.pieces[0].lte).toBe(2);
    });
  });
});
