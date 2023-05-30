import { faInfoCircle, faUserSecret, faTasks, faTasksAlt, faChainBroken, faCalendarWeek, faCalendarDay, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { TitleComponent, CalendarComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { Component, ElementRef, OnInit } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { environment } from 'src/environments/environment';
import { CanvasRenderer } from 'echarts/renderers';
import { interval, Subscription } from 'rxjs';
import { HeatmapChart } from 'echarts/charts';
import * as echarts from 'echarts/core';

import { SuperTasksService } from '../core/_services/tasks/supertasks.sevice';
import { HashesService } from '../core/_services/hashlist/hashes.service';
import { AgentsService } from '../core/_services/agents/agents.service';
import { TasksService } from '../core/_services/tasks/tasks.sevice';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  title = 'Hastopolis';
  username: string = 'Admin';

  faCalendarWeek=faCalendarWeek;
  faChainBroken=faChainBroken;
  faCheckCircle=faCheckCircle;
  faCalendarDay=faCalendarDay;
  faInfoCircle=faInfoCircle;
  faUserSecret=faUserSecret;
  faTasksAlt=faTasksAlt;
  faTasks=faTasks;

  faGithub=faGithub;

  getUsername(){
      return this.username;
  }

  // Dashboard variables
  activeAgents: number = 0;
  totalAgents: number = 0;
  totalTasks: number = 0;
  totalCracks: number = 0;
  allsupertasks: number = 0;

  private maxResults = environment.config.prodApiMaxResults;
  private updateSubscription: Subscription;
  public punchCardOpts = {}
  public punchCardOptss = {}

  constructor(
    private supertaskService: SuperTasksService,
    private agentsService: AgentsService,
    private hashesService: HashesService,
    private tasksService: TasksService,
    private elementRef: ElementRef
  ) { }

  async ngOnInit(): Promise<void> {

    this.initData();
    this.updateSubscription = interval(300000).subscribe(
      (val) => { this.initData()});

  }

  async initData() {

    // Agents
    let params = {'maxResults': this.maxResults}

    this.agentsService.getAgents(params).subscribe((agents: any) => {
      this.totalAgents = agents.total | 0;
      this.activeAgents = agents.values.filter(u=> u.isActive == true).length | 0;
    });

    //  Tasks
    let paramst = {'maxResults': this.maxResults, 'filter': 'isArchived=false'}

    this.tasksService.getAlltasks(paramst).subscribe((tasks: any) => {
      this.totalTasks = tasks.values.filter(u=> u.isArchived != true).length | 0;
    });

    // SuperTasks
    this.supertaskService.getAllsupertasks(params).subscribe((stasks: any) => {
      this.allsupertasks = stasks.total | 0;
    });

    // Cracks
    // let paramsc = {'maxResults': this.maxResults, 'filter': 'isCracked='+true+''}
    let paramsc = {'maxResults': this.maxResults }

    this.hashesService.getAllhashes(paramsc).subscribe((hashes: any) => {
      let lastseven:any = new Date() ;
      lastseven = lastseven.setDate(lastseven.getDate() - 7).valueOf()/1000;
      let lastsevenObject = hashes.values.filter(u=> (u.isCracked == true && u.timeCracked > lastseven ));
      this.totalCracks = lastsevenObject.length | 0;
      this.initCrackCard(hashes.values);
    });

  }

  // Graphs Section

  initCrackCard(obj: any){

    let date_today = new Date();
    let year = (new Date()).getFullYear();
    let first_day_of_the_week = new Date(date_today.setDate(date_today.getDate() - date_today.getDay() ));
    let epochtime = Math.round(first_day_of_the_week.setDate(first_day_of_the_week.getDate()).valueOf()/1000);

    let filterdate = obj.filter(u=> (u.isCracked == true ));

    var arr = [];
    for(let i=0; i < filterdate.length; i++){
      let date:any = new Date(filterdate[i]['timeCracked']* 1000);
      var iso = date.getUTCFullYear()+'-'+(date.getUTCMonth() + 1)+'-'+date.getUTCDate();
      arr.push([iso]);
    }

    var counts = arr.reduce((p, c) => {
      var weekd = c[0];
      if (!p.hasOwnProperty(weekd)) {
        p[weekd] = 0;
      }
      p[weekd]++;
      return p;
    }, {});

    var countsExtended = Object.keys(counts).map(k => {
      return [k, counts[k]]
    }, {});

    echarts.use([
      TitleComponent,
      CalendarComponent,
      TooltipComponent,
      VisualMapComponent,
      HeatmapChart,
      CanvasRenderer
    ]);

    var chartDom = document.getElementById('pcard');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {},
      tooltip: {
        position: 'top',
        formatter: function (p) {
          const format = echarts.time.format(p.data[0], '{dd}-{MM}-{yyyy}', false);
          return format + ': ' + p.data[1];
        }
      },
      visualMap: {
        min: 0,
        max: 300,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 65
      },
      calendar: {
        top: 120,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: year,
        itemStyle: {
          borderWidth: 0.5
        },
        yearLabel: { show: false }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: countsExtended,
        label: {
          show: true,
          formatter: function (p) {
            if(date_today.getDate() == p.data[0]){
              return 'X';
            }
            else{
              return '';
            }
          }
        },
      }
    };
    option && myChart.setOption(option);
  }
}

