import { Subscription, finalize, firstValueFrom } from 'rxjs';

import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { JAgentAssignment } from '@models/agent-assignment.model';
import { JAgent } from '@models/agent.model';
import { JCrackerBinary } from '@models/cracker-binary.model';
import { JHashlist } from '@models/hashlist.model';
import { JHashtype } from '@models/hashtype.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { SpeedStat } from '@models/speed-stat.model';
import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { TasksRoleService } from '@services/roles/tasks/tasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { ConfigService } from '@services/shared/config.service';

import { TasksAgentsTableComponent } from '@components/tables/tasks-agents-table/tasks-agents-table.component';
import { TasksChunksTableComponent } from '@components/tables/tasks-chunks-table/tasks-chunks-table.component';

import { AGENT_MAPPING } from '@src/app/core/_constants/select.config';
import { FileSizePipe } from '@src/app/core/_pipes/file-size.pipe';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

@Component({
  selector: 'app-edit-tasks',
  templateUrl: './edit-tasks.component.html',
  providers: [FileSizePipe],
  standalone: false
})
export class EditTasksComponent implements OnInit, OnDestroy {
  editMode = false;
  editedTaskIndex: number;
  taskWrapperId: number;
  originalValue: JTask;

  updateForm: FormGroup;
  createForm: FormGroup; // Assign Agent
  /** On form update show a spinner loading */
  isUpdatingLoading = false;

  // loading gate to avoid painting the screen before data is ready
  isLoading = true;

  color = '';
  tusepreprocessor: number;
  hashlistDescrip: string;
  hashlistinform: JHashlist | undefined;
  availAgents: JAgent[] = [];
  selectAgents: SelectOption[] = [];
  isLoadingAgents = false;
  crackerinfo: JCrackerBinary | undefined;
  tkeyspace: number;

  @ViewChild('assignedAgentsTable') agentsTable: TasksAgentsTableComponent;
  @ViewChild(TasksChunksTableComponent) chunkTable!: TasksChunksTableComponent;

  // Time calculation
  cprogress: number; // Keyspace searched
  ctimespent: number; // Time Spent
  estimatedTime: number; // Estimated time till task is finished
  searched: string;

  chunkview: number;
  isactive = 0;
  currenspeed = 0;

  isReadOnly = false;

  taskProgressImageUrl: SafeUrl | null = null;
  private rawTaskProgressObjectUrl: string | null = null;

  private routeSub: Subscription | undefined;
  private httpNoInterceptors: HttpClient;

  constructor(
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer,
    private confirmDialog: ConfirmDialogService,
    protected roleService: TasksRoleService,
    private cs: ConfigService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    httpBackend: HttpBackend
  ) {
    this.titleService.set(['Edit Task']);
    this.httpNoInterceptors = new HttpClient(httpBackend);
  }

