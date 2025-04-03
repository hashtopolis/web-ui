import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ACTION, ACTIONARRAY, NOTIFARRAY } from '../../../core/_constants/notifications.config';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../../core/_services/main.config';
import { Filter } from '../notifications.component';
import { ResponseWrapper } from '@models/response.model';
import { JsonAPISerializer } from '@services/api/serializer-service';
import { BaseModel } from '@models/base.model';
import { JAgent } from '@models/agent.model';
import { JTask } from '@models/task.model';
import { JHashlist } from '@models/hashlist.model';

@Component({
  selector: 'app-new-notification',
  templateUrl: './new-notification.component.html'
})
export class NewNotificationComponent implements OnInit, OnDestroy {
  static readonly SUBMITLABEL = 'Save Notification';
  static readonly SUBTITLE = 'Create Notification';

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  triggerAction: string;
  form: FormGroup;
  filters: Filter[];
  editView = false;
  active = false;
  allowedActions = ACTIONARRAY.map((action) => ({
    id: action,
    name: action
  }));
  maxResults: string | number;
  notifications = NOTIFARRAY.map((notif) => ({ id: notif, name: notif }));
  subscriptions: Subscription[] = [];
  submitLabel = NewNotificationComponent.SUBMITLABEL;
  subTitle = NewNotificationComponent.SUBTITLE;
  actionToServiceMap = {
    [ACTION.AGENT_ERROR]: SERV.AGENTS,
    [ACTION.OWN_AGENT_ERROR]: SERV.AGENTS,
    [ACTION.DELETE_AGENT]: SERV.AGENTS,
    [ACTION.NEW_TASK]: SERV.TASKS,
    [ACTION.TASK_COMPLETE]: SERV.TASKS,
    [ACTION.DELETE_TASK]: SERV.TASKS,
    [ACTION.NEW_HASHLIST]: null,
    [ACTION.DELETE_HASHLIST]: SERV.HASHLISTS,
    [ACTION.HASHLIST_ALL_CRACKED]: SERV.HASHLISTS,
    [ACTION.HASHLIST_CRACKED_HASH]: SERV.HASHLISTS,
    [ACTION.USER_CREATED]: SERV.USERS,
    [ACTION.USER_DELETED]: SERV.USERS,
    [ACTION.USER_LOGIN_FAILED]: SERV.USERS,
    [ACTION.LOG_WARN]: null,
    [ACTION.LOG_FATAL]: null,
    [ACTION.LOG_ERROR]: null
  };

  constructor(
    private titleService: AutoTitleService,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    titleService.set(['New Notification']);
  }

  /**
   * Initializes the form for creating a new notification.
   */
  ngOnInit(): void {
    this.createForm();
  }

  /**
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  /**
   * Creates the form for creating a new notification.
   * Initializes form controls with default values and validators.
   */
  createForm(): void {
    this.form = new FormGroup({
      action: new FormControl('', [Validators.required]),
      actionFilter: new FormControl(String('')),
      notification: new FormControl('' || 'ChatBot', [Validators.required]),
      receiver: new FormControl('', [Validators.required]),
      isActive: new FormControl(true)
    });

    //subscribe to changes to handle select trigger actions
    this.form.get('action').valueChanges.subscribe((newvalue) => {
      this.changeAction(newvalue);
    });
  }

  /**
   * Handles the change of action for creating a new notification.
   * Updates the available filters based on the selected action.
   *
   * @param {string} action - The selected action.
   */
  changeAction(action: string): void {
    const path = this.actionToServiceMap[action];
    if (path) {
      this.active = true;

      this.subscriptions.push(
        this.gs.getAll(path).subscribe((response: ResponseWrapper) => {
          const resource = new JsonAPISerializer().deserialize<BaseModel[]>({
            data: response.data,
            included: response.included
          });
          const _filters: Filter[] = [];
          for (let i = 0; i < resource.length; i++) {
            if (path === SERV.AGENTS) {
              const agent = resource[i] as JAgent;
              _filters.push({
                id: agent.id,
                name: agent.agentName
              });
            }
            if (path === SERV.TASKS) {
              const task = resource[i] as JTask;
              _filters.push({
                id: task.id,
                name: task.taskName
              });
            }
            if (path === SERV.USERS || path === SERV.HASHLISTS) {
              const hashlist = resource[i] as JHashlist;
              _filters.push({
                id: hashlist.id,
                name: hashlist.name
              });
            }
          }
          this.filters = _filters;
        })
      );
    } else {
      this.active = false;
    }
  }

  /**
   * Checks if the form for creating a new notification is valid.
   *
   * @returns {boolean} True if the form is valid; otherwise, false.
   */
  formIsValid(): boolean {
    return this.form.valid;
  }

  /**
   * Submits the form to create a new notification.
   * Sends a request to the server and navigates on success.
   */
  onSubmit(): void {
    this.form.patchValue({
      actionFilter: String(this.form.get('actionFilter').value)
    });
    if (this.form.valid) {
      this.isCreatingLoading = true;
      this.subscriptions.push(
        this.gs.create(SERV.NOTIFICATIONS.URL, this.form.value, SERV.NOTIFICATIONS.RESOURCE).subscribe(() => {
          this.alert.okAlert('New Notification created!', '');
          this.isCreatingLoading = false;
          this.router.navigate(['/account/notifications']);
        })
      );
    }
  }
}
