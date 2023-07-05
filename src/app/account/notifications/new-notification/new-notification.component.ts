import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { NotifService } from '../../../core/_services/users/notifications.service';
import { AgentsService } from 'src/app/core/_services/agents/agents.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-new-notification',
  templateUrl: './new-notification.component.html'
})
@PageTitle(['New Notification'])
export class NewNotificationComponent implements OnInit {
  // Loader
  isLoading = false;

  constructor(
    private agentsService: AgentsService,
    private notifService: NotifService
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

    let params = {'maxResults': this.maxResults};

    this.createForm = new FormGroup({
      'action': new FormControl('', [Validators.required]),
      'actionFilter': new FormControl('', [Validators.required]),
      'notification': new FormControl('', [Validators.required]),
      'receiver': new FormControl('', [Validators.required]),
      'isActive': new FormControl(true),
    });

    this.agentsService.getAgents(params).subscribe((agents: any) => {
      this.showagents = agents.values;
    });

  }

  onSubmit(){
    if (this.createForm.valid) {

      this.isLoading = true;

      this.notifService.createNotif(this.createForm.value).subscribe((hasht: any) => {
        const response = hasht;
        this.isLoading = false;
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
