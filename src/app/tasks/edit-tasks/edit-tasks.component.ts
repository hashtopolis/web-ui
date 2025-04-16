import {
  DataZoomComponent,
  DataZoomComponentOption,
  GridComponent,
  GridComponentOption,
  MarkLineComponent,
  MarkLineComponentOption,
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  VisualMapComponent,
  VisualMapComponentOption
} from 'echarts/components';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { FormControl, FormGroup } from '@angular/forms';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as echarts from 'echarts/core';

import { AgentsTableComponent } from 'src/app/core/_components/tables/agents-table/agents-table.component';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { FileSizePipe } from 'src/app/core/_pipes/file-size.pipe';
import { SERV } from '../../core/_services/main.config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { finalize } from 'rxjs';
import { FilterType } from 'src/app/core/_models/request-params.model';
import { JsonAPISerializer } from '@services/api/serializer-service';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { JHashtype } from '@models/hashtype.model';
import { JAgentAssignment } from '@models/agent-assignment.model';
import { JAgent } from '@models/agent.model';
import { JChunk } from '@models/chunk.model';

@Component({
    selector: 'app-edit-tasks',
    templateUrl: './edit-tasks.component.html',
    providers: [FileSizePipe],
    standalone: false
})
export class EditTasksComponent implements OnInit {
  editMode = false;
  editedTaskIndex: number;
  taskWrapperId: number;
  editedTask: any; // Change to Model
  originalValue: any; // Change to Model

  updateForm: FormGroup;
  createForm: FormGroup; // Assign Agent
  /** On form update show a spinner loading */
  isUpdatingLoading = false;

  color = '';
  tusepreprocessor: any;
  hashlistDescrip: any;
  hashlistinform: any;
  assigAgents: any;
  availAgents = [];
  crackerinfo: any;
  tkeyspace: any;

  @ViewChild('agentsTable') agentsTable: AgentsTableComponent;
  @ViewChild('slideToggle', { static: false }) slideToggle: MatSlideToggle;

  //Time calculation
  cprogress: any; // Keyspace searched
  ctimespent: any; // Time Spent

  // Chunk View
  chunkview: number;
  chunktitle: string;
  isactive = 0;
  currenspeed = 0;
  chunkresults: number;
  activechunks: Object;

  constructor(
    private titleService: AutoTitleService,
    private uiService: UIConfigService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private alert: AlertService,
    private gs: GlobalService,
    private fs: FileSizePipe,
    private router: Router,
    private serializer: JsonAPISerializer
  ) {
    this.titleService.set(['Edit Task']);
  }

