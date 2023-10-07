import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { ACTIONARRAY, ACTION, NOTIFARRAY } from '../../../core/_constants/notifications.config';
import { environment } from '../../../../environments/environment';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../../core/_services/main.config';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

@Component({
  selector: 'app-new-notification',
  templateUrl: './new-notification.component.html'
})
export class NewNotificationComponent implements OnInit, OnDestroy {

  triggerAction: string;
  form: FormGroup;
  value: any;
  editView = false;
  active = false;
  allowedActions = ACTIONARRAY;
  notifications = NOTIFARRAY;
  subscriptions: Subscription[] = []
  submitLabel = 'Save Notification'
  subTitle = 'Create Notification'

  maxResults = environment.config.prodApiMaxResults;

  constructor(
    private gs: GlobalService,
    private titleService: AutoTitleService,
    private router: Router
  ) {
    titleService.set(['New Notification'])
  }

  ngOnInit(): void {
    this.createForm()
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe()
    }
  }

  createForm(): void {
    this.form = new FormGroup({
      'action': new FormControl('', [Validators.required]),
      'actionFilter': new FormControl(''),
      'notification': new FormControl('' || 'ChatBot', [Validators.required]),
      'receiver': new FormControl('', [Validators.required]),
      'isActive': new FormControl(true),
    });
  }

  changeAction(action: string): void {
    if (action) {
      const path = this.checkPath(action);
      if (path) {
        const params = { 'maxResults': this.maxResults };

        this.active = true;

        this.subscriptions.push(this.gs.getAll(path, params).subscribe((res: any) => {
          const value = []
          for (let i = 0; i < res.values.length; i++) {
            if (path === SERV.AGENTS) {
              value.push({ "id": res.values[i]['_id'], "name": res.values[i]['agentName'] });
            }
            if (path === SERV.TASKS) {
              value.push({ "id": res.values[i]['_id'], "name": res.values[i]['taskName'] });
            }
            if (path === SERV.USERS || path === SERV.HASHLISTS) {
              value.push({ "id": res.values[i]['_id'], "name": res.values[i]['name'] });
            }
          }
          this.value = value;
        }));
      } else {
        this.active = false;
      }
    } else {
      this.active = false;
    }

  }


  formIsValid(): boolean {
    return this.form.valid
  }

  checkPath(filter: string) {
    let path: string;

    switch (filter) {
      case ACTION.AGENT_ERROR:
        path = SERV.AGENTS;
        break;

      case ACTION.OWN_AGENT_ERROR:
        path = SERV.AGENTS;
        break;

      case ACTION.DELETE_AGENT:
        path = SERV.AGENTS;
        break;

      case ACTION.NEW_TASK:
        path = SERV.TASKS;
        break;

      case ACTION.TASK_COMPLETE:
        path = SERV.TASKS;
        break;

      case ACTION.DELETE_TASK:
        path = SERV.TASKS;
        break;

      case ACTION.NEW_HASHLIST:
        break;

      case ACTION.DELETE_HASHLIST:
        path = SERV.HASHLISTS;
        break;

      case ACTION.HASHLIST_ALL_CRACKED:
        path = SERV.HASHLISTS;
        break;

      case ACTION.HASHLIST_CRACKED_HASH:
        path = SERV.HASHLISTS;
        break;

      case ACTION.USER_CREATED:
        path = SERV.USERS;
        break;

      case ACTION.USER_DELETED:
        path = SERV.USERS;
        break;

      case ACTION.USER_LOGIN_FAILED:
        path = SERV.USERS;
        break;

      case ACTION.LOG_WARN:
        break;

      case ACTION.LOG_FATAL:
        break;

      case ACTION.LOG_ERROR:
        break;

    }
    return path;
  }

  onSubmit() {
    if (this.form.valid) {
      this.subscriptions.push(this.gs.create(SERV.NOTIFICATIONS, this.form.value).subscribe(() => {
        Swal.fire({
          position: 'top-end',
          backdrop: false,
          icon: 'success',
          title: "Success!",
          text: "New Notification created!",
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/account/notifications']);
      }));
    }
  }
}