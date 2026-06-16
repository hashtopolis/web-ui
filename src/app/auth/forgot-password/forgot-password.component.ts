import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UIConfig } from '@models/config-ui.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { LocalStorageService } from '@services/storage/local-storage.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { emailValidator } from '@src/app/core/_validators/email.validator';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { HeaderConfig } from '@src/config/default/app/config.model';
import { environment } from '@src/environments/environment';

export interface ForgotPasswordForm {
  username: FormControl<string | null>;
  email: FormControl<string | null>;
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: false
})
export class ForgotPasswordComponent implements OnDestroy, AfterViewInit {
  private unsubscribeService = inject(UnsubscribeService);
  private storage = inject<LocalStorageService<UIConfig>>(LocalStorageService);
  private gs = inject(GlobalService);
  private alert = inject(AlertService);
  private router = inject(Router);
  private host = inject(ElementRef);

  forgotForm: FormGroup<ForgotPasswordForm>;

  protected uiSettings: UISettingsUtilityClass;
  headerConfig: HeaderConfig;
  isDarkMode = false;

  /** Shows a spinner on the submit button while the request is in flight. */
  isLoading = false;

  constructor() {
    this.headerConfig = environment.config.header;
    this.uiSettings = new UISettingsUtilityClass(this.storage);
    this.isDarkMode = this.uiSettings.getSetting('theme') === 'dark';
    this.buildForm();
  }

  /**
   * Focus the username field once the view is ready, mirroring the login page.
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      const input = this.host.nativeElement.querySelector(
        'input-text[formControlName="username"] input'
      ) as HTMLInputElement | null;
      input?.focus();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Builds the reactive form. Email is validated as an email address; both fields are required.
   */
  buildForm(): void {
    this.forgotForm = new FormGroup<ForgotPasswordForm>({
      username: new FormControl<string | null>('', [Validators.required]),
      email: new FormControl<string | null>('', [Validators.required, emailValidator])
    });
  }

  /**
   * Submits the password reset request. HTTP errors surface via the global
   * response interceptor, so we only manage the loading state here.
   */
  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      this.forgotForm.updateValueAndValidity();
      return;
    }

    const username = this.forgotForm.value.username ?? '';
    const email = this.forgotForm.value.email ?? '';

    this.isLoading = true;

    const resetSubscription$ = this.gs.chelper(SERV.HELPER, 'resetUserPassword', { username, email }).subscribe({
      next: () => {
        this.alert.showSuccessMessage('Password reset requested.');
        this.router.navigate(['/auth']);
      },
      error: () => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    this.unsubscribeService.add(resetSubscription$);
  }
}
