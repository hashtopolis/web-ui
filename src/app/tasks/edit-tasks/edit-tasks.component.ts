import { TitleComponent, TitleComponentOption, ToolboxComponent, ToolboxComponentOption, TooltipComponent, TooltipComponentOption, GridComponent, GridComponentOption, VisualMapComponent, VisualMapComponentOption, DataZoomComponent, DataZoomComponentOption, MarkLineComponent, MarkLineComponentOption } from 'echarts/components';
import { faHomeAlt, faEye, faEraser } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { DataTableDirective } from 'angular-datatables';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Observable, Subject } from 'rxjs';
import * as echarts from 'echarts/core';

import { HashtypeService } from 'src/app/core/_services/config/hashtype.service';
import { PendingChangesGuard } from 'src/app/core/_guards/pendingchanges.guard';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { HashesService } from 'src/app/core/_services/hashlist/hashes.service';
import { CrackerService } from '../../core/_services/config/cracker.service';
import { AgentsService } from '../../core/_services/agents/agents.service';
import { UsersService } from 'src/app/core/_services/users/users.service';
import { ChunkService } from '../../core/_services/tasks/chunks.service';
import { TasksService } from '../../core/_services/tasks/tasks.sevice';

@Component({
  selector: 'app-edit-tasks',
  templateUrl: './edit-tasks.component.html'
})
export class EditTasksComponent implements OnInit,PendingChangesGuard {

  editMode = false;
  editedTaskIndex: number;
  editedTask: any // Change to Model

  faEraser=faEraser;
  faHome=faHomeAlt;
  faEye=faEye;

  isLoading = false;

  constructor(
    private hashtypeService: HashtypeService,
    private crackerService: CrackerService,
    private agentsService: AgentsService,
    private hashesService: HashesService,
    private tasksService: TasksService,
    private chunkService: ChunkService,
    private uiService:UIConfigService,
    private route: ActivatedRoute,
    private users: UsersService,
    private router: Router
  ) { }

  updateForm: FormGroup;
  color: string = '';
  private maxResults = environment.config.prodApiMaxResults;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  uidateformat:any;
  crackerinfo:any;
  getchunks: any;

