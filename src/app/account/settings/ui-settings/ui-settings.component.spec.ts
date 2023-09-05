import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSettingsComponent } from './ui-settings.component';

describe('UiSettingsComponent', () => {
  let component: UiSettingsComponent;
  let fixture: ComponentFixture<UiSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiSettingsComponent]
    });
    fixture = TestBed.createComponent(UiSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
