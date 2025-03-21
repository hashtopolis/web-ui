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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ASC, ignoreErrors } from '../../core/_constants/agentsc.config';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import * as echarts from 'echarts/core';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../core/_services/main.config';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { transformSelectOptions } from 'src/app/shared/utils/forms';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { TASKS_FIELD_MAPPING, USER_AGP_FIELD_MAPPING, USER_FIELD_MAPPING } from 'src/app/core/_constants/select.config';
import { ListResponseWrapper, ResponseWrapper } from '../../core/_models/response.model';
import { AgentData, AgentStats, JAgent } from '../../core/_models/agent.model';
import { JUser } from '../../core/_models/user.model';
import { JsonAPISerializer } from '../../core/_services/api/serializer-service';
import { JTask } from '../../core/_models/task.model';
import { JChunk } from '../../core/_models/chunk.model';
import { JAgentAssignment } from '../../core/_models/agent-assignment.model';
import { FilterType } from 'src/app/core/_models/request-params.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

@Component({
  selector: 'app-edit-agent',
  templateUrl: './edit-agent.component.html'
})
export class EditAgentComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for main form and assign agent. */
  updateForm: FormGroup;
  updateAssignForm: FormGroup;

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

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private uiService: UIConfigService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer
  ) {
    this.onInitialize();
    this.buildForm();
    titleService.set(['Edit Agent']);
  }

  /**
   * Initializes the component by extracting and setting the user ID,
   */
  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedAgentIndex = +params['id'];
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Builds the form for editing an Agent.
   */
  buildForm(): void {
    this.updateForm = new FormGroup({
      isActive: new FormControl(''),
      userId: new FormControl({ value: '', disabled: true }),
      agentName: new FormControl(''),
      token: new FormControl({ value: '', disabled: true }),
      cpuOnly: new FormControl(),
      cmdPars: new FormControl(''),
      ignoreErrors: new FormControl(''),
      isTrusted: new FormControl('')
    });

    this.updateAssignForm = new FormGroup({
      taskId: new FormControl('')
    });
  }

  /**
   * Loads data, Agent data and select options for the component.
   */
  loadData(): void {
    const agentParams = new RequestParamBuilder().addInclude('agentStats').addInclude('accessGroups').create();
    const loadAgentsSubscription$ = this.gs
      .get(SERV.AGENTS, this.editedAgentIndex, agentParams)
      .subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };

        const agent = this.serializer.deserialize<JAgent>(responseBody);
        this.showagent = agent;
        this.selectuserAgps = transformSelectOptions(agent.accessGroups, this.selectUserAgpMap);
        this.drawGraphs(agent.agentStats);
      });
    this.unsubscribeService.add(loadAgentsSubscription$);

    const tasksParams = new RequestParamBuilder().addFilter({
      field: 'isArchived',
      operator: FilterType.EQUAL,
      value: true
    }).create();
    // Load get select tasks for assigment
    const loadTasksSubscription$ = this.gs
      .getAll(SERV.TASKS, tasksParams)
      .subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const tasks = this.serializer.deserialize<JTask[]>(responseBody);

        const filterTasks = tasks.filter(
          (u) => u.keyspaceProgress < u.keyspace || Number(u.keyspaceProgress) === 0
        ); //Remove completed tasks
        this.assignTasks = transformSelectOptions(filterTasks, this.selectAssignMap);
      });

    this.unsubscribeService.add(loadTasksSubscription$);

    // Load select Users
    const loadUsersSubscription$ = this.gs
      .getAll(SERV.USERS)
      .subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const users = this.serializer.deserialize<JUser[]>(responseBody);
        const transformedOptions = transformSelectOptions(
          users,
          this.selectUserMap
        );
        this.selectUsers = transformedOptions;
      });

    this.unsubscribeService.add(loadUsersSubscription$);

    // Initialize form and assigned chunks
    this.initForm();
    this.assignChunksInit(this.editedAgentIndex);
  }

  /**
   * Calculates the total time spent based on an array of chunks.
   *
   * @param {Array<any>} chunks - An array of chunks containing solveTime and dispatchTime properties.
   * @returns {void}
   */
  timeCalc(chunks) {
    const tspent = [];
    for (let i = 0; i < chunks.length; i++) {
      tspent.push(
        Math.max(chunks[i].solveTime, chunks[i].dispatchTime) -
        chunks[i].dispatchTime
      );
    }
    this.timespent = tspent.reduce((a, i) => a + i);
  }

  /**
   * Initializes the assignment chunks for the specified agent ID.
   *
   * @param {number} id - The ID of the agent.
   * @returns {void}
   */
  assignChunksInit(id: number): void {
    const params = new RequestParamBuilder().setPageSize(5000).create();
    // Retrieve chunks associated with the agent
    this.gs.getAll(SERV.CHUNKS, params).subscribe((response: ResponseWrapper) => {
      const responseBody = { data: response.data, included: response.included };
      const chunks = this.serializer.deserialize<JChunk[]>(responseBody);

      const getchunks = chunks.filter((u) => u.agentId == id);

      // Retrieve tasks information
      this.gs.getAll(SERV.TASKS, params).subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const tasks = this.serializer.deserialize<JTask[]>(responseBody);

        // Combine chunks and tasks information
        this.getchunks = getchunks.map((mainObject) => {
          const matchObjectAgents = tasks.find((task) => task.id === mainObject.id);
          return { ...mainObject, ...matchObjectAgents };
        });

        // Calculate and update timespent
        this.timeCalc(this.getchunks);
      });
    });
  }

  /**
   * Handles the form submission for updating an agent.
   *
   * @returns {void}
   */
  onSubmit() {
    if (this.updateForm.valid) {
      this.onUpdateAssign(this.updateAssignForm.value);
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
   * @param {any} val - The form value containing the task ID.
   * @returns {void}
   */
  onUpdateAssign(val: any) {
    const id = Number(val['taskId']);
    if (id) {
      const payload = {
        taskId: Number(val['taskId']),
        agentId: this.editedAgentIndex
      };
      const onCreateSubscription$ = this.gs
        .create(SERV.AGENT_ASSIGN, payload)
        .subscribe();
      this.unsubscribeService.add(onCreateSubscription$);
    }
    if (id === 0) {
      const onDeleteSubscription$ = this.gs
        .delete(SERV.AGENT_ASSIGN, this.assignId)
        .subscribe();
      this.unsubscribeService.add(onDeleteSubscription$);
    }
  }

  // Render devices using count by device type
  renderDevices(agent: any) {
    if (agent) {
      const deviceList = agent.split('\n');
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
    return undefined;
  }

  /**
   * Draw all graphs for GPU temperature and utilisation and CPU utilisation
   * @param agentStatList List of agentStats objects
   */
  drawGraphs(agentStatList: AgentStats[]) {
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

  // //
  //  GRAPHS SECTION
  // //

  /**
   * Draw single Graph from AgentStats
   * @param agentStatList List of AgentStats objects
   * @param status Number to determine device and displayed stats (GPU_TEMP: 1, GPU_UTIL: 2, CPU_UTIL: 3)
   * @param name Name of Graph
   */
  drawGraph(agentStatList: AgentStats[], status: number, name: string) {
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
    arr.forEach(function(a) {
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
        data: xAxis.map(function(item: any[] | any) {
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

  /**
   * Initializes the form with user data retrieved from the server.
   */
  private initForm() {
    this.gs.get(SERV.AGENTS, this.editedAgentIndex).subscribe((result: ListResponseWrapper<AgentData>) => {

      let obj = result.data as object;
      let data = obj as AgentData;

      this.updateForm = new FormGroup({
        isActive: new FormControl(data.attributes.isActive, [Validators.required]),
        userId: new FormControl(data.attributes.userId),
        agentName: new FormControl(data.attributes.agentName, [Validators.required]),
        token: new FormControl(data.attributes.token),
        cpuOnly: new FormControl(data.attributes.cpuOnly),
        cmdPars: new FormControl(data.attributes.cmdPars),
        ignoreErrors: new FormControl(data.attributes.ignoreErrors),
        isTrusted: new FormControl(data.attributes.isTrusted)
      });
    });

    const params = new RequestParamBuilder().addFilter({
      field: 'agentId',
      operator: FilterType.EQUAL,
      value: this.editedAgentIndex
    }).create();
    this.gs
      .getAll(SERV.AGENT_ASSIGN, params)
      .subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const assignmentList = this.serializer.deserialize<JAgentAssignment[]>(responseBody);
        if (assignmentList.length) {
          this.assignNew = !!assignmentList?.[0]['taskId'];
          this.assignId = assignmentList?.[0]['assignmentId'];
          this.updateAssignForm = new FormGroup({
            taskId: new FormControl(assignmentList?.[0]['taskId'])
          });
        }
      });
  }
}
