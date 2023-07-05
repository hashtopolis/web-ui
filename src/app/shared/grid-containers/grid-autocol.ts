import { SCREEN_SIZE } from "src/app/layout/screen-size-detector/screen-size-detector.enum";
import { ScreenSizeService } from 'src/app/core/_services/shared/screensize.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from "rxjs";

@Component({
  selector: 'grid-autocol',
  template: `
  <div #content [ngStyle]="getStyles()">
    <ng-content></ng-content>
  </div>
`,
host: {
  "(window:resize)":"onWindowResize($event)"
}
})
export class GridAutoColComponent implements OnInit {

  @Input() centered?: boolean;

  isMobile: boolean = false;
  width:number = window.innerWidth;
  height:number = window.innerHeight;
  mobileWidth:number  = 760;
  size1920_1080 = false;
  size1366_768 = false;
  size1280_720 = false;
  size1536_864 = false;

  constructor() {}

  ngOnInit() : void {
    this.isMobile = this.width < this.mobileWidth;
  }

  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
    this.isMobile = this.width < this.mobileWidth;
  }

  public getStyles() {

    // If screen is Tablet or Phone, use only one column
    if(this.width < 767 || this.height < 721){
      return {
        '': '',
      };
    }
    if(this.width > 767 || this.height > 721){
      const gutterSize = 50; //Separation between columns
      const cardWidth = 100; //Padding left and right
      const cardHeight = 80;  //We take the full height minus the header and footer
      var cols = Math.floor((this.width + gutterSize) / (cardWidth + gutterSize));
      var rows = Math.floor((this.height + gutterSize) / (cardHeight + gutterSize));
    }
    return {
      'display': 'inline-grid',
      'grid-template-columns': `repeat(${cols}, auto)`,
      'grid-template-rows': `repeat(${rows}, auto)`,
      'grid-gap': '1px',
      'grid-auto-flow': 'column',
    };
  }

}
