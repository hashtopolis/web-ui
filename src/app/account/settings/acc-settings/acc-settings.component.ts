import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { Router } from '@angular/router';
import { SERV } from '../../../core/_services/main.config';
import { Subscription } from 'rxjs';
import { passwordMatchValidator } from 'src/app/core/_validators/password.validator';
import { uiDatePipe } from 'src/app/core/_pipes/date.pipe';

@Component({
  selector: 'app-acc-settings',
  templateUrl: './acc-settings.component.html',
  providers: [uiDatePipe],
  standalone: false
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  static readonly PWD_MIN = 4;
  static readonly PWD_MAX = 12;

  pageTitle = 'Account Settings';
  pageSubtitlePassword = 'Password Update';

  /** Form group for main form. */
  form: FormGroup;
  passform: FormGroup;
  changepasswordFormGroup: FormGroup;

  /** On form update show a spinner loading */
  isUpdatingLoading = false;
  isUpdatingPassLoading = false;

  strongPassword = false;
  subscriptions: Subscription[] = [];

  constructor(
    private titleService: AutoTitleService,
    private datePipe: uiDatePipe,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.titleService.set(['Account Settings']);
  }

  /**
   * Initializes the form, loads user settings, and sets up initial data.
   */
  ngOnInit(): void {
    this.createForm();
    this.loadUserSettings();
    this.createUpdatePassForm();
    this.updatePassForm();
  }

  /**
   * Unsubscribes from all active subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
  /**
   * Creates and configures basic controls
   *
   * @param {string} name - Account type name.
   * @param {string} registeredSince - Account registration date.
   * @param {string} email - The user's email.
   */
  createForm(name = '', registeredSince = '', email = ''): void {
    this.form = new FormGroup({
      name: new FormControl({
        value: name,
        disabled: true
      }),
      registeredSince: new FormControl({
        value: registeredSince,
        disabled: true
      }),
      email: new FormControl(email, [Validators.required, Validators.email])
    });
  }

  createUpdatePassForm() {
    this.changepasswordFormGroup = new FormGroup({
      /* oldPassword: new FormControl('', Validators.required), */
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(AccountSettingsComponent.PWD_MIN),
        Validators.maxLength(AccountSettingsComponent.PWD_MAX)
      ]),
      confirmNewPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(AccountSettingsComponent.PWD_MIN),
        Validators.maxLength(AccountSettingsComponent.PWD_MAX)
      ])
    });
  }
  /*   get oldPasswordValueFromForm() {
    return this.changepasswordFormGroup.get('oldPassword').value;
  } */
  get newPasswordValueFromForm() {
    return this.changepasswordFormGroup.get('newPassword').value;
  }
  get confirmNewPasswordValueFromForm() {
    return this.changepasswordFormGroup.get('confirmNewPassword').value;
  }
  /**
   * Creates and password update
   *
   */
  updatePassForm() {
    // this.passform = new FormGroup(
    //   {
    //     oldpassword: new FormControl(''),
    //     newpassword: new FormControl('', [
    //       Validators.required,
    //       Validators.minLength(AccountSettingsComponent.PWD_MIN),
    //       Validators.maxLength(AccountSettingsComponent.PWD_MAX)
    //     ]),
    //     confirmpass: new FormControl('', [
    //       Validators.required,
    //       Validators.minLength(AccountSettingsComponent.PWD_MIN),
    //       Validators.maxLength(AccountSettingsComponent.PWD_MAX)
    //     ])
    //   },
    //   passwordMatchValidator
    // );
    this.passform = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(AccountSettingsComponent.PWD_MIN),
        Validators.maxLength(AccountSettingsComponent.PWD_MAX)
      ])
    });
  }

  /**
   * Handles form basic form submission
   */
  onSubmit() {
    if (this.form.valid) {
      this.isUpdatingLoading = true;
      this.subscriptions.push(
        this.gs.update(SERV.USERS, this.gs.userId, this.form.value).subscribe(() => {
          this.alert.okAlert('User saved!', '');
          this.isUpdatingLoading = false;
          this.router.navigate(['users/all-users']);
        })
      );
    }
  }

  /**
   * Handles password submission
   */
  onSubmitPass() {
    if (this.passform.valid) {
      this.isUpdatingPassLoading = true;
      const payload = {
        userId: this.gs.userId,
        password: this.passform.value['password']
      };
      console.log(payload);
      this.subscriptions.push(
        this.gs.chelper(SERV.HELPER, 'setUserPassword', payload).subscribe(() => {
          this.alert.okAlert('User password updated!', '');
          this.isUpdatingPassLoading = false;
          this.router.navigate(['users/all-users']);
        })
      );
    }
  }
  /**
   * Handles password submission
   */
  onSubmitUpdatePass() {
    console.log(this.changepasswordFormGroup.valid);
    if (this.changepasswordFormGroup.valid && this.newPasswordValueFromForm === this.confirmNewPasswordValueFromForm) {
      console.log('valid');
      this.isUpdatingPassLoading = true;
      const payload = {
        userId: this.gs.userId,
        password: this.newPasswordValueFromForm
      };
      this.subscriptions.push(
        this.gs.chelper(SERV.HELPER, 'setUserPassword', payload).subscribe(() => {
          this.alert.okAlert('User password updated!', '');
          this.isUpdatingPassLoading = false;
          this.router.navigate(['users/all-users']);
        })
      );
    } else {
      this.alert.okAlert('ERROR updating password', '');
      console.log('invalid');
    }
  }
  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  onPasswordMatchChanged(event: boolean) {
    this.strongPassword = event;
  }

  /**
   * Loads user settings from the server and populates the form with initial data.
   */
  private loadUserSettings() {
    this.subscriptions.push(
      this.gs.get(SERV.USERS, this.gs.userId, { include: ['globalPermissionGroup'] }).subscribe((result) => {
        this.createForm(
          result.globalPermissionGroup['name'],
          this.datePipe.transform(result['registeredSince']),
          result['email']
        );
      })
    );
  }
}
