import { Subscription, finalize } from 'rxjs';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ActivatedRoute, Params, Router } from '@angular/router';

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
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { TasksAgentsTableComponent } from '@components/tables/tasks-agents-table/tasks-agents-table.component';
import { TasksChunksTableComponent } from '@components/tables/tasks-chunks-table/tasks-chunks-table.component';

import { FileSizePipe } from '@src/app/core/_pipes/file-size.pipe';

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

  color = '';
  tusepreprocessor: number;
  hashlistDescrip: string;
  hashlistinform: JHashlist;
  availAgents: JAgent[] = [];
  crackerinfo: JCrackerBinary;
  tkeyspace: number;

  @ViewChild('assignedAgentsTable') agentsTable: TasksAgentsTableComponent;
  @ViewChild(TasksChunksTableComponent) chunkTable!: TasksChunksTableComponent;

  //Time calculation
  cprogress: number; // Keyspace searched
  ctimespent: number; // Time Spent
  estimatedTime: number; // Estimated time till task is finished
  searched: string;

  // Chunk View
  chunkview: number;
  isactive = 0;
  currenspeed = 0;
  chunkresults: number;

  private routeSub: Subscription;

  constructor(
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer,
    private confirmDialog: ConfirmDialogService
  ) {
    this.titleService.set(['Edit Task']);
    this.onInitialize();
  }

  ngOnInit() {
    this.buildForm();
    this.initForm();
    this.assignChunksInit();
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedTaskIndex = +params['id'];
      this.editMode = params['id'] != null;

      this.ngOnInit();
    });
  }

  /**
   * Reload data
   */
  refresh(): void {
    this.onInitialize();
    this.agentsTable.reload();
  }

  buildForm() {
    this.updateForm = new FormGroup({
      taskId: new FormControl({ value: '', disabled: true }),
      forcePipe: new FormControl({ value: '', disabled: true }),
      skipKeyspace: new FormControl({ value: '', disabled: true }),
      keyspace: new FormControl({ value: '', disabled: true }),
      keyspaceProgress: new FormControl({ value: '', disabled: true }),
      crackerBinaryId: new FormControl({ value: '', disabled: true }),
      chunkSize: new FormControl({ value: '', disabled: true }),
      updateData: new FormGroup({
        taskName: new FormControl(''),
        attackCmd: new FormControl(''),
        notes: new FormControl(''),
        color: new FormControl(''),
        chunkTime: new FormControl(''),
        statusTimer: new FormControl(''),
        priority: new FormControl(''),
        maxAgents: new FormControl(''),
        isCpuTask: new FormControl(''),
        isSmall: new FormControl('')
      })
    });
    this.createForm = new FormGroup({
      agentId: new FormControl()
    });
  }

  onSubmit() {
    if (this.updateForm.valid) {
      // Check if attackCmd has been modified
      if (this.updateForm.value['updateData'].attackCmd !== this.originalValue.attackCmd) {
        const message: string =
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

  private updateTask() {
    this.isUpdatingLoading = true;
    this.gs.update(SERV.TASKS, this.editedTaskIndex, this.updateForm.value['updateData']).subscribe(() => {
      this.isUpdatingLoading = false;
      this.router.navigate(['tasks/show-tasks']).then(() => {
        this.alertService.showSuccessMessage('Task data has been updated successfully.');
      });
    });
  }

  private initForm() {
    if (this.editMode) {
      const params = new RequestParamBuilder()
        .addInclude('hashlist')
        .addInclude('crackerBinary')
        .addInclude('crackerBinaryType')
        .addInclude('files')
        .addInclude('assignedAgents')
        .create();

      this.gs.get(SERV.TASKS, this.editedTaskIndex, params).subscribe((response: ResponseWrapper) => {
        const task = this.serializer.deserialize<JTask>({ data: response.data, included: response.included });

        this.originalValue = task;
        this.searched = task.searched;
        this.color = task.color;
        this.crackerinfo = task.crackerBinary;
        this.taskWrapperId = task.taskWrapperId;

        this.assingAgentInit();
        this.getTaskSpeeds(task.assignedAgents.length);

        // Hashlist Description and Type
        if (task.hashlist) {
          this.hashlistinform = task.hashlist;
          if (this.hashlistinform) {
            this.gs.get(SERV.HASHTYPES, task.hashlist.hashTypeId).subscribe((response: ResponseWrapper) => {
              const responseBody = { data: response.data, included: response.included };
              const hashtype = this.serializer.deserialize<JHashtype>(responseBody);
              this.hashlistDescrip = hashtype.description;
            });
          } else {
            console.error('hashlistinform is undefined.');
          }
        } else {
          console.error('No hashlist found in the result.');
        }
        this.tkeyspace = task.keyspace;
        this.tusepreprocessor = task.preprocessorId;

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
      });
    }
  }

  /**
   * The below functions are related with assign, manage and delete agents
   *
   **/
  assingAgentInit() {
    // TODO possibly we could turn this in a single helper request to the backend if we create a helper endpoint
    // That retrieves available agents. Or even better, we might be able to use the agents, in the datasource of
    // the assigned agents table. And use those IDs to filter for available agents.
    const paramsAgentAssign = new RequestParamBuilder();
    paramsAgentAssign.addFilter({ field: 'taskId', operator: FilterType.EQUAL, value: this.editedTaskIndex });
    this.gs.getAll(SERV.AGENT_ASSIGN, paramsAgentAssign.create()).subscribe((responseAssignments: ResponseWrapper) => {
      const responseBodyAssignments = { data: responseAssignments.data, included: responseAssignments.included };
      const agentAssignments = this.serializer.deserialize<JAgentAssignment[]>(responseBodyAssignments);

      const agentAssignmentsAgentIds = agentAssignments.map((agentAssignment) => agentAssignment.agentId);

      const params = new RequestParamBuilder();
      if (agentAssignmentsAgentIds.length > 0) {
        params.addFilter({ field: 'agentId', operator: FilterType.NOTIN, value: agentAssignmentsAgentIds });
      }

      this.gs.getAll(SERV.AGENTS, params.create()).subscribe((responseAgents: ResponseWrapper) => {
        const responseBodyAgents = { data: responseAgents.data, included: responseAgents.included };
        this.availAgents = this.serializer.deserialize<JAgent[]>(responseBodyAgents);
      });
    });
  }

  assignAgent() {
    if (this.createForm.valid) {
      const payload = {
        taskId: this.editedTaskIndex,
        agentId: this.createForm.value['agentId']
      };
      this.gs
        .create(SERV.AGENT_ASSIGN, payload)
        .pipe(
          finalize(() => {
            this.assingAgentInit();
            this.agentsTable.reload();
          })
        )
        .subscribe(() => {
          this.createForm.reset();
          this.alertService.showSuccessMessage('Agent assigned!');
        });
    }
  }

  assignChunksInit() {
    this.route.data.subscribe((data) => {
      switch (data['kind']) {
        case 'edit-task':
          this.chunkview = 0;
          this.chunkresults = 60000;
          // this.slideToggle.checked = false;
          break;
        case 'edit-task-cAll':
          this.chunkview = 1;
          this.chunkresults = 60000;
          // this.slideToggle.checked = true;
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
      });
  }

  onChunkViewChange(event: MatButtonToggleChange): void {
    this.chunkview = event.value;
  }

  /**
   * Helper functions
   *
   **/

  purgeTask() {
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
   * The resulting array must ve reversed to have it sorted ascending by time
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
