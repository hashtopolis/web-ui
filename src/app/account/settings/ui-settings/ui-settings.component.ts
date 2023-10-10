import { dateFormat } from '../../../core/_constants/settings.config';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { CookieStorageService } from 'src/app/core/_services/storage/cookie-storage.service';


export interface UISettings {
  localtimefmt: string
}

@Component({
  selector: 'app-ui-settings',
  templateUrl: './ui-settings.component.html'
})
export class UiSettingsComponent implements OnInit {

  // Constants
  static readonly COOKIE_NAME = 'ui-settings';
  static readonly DEFAULT_LOCALTIMEFMT = 'dd/MM/yyyy h:mm:ss';

  dateFormat = dateFormat;
  uiForm: FormGroup;
  settings!: UISettings

  /**
   * Creates an instance of UiSettingsComponent.
   *
   * @param cookieStorage - Service for managing cookies storing user interface settings.
   */
  constructor(private cookieStorage: CookieStorageService<UISettings>) { }

  /**
   * Initializes UI settings, retrieves saved settings from cookies if available, and initializes the UI form.
   */
  ngOnInit(): void {
    this.initSettings();
    this.initForm();
  }

  /**
   * Initializes UI settings, retrieves saved settings from cookies if available.
   */
  initSettings(): void {
    this.settings = this.cookieStorage.getItem(UiSettingsComponent.COOKIE_NAME);
    // If no settings are found in cookies, use default settings
    if (!this.settings) {
      this.settings = {
        localtimefmt: UiSettingsComponent.DEFAULT_LOCALTIMEFMT
      }
    }
  }

  /**
   * Initializes the Angular form for UI settings.
   * Sets up form controls and default values based on saved settings.
   */
  initForm() {
    this.uiForm = new FormGroup({
      'localtimefmt': new FormControl(this.settings?.localtimefmt || ''),
    });
  }

  /**
   * Sets a new value for a specific UI setting and updates it in cookies if it has changed.
   *
   * @param name - The name of the UI setting to update.
   * @param value - The new value for the UI setting.
   */
  setCookieValue(name: string, value: string) {
    if (name in this.settings && this.settings[name] !== value) {
      this.settings[name] = value;
      this.uiForm.patchValue({ name: value });
      this.cookieStorage.setItem(UiSettingsComponent.COOKIE_NAME, this.settings, 31557600000);
      this.savedAlert();
    }
  }

  /**
   * Displays a success alert using Swal (SweetAlert2) library.
   */
  savedAlert() {
    Swal.fire({
      position: 'top-end',
      backdrop: false,
      icon: 'success',
      title: 'Saved',
      showConfirmButton: false,
      timer: 1500
    })
  }
}
