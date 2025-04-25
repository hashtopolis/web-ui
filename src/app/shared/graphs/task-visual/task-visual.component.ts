import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { GlobalService } from '../../../core/_services/main.service';
import { SERV } from '../../../core/_services/main.config';
import { FilterType } from 'src/app/core/_models/request-params.model';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { JTask } from '@models/task.model';
import { ResponseWrapper } from '@models/response.model';
import { JsonAPISerializer } from '@services/api/serializer-service';
import { JTaskWrapper } from '@models/task-wrapper.model';
import { JChunk } from '@models/chunk.model';

@Component({
    selector: 'task-visual',
    template: `
    <canvas
      #myCanvas
      style="border: 1px solid;"
      width="{{ x }}"
      height="{{ y }}"
      class="img-fluid"
    >
      Fallback content
    </canvas>
  `,
    host: {
        '(window:resize)': 'onWindowResize($event)'
    },
    standalone: false
})
export class TaskVisualomponent {
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

  getWidth(){
    if (document.body.className.includes('fixed-width-layout')) {
      this.x = 1467;
    } else if (document.body.className.includes('full-width-layout')) {
      this.x = $(window).width() - 50;
    }
  }

  constructor(private gs: GlobalService) {
    this.getWidth();
  }

  onWindowResize(event) {
    this.getWidth();
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');

    this.drawPoint();
  }

  drawBorder(xPos, yPos, width, height, thickness = 1) {
    this.ctx.fillStyle = '#000';
    this.ctx.rect(
      xPos - thickness,
      yPos - thickness,
      width + thickness * 2,
      height + thickness * 2
    );
    this.ctx.fill();
  }

  drawPoint() {
    const maxResults = 10000;
      const paramsTasks = new RequestParamBuilder()
      .addFilter({ field: 'taskId', operator: FilterType.EQUAL, value: this.taskid })
      .setPageSize(maxResults)
      .create();

    this.gs
      .getAll(SERV.TASKS, paramsTasks)
      .subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const tasks = new JsonAPISerializer().deserialize<JTask[]>(responseBody);


        const paramsTaskWrapper = new RequestParamBuilder()
          .addFilter({ field: 'taskWrapperId', operator: FilterType.EQUAL, value: tasks[0].taskWrapperId })
          .setPageSize(maxResults)
          .create();

        this.gs
          .getAll(SERV.TASKS_WRAPPER, paramsTaskWrapper)
          .subscribe((response: ResponseWrapper) => {
            const responseBody = { data: response.data, included: response.included };
            const taskwrapper = new JsonAPISerializer().deserialize<JTaskWrapper[]>(responseBody);

            const ch = taskwrapper;
            if (ch[0].taskType === 1 && this.view === 'supertask') {
              for (let i = 0; i < ch.length; i++) {
                this.gs
                  .getAll(SERV.CHUNKS, paramsTasks)
                  .subscribe((res: ResponseWrapper) => {

                    const responseBody = { data: response.data, included: response.included };
                    const chunks = new JsonAPISerializer().deserialize<JChunk[]>(responseBody);

                    let progress;
                    let cracked;
                    for (let i = 0; i < chunks.length; i++) {
                      progress.push(chunks[i].progress);
                      cracked.push(chunks[i].cracked);
                    }
                    progress = progress.reduce((a, i) => a + i, 0);
                    cracked = cracked.reduce((a, i) => a + i, 0);

                    if (cracked > 0) {
                      this.ctx.fillStyle = '#00ff00';
                      this.ctx.fillRect(
                        (i * this.x) / ch.length,
                        0,
                        ((i + 1) * this.x) / ch.length,
                        this.y - 1
                      );
                    }
                    //ToDo need to get the task keypace
                    // if(){
                    //   this.ctx.fillStyle = "#0000FF";
                    //   this.ctx.strokeRect(i*this.x/ch.length, 0, (i+1)*this.x/ch.length, (this.y-1));
                    // }
                    // if(){
                    //   this.ctx.fillStyle = "#00ff00";
                    //   this.ctx.strokeRect(i*this.x/ch.length, 0, (i+1)*this.x/ch.length, (this.y-1));
                    // }
                    else {
                      this.ctx.fillStyle = '#c0c0c0';
                      this.ctx.fillRect(
                        (i * this.x) / ch.length,
                        0,
                        ((i + 1) * this.x) / ch.length,
                        this.y - 1
                      );
                    }
                  });
              }
            } else {
              this.gs
                .getAll(SERV.CHUNKS, paramsTasks)
                .subscribe((response: ResponseWrapper) => {

                  const responseBody = { data: response.data, included: response.included };
                  const chunks = new JsonAPISerializer().deserialize<JChunk[]>(responseBody);
                  const ch = chunks; // Get chunks by id

                  // Getting variables
                  const keyspace = Number(this.tkeyspace); // Get Keyspace Progress
                  const progress = Number(this.cprogress); // Get Progress

                  // this.ctx.beginPath();
                  for (let i = 0; i < ch.length; i++) {
                    if (this.tusepreprocessor === 1 && this.tkeyspace <= 0) {
                      break;
                    }
                    const start = Math.floor(
                      ((this.x - 1) * ch[i]['skip']) / keyspace
                    );
                    const end =
                      Math.floor(
                        ((this.x - 1) * (ch[i]['skip'] + ch[i]['length'])) /
                          keyspace
                      ) - 1;
                    let current =
                      Math.floor(
                        ((this.x - 1) *
                          (ch[i]['skip'] +
                            (ch[i]['length'] * progress) / 10000)) /
                          keyspace
                      ) - 1;

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
                        this.ctx.fillRect(
                          start + 1,
                          1,
                          current - 1,
                          this.y - 2
                        );
                      } else {
                        this.ctx.fillStyle = '#ffff00'; //Yellow
                        this.ctx.fillRect(
                          start + 1,
                          1,
                          current - 1,
                          this.y - 2
                        );
                      }
                    }
                  }
                });
            }
          });
      });
  }
}
