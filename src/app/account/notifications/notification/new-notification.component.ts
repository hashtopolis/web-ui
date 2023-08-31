import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { ACTIONARRAY, ACTION, NOTIFARRAY } from '../../../core/_constants/notifications.config';
import { environment } from '../../../../environments/environment';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-notification',
  templateUrl: './new-notification.component.html'
})
@PageTitle(['New Notification'])
export class NewNotificationComponent implements OnInit {

  constructor(
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router:Router
  ) { }

  createForm: FormGroup;
  Allnotif: any;
  value: any;
  editView = false;
  active = true;

  allowedActions = ACTIONARRAY;

  notifications = NOTIFARRAY;

  private maxResults = environment.config.prodApiMaxResults;

  ngOnInit(): void {

    const qp = this.route.snapshot.queryParams;

    this.onSubscribe(qp['filter']);

    this.createForm = new FormGroup({
      'action': new FormControl('' || qp['filter']),
      'actionFilter': new FormControl(''),
      'notification': new FormControl('' || 'ChatBot'),
      'receiver': new FormControl(),
      'isActive': new FormControl(true),
    });

  }

  onSubscribe(filter: string){

    let path = this.checkPath(filter);

    const params = {'maxResults': this.maxResults};

    if(String(path) !== 'none'){
    this.active = true;
    this.gs.getAll(path,params).subscribe((res: any) => {
      const value = []
      for(let i=0; i < res.values.length; i++){
        if(path === SERV.AGENTS) {
          console.log(res.values.length)
          value.push({"id": res.values[i]['_id'], "name": res.values[i]['agentName']});
        }
        if(path === SERV.TASKS) {
          value.push({"id": res.values[i]['_id'], "name": res.values[i]['taskName']});
        }
        if(path === SERV.USERS || path === SERV.HASHLISTS ){
          value.push({"id": res.values[i]['_id'], "name": res.values[i]['name']});
        }
       }
      this.value = value;
    });
    }else{
      this.active = false;
    }

  }

  onQueryp(name: any){
    this.router.navigate(['/account/notifications/new-notification'], {queryParams: {filter: name}, queryParamsHandling: 'merge'});
    setTimeout(() => {
      this.ngOnInit();
    });
  }

  checkPath(filter: string){

    let path;
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

      case  ACTION.TASK_COMPLETE:
        path = SERV.TASKS;
      break;

      case ACTION.DELETE_TASK:
        path = SERV.TASKS;
      break;

      case ACTION.NEW_HASHLIST:
        path = 'none';
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
        path = 'none';
      break;

      case ACTION.LOG_FATAL:
        path = 'none';
      break;

      case ACTION.LOG_ERROR:
        path = 'none';
      break;

      default:
        path = 'none';

    }
    return path;
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
          this.router.navigate(['/account/notifications']);
        }
      );
    }
  }

}