  ngOnInit() {
    this.onInitialize();
    this.buildForm();
    this.initForm();
    this.assignChunksInit(this.editedTaskIndex);
  }

  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedTaskIndex = +params['id'];
      this.editMode = params['id'] != null;
    });
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

  OnChangeValue(value) {
    this.updateForm.patchValue({
      updateData: { color: value }
    });
  }

  onSubmit() {
    if (this.updateForm.valid) {
      // Check if attackCmd has been modified
      if (this.updateForm.value['updateData'].attackCmd !== this.originalValue.attackCmd) {
        const warning =
          'Do you really want to change the attack command? If the task already was started, it will be completely purged before and reset to an initial state. (Note that you cannot change files)';
        this.alert.customConfirmation(warning).then((confirmed) => {
          if (confirmed) {
            this.updateTask();
          } else {
            // Handle cancellation
            this.alert.okAlert(`Task Information has not been updated!`, '');
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
      this.alert.okAlert('Task saved!', '');
      this.isUpdatingLoading = false;
      this.router.navigate(['tasks/show-tasks']).then(() => {
        window.location.reload();
      });
    });
  }

  private initForm() {
    if (this.editMode) {
      const params = new RequestParamBuilder()
        .addInclude('hashlist')
        .addInclude('speeds')
        .addInclude('crackerBinary')
        .addInclude('crackerBinaryType')
        .addInclude('files')
        .create();

      this.gs.get(SERV.TASKS, this.editedTaskIndex, params).subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const task = this.serializer.deserialize<JTask>(responseBody);

        this.originalValue = task;
        this.color = task.color;
        this.crackerinfo = task.crackerBinary;
        this.taskWrapperId - task.taskWrapperId;
        // Graph Speed
        this.initTaskSpeed(task.speeds);
        // Assigned Agents init
        this.assingAgentInit();
        // Hashlist Description and Type
        this.hashlistinform = '';
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
        this.updateForm = new FormGroup({
          taskId: new FormControl({
            value: task.id,
            disabled: true
          }),
          forcePipe: new FormControl({
            value: task.forcePipe == true ? 'Yes' : 'No',
            disabled: true
          }),
          skipKeyspace: new FormControl({
            value: task.skipKeyspace > 0 ? task.skipKeyspace : 'N/A',
            disabled: true
          }),
          keyspace: new FormControl({
            value: task.keyspace,
            disabled: true
          }),
          keyspaceProgress: new FormControl({
            value: task.keyspaceProgress,
            disabled: true
          }),
          crackerBinaryId: new FormControl(task.crackerBinaryId),
          chunkSize: new FormControl({
            value: task.chunkSize,
            disabled: true
          }),
          updateData: new FormGroup({
            taskName: new FormControl(task.taskName),
            attackCmd: new FormControl(task.attackCmd),
            notes: new FormControl(task.notes),
            color: new FormControl(task.color),
            chunkTime: new FormControl(Number(task.chunkTime)),
            statusTimer: new FormControl(task.statusTimer),
            priority: new FormControl(task.priority),
            maxAgents: new FormControl(task.maxAgents),
            isCpuTask: new FormControl(task.isCpuTask),
            isSmall: new FormControl(task.isSmall)
          })
        });
      });
    }
  }

  /**
   * The below functions are related with assign, manage and delete agents
   *
   **/
  assingAgentInit() {
    const paramsAgentAssign = new RequestParamBuilder().create();
    this.gs.getAll(SERV.AGENT_ASSIGN, paramsAgentAssign).subscribe((responseAssignments: ResponseWrapper) => {
      const responseBodyAssignments = { data: responseAssignments.data, included: responseAssignments.included };
      const agentAssignments = this.serializer.deserialize<JAgentAssignment[]>(responseBodyAssignments);

      const agentAssignmentsAgentIds = agentAssignments.map((agentAssignment) => agentAssignment.agentId);

      const params = new RequestParamBuilder();
      if (agentAssignmentsAgentIds.length > 0) {
        params.addFilter({ field: 'agentId', operator: FilterType.NOTIN, value: agentAssignmentsAgentIds });
      }

      this.gs.getAll(SERV.AGENTS, params.create()).subscribe((responseAgents: ResponseWrapper) => {
        const responseBodyAgents = { data: responseAgents.data, included: responseAgents.included };
        const agents = this.serializer.deserialize<JAgent[]>(responseBodyAgents);
        this.availAgents = agents;

        // this.assigAgents = res.values.map((mainObject) => {
        //   const matchObject = agents.values.find((element) => element.agentId === mainObject.agentId);
        //   return { ...mainObject, ...matchObject };
        // });
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
          this.snackBar.open('Agent assigned!', 'Close');
        });
    }
  }

  /**
   * This function calculates Keyspace searched, Time Spent and Estimated Time
   *
   **/
  timeCalc(chunks: JChunk[]) {
    const cprogress = [];
    const timespent = [];
    const current = 0;
    for (let i = 0; i < chunks.length; i++) {
      cprogress.push(chunks[i].checkpoint - chunks[i].skip);
      if (chunks[i].dispatchTime > current) {
        timespent.push(chunks[i].solveTime - chunks[i].dispatchTime);
      } else if (chunks[i].solveTime > current) {
        timespent.push(chunks[i].solveTime - current);
      }
    }
    this.cprogress = cprogress.reduce((a, i) => a + i);
    this.ctimespent = timespent.reduce((a, i) => a + i);
  }

  assignChunksInit(id: number) {
    this.route.data.subscribe((data) => {
      switch (data['kind']) {
        case 'edit-task':
          this.chunkview = 0;
          this.chunktitle = 'Live Chunks';
          this.chunkresults = 60000;
          // this.slideToggle.checked = false;
          break;
        case 'edit-task-cAll':
          this.chunkview = 1;
          this.chunktitle = 'All Chunks';
          this.chunkresults = 60000;
          // this.slideToggle.checked = true;
          break;
      }
    });

    //TODO. It is repeting code to get the speed
    const page = { size: this.chunkresults };

    const paramsChunks = new RequestParamBuilder()
      .addFilter({ field: 'taskId', operator: FilterType.EQUAL, value: this.editedTaskIndex })
      .create();

    this.gs.getAll(SERV.CHUNKS, paramsChunks).subscribe((response: ResponseWrapper) => {
      const responseChunks = { data: response.data, included: response.included };
      const chunks = this.serializer.deserialize<JChunk[]>(responseChunks);
      this.timeCalc(chunks);

      const paramsAgents = new RequestParamBuilder().create();

      this.gs.getAll(SERV.AGENTS, paramsAgents).subscribe((respAgents: ResponseWrapper) => {
        const responseAgents = { data: respAgents.data, included: respAgents.included };
        const agents = this.serializer.deserialize<JAgent[]>(responseAgents);

        const getchunks = chunks.map((mainObject) => {
          const matchObject = agents.find((element) => element.id === mainObject.agentId);
          return { ...mainObject, ...matchObject };
        });

        if (this.chunkview == 0) {
          const chunktime = this.uiService.getUIsettings('chunktime').value;
          const resultArray = [];
          const cspeed = [];
          for (let i = 0; i < getchunks.length; i++) {
            if (
              Date.now() / 1000 - Math.max(getchunks[i].solveTime, getchunks[i].dispatchTime) < chunktime &&
              getchunks[i].progress < 10000
            ) {
              this.isactive = 1;
              cspeed.push(getchunks[i].speed);
              resultArray.push(getchunks[i]);
            }
          }
          if (cspeed.length > 0) {
            this.currenspeed = cspeed.reduce((a, i) => a + i);
          }
        }
      });
    });
  }

  toggleIsAll(event) {
    if (this.chunkview === 0) {
      this.router.navigate(['/tasks/show-tasks', this.editedTaskIndex, 'edit', 'show-all-chunks']);
    } else {
      this.router.navigate(['/tasks/show-tasks', this.editedTaskIndex, 'edit']);
    }
  }

  /**
   * Helper functions
   *
   **/

  purgeTask() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn'
      },
      buttonsStyling: false
    });
    Swal.fire({
      title: 'Are you sure?',
      text: "It'll purge the Task!",
      icon: 'warning',
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonColor: this.alert.cancelButtonColor,
      confirmButtonColor: this.alert.confirmButtonColor,
      confirmButtonText: this.alert.purgeText
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = { taskId: this.editedTaskIndex };
        this.gs.chelper(SERV.HELPER, 'purgeTask', payload).subscribe(() => {
          this.alert.okAlert('Purged task id' + this.editedTaskIndex + '', '');
          this.ngOnInit();
        });
      } else {
        swalWithBootstrapButtons.fire({
          title: 'Cancelled',
          text: 'Purge was cancelled!',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  /**
   * Task Speed Grap
   *
   **/
  initTaskSpeed(obj: object) {
    echarts.use([
      TitleComponent,
      ToolboxComponent,
      TooltipComponent,
      GridComponent,
      VisualMapComponent,
      DataZoomComponent,
      MarkLineComponent,
      LineChart,
      CanvasRenderer,
      UniversalTransition
    ]);

    type EChartsOption = echarts.ComposeOption<
      | TitleComponentOption
      | ToolboxComponentOption
      | TooltipComponentOption
      | GridComponentOption
      | VisualMapComponentOption
      | DataZoomComponentOption
      | MarkLineComponentOption
      | LineSeriesOption
    >;

    const data: any = obj;
    const arr = [];
    const max = [];
    const result = [];

    data.reduce(function (res, value) {
      if (!res[value.time]) {
        res[value.time] = { time: value.time, speed: 0 };
        result.push(res[value.time]);
      }
      res[value.time].speed += value.speed;
      return res;
    }, {});

    for (let i = 0; i < result.length; i++) {
      const iso = this.transDate(result[i]['time']);

      arr.push([
        iso,
        this.fs.transform(result[i]['speed'], false, 1000).match(/\d+(\.\d+)?/)[0],
        this.fs.transform(result[i]['speed'], false, 1000).slice(-2)
      ]);
      max.push(result[i]['time']);
    }

    const startdate = max.slice(0)[0];
    const enddate = max.slice(-1)[0];
    const datelabel = this.transDate(enddate);
    const xAxis = this.generateIntervalsOf(1, +startdate, +enddate);

    const chartDom = document.getElementById('tspeed');
    const myChart = echarts.init(chartDom);
    let option: EChartsOption;

    const self = this;

    option = {
      title: {
        subtext: 'Last record: ' + datelabel
      },
      tooltip: {
        position: 'top',
        formatter: function (p) {
          return p.data[0] + ': ' + p.data[1] + ' ' + p.data[2] + ' H/s';
        }
      },
      grid: {
        left: '5%',
        right: '4%'
      },
      xAxis: {
        data: xAxis.map(function (item: any[] | any) {
          return self.transDate(item);
        })
      },
      yAxis: {
        type: 'value',
        name: 'H/s',
        position: 'left',
        alignTicks: true
      },
      useUTC: true,
      toolbox: {
        itemGap: 10,
        show: true,
        left: '85%',
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {
            name: 'Task Speed'
          }
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 94,
          end: 100,
          handleSize: 8
        },
        {
          type: 'inside',
          start: 70,
          end: 100
        }
      ],
      series: {
        name: '',
        type: 'line',
        data: arr,
        connectNulls: true,
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          lineStyle: {
            color: '#333'
          }
        }
      }
    };
    if (data.length > 0) {
      option && myChart.setOption(option);
    }
  }

  leading_zeros(dt) {
    return (dt < 10 ? '0' : '') + dt;
  }

  transDate(dt) {
    const date: any = new Date(dt * 1000);
    // American Format
    // return date.getUTCFullYear()+'-'+this.leading_zeros((date.getUTCMonth() + 1))+'-'+date.getUTCDate()+','+this.leading_zeros(date.getUTCHours())+':'+this.leading_zeros(date.getUTCMinutes())+':'+this.leading_zeros(date.getUTCSeconds());
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
