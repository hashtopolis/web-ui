import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { LastUpdatedComponent } from '@src/app/shared/widgets/last-updated/last-updated.component';

describe('LastUpdatedComponent', () => {
  let component: LastUpdatedComponent;
  let fixture: ComponentFixture<LastUpdatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastUpdatedComponent],
      providers: [
        {
          provide: UISettingsUtilityClass,
          useValue: {
            getSetting: jasmine.createSpy('getSetting').and.returnValue('dd/MM/yyyy h:mm:ss')
          }
        },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LastUpdatedComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format lastUpdatedDisplay using UI settings', () => {
    component.lastUpdated = new Date(2025, 8, 26, 10, 30, 0);
    fixture.detectChanges();
    expect(component.lastUpdatedDisplay).toContain('26/09/2025 10:30:00');
  });

  it('should display countdown if nextRefreshTimestamp is in the future and not refreshing', fakeAsync(() => {
    component.nextRefreshTimestamp = Date.now() + 5000; // 5s in the future
    component.refreshing = false;
    component.ngOnChanges({
      nextRefreshTimestamp: {
        currentValue: component.nextRefreshTimestamp,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    tick(1000); // allow interval to run
    fixture.detectChanges();

    expect(component.nextUpdateDisplay).not.toBeNull();
    expect(component.nextUpdateDisplay).toMatch(/\d{2}:\d{2}/); // mm:ss format
  }));

  it('should stop countdown if nextRefreshTimestamp is in the past', fakeAsync(() => {
    component.nextRefreshTimestamp = Date.now() - 1000; // past
    component.refreshing = false;
    component.ngOnChanges({
      nextRefreshTimestamp: {
        currentValue: component.nextRefreshTimestamp,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    tick(300);

    expect(component.nextUpdateDisplay).toBe('00:00');
  }));

  it('should hide countdown if refreshing is true', fakeAsync(() => {
    component.nextRefreshTimestamp = Date.now() + 5000; // future
    component.refreshing = true;
    component.ngOnChanges({
      nextRefreshTimestamp: {
        currentValue: component.nextRefreshTimestamp,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    tick(300);

    expect(component.nextUpdateDisplay).toBeNull();
  }));
});
