import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Type definition for the UI Settings Form.
 */
export type UiSettingsForm = {
  timefmt: FormControl<string>;
  layout: FormControl<string>;
  theme: FormControl<string>;
  refreshPage: FormControl<boolean>;
  refreshInterval: FormControl<number>;
};

/**
 * FormGroup for UI Settings.
 */
export class UiSettingsFormGroup extends FormGroup<UiSettingsForm> {
  static readonly REFRESH_INTERVAL_MIN = 5; // 5 seconds
  static readonly REFRESH_INTERVAL_MAX = 300; // 5 minutes

  constructor() {
    super({
      timefmt: new FormControl(''),
      layout: new FormControl(''),
      theme: new FormControl(''),
      refreshPage: new FormControl(false),
      refreshInterval: new FormControl(undefined, [
        Validators.min(UiSettingsFormGroup.REFRESH_INTERVAL_MIN),
        Validators.max(UiSettingsFormGroup.REFRESH_INTERVAL_MAX)
      ])
    });
  }
}
