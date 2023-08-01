import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { environment } from './../../../../environments/environment';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';


@Component({
  selector: 'app-new-notification',
  templateUrl: './new-notification.component.html'
})
@PageTitle(['New Notification'])
export class NewNotificationComponent implements OnInit {

  constructor(
    private gs: GlobalService,
  ) { }

  createForm: FormGroup;
  Allnotif: any;
  showagents: any;

  allowedActions = [
    '',
    'agentError',
    'deleteTask',
    'deleteHashlist',
    'deleteAgent',
    'hashlistAllCracked',
    'hashlistCrackedHash',
    'logWarn',
    'logFatal',
    'logError',
    'ownAgentError',
    'newAgent',
    'newTask',
    'newHashlist',
    'taskComplete',
    'userCreated',
    'userDeleted',
    'userLoginFailed'
  ];

  private maxResults = environment.config.prodApiMaxResults;

  ngOnInit(): void {

    const params = {'maxResults': this.maxResults};

    this.createForm = new FormGroup({
      'action': new FormControl('', [Validators.required]),
      'actionFilter': new FormControl('', [Validators.required]),
      'notification': new FormControl('', [Validators.required]),
      'receiver': new FormControl('', [Validators.required]),
      'isActive': new FormControl(true),
    });

    this.gs.getAll(SERV.AGENTS,params).subscribe((agents: any) => {
      this.showagents = agents.values;
    });

  }

  onSubmit(){
    if (this.createForm.valid) {

      this.gs.create(SERV.NOTIFICATIONS,this.createForm.value).subscribe(() => {
          Swal.fire({
            title: "Success!",
            text: "New Notification created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.ngOnInit();
        }
      );
    }
  }

}
