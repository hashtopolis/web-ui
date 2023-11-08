import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-title',
  template: `
<div class="page-title-wrapper">
    <h2 class="h4">{{ title }}</h2>
    <ng-container *ngIf="subbutton">
      <button mat-flat-button color="primary" (click)="navigate()">
        <mat-icon>add</mat-icon>
        {{ buttontitle }}
      </button>
    </ng-container>
  </div>
  <div *ngIf="usetoggle" class="btn-toolbar mb-2 mb-md-0">
     <div #content><ng-content></ng-content></div>
  </div>
  `
})
export class PageTitleComponent {

  @Input() title: any;
  @Input() buttontitle?: any;
  @Input() buttonlink?: any;
  @Input() subbutton?: boolean;
  @Input() usetoggle?: boolean;

  constructor(private router: Router) { }

  navigate() {
    this.router.navigate([this.buttonlink]);
  }

}
