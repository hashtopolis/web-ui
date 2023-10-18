import { CookieService } from '../../../core/_services/shared/cookies.service';
import { dateFormat } from '../../../core/_constants/settings.config';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { AlertService } from 'src/app/core/_services/shared/alert.service';

@Component({
  selector: 'app-ui-settings',
  templateUrl: './ui-settings.component.html'
})
export class UiSettingsComponent implements OnInit {

  dateFormat = dateFormat;
  uiForm: FormGroup;

  constructor(
    private cookieService: CookieService,
    private alert: AlertService
  ) { }


  ngOnInit(): void {

    this.uiForm = new FormGroup({
      'localtimefmt': new FormControl(),
    });

    this.initForm();

  }

  private initForm() {

    const localtimefmt = this.getCookieValue('localtimefmt');

    this.uiForm = new FormGroup({
      'localtimefmt': new FormControl(localtimefmt),
    });

  }

  setCookieValue(name: string, value: string){
    this.cookieService.setCookie(name, value, 365);
    this.alert.okAlert('UI Setting saved!','');
    this.ngOnInit();
  }

  getCookieValue(name: string){
    return this.cookieService.getCookie(name);
  }

}