  async ngOnInit(): Promise<void> {
    this.isReadOnly = !this.roleService.hasRole('edit');

    this.editedTaskIndex = +this.route.snapshot.params['id'];
    this.editMode = Number.isFinite(this.editedTaskIndex);

    this.buildForm();

    try {
      const task = await this.loadTask();

      this.originalValue = task;
      this.searched = task.searched;
      this.color = task.color;
      this.crackerinfo = task.crackerBinary;
      this.taskWrapperId = task.taskWrapperId;
      this.tkeyspace = task.keyspace;
      this.tusepreprocessor = task.preprocessorId;

      if (this.roleService.hasRole('editTaskAgents') && this.roleService.hasRole('editTaskAssignAgents')) {
        this.assingAgentInit(task.assignedAgents.map((entry) => entry.id));
      }

      if (this.roleService.hasRole('editTaskSpeed')) {
        this.getTaskSpeeds(task.assignedAgents.length);
      }

      if (task.hashlist && this.roleService.hasRole('editTaskInfoHashlist')) {
        this.hashlistinform = task.hashlist;
        this.gs.get(SERV.HASHTYPES, task.hashlist.hashTypeId).subscribe((response: ResponseWrapper) => {
          const hashtype = this.serializer.deserialize<JHashtype>({ data: response.data, included: response.included });
          this.hashlistDescrip = hashtype.description;
        });
      }

      this.updateForm.setValue({
        taskId: task.id,
        forcePipe: task.forcePipe === true ? 'Yes' : 'No',
        skipKeyspace: task.skipKeyspace > 0 ? task.skipKeyspace : 'N/A',
        keyspace: task.keyspace,
        keyspaceProgress: task.keyspaceProgress,
        crackerBinaryId: task.crackerBinaryId,
        chunkSize: task.chunkSize,
        updateData: {
          taskName: task.taskName,
          attackCmd: task.attackCmd,
          notes: task.notes,
          color: task.color,
          chunkTime: Number(task.chunkTime),
          statusTimer: task.statusTimer,
          priority: task.priority,
          maxAgents: task.maxAgents,
          isCpuTask: task.isCpuTask,
          isSmall: task.isSmall
        }
      });

      this.assignChunksInit();

      if (this.editedTaskIndex && this.roleService.hasRole('editTaskChunks')) {
        this.loadTaskProgressImage();
      }

      this.isLoading = false;
    } catch (e: unknown) {
      const status = e instanceof HttpErrorResponse ? e.status : undefined;
      if (status === 403) {
        this.router.navigateByUrl('/forbidden');
        return;
      }
      // Only navigate to not-found when the backend explicitly returns 404.
      // For other server errors (500 etc.) show an error message so the
      // user knows something went wrong on the server instead of silently
      // redirecting to the 404 page.
      if (status === 404) {
        this.router.navigateByUrl('/not-found');
        return;
      }

      // Log and show a user-friendly error for unexpected server errors
      // (500, 502, etc.). Keep the loading flag disabled so the UI can
      // present an appropriate state.
      // eslint-disable-next-line no-console
      console.error('Error loading task:', e);
      const msg = status ? `Error loading task (server returned ${status}).` : 'Error loading task.';
      this.alertService.showErrorMessage(msg);
      this.isLoading = false;
      return;
    }
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();

    if (this.rawTaskProgressObjectUrl) {
      URL.revokeObjectURL(this.rawTaskProgressObjectUrl);
      this.rawTaskProgressObjectUrl = null;
    }
  }

  private buildForm(): void {
    this.updateForm = new FormGroup({
      taskId: new FormControl({ value: '', disabled: true }),
      forcePipe: new FormControl({ value: '', disabled: true }),
      skipKeyspace: new FormControl({ value: '', disabled: true }),
      keyspace: new FormControl({ value: '', disabled: true }),
      keyspaceProgress: new FormControl({ value: '', disabled: true }),
      crackerBinaryId: new FormControl({ value: '', disabled: true }),
      chunkSize: new FormControl({ value: '', disabled: true }),
      updateData: new FormGroup({
        taskName: new FormControl({ value: '', disabled: this.isReadOnly }),
        attackCmd: new FormControl({ value: '', disabled: this.isReadOnly }),
        notes: new FormControl({ value: '', disabled: this.isReadOnly }),
        color: new FormControl({ value: '', disabled: this.isReadOnly }),
        chunkTime: new FormControl({ value: '', disabled: this.isReadOnly }),
        statusTimer: new FormControl({ value: '', disabled: this.isReadOnly }),
        priority: new FormControl({ value: '', disabled: this.isReadOnly }),
        maxAgents: new FormControl({ value: '', disabled: this.isReadOnly }),
        isCpuTask: new FormControl({ value: '', disabled: this.isReadOnly }),
        isSmall: new FormControl({ value: '', disabled: this.isReadOnly })
      })
    });

    this.createForm = new FormGroup({
      agentId: new FormControl<number | null>(null)
    });
  }

