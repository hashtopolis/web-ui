import { faPlus }  from '@fortawesome/free-solid-svg-icons';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-title',
  template: `
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
  <div class="d-block mb-4 mb-md-0">
      <h2 class="h4">{{ title }}</h2>
  </div>
  <div *ngIf="subbutton" class="btn-toolbar mb-2 mb-md-0">
      <a (click)="redirect()" class="btn btn-sm btn-gray-800 d-inline-flex align-items-center">
        <fa-icon [icon]="faPlus" aria-hidden="true"></fa-icon>
          {{ buttontitle }}
      </a>
  </div>
  <div *ngIf="usetoggle" class="btn-toolbar mb-2 mb-md-0">
     <div #content><ng-content></ng-content></div>
  </div>
</div>
  `
})
export class PageTitleComponent  {

  faPlus=faPlus;

  @Input() title: any;
  @Input() buttontitle?: any;
  @Input() buttonlink?: any;
  @Input() subbutton?: boolean;
  @Input() usetoggle?: boolean;

  constructor(
    private router: Router
  ) { }

  redirect(){
    this.router.navigate([this.buttonlink]);
  }

}
