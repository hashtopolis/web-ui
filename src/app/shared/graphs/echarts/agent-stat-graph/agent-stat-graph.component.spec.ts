import { ASC } from '@constants/agentsc.config';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JAgentStat } from '@models/agent-stats.model';

import { AgentStatGraphComponent } from '@src/app/shared/graphs/echarts/agent-stat-graph/agent-stat-graph.component';

describe('AgentStatGraphComponent', () => {
  let component: AgentStatGraphComponent;
  let fixture: ComponentFixture<AgentStatGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentStatGraphComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AgentStatGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('GPU temp - Displays the message and hides the chart if no data is available', () => {
    // No Data available for the specified statType
    component.agentStats = [];
    component.statType = ASC.GPU_TEMP;

    // check if data exists for the given statType
    component.hasData = component.agentStats.some((s) => s.statType === component.statType);

    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    // get chart-div
    const chartDiv = compiled.querySelector('div[style*="height: 300px"]') as HTMLElement | null;
    expect(chartDiv).toBeTruthy();

    // check if chart is hidden
    const chartDisplay = chartDiv ? window.getComputedStyle(chartDiv).display : '';
    expect(chartDisplay).toBe('none');

    // check if hint-div is visible
    const hintDiv = compiled.querySelectorAll('div')[1] as HTMLElement | null;
    expect(hintDiv).toBeTruthy();
    const hintDisplay = hintDiv ? window.getComputedStyle(hintDiv).display : '';
    expect(hintDisplay).toBe('block');

    // check if the expected message is displayed
    const expectedText = 'Device(s) temperature data unavailable';
    expect(compiled.textContent).toContain(expectedText);
  });

  it('GPU temp - Displays the chart and hides the message when data is available', () => {
    // sample data for GPU temp statType
    component.agentStats = [
      {
        type: 'agentStat',
        id: 23939,
        agentId: 2,
        statType: 1,
        time: 1766135394,
        value: [14]
      }
    ] as JAgentStat[];
    component.statType = ASC.GPU_TEMP;

    // check if data exists for the given statType
    component.hasData = component.agentStats.some((s) => s.statType === component.statType);

    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    // get chart-div
    const chartDiv = compiled.querySelector('div[style*="height: 300px"]') as HTMLElement | null;
    expect(chartDiv).toBeTruthy();

    // check if chart is visible
    const chartDisplay = chartDiv ? window.getComputedStyle(chartDiv).display : '';
    expect(chartDisplay).toBe('block');

    // check if hint-div is hidden
    const hintDiv = compiled.querySelectorAll('div')[1] as HTMLElement | null;
    expect(hintDiv).toBeTruthy();
    const hintDisplay = hintDiv ? window.getComputedStyle(hintDiv).display : '';
    expect(hintDisplay).toBe('none');
  });

  it('GPU_UTIL - Displays the message and hides the chart if no data is available', () => {
    // No Data available for the specified statType
    component.agentStats = [];
    component.statType = ASC.GPU_UTIL;

    // check if data exists for the given statType
    component.hasData = component.agentStats.some((s) => s.statType === component.statType);

    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    // get chart-div
    const chartDiv = compiled.querySelector('div[style*="height: 300px"]') as HTMLElement | null;
    expect(chartDiv).toBeTruthy();

    // check if chart is hidden
    const chartDisplay = chartDiv ? window.getComputedStyle(chartDiv).display : '';
    expect(chartDisplay).toBe('none');

    // check if hint-div is visible
    const hintDiv = compiled.querySelectorAll('div')[1] as HTMLElement | null;
    expect(hintDiv).toBeTruthy();
    const hintDisplay = hintDiv ? window.getComputedStyle(hintDiv).display : '';
    expect(hintDisplay).toBe('block');

    // check if the expected message is displayed
    const expectedText = 'GPU utilisation data unavailable';
    expect(compiled.textContent).toContain(expectedText);
  });

  it('GPU_UTIL - Displays the chart and hides the message when data is available', () => {
    // sample data for GPU temp statType
    component.agentStats = [
      {
        type: 'agentStat',
        id: 23939,
        agentId: 2,
        statType: 2,
        time: 1766135394,
        value: [14]
      }
    ] as JAgentStat[];
    component.statType = ASC.GPU_UTIL;

    // check if data exists for the given statType
    component.hasData = component.agentStats.some((s) => s.statType === component.statType);

    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    // get chart-div
    const chartDiv = compiled.querySelector('div[style*="height: 300px"]') as HTMLElement | null;
    expect(chartDiv).toBeTruthy();

    // check if chart is visible
    const chartDisplay = chartDiv ? window.getComputedStyle(chartDiv).display : '';
    expect(chartDisplay).toBe('block');

    // check if hint-div is hidden
    const hintDiv = compiled.querySelectorAll('div')[1] as HTMLElement | null;
    expect(hintDiv).toBeTruthy();
    const hintDisplay = hintDiv ? window.getComputedStyle(hintDiv).display : '';
    expect(hintDisplay).toBe('none');
  });

  it('CPU_UTIL - Displays the message and hides the chart if no data is available', () => {
    // No Data available for the specified statType
    component.agentStats = [];
    component.statType = ASC.CPU_UTIL;

    // check if data exists for the given statType
    component.hasData = component.agentStats.some((s) => s.statType === component.statType);

    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    // get chart-div
    const chartDiv = compiled.querySelector('div[style*="height: 300px"]') as HTMLElement | null;
    expect(chartDiv).toBeTruthy();

    // check if chart is hidden
    const chartDisplay = chartDiv ? window.getComputedStyle(chartDiv).display : '';
    expect(chartDisplay).toBe('none');

    // check if hint-div is visible
    const hintDiv = compiled.querySelectorAll('div')[1] as HTMLElement | null;
    expect(hintDiv).toBeTruthy();
    const hintDisplay = hintDiv ? window.getComputedStyle(hintDiv).display : '';
    expect(hintDisplay).toBe('block');

    // check if the expected message is displayed
    const expectedText = 'CPU utilisation data unavailable';
    expect(compiled.textContent).toContain(expectedText);
  });

  it('CPU_UTIL - Displays the chart and hides the message when data is available', () => {
    // sample data for GPU temp statType
    component.agentStats = [
      {
        type: 'agentStat',
        id: 23939,
        agentId: 2,
        statType: 3,
        time: 1766135394,
        value: [14]
      }
    ] as JAgentStat[];
    component.statType = ASC.CPU_UTIL;

    // check if data exists for the given statType
    component.hasData = component.agentStats.some((s) => s.statType === component.statType);

    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    // get chart-div
    const chartDiv = compiled.querySelector('div[style*="height: 300px"]') as HTMLElement | null;
    expect(chartDiv).toBeTruthy();

    // check if chart is visible
    const chartDisplay = chartDiv ? window.getComputedStyle(chartDiv).display : '';
    expect(chartDisplay).toBe('block');

    // check if hint-div is hidden
    const hintDiv = compiled.querySelectorAll('div')[1] as HTMLElement | null;
    expect(hintDiv).toBeTruthy();
    const hintDisplay = hintDiv ? window.getComputedStyle(hintDiv).display : '';
    expect(hintDisplay).toBe('none');
  });
});
