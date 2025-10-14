import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapChartComponent } from './heatmap-chart.component';

describe('HeatmapChartComponent', () => {
  let component: HeatmapChartComponent;
  let fixture: ComponentFixture<HeatmapChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatmapChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeatmapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
