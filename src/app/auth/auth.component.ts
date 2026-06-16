import { AfterViewInit, Component, ElementRef, OnInit, inject } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import { UIConfig } from '@models/config-ui.model';

import { AuthService } from '@services/access/auth.service';
import { ConfigService } from '@services/shared/config.service';
import { LocalStorageService } from '@services/storage/local-storage.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { HeaderConfig } from '@src/config/default/app/config.model';
import { environment } from '@src/environments/environment';

export interface LoginForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: false
})
export class AuthComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribeService = inject(UnsubscribeService);
  private storage = inject<LocalStorageService<UIConfig>>(LocalStorageService);
  private configService = inject(ConfigService);
  private authService = inject(AuthService);
  private host = inject(ElementRef);

  /** Form group for the new SuperHashlist. */
  loginForm: FormGroup<LoginForm>;

  protected uiSettings: UISettingsUtilityClass;
  public isVisible = true;
  headerConfig: HeaderConfig;
  isDarkMode = false;

  /** on loggin loading */
  isLoading = false;

  constructor() {
    this.headerConfig = environment.config.header;
    this.uiSettings = new UISettingsUtilityClass(this.storage);
    this.isDarkMode = this.uiSettings.getSetting('theme') === 'dark';
    this.buildForm();
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.setupConfig();
    this.configService.getEndpoint();
  }

  /**
   * Lifecycle hook called after the component's view has been fully initialized.
   * Sets focus to the username input field for better user experience.
   * Uses a timeout to ensure that the view is fully rendered before trying to access the input element.
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      const input = this.host.nativeElement.querySelector(
        'input-text[formControlName="username"] input'
      ) as HTMLInputElement | null;
      input?.focus();
    });
  }

  private setupConfig(): void {
    this.configService.getEndpoint();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Builds the form for Logging an user in
   */
  buildForm(): void {
    this.loginForm = new FormGroup<LoginForm>({
      username: new FormControl<string | null>(null, [Validators.required, Validators.minLength(2)]),
      password: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3)])
    });
  }

  /**
   * Handle login, when user submits the login form.
   */
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginForm.updateValueAndValidity();
      return;
    }
    const username = this.loginForm.value.username ?? '';
    const password = this.loginForm.value.password ?? '';

    this.isLoading = true; // Show spinner

    const authObs = this.authService.logIn(username, password);

    const authSubscription$ = authObs.subscribe({
      next: () => {
        this.loginForm.reset();
      },
      error: () => {
        // The global HTTP response interceptor already surfaces the error to the
        // user (modal dialog), so we only need to stop the loading spinner here.
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false; // Hide spinner after attempting to log in
      }
    });

    this.unsubscribeService.add(authSubscription$);
  }
}
