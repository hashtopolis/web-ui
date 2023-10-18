import { TitleComponent,TitleComponentOption, ToolboxComponent, ToolboxComponentOption,TooltipComponent,TooltipComponentOption,GridComponent,GridComponentOption,LegendComponent,MarkLineComponent,MarkPointComponent,MarkLineComponentOption} from 'echarts/components';
import { faAlignJustify, faIdBadge, faComputer, faKey, faInfoCircle, faEye } from '@fortawesome/free-solid-svg-icons';
import { faLinux, faWindows, faApple } from '@fortawesome/free-brands-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ASC } from '../../core/_constants/agentsc.config';
import { UniversalTransition } from 'echarts/features';
import { DataTableDirective } from 'angular-datatables';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { Subject } from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';
import { AlertService } from 'src/app/core/_services/shared/alert.service';

@Component({
  selector: 'app-edit-agent',
  templateUrl: './edit-agent.component.html'
})
@PageTitle(['Edit Agent'])
export class EditAgentComponent implements OnInit {

  editMode = false;
  editedAgentIndex: number;
  editedAgent: any // Change to Model

  faAlignJustify=faAlignJustify;
  faInfoCircle=faInfoCircle;
  faComputer=faComputer;
  faIdBadge=faIdBadge;
  faWindows=faWindows;
  faLinux=faLinux;
  faApple=faApple;
  faKey=faKey;
  faEye=faEye;

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private uiService: UIConfigService,
    private route:ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) { }

  updateAssignForm: FormGroup;
  updateForm: FormGroup;
  assignTasks: any = [];
  showagent: any = [];
  groups: any = [];
  users: any = [];
  assignNew: any;
  assignId: any;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedAgentIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
        this.assignChunksInit(this.editedAgentIndex);
      }
    );

    this.updateForm = new FormGroup({
      'isActive': new FormControl(''),
      'userId': new FormControl({value: '', disabled: true}),
      'agentName': new FormControl(''),
      'token': new FormControl({value: '', disabled: true}),
      'cpuOnly': new FormControl(),
      'cmdPars': new FormControl(''),
      'ignoreErrors': new FormControl(''),
      'isTrusted': new FormControl('')
    });

    this.updateAssignForm = new FormGroup({
      'taskId': new FormControl(''),
    });

    const id = +this.route.snapshot.params['id'];
    this.gs.get(SERV.AGENTS,id,{'expand':'agentstats,accessGroups'}).subscribe((agent: any) => {
      this.showagent = agent;
      this.groups = agent.accessGroups;
      this.agentStats(agent.agentstats);
    });

    // Get Task for Assigment
    this.gs.getAll(SERV.TASKS, {'maxResults': this.maxResults, 'filter': 'isArchived=false'}).subscribe((tasks: any) => {
      this.assignTasks = tasks.values.filter(u=> u.keyspaceProgress < u.keyspace || Number(u.keyspaceProgress) === 0 ); //Remove completed tasks
    });

    this.gs.getAll(SERV.USERS, {'maxResults': this.maxResults}).subscribe((user: any) => {
      this.users = user.values;
    });

  }

  timespent: number;
  getchunks: any;

  timeCalc(chunks){
    const tspent = [];
    for(let i=0; i < chunks.length; i++){
      tspent.push(Math.max(chunks[i].solveTime, chunks[i].dispatchTime)-chunks[i].dispatchTime);
    }
    this.timespent = tspent.reduce((a, i) => a + i);
  }

  assignChunksInit(id: number){
    const params = {'maxResults': 999999};
    this.gs.getAll(SERV.CHUNKS,params).subscribe((c: any)=>{
      const getchunks = c.values.filter(u=> u.agentId == id);
      this.gs.getAll(SERV.TASKS,params).subscribe((t: any)=>{
        this.getchunks = getchunks.map(mainObject => {
          const matchObjectAgents = t.values.find(e => e.taskId === mainObject.taskId)
          return { ...mainObject, ...matchObjectAgents}
        })
      this.timeCalc(this.getchunks);
      this.dtTrigger.next(void 0);
      })
    });

    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      scrollY: "700px",
      scrollX: true,
      lengthMenu: [
        [10, 25, 50, 100, 250, -1],
        [10, 25, 50, 100, 250, 'All']
      ],
      pageLength: 25,
      scrollCollapse: true,
      paging: false,
      destroy: true,
      buttons: {
          dom: {
            button: {
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
            }
          },
      buttons:[
        {
          text: '↻',
          autoClose: true,
          action: function (e, dt, node, config) {
            self.onRefresh();
          }
        },
        {
          extend: 'colvis',
          text: 'Column View',
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        }
      ]
      }
    }
  }

  onRefresh(){
    this.ngOnInit();
    this.rerender();  // rerender datatables
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }

  onSubmit(){
    if (this.updateForm.valid) {
      this.onUpdateAssign(this.updateAssignForm.value);
      this.gs.update(SERV.AGENTS,this.editedAgentIndex,this.updateForm.value).subscribe(() => {
        this.alert.okAlert('Agent saved!','');
        this.updateForm.reset(); // success, we reset form
        this.router.navigate(['agents/show-agents']);
      });
    }
  }

  onUpdateAssign(val: any){
    const id = Number(val['taskId']);
    if(id){
        const payload = {"taskId": Number(val['taskId']), "agentId": this.editedAgentIndex};
        this.gs.create(SERV.AGENT_ASSIGN,payload).subscribe();
    }
    if(id === 0){
      this.gs.delete(SERV.AGENT_ASSIGN,this.assignId).subscribe();
    }
  }

  private initForm() {
    if (this.editMode) {
      this.gs.get(SERV.AGENTS,this.editedAgentIndex).subscribe((result)=>{
      this.updateForm = new FormGroup({
        'isActive': new FormControl(result['isActive'], [Validators.required]),
        'userId': new FormControl(result['userId']),
        'agentName': new FormControl(result['agentName'], [Validators.required]),
        'token': new FormControl(result['token']),
        'cpuOnly': new FormControl(result['cpuOnly']),
        'cmdPars': new FormControl(result['cmdPars']),
        'ignoreErrors': new FormControl(result['ignoreErrors']),
        'isTrusted': new FormControl(result['isTrusted'])
      });
    });
    this.gs.getAll(SERV.AGENT_ASSIGN, {'filter':'agentId='+this.editedAgentIndex+''}).subscribe((assign: any) => {
      this.assignNew = assign?.values[0]['taskId'] ? true: false;
      this.assignId = assign?.values[0]['assignmentId'];
      this.updateAssignForm = new FormGroup({
          'taskId': new FormControl(assign?.values[0]['taskId']),
        });
    });
   }
  }

  // //
  //  GRAPHS SECTION
  // //

  agentStats(obj: any){
    this.getGraph(obj.filter(u=> u.statType == ASC.GPU_TEMP),ASC.GPU_TEMP,'tempgraph'); // filter Device Temperature
    this.getGraph(obj.filter(u=> u.statType == ASC.GPU_UTIL),ASC.GPU_UTIL,'devicegraph'); // filter Device Utilization
    this.getGraph(obj.filter(u=> u.statType == ASC.CPU_UTIL),ASC.CPU_UTIL,'cpugraph'); // filter CPU utilization
  }

  // Temperature Graph