  ngOnInit() {

    this.setAccessPermissions();

    this.uidateformat = this.uiService.getUIsettings('timefmt').value;

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedTaskIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
        this.assignChunksInit(this.editedTaskIndex);
      }
    );

    this.updateForm = new FormGroup({
      'taskId': new FormControl({value: '', disabled: true}),
      'forcePipe': new FormControl({value: '', disabled: true}),
      'skipKeyspace': new FormControl({value: '', disabled: true}),
      'keyspace': new FormControl({value: '', disabled: true}),
      'keyspaceProgress': new FormControl({value: '', disabled: true}),
      'crackerBinaryId': new FormControl({value: '', disabled: true}),
      'chunkSize': new FormControl({value: '', disabled: true}),
      'updateData': new FormGroup({
        'taskName': new FormControl(''),
        'attackCmd': new FormControl(''),
        'notes': new FormControl(''),
        'color': new FormControl(''),
        'chunkTime': new FormControl(''),
        'statusTimer': new FormControl(''),
        'priority': new FormControl(''),
        'maxAgents': new FormControl(''),
        'isCpuTask': new FormControl(''),
        'isSmall': new FormControl(''),
      }),
    });

    this.getTaskSpeed();

  }

  // Set permissions
  manageTaskAccess: any;

  setAccessPermissions(){
    this.users.getUser(this.users.userId,{'expand':'globalPermissionGroup'}).subscribe((perm: any) => {
        this.manageTaskAccess = perm.globalPermissionGroup.permissions.manageTaskAccess;
    });
  }

  OnChangeValue(value){
    this.updateForm.patchValue({
      updateData:{color: value}
    });
  }

  onSubmit(){
    if(this.manageTaskAccess || typeof this.manageTaskAccess == 'undefined'){
    if (this.updateForm.valid) {

      this.isLoading = true;

      this.tasksService.updateTask(this.editedTaskIndex,this.updateForm.value['updateData']).subscribe((tasks: any) => {
        const response = tasks;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "Task updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset(); // success, we reset form
          this.router.navigate(['tasks/show-tasks']);
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "Task was not created, please try again!",
            icon: "warning",
            showConfirmButton: true
          });
        }
      );
    }
    }else{
      Swal.fire({
        title: "ACTION DENIED",
        text: "Please contact your Administrator.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  private initForm() {
    this.isLoading = true;
    if (this.editMode) {
    this.tasksService.getTask(this.editedTaskIndex).subscribe((result)=>{
      this.color = result['color'];
      this.crackerService.getCrackerBinary(result['crackerBinaryId']).subscribe((val) => {
        this.crackerinfo = val;
      });
      this.getHashlist();
      this.tkeyspace = result['keyspace'];
      this.tusepreprocessor = result['preprocessorId'];
      this.updateForm = new FormGroup({
        'taskId': new FormControl(result['taskId']),
        'forcePipe': new FormControl(result['forcePipe']== true? 'Yes':'No'),
        'skipKeyspace': new FormControl(result['skipKeyspace'] > 0?result['skipKeyspace']:'N/A'),
        'keyspace': new FormControl(result['keyspace']),
        'keyspaceProgress': new FormControl(result['keyspaceProgress']),
        'crackerBinaryId': new FormControl(result['crackerBinaryId']),
        'chunkSize': new FormControl(result['chunkSize']),
        'updateData': new FormGroup({
          'taskName': new FormControl(result['taskName']),
          'attackCmd': new FormControl(result['attackCmd']),
          'notes': new FormControl(result['notes']),
          'color': new FormControl(result['color']),
          'chunkTime': new FormControl(Number(result['chunkTime'])),
          'statusTimer': new FormControl(result['statusTimer']),
          'priority': new FormControl(result['priority']),
          'maxAgents': new FormControl(result['maxAgents']),
          'isCpuTask': new FormControl(result['isCpuTask']),
          'isSmall': new FormControl(result['isSmall']),
        }),
      });
      this.isLoading = false;
    });
   }
  }

  attachFilesInit(id: number){
    this.dtOptions[0] = {
      dom: 'Bfrtip',
      scrollY: "700px",
      scrollCollapse: true,
      paging: false,
      autoWidth: false,
      buttons: {
          dom: {
            button: {
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
            }
          },
      buttons:[]
      }
    }
  }

  assingAgentInit(id: number){
    this.dtOptions[1] = {
      dom: 'Bfrtip',
      scrollY: "700px",
      scrollCollapse: true,
      paging: false,
      destroy: true,
      buttons: {
          dom: {
            button: {
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
            }
          },
      buttons:[]
      }
    }
  }

/**
 * This function calculates Keyspace searched, Time Spent and Estimated Time
 *
**/
  // Keyspace searched
  cprogress: any;
  tkeyspace: any;
  tusepreprocessor: any;
  // Time Spent
  ctimespent: any;
  timeCalc(chunks){
      var cprogress = [];
      var timespent = [];
      var current = 0;
      for(let i=0; i < chunks.length; i++){
        cprogress.push(chunks[i].checkpoint - chunks[i].skip);
        if(chunks[i].dispatchTime > current){
          timespent.push(chunks[i].solveTime - chunks[i].dispatchTime);
        } else if (chunks[i].solveTime > current) {
          timespent.push(chunks[i].solveTime- current);
        }
      }
      this.cprogress = cprogress.reduce((a, i) => a + i);
      this.ctimespent = timespent.reduce((a, i) => a + i);
  }

  // Chunk View
  chunkview: number;
  isactive: number = 0;
  currenspeed: number = 0;
  chunkresults: Object;
  activechunks: Object;

  assignChunksInit(id: number){
    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'edit-task':
          this.chunkview = 0;
          this.chunkresults = this.maxResults;
        break;

        case 'edit-task-c100':
          this.chunkview = 1;
          this.chunkresults = 100;
        break;

        case 'edit-task-cAll':
          this.chunkview = 2;
          this.chunkresults = 6000;
        break;

      }
    });
    let params = {'maxResults': this.chunkresults};
    this.chunkService.getChunks(params).subscribe((result: any)=>{
      var getchunks = result.values.filter(u=> u.taskId == id);
      this.timeCalc(getchunks);
      this.agentsService.getAgents(params).subscribe((agents: any) => {
      this.getchunks = getchunks.map(mainObject => {
        let matchObject = agents.values.find(element => element.agentId === mainObject.agentId)
        return { ...mainObject, ...matchObject }
        })
      if(this.chunkview == 0){
        let chunktime = this.uiService.getUIsettings('chunktime').value;
        var resultArray = [];
        var cspeed = [];
        for(let i=0; i < this.getchunks.length; i++){
          if(Date.now() - Math.max(this.getchunks[i].solveTime, this.getchunks[i].dispatchTime) < chunktime && this.getchunks[i].progress < 10000){
            this.isactive = 1;
            cspeed.push(this.getchunks[i].speed);
            resultArray.push(this.getchunks[i]);
          }
        }
        this.currenspeed = cspeed.reduce((a, i) => a + i);
        this.getchunks = resultArray;
      }
      this.dtTrigger.next(void 0);
      });
    });

    this.dtOptions[2] = {
      dom: 'Bfrtip',
      scrollY: "700px",
      scrollCollapse: true,
      paging: false,
      destroy: true,
      buttons: {
          dom: {
            button: {
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
            }
          },
      buttons:[]
      }
    }
  }

