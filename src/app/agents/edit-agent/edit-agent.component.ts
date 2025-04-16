import * as echarts from 'echarts/core';
import {
  GridComponent,
  GridComponentOption,
  LegendComponent,
  MarkLineComponent,
  MarkLineComponentOption,
  MarkPointComponent,
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ASC, ignoreErrors } from '@src/app/core/_constants/agentsc.config';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../core/_services/main.config';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { transformSelectOptions } from 'src/app/shared/utils/forms';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { TASKS_FIELD_MAPPING, USER_AGP_FIELD_MAPPING, USER_FIELD_MAPPING } from 'src/app/core/_constants/select.config';
import { ResponseWrapper } from '../../core/_models/response.model';
import { JAgent } from '../../core/_models/agent.model';
import { JUser } from '../../core/_models/user.model';
import { JsonAPISerializer } from '../../core/_services/api/serializer-service';
import { JTask } from '../../core/_models/task.model';
import { JChunk } from '../../core/_models/chunk.model';
import { JAgentAssignment } from '../../core/_models/agent-assignment.model';
import { FilterType } from 'src/app/core/_models/request-params.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import {
  EditAgentForm,
  UpdateAssignmentForm,
  getEditAgentForm,
  getUpdateAssignmentForm
} from '@src/app/agents/edit-agent/edit-agent.form';
import { firstValueFrom } from 'rxjs';
import { JAgentStat } from '@models/agent-stats.model';

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
  selectUsers: any;
  selectIgnorerrors = ignoreErrors;
  selectuserAgps: any;

  /** Select Options Mapping */
  selectUserAgpMap = {
    fieldMapping: USER_AGP_FIELD_MAPPING
  };

  selectUserMap = {
    fieldMapping: USER_FIELD_MAPPING
  };

  selectAssignMap = {
    fieldMapping: TASKS_FIELD_MAPPING
  };

  /** Assign Tasks */
  assignTasks: any = [];
  assignNew: any;
  assignId: any;

  // Edit Index
  editedAgentIndex: number;
  editedAgent: any;
  showagent: any = [];

  // Calculations
  timespent: number;
  getchunks: any;

  currentAssignment: JAgentAssignment;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private uiService: UIConfigService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer,
    private cdr: ChangeDetectorRef
  ) {
    this.onInitialize();
    this.buildEmptyForms();
    titleService.set(['Edit Agent']);
  }

  /**
   * Initializes the component by extracting and setting the agent ID,
   */
  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedAgentIndex = +params['id'];
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
    this.drawGraphs(this.showagent.agentStats);
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
    this.selectuserAgps = transformSelectOptions(agent.accessGroups, this.selectUserAgpMap);
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
      this.assignTasks = transformSelectOptions(filterTasks, this.selectAssignMap);
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
      this.selectUsers = this.serializer.deserialize<JUser[]>(responseBody);
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
        this.onUpdateAssign(this.updateAssignForm.value);
      }
      this.isUpdatingLoading = true;
      const onSubmitSubscription$ = this.gs
        .update(SERV.AGENTS, this.editedAgentIndex, this.updateForm.value)
        .subscribe(() => {
          this.alert.okAlert('Agent saved!', '');
          this.isUpdatingLoading = false;
          this.router.navigate(['agents/show-agents']);
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }

  /**
   * Updates agent assignment based on the provided value.
   *
   * @param value The form value containing the task ID.
   */
  onUpdateAssign(value: FormGroup<UpdateAssignmentForm>['value']) {
    if (value.taskId) {
      const payload = {
        taskId: value.taskId,
        agentId: this.editedAgentIndex
      };
      const onCreateSubscription$ = this.gs.create(SERV.AGENT_ASSIGN, payload).subscribe();
      this.unsubscribeService.add(onCreateSubscription$);
    }
    if (value.taskId === 0) {
      const onDeleteSubscription$ = this.gs.delete(SERV.AGENT_ASSIGN, this.assignId).subscribe();
      this.unsubscribeService.add(onDeleteSubscription$);
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

    // Format the result string with HTML line breaks
    const formattedDevices = Object.keys(deviceCountMap)
      .map((device) => `${deviceCountMap[device]} x ${device}`)
      .join('<br>');
    return formattedDevices;
  }

  // //
  //  GRAPHS SECTION
  // //
  /**
   * Draw all graphs for GPU temperature and utilisation and CPU utilisation
   * @param agentStatList List of agentStats objects
   */
  drawGraphs(agentStatList: JAgentStat[]) {
    this.drawGraph(
      agentStatList.filter((agentStat) => agentStat.statType == ASC.GPU_TEMP),
      ASC.GPU_TEMP,
      'tempgraph'
    ); // filter Device Temperature
    this.drawGraph(
      agentStatList.filter((agentStat) => agentStat.statType == ASC.GPU_UTIL),
      ASC.GPU_UTIL,
      'devicegraph'
    ); // filter Device Utilization
    this.drawGraph(
      agentStatList.filter((agentStat) => agentStat.statType == ASC.CPU_UTIL),
      ASC.CPU_UTIL,
      'cpugraph'
    ); // filter CPU utilization
  }

  /**
   * Draw single Graph from AgentStats
   * @param agentStatList List of AgentStats objects
   * @param status Number to determine device and displayed stats (GPU_TEMP: 1, GPU_UTIL: 2, CPU_UTIL: 3)
   * @param name Name of Graph
   */
  drawGraph(agentStatList: JAgentStat[], status: number, name: string) {
    echarts.use([
      TitleComponent,
      ToolboxComponent,
      TooltipComponent,
      GridComponent,
      LegendComponent,
      MarkLineComponent,
      MarkPointComponent,
      LineChart,
      CanvasRenderer,
      UniversalTransition
    ]);

    type EChartsOption = echarts.ComposeOption<
      | TitleComponentOption
      | ToolboxComponentOption
      | TooltipComponentOption
      | GridComponentOption
      | MarkLineComponentOption
    >;

    let templabel = '';

    if (ASC.GPU_TEMP === status) {
      if (this.getTemp2() > 100) {
        templabel = '°F';
      } else {
        templabel = '°C';
      }
    }
    if (ASC.GPU_UTIL === status) {
      templabel = '%';
    }
    if (ASC.CPU_UTIL === status) {
      templabel = '%';
    }

    const data: any = agentStatList;
    const arr = [];
    const max = [];
    const devlabels = [];
    const result: any = agentStatList;

    for (let i = 0; i < result.length; i++) {
      const val = result[i].value;
      for (let i = 0; i < val.length; i++) {
        const iso = this.transDate(result[i].time);
        arr.push({ time: iso, value: val[i], device: i });
        max.push(result[i].time);
        devlabels.push('Device ' + i + '');
      }
    }

    const grouped = [];
    arr.forEach(function (a) {
      grouped[a.device] = grouped[a.device] || [];
      grouped[a.device].push({ time: a.time, value: a.value });
    });

    const labels = [...new Set(devlabels)];

    const startdate = Math.max(...max);
    const datelabel = this.transDate(startdate);
    const xAxis = this.generateIntervalsOf(1, +startdate - 500, +startdate);

    const chartDom = document.getElementById(name);
    const myChart = echarts.init(chartDom);
    let option: EChartsOption;

    const seriesData = [];
    for (let i = 0; i < grouped.length; i++) {
      seriesData.push({
        name: 'Device ' + i + '',
        type: 'line',
        data: grouped[i],
        markLine: {
          data: [{ type: 'average', name: 'Avg' }],
          symbol: ['none', 'none']
        }
      });
    }

    const self = this;
    option = {
      tooltip: {
        position: 'top'
      },
      legend: {
        data: labels
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {
            name: 'Device Temperature'
          }
        }
      },
      useUTC: true,
      xAxis: {
        data: xAxis.map(function (item: any[] | any) {
          return self.transDate(item);
        })
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} ' + templabel + ''
        }
      },
      series: seriesData
    };
    option && myChart.setOption(option);
  }

  getTemp1() {
    // Temperature Config Setting
    return this.uiService.getUIsettings('agentTempThreshold1').value;
  }

  getTemp2() {
    // Temperature 2 Config Setting
    return this.uiService.getUIsettings('agentTempThreshold2').value;
  }

  transDate(dt) {
    const date: any = new Date(dt * 1000);
    return (
      date.getUTCDate() +
      '-' +
      this.leading_zeros(date.getUTCMonth() + 1) +
      '-' +
      date.getUTCFullYear() +
      ',' +
      this.leading_zeros(date.getUTCHours()) +
      ':' +
      this.leading_zeros(date.getUTCMinutes()) +
      ':' +
      this.leading_zeros(date.getUTCSeconds())
    );
  }

  leading_zeros(dt) {
    return (dt < 10 ? '0' : '') + dt;
  }

  generateIntervalsOf(interval, start, end) {
    const result = [];
    let current = start;

    while (current < end) {
      result.push(current);
      current += interval;
    }

    return result;
  }
}