getGraph(obj: object, status: number, name: string){

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

  if(ASC.GPU_TEMP === status){
    if(this.getTemp2() > 100){ templabel = '°F'}else{ templabel = '°C'}
  }
  if(ASC.GPU_UTIL === status){
    templabel = '%';
  }
  if(ASC.CPU_UTIL === status){
    templabel = '%'
  }

  // console.log(this.getTemp1());  //Min temp
  // console.log(this.getTemp2());  //Max temp

  const data:any = obj;
  const arr = [];
  const max = [];
  const devlabels = [];
  const result:any = obj;

  for(let i=0; i < result.length; i++){
    let val = result[i].value;
    for(let i=0; i < val.length; i++){
      const iso = this.transDate(result[i]['time']);
      arr.push({ 'time': iso, 'value': val[i], 'device': i});
      max.push(result[i]['time']);
      devlabels.push('Device '+i+'');
    }
  }

  const grouped = [];
  arr.forEach(function (a) {
    grouped[a.device] = grouped[a.device] || [];
    grouped[a.device].push({ time: a.time, value: a.value });
  });

  let labels = [...new Set(devlabels)];

  const startdate =  Math.max(...max);
  const datelabel = this.transDate(startdate);
  const xAxis = this.generateIntervalsOf(1,+startdate-500,+startdate);

  const chartDom = document.getElementById(name);
  const myChart = echarts.init(chartDom);
  let option: EChartsOption;

  const seriesData= [];
  for(let i=0; i < grouped.length; i++){
    seriesData.push({
      name: 'Device '+i+'',
      type: 'line',
      data: grouped[i],
      markLine: {
        data: [{ type: 'average', name: 'Avg' }],
        symbol:['none', 'none'],
    }})
  }

  const self = this;
  option = {
    tooltip: {
      position: 'top',
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
          name: "Device Temperature"
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
        formatter: '{value} '+templabel+''
      }
    },
    series: seriesData
  };
  option && myChart.setOption(option);
 }

getTemp1(){  // Temperature Config Setting
  return this.uiService.getUIsettings('agentTempThreshold1').value;
 }

getTemp2(){  // Temperature 2 Config Setting
  return this.uiService.getUIsettings('agentTempThreshold2').value;
}

transDate(dt){
  const date:any = new Date(dt* 1000);
  return date.getUTCDate()+'-'+this.leading_zeros((date.getUTCMonth() + 1))+'-'+date.getUTCFullYear()+','+this.leading_zeros(date.getUTCHours())+':'+this.leading_zeros(date.getUTCMinutes())+':'+this.leading_zeros(date.getUTCSeconds());
 }

leading_zeros(dt){
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
