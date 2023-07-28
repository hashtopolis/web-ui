import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'settings-menu',
  template: `
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
    <div class="d-block mb-4 mb-md-0">
      <div #content><ng-content></ng-content></div>
    </div>
  <div class="btn-toolbar mb-2 mb-md-0">
    <div class="btn-group ms-2 ms-3">
      <a type="button" (click)="Agent()" class="btn btn-sm btn-outline-gray-600 {{aclass}}">Agent</a>
      <a type="button" (click)="Task()" class="btn btn-sm btn-outline-gray-600 {{tclass}}">Task/Chunk</a>
      <a type="button" (click)="Hch()" class="btn btn-sm btn-outline-gray-600 {{hchclass}}">Hashes/Cracks/Hashlist</a>
      <a type="button" (click)="Notif()" class="btn btn-sm btn-outline-gray-600 {{nclass}}">Notifications</a>
      <a type="button" (click)="General()" class="btn btn-sm btn-outline-gray-600 {{gclass}}">General</a>
    </div>
  </div>
  </div>
  `
})
export class SettingsMenuComponent  {

  @Input() aclass?: any;
  @Input() tclass?: any;
  @Input() hchclass?: any;
  @Input() nclass?: any;
  @Input() gclass?: any;

  constructor(
    private router: Router
  ) { }

  Agent(){
    this.router.navigate(['/config/agent']);
  }

  Task(){
    this.router.navigate(['/config/task-chunk']);
  }

  Hch(){
    this.router.navigate(['/config/hch']);
  }

  Notif(){
    this.router.navigate(['/config/notifications']);
  }

  General(){
    this.router.navigate(['/config/general-settings']);
  }


}
