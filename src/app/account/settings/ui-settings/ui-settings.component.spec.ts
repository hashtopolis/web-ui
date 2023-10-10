/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { UISettings, UiSettingsComponent } from './ui-settings.component';
import { CookieStorageService } from 'src/app/core/_services/storage/cookie-storage.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/shared/components.module';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataTablesModule } from 'angular-datatables';
import { PipesModule } from 'src/app/shared/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { setFieldValue } from 'src/app/spec-helpers/element.spec-helper';
import Swal from 'sweetalert2/dist/sweetalert2.js';

class MockCookieStorageService {
  getItem(key: string): any {
    return {
      localtimefmt: 'dd/MM/yyyy'
    }
  }
  setItem(key: string, value: any, expiresInMs: number): void {
    // Do nothing
  }
  removeItem(key: string): void {
    // Do nothing
  }
}

describe('UiSettingsComponent', () => {
  let component: UiSettingsComponent;
  let fixture: ComponentFixture<UiSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UiSettingsComponent
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FontAwesomeModule,
        ComponentsModule,
        DataTablesModule,
        PipesModule,
        NgbModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: CookieStorageService,
          useClass: MockCookieStorageService
        },
        Swal
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize settings from cookies', () => {
    const mockSettings = { localtimefmt: 'dd/MM/yyyy' };

    component.initSettings();
    component.initForm();

    expect(component.settings).toEqual(mockSettings);
  });

  it('should set a new value for a UI setting', () => {
    const mockName = 'localtimefmt';
    const mockValue = 'dd/MM/yyyy';

    component.setCookieValue(mockName, mockValue);

    expect(component.settings[mockName]).toBe(mockValue);
    expect(component.uiForm.get(mockName)?.value).toBe(mockValue);
  });

  it('should handle select change and call setCookieValue', () => {
    const mockName = 'localtimefmt';
    const mockValue = 'dd/MM/yyyy h:mm:ss';

    const setCookieValueSpy = spyOn(component, 'setCookieValue');

    setFieldValue(fixture, 'select-localtimefmt', mockValue);

    fixture.detectChanges();

    expect(setCookieValueSpy).toHaveBeenCalledWith(mockName, mockValue);
  });
});
