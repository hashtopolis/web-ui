import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'grid-main',
  template: `
    <mat-card class="grid-card">
      <mat-card-content>
        <ng-container #content><ng-content></ng-content></ng-container>
      </mat-card-content>
    </mat-card>
  `,
  host: {
    '(window:resize)': 'onWindowResize($event)'
  }
})
export class GridMainComponent implements OnInit {
  @Input() class: any;
  @Input() centered?: boolean;

  isMobile = false;
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  mobileWidth = 760;

  constructor() {}

  ngOnInit(): void {
    this.isMobile = this.width < this.mobileWidth;
  }

  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
    this.isMobile = this.width < this.mobileWidth;
  }
}
