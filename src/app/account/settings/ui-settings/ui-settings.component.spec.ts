import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UIConfig, uiConfigDefault } from '@models/config-ui.model';

import { ReloadService } from '@services/reload.service';
import { AlertService } from '@services/shared/alert.service';
import { RuntimeThemeOption, ThemeCatalogService } from '@services/shared/theme-catalog.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { UiSettingsComponent } from '@src/app/account/settings/ui-settings/ui-settings.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { TableModule } from '@src/app/shared/table/table-actions.module';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

describe('UiSettingsComponent', () => {
  let component: UiSettingsComponent;
  let fixture: ComponentFixture<UiSettingsComponent>;
  let alertService: AlertService;
  let mockReloadService: jasmine.SpyObj<ReloadService>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService<UIConfig>>;
  let mockThemeCatalogService: jasmine.SpyObj<ThemeCatalogService>;

  const mockThemes: RuntimeThemeOption[] = [
    { value: 'light', description: 'Light Mode', icon: 'light_mode', source: 'builtin', isDark: false },
    { value: 'dark', description: 'Dark Mode', icon: 'dark_mode', source: 'builtin', isDark: true }
  ];

  const mockModifiedUIConfig = {
    layout: 'full',
    theme: 'dark',
    dateFmt: 'yyyy-MM-dd',
    timeFmt: '12h',
    refreshPage: true,
    refreshInterval: 10
  } as UIConfig;

  beforeEach(async () => {
    mockReloadService = jasmine.createSpyObj('ReloadService', ['reloadPage']);
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    // Clone like the real service does: onSubmit() mutates this object in place.
    mockLocalStorageService.getItem.and.returnValue(structuredClone(uiConfigDefault));
    mockThemeCatalogService = jasmine.createSpyObj('ThemeCatalogService', ['getThemes']);
    mockThemeCatalogService.getThemes.and.returnValue(of(mockThemes));

    await TestBed.configureTestingModule({
      declarations: [UiSettingsComponent],
      imports: [
        MatSelectModule,
        ReactiveFormsModule,
        PageTitleModule,
        TableModule,
        MatSelectModule,
        MatIconModule,
        MatTooltipModule,
        ButtonsModule,
        InputModule
      ],
      providers: [
        { provide: ReloadService, useValue: mockReloadService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: ThemeCatalogService, useValue: mockThemeCatalogService }
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
    expect(component.form.controls.dateFmt).toBeDefined();
    expect(component.form.controls.timeFmt).toBeDefined();
    expect(component.form.controls.layout).toBeDefined();
    expect(component.form.controls.theme).toBeDefined();
    expect(component.form.controls.refreshPage).toBeDefined();
    expect(component.form.controls.refreshInterval).toBeDefined();
  });

  it('should call updateForm and patch form values', () => {
    component.util = {
      uiConfig: { dateFmt: 'dd/MM/yyyy', timeFmt: '24h', layout: 'fixed', theme: 'dark' }
    } as UISettingsUtilityClass;

    component.loadSettings();

    expect(component.form.controls.dateFmt.value).toBe('dd/MM/yyyy');
    expect(component.form.controls.timeFmt.value).toBe('24h');
    expect(component.form.controls.layout.value).toBe('fixed');
    expect(component.form.controls.theme.value).toBe('dark');
  });

  it('should show info message on submit, if values have changed', () => {
    component.form.controls.dateFmt.patchValue(mockModifiedUIConfig.dateFmt);
    component.form.controls.timeFmt.patchValue(mockModifiedUIConfig.timeFmt);
    component.form.controls.layout.patchValue(mockModifiedUIConfig.layout);
    component.form.controls.theme.patchValue(mockModifiedUIConfig.theme);
    component.form.controls.refreshPage.patchValue(mockModifiedUIConfig.refreshPage);
    component.form.controls.refreshInterval.patchValue(mockModifiedUIConfig.refreshInterval);

    spyOn(alertService, 'showInfoMessage');

    const button = fixture.nativeElement.querySelector('[data-testid="button-submit"]').querySelector('button');
    button.click();

    expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
      'ui-config',
      jasmine.objectContaining(mockModifiedUIConfig),
      0,
      jasmine.anything()
    );
    expect(alertService.showInfoMessage).toHaveBeenCalledWith('Reloading settings ...');
    expect(mockReloadService.reloadPage).toHaveBeenCalled();
  });

  it('should show "No changes were saved", if nothing changed', () => {
    spyOn(component.util, 'updateSettings').and.returnValue(0);
    spyOn(alertService, 'showInfoMessage');

    const button = fixture.nativeElement.querySelector('[data-testid="button-submit"]').querySelector('button');
    button.click();

    expect(component.util.updateSettings).toHaveBeenCalledWith(component.form.value);
    expect(mockLocalStorageService.setItem).not.toHaveBeenCalled();
    expect(alertService.showInfoMessage).toHaveBeenCalledWith('No changes were saved');
    expect(mockReloadService.reloadPage).toHaveBeenCalled();
  });
});