  private async loadTask(): Promise<JTask> {
    const includes = ['hashlist', 'crackerBinary', 'crackerBinaryType', 'assignedAgents'];

    const base = this.cs.getEndpoint() + SERV.TASKS.URL;
    const url = `${base}/${this.editedTaskIndex}`;

    const params: { [k: string]: string } = { include: includes.join(',') };

    try {
      const response = await firstValueFrom<ResponseWrapper>(this.http.get<ResponseWrapper>(url, { params }));
      return this.serializer.deserialize<JTask>({ data: response.data, included: response.included });
    } catch (err: unknown) {
      // If backend fails with server error (500+), try a fallback request without includes.
      // This helps when the server chokes resolving included relationships but the main
      // resource exists — the UI can still open the edit form with the primary data.
      if (err instanceof HttpErrorResponse && err.status && err.status >= 500) {
        // eslint-disable-next-line no-console
        console.warn('loadTask(): primary request failed, retrying without includes', err);
        const responseFallback = await firstValueFrom<ResponseWrapper>(this.http.get<ResponseWrapper>(url));
        return this.serializer.deserialize<JTask>({ data: responseFallback.data, included: responseFallback.included });
      }
      throw err;
    }
  }

  onSubmit(): void {
    if (this.updateForm.valid && !this.isReadOnly) {
      // Check if attackCmd has been modified
      if (this.updateForm.value['updateData'].attackCmd !== this.originalValue.attackCmd) {
        const message =
          'Do you really want to change the attack command? If the task already was started, it will be completely purged before and reset to an initial state. (Note that you cannot change files)';
        this.confirmDialog.confirmYesNo('Update task data', message).subscribe((confirmed) => {
          if (confirmed) {
            this.updateTask();
          } else {
            this.alertService.showInfoMessage('Task Information has not been updated');
          }
        });
      } else {
        this.updateTask();
      }
    }
  }

  private updateTask(): void {
    this.isUpdatingLoading = true;
    this.gs.update(SERV.TASKS, this.editedTaskIndex, this.updateForm.value['updateData']).subscribe(() => {
      this.isUpdatingLoading = false;
      this.router.navigate(['tasks/show-tasks']).then(() => {
        this.alertService.showSuccessMessage('Task data has been updated successfully.');
      });
    });
  }

