import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AgentTemperatureInformationDialogComponent } from '@src/app/shared/dialog/agent-temperature-information-dialog/agent-temperature-information-dialog.component';
import { provideDisabledMaterialAnimations } from '@src/app/testing/material-animations';

describe('AgentTemperatureInformationDialogComponent', () => {
  let fixture: ComponentFixture<AgentTemperatureInformationDialogComponent>;
  let close: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    close = vi.fn().mockName('close');
    await TestBed.configureTestingModule({
      imports: [AgentTemperatureInformationDialogComponent],
      providers: [
        provideDisabledMaterialAnimations(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            agentData: [
              {
                tabName: 'Temperature',
                icon: 'device_thermostat',
                threshold1: 70,
                threshold2: 90,
                unitLabel: '°C',
                statusLabel: 'Temperature'
              },
              {
                tabName: 'Utilization',
                icon: 'speed',
                threshold1: 80,
                threshold2: 40,
                unitLabel: '%',
                statusLabel: 'Utilization'
              }
            ]
          }
        },
        { provide: MatDialogRef, useValue: { close } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AgentTemperatureInformationDialogComponent);
    fixture.detectChanges();
  });

  it('renders temperature thresholds and common status explanations', () => {
    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('Temperature is good (< 70 °C)');
    expect(text).toContain('Temperature not ideal (>= 70 °C)');
    expect(text).toContain('Temperature too high (> 90 °C)');
    expect(text).toContain('Agent is not active');
    expect(text).toContain('Agent is active but not working or not providing device data');
    expect(text).toContain('Invalid temperature data from agent or values being 0');
    expect(text).toContain('Threshold can be configured in the config section.');
  });

  it('renders the other threshold variant when its tab is selected', () => {
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(2);
    tabs[1].click();
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('Utilization is good (> 80 %)');
    expect(text).toContain('Utilization not ideal (<= 40 %)');
    expect(text).toContain('Utilization low (<= 40 %)');
    expect(text).toContain('Invalid utilization data');
  });

  it('closes the dialog from the close button', () => {
    fixture.nativeElement.querySelector('button.btn-submit').click();
    expect(close).toHaveBeenCalledExactlyOnceWith('');
  });
});
