import { firstValueFrom } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
import { AgentRoleService } from '@services/roles/agents/agent-role.service';
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
  selectUserAgps: SelectOption[] = [];

  /** Assign Tasks */
  assignTasks: SelectOption[] = [];
  assignNew = false;
  assignId: number | null = null;

  // Edit Index
  editedAgentIndex: number;
  showagent: JAgent;

  // Calculations
  timespent = 0;
  getchunks: JChunk[] = [];

  currentAssignment: JAgentAssignment | null = null;
  public ASC = ASC;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private uiService: UIConfigService, // eslint-disable-line @typescript-eslint/no-unused-vars
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer,
    protected agentRoleService: AgentRoleService
  ) {
    this.onInitialize();
    this.buildEmptyForms();
    this.titleService.set(['Edit Agent']);
  }

  /**
   * Initializes the component by extracting and setting the agent ID.
   * If the id is missing or invalid, redirect to 404.
   */
  private onInitialize(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.editedAgentIndex = idParam ? +idParam : NaN;

    if (!this.editedAgentIndex || Number.isNaN(this.editedAgentIndex)) {
      this.router.navigate(['/not-found']);
    }
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  async ngOnInit(): Promise<void> {
    if (!this.editedAgentIndex || Number.isNaN(this.editedAgentIndex)) {
      return;
    }

    try {
      await this.loadAgent();
      this.loadSelectTasks();
      this.loadSelectUsers();

      if (this.agentRoleService.hasRole('readChunk')) {
        this.assignChunksInit(this.editedAgentIndex);
      }

      this.initForm();
    } catch (error) {
      this.handleLoadError(error);
      return;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Centralized handler for 404 / 403 / other load errors.
   */
  private handleLoadError(error: unknown): void {
    const httpError = error as HttpErrorResponse;
    const status = httpError?.status;

    if (status === 404) {
      this.router.navigate(['/not-found']);
    } else if (status === 403) {
      // ajusta la ruta si en tu app es distinta (por ejemplo '/forbidden')
      this.router.navigate(['/forbidden']);
    } else {
      this.alert.showErrorMessage('Error loading agent details');
    }
  }

  /**
   * Builds the empty forms for editing an agent and updating its assignment to a task
   * @private
   */
  private buildEmptyForms(): void {
    this.updateForm = getEditAgentForm(!this.agentRoleService.hasRole('update'));
    this.updateAssignForm = getUpdateAssignmentForm(!this.agentRoleService.hasRole('updateAssignment'));
  }

  /**
   * Load agent including its agentStats and accessGroups from server to draw stat graphs
   * @private
   */
  private async loadAgent(): Promise<void> {
    const includes = ['agentStats', 'accessGroups'];

    if (this.agentRoleService.hasRole('readAssignment')) {
      includes.push('assignments');
    }
    try {
      const response = await firstValueFrom<ResponseWrapper>(
        this.gs.get(SERV.AGENTS, this.editedAgentIndex, {
          include: includes
        })
      );

      const responseBody = { data: response.data, included: response.included };
      const agent = this.serializer.deserialize<JAgent>(responseBody);
      this.showagent = agent;
      this.selectUserAgps = transformSelectOptions(agent.accessGroups, ACCESS_GROUP_FIELD_MAPPING);
      if (this.agentRoleService.hasRole('readAssignment')) {
        if (agent.assignments.length) {
          const firstAssignment = agent.assignments[0];
          this.assignNew = !!firstAssignment.taskId;
          this.assignId = firstAssignment.id;
          this.currentAssignment = firstAssignment;
        } else {
          this.currentAssignment = null;
          this.assignId = null;
          this.assignNew = false;
        }
      }
    } catch (err) {
      const httpErr = err as HttpErrorResponse;

      // If the server fails while resolving included relations (500+),
      // try once more without the `include` params so the primary resource can still load.
      if (httpErr?.status && httpErr.status >= 500) {
        const response = await firstValueFrom<ResponseWrapper>(this.gs.get(SERV.AGENTS, this.editedAgentIndex));

        const responseBody = { data: response.data, included: response.included };
        const agent = this.serializer.deserialize<JAgent>(responseBody);
        this.showagent = agent;
        this.selectUserAgps = transformSelectOptions(agent.accessGroups, ACCESS_GROUP_FIELD_MAPPING);
        return;
      }

      // Non-500 errors are rethrown and will be handled by the caller
      throw err;
    }
  }

  /**
   * Load assignable task for the select element (All tasks not yet completed and not running)
   * @private
   */
  private loadSelectTasks(): void {
    if (!this.agentRoleService.hasRole('readAssignment')) {
      return;
    }

    const requestParams = new RequestParamBuilder()
      .addFilter({ field: 'isArchived', operator: FilterType.EQUAL, value: false })
      .create();

    const loadTasksSubscription$ = this.gs.getAll(SERV.TASKS, requestParams).subscribe((response: ResponseWrapper) => {
      const responseBody = { data: response.data, included: response.included };
      const tasks = this.serializer.deserialize<JTask[]>(responseBody);

      // Remove completed tasks
      const filterTasks = tasks.filter((u) => u.keyspaceProgress < u.keyspace || Number(u.keyspaceProgress) === 0);
      this.assignTasks = transformSelectOptions(filterTasks, TASKS_FIELD_MAPPING);
    });

    this.unsubscribeService.add(loadTasksSubscription$);
  }

  /**
   * Load all users for the select element
   * @private
   */
  private loadSelectUsers(): void {
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
   * Initializes the forms with data retrieved from the server.
   * @private
   */
  private initForm(): void {
    if (!this.showagent) {
      return;
    }

    this.updateForm.setValue({
      isActive: this.showagent.isActive,
      userId: this.showagent.userId,
      agentName: this.showagent.agentName,
      cpuOnly: this.showagent.cpuOnly,
      cmdPars: this.showagent.cmdPars,
      ignoreErrors: this.showagent.ignoreErrors,
      isTrusted: this.showagent.isTrusted
    });

    if (this.currentAssignment) {
      this.updateAssignForm.setValue({
        taskId: this.currentAssignment.taskId
      });
    } else {
      this.updateAssignForm.reset({
        taskId: null
      });
    }
  }

  /**
   * Calculates the total time spent based on an array of chunks.
   * @param chunks - An array of chunks containing solveTime and dispatchTime properties.
   */
  timeCalc(chunks: JChunk[]): void {
    const tspent = chunks.map((chunk) => Math.max(chunk.solveTime, chunk.dispatchTime) - chunk.dispatchTime);
    this.timespent = tspent.reduce((a, i) => a + i, 0);
  }

  /**
   * Initializes the assignment chunks for the specified agent ID.
   * @param  agentID - The ID of the agent.
   */
  assignChunksInit(agentID: number): void {
    const chunkRequestParams = new RequestParamBuilder()
      .addFilter({ field: 'agentId', operator: FilterType.EQUAL, value: agentID })
      .create();

    const chunksSub$ = this.gs.getAll(SERV.CHUNKS, chunkRequestParams).subscribe((response: ResponseWrapper) => {
      const chunksBody = { data: response.data, included: response.included };
      const chunks = this.serializer.deserialize<JChunk[]>(chunksBody);

      const tasksSub$ = this.gs.getAll(SERV.TASKS).subscribe((tasksResponse: ResponseWrapper) => {
        const tasksBody = { data: tasksResponse.data, included: tasksResponse.included };
        const tasks = this.serializer.deserialize<JTask[]>(tasksBody);

        this.getchunks = chunks.map((chunk) => {
          const matchedTask = tasks.find((task) => task.id === chunk.taskId);
          if (matchedTask) {
            chunk.taskName = matchedTask.taskName;
          }
          return chunk;
        });

        if (this.getchunks.length) {
          this.timeCalc(this.getchunks);
        }
      });

      this.unsubscribeService.add(tasksSub$);
    });

    this.unsubscribeService.add(chunksSub$);
  }

  /**
   * Handles the form submission for updating an agent.
   */
  onSubmit(): void {
    if (this.updateForm.invalid) {
      return;
    }

    if (this.updateAssignForm.valid && this.updateAssignForm.value.taskId !== this.currentAssignment?.taskId) {
      this.onUpdateAssign(this.updateAssignForm.value.taskId);
    }

    this.isUpdatingLoading = true;

    const onSubmitSubscription$ = this.gs.update(SERV.AGENTS, this.editedAgentIndex, this.updateForm.value).subscribe({
      next: () => {
        this.alert.showSuccessMessage('Agent saved');
        this.isUpdatingLoading = false;
        this.router.navigate(['agents/show-agents']);
      },
      error: () => {
        this.isUpdatingLoading = false;
        this.alert.showErrorMessage('Error updating agent');
      }
    });

    this.unsubscribeService.add(onSubmitSubscription$);
  }

  /**
   * Updates agent assignment based on the provided value.
   * Assigns the agent to the provided taskID or removes a current assignment
   * @param taskId The task ID.
   */
  onUpdateAssign(taskId: number | null): void {
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
  renderDevices(devices: string): string {
    const deviceList = devices.split('\n').filter((d) => !!d.trim());
    const deviceCountMap: { [key: string]: number } = {};

    deviceList.forEach((device) => {
      deviceCountMap[device] = (deviceCountMap[device] || 0) + 1;
    });

    return Object.keys(deviceCountMap)
      .map((device) => `${deviceCountMap[device]} x ${device}`)
      .join('<br>');
  }
}