/**
 * This function reset information in the selected chunk, sets to zero; Dispatch Time, Solve Time, Progress and State
 *
**/
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

  onReset(id: number){
    let reset = {'dispatchTime':0, 'solveTime':0, 'progress':0,'state':0};
    this.chunkService.updateChunk(id, reset).subscribe(()=>{
      Swal.fire({
        title: "Chunk Reset!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      });
      this.ngOnInit();
      this.rerender();
    });
  }
// Get HashList Information
hashL: any;

getHashlist(){
  let params = {'maxResults': this.maxResults, 'expand': 'hashlist', 'filter': 'taskId='+this.editedTaskIndex+''}
  let paramsh = {'maxResults': this.maxResults};
  var matchObject =[]
  this.tasksService.getAlltasks(params).subscribe((tasks: any) => {
    this.hashtypeService.getHashTypes(paramsh).subscribe((htypes: any) => {
      this.hashL = tasks.values.map(mainObject => {
        matchObject.push(htypes.values.find((element:any) => element.hashTypeId === mainObject.hashlist.hashTypeId))
      return { ...mainObject, ...matchObject }
      })
    })
  })
}

// Task Speed Graph
getTaskSpeed(){
  this.editedTaskIndex;
  let params = {'maxResults': 500 };

  this.hashesService.getAllhashes(params).subscribe((hashes: any) => {
    this.initTaskSpeed(hashes.values);
  });
}

initTaskSpeed(obj: Object){

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

  var data:any = obj;
  var arr = [];
  var max = []
  for(let i=0; i < data.length; i++){

    var iso = this.transDate(data[i]['timeCracked']);
    arr.push([iso, data[i]['chunkId']]);
    max.push(data[i]['timeCracked']);
  }

  var startdate =  Math.max(...max);
  var datelabel = this.transDate(startdate);
  var xAxis = this.generateIntervalsOf(5,+startdate-50,+startdate);

  var chartDom = document.getElementById('tspeed')!;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  const self = this;

   option = {
        title: {
          subtext: 'Last record: '+datelabel,
        },
        tooltip: {
          position: 'top',
          formatter: function (p) {
            return p.data[0] + ': ' + p.data[1] + ' H/s';
          }
        },
        grid: {
          left: '5%',
          right: '15%',
          bottom: '10%'
        },
        xAxis: {
          data: xAxis.map(function (item: any[] | any) {
            return self.transDate(item);
          })
        },
        yAxis: {},
        toolbox: {
          right: 10,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [
          {
            startValue: datelabel
          },
          {
            type: 'inside'
          }
        ],
        visualMap: {
          top: 50,
          right: 10,
          pieces: [
            {
              gt: 0,
              lte: 30000,
              color: '#FC7D02'
            },
            {
              gt: 30000,
              lte: 60000,
              color: '#FBDB0F'
            },
            {
              gt: 60000,
              lte: 10000000,
              color: '#93CE07'
            }
          ],
          outOfRange: {
            color: '#999'
          }
        },
        series: {
          name: '',
          type: 'line',
          data: arr,
          markLine: {
            silent: true,
            lineStyle: {
              color: '#333'
            },
            data: [
              {
                yAxis: 50
              },
              {
                yAxis: 100
              },
              {
                yAxis: 150
              },
              {
                yAxis: 200
              },
              {
                yAxis: 300
              }
            ]
          }
          }
        };
    option && myChart.setOption(option);
 }

 leading_zeros(dt){
  return (dt < 10 ? '0' : '') + dt;
 }

 transDate(dt){
  let date:any = new Date(dt* 1000);
  return date.getUTCFullYear()+'-'+this.leading_zeros((date.getUTCMonth() + 1))+'-'+date.getUTCDate()+','+this.leading_zeros(date.getUTCHours())+':'+this.leading_zeros(date.getUTCMinutes())+':'+this.leading_zeros(date.getUTCSeconds());
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

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
        $event.returnValue = "IE and Edge Message";
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.updateForm.valid) {
    return false;
    }
    return true;
  }

}
