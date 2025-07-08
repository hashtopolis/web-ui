import { FilterType } from 'src/app/core/_models/request-params.model';

import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { JChunk } from '@models/chunk.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask, JTaskWrapper, TaskType } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

@Component({
  selector: 'task-visual',
  template: `
    <canvas #myCanvas style="border: 1px solid;" width="{{ x }}" height="{{ y }}" class="img-fluid">
      Fallback content
    </canvas>
  `,
  host: {
    '(window:resize)': 'onWindowResize($event)'
  },
  standalone: false
})
export class TaskVisualComponent implements AfterViewInit {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() view: any;
  @Input() tkeyspace: any;
  @Input() taskid: any;
  @Input() taskWrapperId: any;
  @Input() cprogress: any;
  @Input() tusepreprocessor: any;
  private ctx: CanvasRenderingContext2D;
  // public x = 1500;
  public x: number = window.innerWidth; // Dynamic width
  public y = 32;

  getWidth() {
    if (document.body.className.includes('fixed-width-layout')) {
      this.x = 1467;
    } else if (document.body.className.includes('full-width-layout')) {
      this.x = $(window).width() - 50;
    }
  }

  constructor(private gs: GlobalService) {
    this.getWidth();
  }

  onWindowResize() {
    this.getWidth();
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');

    this.drawPoint();
  }

  drawPoint() {
    const maxResults = 10000;
    const paramsTasks = new RequestParamBuilder()
      .addFilter({ field: 'taskId', operator: FilterType.EQUAL, value: this.taskid })
      .setPageSize(maxResults)
      .create();

    this.gs.getAll(SERV.TASKS, paramsTasks).subscribe((response: ResponseWrapper) => {
      const responseBody = { data: response.data, included: response.included };
      const tasks = new JsonAPISerializer().deserialize<JTask[]>(responseBody);

      const paramsTaskWrapper = new RequestParamBuilder()
        .addFilter({ field: 'taskWrapperId', operator: FilterType.EQUAL, value: tasks[0].taskWrapperId })
        .setPageSize(maxResults)
        .create();

      this.gs.getAll(SERV.TASKS_WRAPPER, paramsTaskWrapper).subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const taskWrappers = new JsonAPISerializer().deserialize<JTaskWrapper[]>(responseBody);
        if (taskWrappers[0].taskType === TaskType.SUPERTASK && this.view === 'supertask') {
          for (let i = 0; i < taskWrappers.length; i++) {
            this.gs.getAll(SERV.CHUNKS, paramsTasks).subscribe((response: ResponseWrapper) => {
              const responseBody = { data: response.data, included: response.included };
              const chunks = new JsonAPISerializer().deserialize<JChunk[]>(responseBody);

              const progress = [];
              let cracked = [];
              for (let i = 0; i < chunks.length; i++) {
                progress.push(chunks[i].progress);
                cracked.push(chunks[i].cracked);
              }
              progress.reduce((a, i) => a + i, 0);
              cracked = cracked.reduce((a, i) => a + i, 0);

              if (cracked.length > 0) {
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(
                  (i * this.x) / taskWrappers.length,
                  0,
                  ((i + 1) * this.x) / taskWrappers.length,
                  this.y - 1
                );
              }
              //ToDo need to get the task keypace
              // if(){
              //   this.ctx.fillStyle = "#0000FF";
              //   this.ctx.strokeRect(i*this.x/taskWrappers.length, 0, (i+1)*this.x/taskWrappers.length, (this.y-1));
              // }
              // if(){
              //   this.ctx.fillStyle = "#00ff00";
              //   this.ctx.strokeRect(i*this.x/taskWrappers.length, 0, (i+1)*this.x/taskWrappers.length, (this.y-1));
              // }
              else {
                this.ctx.fillStyle = '#c0c0c0';
                this.ctx.fillRect(
                  (i * this.x) / taskWrappers.length,
                  0,
                  ((i + 1) * this.x) / taskWrappers.length,
                  this.y - 1
                );
              }
            });
          }
        } else {
          this.gs.getAll(SERV.CHUNKS, paramsTasks).subscribe((response: ResponseWrapper) => {
            const responseBody = { data: response.data, included: response.included };
            const ch = new JsonAPISerializer().deserialize<JChunk[]>(responseBody); // Get chunks by id

            // Getting variables
            const keyspace = Number(this.tkeyspace); // Get Keyspace Progress
            const progress = Number(this.cprogress); // Get Progress

            // this.ctx.beginPath();
            for (let i = 0; i < ch.length; i++) {
              if (this.tusepreprocessor === 1 && this.tkeyspace <= 0) {
                break;
              }
              const start = Math.floor(((this.x - 1) * ch[i]['skip']) / keyspace);
              const end = Math.floor(((this.x - 1) * (ch[i]['skip'] + ch[i]['length'])) / keyspace) - 1;
              let current =
                Math.floor(((this.x - 1) * (ch[i]['skip'] + (ch[i]['length'] * progress) / 10000)) / keyspace) - 1;

              if (current > end) {
                current = end;
              }

              if (end - start < 3) {
                if (ch[i]['state'] >= 6) {
                  this.ctx.fillStyle = '#ff0000'; //Red
                  this.ctx.fillRect(start, 0, end, this.y - 1);
                }
                if (ch[i]['cracked'] > 0) {
                  this.ctx.fillStyle = '#00ff00'; //Green
                  this.ctx.fillRect(start, 0, end, this.y - 1);
                } else {
                  this.ctx.fillStyle = '#ffff00'; //Yellow
                  this.ctx.fillRect(start, 0, end, this.y - 1);
                }
              } else {
                if (ch[i]['state'] >= 6) {
                  this.ctx.fillStyle = '#ff0000'; //Red
                  this.ctx.fillRect(start, 0, end, this.y - 1);
                } else {
                  this.ctx.fillStyle = '#c0c0c0'; //Gray
                  this.ctx.fillRect(start, 1, end, this.y);
                }
                if (ch[i]['cracked'] > 0) {
                  this.ctx.fillStyle = '#00ff00'; //Green
                  this.ctx.fillRect(start + 1, 1, current - 1, this.y - 2);
                } else {
                  this.ctx.fillStyle = '#ffff00'; //Yellow
                  this.ctx.fillRect(start + 1, 1, current - 1, this.y - 2);
                }
              }
            }
          });
        }
      });
    });
  }
}
