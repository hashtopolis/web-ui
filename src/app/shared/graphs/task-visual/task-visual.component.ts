import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { GlobalService } from '../../../core/_services/main.service';
import { SERV } from '../../../core/_services/main.config';

@Component({
  selector: 'task-visual',
  template: `
  <canvas #myCanvas style="border: 1px solid;" width={{x}} height=32px class='img-fluid'>
    Fallback content
  </canvas>
  `,
  host: {
    "(window:resize)":"onWindowResize($event)"
  }
})
export class TaskVisualomponent  {

  @ViewChild("myCanvas") canvasRef: ElementRef;
  @Input() view: any;
  @Input() tkeyspace: any;
  @Input() taskid: any;
  @Input() taskWrapperId: any;
  @Input() cprogress: any;
  @Input() tusepreprocessor: any;
  private ctx: CanvasRenderingContext2D;
  // public x = 1500;
  public x:number = window.innerWidth; // Dynamic width
  public y = 32;

  constructor(
    private gs: GlobalService
  ) { }

  onWindowResize(event) {
    this.x = event.target.innerWidth;
  }

  ngAfterViewInit () {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');

    this.drawPoint();
  }

  drawBorder(xPos, yPos, width, height, thickness = 1)
  {
    this.ctx.fillStyle='#000';
    this.ctx.rect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
    this.ctx.fill();
  }

  drawPoint() {

    const maxResults = 10000;

    // const maxResults = environment.config.prodApiMaxResults;
    this.gs.getAll(SERV.TASKS,{'maxResults': maxResults, 'filter': 'taskId='+this.taskid+''})
      .subscribe((res) => {
      this.gs.getAll(SERV.TASKS_WRAPPER,{'maxResults': maxResults, 'filter': 'taskWrapperId='+res.values[0].taskWrapperId+''})
        .subscribe((res) => {
          const ch = res.values;
          if(ch[0].taskType === 1 && this.view === 'supertask'){
            for(let i=0; i < ch.length; i++){
            this.gs.getAll(SERV.CHUNKS,{'maxResults': maxResults, 'filter': 'taskId='+this.taskid+''})
            .subscribe((res) => {
              const chunks = res.values;
              let progress;
              let cracked;
              for(let i=0; i < chunks.length; i++){
                progress.push(chunks[i].progress);
                cracked.push(chunks[i].cracked);
              }
              progress = progress.reduce((a, i) => a + i,0);
              cracked = cracked.reduce((a, i) => a + i,0);

              if(cracked > 0){
                this.ctx.fillStyle = "#00ff00";
                this.ctx.fillRect(i*this.x/ch.length, 0, (i+1)*this.x/ch.length, (this.y-1));
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
              else{
                this.ctx.fillStyle = "#c0c0c0";
                this.ctx.fillRect(i*this.x/ch.length, 0, (i+1)*this.x/ch.length, (this.y-1));
              }
            })
           }
          }
          else{
            this.gs.getAll(SERV.CHUNKS,{'maxResults': maxResults, 'filter': 'taskId='+this.taskid+''})
            .subscribe((res) => {

              const ch = res.values; // Get chunks by id

              // Getting variables
              let keyspace = Number(this.tkeyspace); // Get Keyspace Progress
              let progress = Number(this.cprogress); // Get Progress

              // this.ctx.beginPath();
              for(let i=0; i < ch.length; i++){
                if(this.tusepreprocessor === 1 && this.tkeyspace <= 0){
                  break;
                }
                let start = Math.floor((this.x - 1) * ch[i]['skip'] / keyspace);
                let end = Math.floor((this.x - 1) * (ch[i]['skip'] + ch[i]['length']) / keyspace) -1;
                let current = Math.floor((this.x - 1) * (ch[i]['skip'] + ch[i]['length'] * progress / 10000) /keyspace) -1;

                if(current > end) {
                  current = end;
                }

               if(end - start < 3){
                if(ch[i]['state'] >= 6){
                  this.ctx.fillStyle = "#ff0000"; //Red
                  this.ctx.fillRect(start, 0, end, this.y-1);
                }if (ch[i]['cracked'] > 0) {
                  this.ctx.fillStyle = "#00ff00"; //Green
                  this.ctx.fillRect(start, 0, end, this.y-1);
                } else {
                  this.ctx.fillStyle = "#ffff00"; //Yellow
                  this.ctx.fillRect(start, 0, end, this.y-1);
                }
               }else{
                  if(ch[i]['state'] >= 6){
                    this.ctx.fillStyle = "#ff0000"; //Red
                    this.ctx.fillRect(start, 0, end, (this.y-1));
                  }
                  else{
                    this.ctx.fillStyle = "#c0c0c0"; //Gray
                    this.ctx.fillRect(start, 1, end, (this.y));
                  }
                  if(ch[i]['cracked'] > 0){
                    this.ctx.fillStyle = "#00ff00"; //Green
                    this.ctx.fillRect(start+1, 1, current-1, (this.y-2));
                  }else{
                    this.ctx.fillStyle="#ffff00"; //Yellow
                    this.ctx.fillRect(start+1, 1, current-1, (this.y-2));
                  }
               }
              }
            });
          }
      })
    })
  }
}

