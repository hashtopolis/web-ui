import { firstValueFrom } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JAgentAssignment } from '@models/agent-assignment.model';
import { JAgent } from '@models/agent.model';
import { JChunk } from '@models/chunk.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';
import { JUser } from '@models/user.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UIConfigService } from '@services/shared/storage.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import {
  EditAgentForm,
  UpdateAssignmentForm,
  getEditAgentForm,
  getUpdateAssignmentForm
} from '@src/app/agents/edit-agent/edit-agent.form';
import { ASC, IGNORE_ERROR_CHOICES } from '@src/app/core/_constants/agentsc.config';
import {
  ACCESS_GROUP_FIELD_MAPPING,
  DEFAULT_FIELD_MAPPING,
  TASKS_FIELD_MAPPING
} from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

@Component({
  selector: 'app-edit-agent',
  templateUrl: './edit-agent.component.html',
  standalone: false
})
export class EditAgentComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for main form and assign agent. */
  updateForm: FormGroup<EditAgentForm>;
  updateAssignForm: FormGroup<UpdateAssignmentForm>;

  /** On form update show a spinner loading */
  isUpdatingLoading = false;

  /** Select Options. */
  selectUsers: SelectOption[] = [];
  selectIgnorerrors = IGNORE_ERROR_CHOICES;
  selectUserAgps: SelectOption[];

  /** Assign Tasks */
  assignTasks: SelectOption[];
  assignNew: boolean;
  assignId: number;

  // Edit Index
  editedAgentIndex: number;
  showagent: JAgent;

  // Calculations
  timespent: number;
  getchunks: JChunk[];

  currentAssignment: JAgentAssignment;
  public ASC = ASC;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private uiService: UIConfigService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer
  ) {
    this.onInitialize();
    this.buildEmptyForms();
    this.titleService.set(['Edit Agent']);
  }

  /**
   * Initializes the component by extracting and setting the agent ID,
   */
  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedAgentIndex = +params['id'];
      this.ngOnInit();
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  async ngOnInit() {
    await this.loadAgent();
    await this.loadCurrentAssignment();
    this.loadSelectTasks();
    this.loadSelectUsers();
    this.assignChunksInit(this.editedAgentIndex);
    this.initForm();
  }
  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Builds the empty forms for editing an agent and updating its assignment to a task
   * @private
   */
  private buildEmptyForms(): void {
    this.updateForm = getEditAgentForm();
    this.updateAssignForm = getUpdateAssignmentForm();
  }

  /**
   * Load agent including its agentStats and accessGroups from server to draw stat graphs
   * @private
   */
  private async loadAgent() {
    const response = await firstValueFrom<ResponseWrapper>(
      this.gs.get(SERV.AGENTS, this.editedAgentIndex, {
        include: ['agentStats', 'accessGroups']
      })
    );
    const responseBody = { data: response.data, included: response.included };
    const agent = this.serializer.deserialize<JAgent>(responseBody);
    this.showagent = agent;
    this.selectUserAgps = transformSelectOptions(agent.accessGroups, ACCESS_GROUP_FIELD_MAPPING);
  }

  /**
   * Load assignable task for the select element (All tasks not yet completed and not running)
   * @private
   */
  private loadSelectTasks(): void {
    const requestParams = new RequestParamBuilder()
      .addFilter({ field: 'isArchived', operator: FilterType.EQUAL, value: false })
      .create();
    const loadTasksSubscription$ = this.gs.getAll(SERV.TASKS, requestParams).subscribe((response: ResponseWrapper) => {
      const responseBody = { data: response.data, included: response.included };
      const tasks = this.serializer.deserialize<JTask[]>(responseBody);

      const filterTasks = tasks.filter((u) => u.keyspaceProgress < u.keyspace || Number(u.keyspaceProgress) === 0); //Remove completed tasks
      this.assignTasks = transformSelectOptions(filterTasks, TASKS_FIELD_MAPPING);
    });
    this.unsubscribeService.add(loadTasksSubscription$);
  }

  /**
   * Load all users for the select element
   * @private
   */
  private loadSelectUsers() {
    const loadUsersSubscription$ = this.gs.getAll(SERV.USERS).subscribe((response: ResponseWrapper) => {
      const responseBody = { data: response.data, included: response.included };
      this.selectUsers = transformSelectOptions(
        this.serializer.deserialize<JUser[]>(responseBody),
        DEFAULT_FIELD_MAPPING
      );
    });
    this.unsubscribeService.add(loadUsersSubscription$);
  }

  /**
   * Loads assignment from server
   * @private
   */
  private async loadCurrentAssignment() {
    const requestParams = new RequestParamBuilder()
      .addFilter({
        field: 'agentId',
        operator: FilterType.EQUAL,
        value: this.editedAgentIndex
      })
      .create();
    const response = await firstValueFrom<ResponseWrapper>(this.gs.getAll(SERV.AGENT_ASSIGN, requestParams));
    const assignments = this.serializer.deserialize<JAgentAssignment[]>({
      data: response.data,
      included: response.included
    });
    if (assignments.length) {
      this.assignNew = !!assignments?.[0]['taskId'];
      this.assignId = assignments?.[0]['id'];
      this.currentAssignment = assignments?.[0];
    }
  }

  /**
   * Initializes the forms with data retrieved from the server.
   * @private
   */
  private initForm() {
    this.updateForm.setValue({
      isActive: this.showagent.isActive,
      userId: this.showagent.userId,
      agentName: this.showagent.agentName,
      token: this.showagent.token,
      cpuOnly: this.showagent.cpuOnly,
      cmdPars: this.showagent.cmdPars,
      ignoreErrors: this.showagent.ignoreErrors,
      isTrusted: this.showagent.isTrusted
    });
    if (this.currentAssignment) {
      this.updateAssignForm.setValue({
        taskId: this.currentAssignment.taskId
      });
    }
  }

  /**
   * Calculates the total time spent based on an array of chunks.
   * @param chunks - An array of chunks containing solveTime and dispatchTime properties.
   */
  timeCalc(chunks: JChunk[]) {
    const tspent = [];
    for (let i = 0; i < chunks.length; i++) {
      tspent.push(Math.max(chunks[i].solveTime, chunks[i].dispatchTime) - chunks[i].dispatchTime);
    }
    this.timespent = tspent.reduce((a, i) => a + i);
  }

  /**
   * Initializes the assignment chunks for the specified agent ID.
   * @param  agentID - The ID of the agent.
   */
  assignChunksInit(agentID: number): void {
    // Retrieve chunks associated with the agent
    const chunkRequestParams = new RequestParamBuilder()
      .addFilter({ field: 'agentId', operator: FilterType.EQUAL, value: agentID })
      .create();
    this.gs.getAll(SERV.CHUNKS, chunkRequestParams).subscribe((response: ResponseWrapper) => {
      const responseBody = { data: response.data, included: response.included };
      const chunks = this.serializer.deserialize<JChunk[]>(responseBody);

      // Retrieve tasks information
      this.gs.getAll(SERV.TASKS).subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const tasks = this.serializer.deserialize<JTask[]>(responseBody);

        // Assign taskName of tasks associated with the chunks
        this.getchunks = chunks.map((chunk) => {
          const matchedTask = tasks.find((task) => task.id === chunk.taskId);
          if (matchedTask) {
            chunk.taskName = matchedTask.taskName;
          }
          return chunk;
        });

        // Calculate and update timespent
        if (this.getchunks.length) {
          this.timeCalc(this.getchunks);
        }
      });
    });
  }

  /**
   * Handles the form submission for updating an agent.
   */
  onSubmit() {
    if (this.updateForm.valid) {
      if (this.updateAssignForm.valid) {
        this.onUpdateAssign(this.updateAssignForm.value.taskId);
      }
      this.isUpdatingLoading = true;
      const onSubmitSubscription$ = this.gs
        .update(SERV.AGENTS, this.editedAgentIndex, this.updateForm.value)
        .subscribe(() => {
          this.alert.showSuccessMessage('Agent saved');
          this.isUpdatingLoading = false;
          this.router.navigate(['agents/show-agents']);
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }

  /**
   * Updates agent assignment based on the provided value.
   * Assigns the agent to the provided taskID or removes a current assignment
   * @param taskId The task ID.
   */
  onUpdateAssign(taskId: number): void {
    let request$;

    if (taskId) {
      const payload = {
        taskId,
        agentId: this.editedAgentIndex
      };
      request$ = this.gs.create(SERV.AGENT_ASSIGN, payload);
    } else if (this.assignId) {
      request$ = this.gs.delete(SERV.AGENT_ASSIGN, this.assignId);
    }

    if (request$) {
      const subscription = request$.subscribe();
      this.unsubscribeService.add(subscription);
    }
  }

  // Render devices using count by device type
  renderDevices(devices: string) {
    const deviceList = devices.split('\n');
    const deviceCountMap: { [key: string]: number } = {};

    // Count occurrences of each device
    deviceList.forEach((device) => {
      if (deviceCountMap[device]) {
        deviceCountMap[device]++;
      } else {
        deviceCountMap[device] = 1;
      }
    });

    // Format with HTML line breaks and return the formatted devices as string
    return Object.keys(deviceCountMap)
      .map((device) => `${deviceCountMap[device]} x ${device}`)
      .join('<br>');
  }
}
