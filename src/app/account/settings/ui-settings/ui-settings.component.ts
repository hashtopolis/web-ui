import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/core/_services/storage/local-storage.service';
import { UIConfig } from 'src/app/core/_models/config-ui.model';
import {
  Setting,
  dateFormats,
  layouts,
  themes
} from 'src/app/core/_constants/settings.config';
import { UISettingsUtilityClass } from 'src/app/shared/utils/config';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ui-settings',
  templateUrl: './ui-settings.component.html'
})
export class UiSettingsComponent implements OnInit {
  form!: FormGroup;
  util: UISettingsUtilityClass;

  pageTitle = 'UI Settings';

  /** On form update show a spinner loading */
  isUpdatingLoading = false;

  formats: Setting[] = dateFormats;
  layouts: Setting[] = layouts;
  themes: Setting[] = themes;

  constructor(
    private service: LocalStorageService<UIConfig>,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.util = new UISettingsUtilityClass(this.service);
    this.updateForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      timefmt: new FormControl(''),
      layout: new FormControl(''),
      theme: new FormControl('')
    });
  }

  private updateForm(): void {
    this.form.patchValue({
      timefmt: this.util.uiConfig.timefmt,
      layout: this.util.uiConfig.layout,
      theme: this.util.uiConfig.theme
    });
  }

  onSubmit(): void {
    this.isUpdatingLoading = true;
    setTimeout(() => {
      window.location.reload();
    }, 800);

    const changedValues = this.util.updateSettings(this.form.value);
    const message =
      changedValues > 0 ? 'Reloading settings ...' : 'No changes were saved';

    this.snackBar.open(message, 'Close');
    this.isUpdatingLoading = false;
  }
}
