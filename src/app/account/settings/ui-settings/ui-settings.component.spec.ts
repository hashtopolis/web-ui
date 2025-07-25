import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { AlertService } from '@services/shared/alert.service';

import { UiSettingsComponent } from '@src/app/account/settings/ui-settings/ui-settings.component';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { TableModule } from '@src/app/shared/table/table-actions.module';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

describe('UiSettingsComponent', () => {
  let component: UiSettingsComponent;
  let fixture: ComponentFixture<UiSettingsComponent>;
  let alertService: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiSettingsComponent],
      imports: [MatSelectModule, ReactiveFormsModule, PageTitleModule, TableModule]
    }).compileComponents();
    fixture = TestBed.createComponent(UiSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    alertService = TestBed.inject(AlertService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('timefmt')).toBeDefined();
    expect(component.form.get('layout')).toBeDefined();
    expect(component.form.get('theme')).toBeDefined();
  });

  it('should call updateForm and patch form values', () => {
    spyOn(component.form, 'patchValue');
    component.util = {
      uiConfig: { timefmt: 'dd/MM/yyyy h:mm:ss', layout: 'fixed', theme: 'dark' }
    } as UISettingsUtilityClass;
    component.updateForm();
    expect(component.form.patchValue).toHaveBeenCalledWith({
      timefmt: 'dd/MM/yyyy h:mm:ss',
      layout: 'fixed',
      theme: 'dark'
    });
  });

  it('should show info message on submit', () => {
    spyOn(component.util, 'updateSettings').and.returnValue(1);
    spyOn(alertService, 'showInfoMessage');
    component.onSubmit();
    expect(alertService.showInfoMessage).toHaveBeenCalledWith('Reloading settings ...');
  });

  it('should show "No changes were saved" if nothing changed', () => {
    spyOn(component.util, 'updateSettings').and.returnValue(0);
    spyOn(alertService, 'showInfoMessage');
    component.onSubmit();
    expect(alertService.showInfoMessage).toHaveBeenCalledWith('No changes were saved');
  });
});
