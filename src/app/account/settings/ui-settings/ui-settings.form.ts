import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Layout, Theme } from '@models/config-ui.model';

/**
 * Type definition for the UI Settings Form.
 */
export type UiSettingsForm = {
  timefmt: FormControl<string>;
  layout: FormControl<Layout>;
  theme: FormControl<Theme>;
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
      timefmt: new FormControl<string>('', { nonNullable: true }),
      layout: new FormControl<Layout>('fixed', { nonNullable: true }),
      theme: new FormControl<Theme>('light', { nonNullable: true }),
      refreshPage: new FormControl<boolean>(false, { nonNullable: true }),
      refreshInterval: new FormControl<number>(UiSettingsFormGroup.REFRESH_INTERVAL_MIN, {
        nonNullable: true,
        validators: [
          Validators.min(UiSettingsFormGroup.REFRESH_INTERVAL_MIN),
          Validators.max(UiSettingsFormGroup.REFRESH_INTERVAL_MAX)
        ]
      })
    });
  }
}
