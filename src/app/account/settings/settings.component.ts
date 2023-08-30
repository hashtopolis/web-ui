import { Component, OnInit } from '@angular/core';
import { dateFormat, serverlog, proxytype } from '../../core/_constants/settings.config';
import { FormControl, FormGroup } from '@angular/forms';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { isObservable } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  configForm: FormGroup


  constructor(    
    private uiService: UIConfigService,
    ) { }
  
  
  uidateformat:any;
  gsForm: FormGroup;
  dateFormat = dateFormat;
  
  
  ngOnInit(): void {
    this.uidateformat = this.uiService.getUIsettings('timefmt').value;

    this.configForm = new FormGroup({
      'timefmt': new FormControl(''),
    });
  }


  onChangeDate(value) {
    this.uidateformat = value;
  }

  onSubmit() {
    let uis = JSON.parse(localStorage.getItem('uis'))

    for (var i = 0; i < uis.length; i++) {
      if ("timefmt" === uis[i].name) {
        uis[i].value = this.uidateformat
      }
    }

    localStorage.setItem("uis", JSON.stringify(uis));

    console.log(uis);

    Swal.fire({
      title: "Good job!",
      text: "Settings have been updated!",
      icon: "success",
      showConfirmButton: false,
      timer: 1500
    });

  }

}
