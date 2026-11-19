import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapChartComponent } from '@src/app/shared/graphs/echarts/heatmap-chart/heatmap-chart.component';

describe('HeatmapChartComponent', () => {
  let component: HeatmapChartComponent;
  let fixture: ComponentFixture<HeatmapChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatmapChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeatmapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('labels the bottom row with the current weekday', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(new Date(2026, 9, 21)); // Wednesday
      component.ngOnChanges();
    } finally {
      vi.useRealTimers();
    }

    expect(component.dayLabels).toEqual(['Thu', '', 'Sat', '', 'Mon', '', 'Wed']);
    expect(component.cellAt(component.weeks.length - 1, 6)?.date).toBe('2026-10-21');
  });
});
