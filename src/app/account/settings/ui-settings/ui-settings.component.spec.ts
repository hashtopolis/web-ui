import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { UIConfig } from '@models/config-ui.model';

import { ReloadService } from '@services/reload.service';
import { AlertService } from '@services/shared/alert.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { UiSettingsComponent } from '@src/app/account/settings/ui-settings/ui-settings.component';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { TableModule } from '@src/app/shared/table/table-actions.module';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

describe('UiSettingsComponent', () => {
  let component: UiSettingsComponent;
  let fixture: ComponentFixture<UiSettingsComponent>;
  let alertService: AlertService;
  let mockReloadService: jasmine.SpyObj<ReloadService>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService<UIConfig>>;

  const mockModifiedUIConfig = {
    layout: 'full',
    theme: 'dark',
    timefmt: 'dd/MM/yyyy h:mm:ss'
  } as UIConfig;

  beforeEach(async () => {
    mockReloadService = jasmine.createSpyObj('ReloadService', ['reloadPage']);
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);

    await TestBed.configureTestingModule({
      declarations: [UiSettingsComponent],
      imports: [MatSelectModule, ReactiveFormsModule, PageTitleModule, TableModule, MatSelectModule],
      providers: [
        { provide: ReloadService, useValue: mockReloadService },
        { provide: LocalStorageService, useValue: mockLocalStorageService }
      ]
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
    component.util = {
      uiConfig: { timefmt: 'dd/MM/yyyy h:mm:ss', layout: 'fixed', theme: 'dark' }
    } as UISettingsUtilityClass;

    component.updateForm();

    expect(component.form.get('timefmt').value).toBe('dd/MM/yyyy h:mm:ss');
    expect(component.form.get('layout').value).toBe('fixed');
    expect(component.form.get('theme').value).toBe('dark');
  });

  it('should show info message on submit, if values have changed', () => {
    component.form.get('timefmt').patchValue(mockModifiedUIConfig.timefmt);
    component.form.get('layout').patchValue(mockModifiedUIConfig.layout);
    component.form.get('theme').patchValue(mockModifiedUIConfig.theme);

    spyOn(alertService, 'showInfoMessage');

    const button = fixture.nativeElement.querySelector('[data-testid="button-submit"]');
    button.click();

    expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
      'ui-config',
      jasmine.objectContaining(mockModifiedUIConfig),
      0
    );
    expect(alertService.showInfoMessage).toHaveBeenCalledWith('Reloading settings ...');
    expect(mockReloadService.reloadPage).toHaveBeenCalled();
  });

  it('should show "No changes were saved", if nothing changed', () => {
    spyOn(component.util, 'updateSettings').and.returnValue(0);
    spyOn(alertService, 'showInfoMessage');

    const button = fixture.nativeElement.querySelector('[data-testid="button-submit"]');
    button.click();

    expect(component.util.updateSettings).toHaveBeenCalledWith(component.form.value);
    expect(mockLocalStorageService.setItem).not.toHaveBeenCalled();
    expect(alertService.showInfoMessage).toHaveBeenCalledWith('No changes were saved');
    expect(mockReloadService.reloadPage).toHaveBeenCalled();
  });
});
