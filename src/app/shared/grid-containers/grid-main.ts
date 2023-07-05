import { SCREEN_SIZE } from "src/app/layout/screen-size-detector/screen-size-detector.enum";
import { ScreenSizeService } from 'src/app/core/_services/shared/screensize.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from "rxjs";

@Component({
  selector: 'grid-main',
  template: `
<div class="grid-container-main">
  <div class="row justify-content-center">
    <div [ngClass]="centered ? 'col-12 d-flex align-items-center justify-content-center':'col-12 d-flex' ">
      <div class="layout-col shadow border-0 rounded p-4 p-lg-5 {{class}}" style="{{class}}">
          <div #content><ng-content></ng-content></div>
    </div>
  </div>
</div>
`,
host: {
  "(window:resize)":"onWindowResize($event)"
}
})
export class GridMainComponent implements OnInit {

  @Input() class: any;
  @Input() centered?: boolean;

  isMobile: boolean = false;
  width:number = window.innerWidth;
  height:number = window.innerHeight;
  mobileWidth:number  = 760;

  constructor() {}

  ngOnInit() : void {
    this.isMobile = this.width < this.mobileWidth;
  }

  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
    this.isMobile = this.width < this.mobileWidth;
  }

}