  /**
   * Load task progress image from backend
   * @private
   */
  private loadTaskProgressImage(): void {
    const url = this.cs.getEndpoint() + SERV.HELPER.URL + '/getTaskProgressImage?task=' + this.editedTaskIndex;

    try {
      if (this.rawTaskProgressObjectUrl) {
        URL.revokeObjectURL(this.rawTaskProgressObjectUrl);
        this.rawTaskProgressObjectUrl = null;
        this.taskProgressImageUrl = null;
      }

      this.http.get(url, { responseType: 'blob' }).subscribe({
        next: (blob) => {
          if (!blob || blob.size === 0) {
            this.taskProgressImageUrl = null;
            return;
          }
          const objectUrl = URL.createObjectURL(blob);
          this.rawTaskProgressObjectUrl = objectUrl;
          this.taskProgressImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        },
        error: () => {
          this.taskProgressImageUrl = null;
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * The below functions are related with assign, manage and delete agents
   */
  private assingAgentInit(assignedAgentIds: Array<number>): void {
    this.isLoadingAgents = true;
    const params = new RequestParamBuilder();
    if (assignedAgentIds.length > 0) {
      params.addFilter({ field: 'agentId', operator: FilterType.NOTIN, value: assignedAgentIds });
    }

    this.gs.getAll(SERV.AGENTS, params.create()).subscribe((responseAgents: ResponseWrapper) => {
      const responseBodyAgents = { data: responseAgents.data, included: responseAgents.included };
      this.availAgents = this.serializer.deserialize<JAgent[]>(responseBodyAgents);
      this.selectAgents = transformSelectOptions(this.availAgents, AGENT_MAPPING);
      this.isLoadingAgents = false;
    });
  }

  reloadAgentAssignment(): void {
    const paramsAgentAssign = new RequestParamBuilder();
    paramsAgentAssign.addFilter({ field: 'taskId', operator: FilterType.EQUAL, value: this.editedTaskIndex });
    this.gs.getAll(SERV.AGENT_ASSIGN, paramsAgentAssign.create()).subscribe((responseAssignments: ResponseWrapper) => {
      const responseBodyAssignments = {
        data: responseAssignments.data,
        included: responseAssignments.included
      };
      const agentAssignments = this.serializer.deserialize<JAgentAssignment[]>(responseBodyAssignments);
      const agentAssignmentsAgentIds: Array<number> = agentAssignments.map(
        (agentAssignment) => agentAssignment.agentId
      );
      this.assingAgentInit(agentAssignmentsAgentIds);
    });
  }

  assignAgent(): void {
    if (this.createForm.valid) {
      const payload = {
        taskId: this.editedTaskIndex,
        agentId: this.createForm.value['agentId']
      };
      this.gs
        .create(SERV.AGENT_ASSIGN, payload)
        .pipe(
          finalize(() => {
            this.reloadAgentAssignment();
            this.agentsTable.reload();
          })
        )
        .subscribe({
          next: () => {
            this.createForm.reset();
            this.alertService.showSuccessMessage('Agent assigned!');
          },
          error: (err: HttpErrorResponse) => {
            // If backend rejects the assignment, clear selection so the user knows it wasn't added
            this.createForm.reset();
            const msg = err?.error?.message ?? 'Agent cannot be assigned to this task.';
            this.alertService.showErrorMessage(msg);
          }
        });
    }
  }

  private assignChunksInit(): void {
    this.route.data.subscribe((data) => {
      switch (data['kind']) {
        case 'edit-task':
          this.chunkview = 0;
          break;
        case 'edit-task-cAll':
          this.chunkview = 1;
          break;
      }
    });

    this.gs
      .ghelper(SERV.HELPER, 'taskExtraDetails?task=' + this.editedTaskIndex)
      .subscribe((result: ResponseWrapper) => {
        const taskDetailData = result.meta;
        this.ctimespent = taskDetailData['timeSpent'];
        this.currenspeed = taskDetailData['currentSpeed'];
        this.estimatedTime = taskDetailData['estimatedTime'];
        this.cprogress = taskDetailData['cprogress'];
      });
  }

  onChunkViewChange(event: MatButtonToggleChange): void {
    this.chunkview = event.value;
  }

  purgeTask(): void {
    this.confirmDialog.confirmYesNo('Purge Task', 'Do you really want to purge the task').subscribe((confirmed) => {
      if (confirmed) {
        const payload = { taskId: this.editedTaskIndex };
        this.gs.chelper(SERV.HELPER, 'purgeTask', payload).subscribe(() => {
          this.alertService.showSuccessMessage(`Purged task id ${this.editedTaskIndex}`);
        });
      } else {
        this.alertService.showInfoMessage('Purge was cancelled');
      }
    });
  }

  /**
   * Get task speeds for speed diagram.
   *
   * Time range is roughly limited to one hour for a maximum of 10 agents.
   * If we have more than 10 agents, the period will be decreased (e.g. 30 minutes for 20 agents)
   * Estimation is a new speed entry per agent every 5 seconds: (60 seconds * 60) / 5 = 720
   *
   * The resulting array must be reversed to have it sorted ascending by time
   *
   * @param assignedAgentsCount - number of assigned agents to the task
   * @private
   */
  private getTaskSpeeds(assignedAgentsCount: number): void {
    const limitPerAgent = 720;
    const maxAgents = 10;
    const requestLimit = Math.min(limitPerAgent * (assignedAgentsCount + 1), limitPerAgent * maxAgents);

    const speedParams = new RequestParamBuilder()
      .addFilter({
        field: 'taskId',
        value: this.editedTaskIndex,
        operator: FilterType.EQUAL
      })
      .addSorting({ dataKey: 'speedId', direction: 'desc', isSortable: true })
      .setPageSize(requestLimit);

    this.gs.getAll(SERV.SPEEDS, speedParams.create()).subscribe((response: ResponseWrapper) => {
      const speeds = this.serializer.deserialize<SpeedStat[]>({ data: response.data, included: response.included });
      this.originalValue.speeds = [...speeds].reverse();
    });
  }
}
