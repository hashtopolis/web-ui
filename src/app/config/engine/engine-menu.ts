import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'engine-menu',
  template: `
<div class="btn-group">
  <button type="button" routerLink="../agent-binaries" class="btn btn-sm btn-outline-gray-600 {{aclass}}">Agent Binaries</button>
  <button type="button" routerLink="../crackers" class="btn btn-sm btn-sm btn-outline-gray-600 {{cclass}}">Crackers</button>
  <button type="button" routerLink="../preprocessors" class="btn btn-sm btn-outline-gray-600 {{pclass}}">Preprocessors</button>
</div>
  `
})
export class EngineMenuComponent  {

  @Input() aclass?: any;
  @Input() cclass?: any;
  @Input() pclass?: any;

  constructor(
    private router: Router
  ) { }

  Binary(){
    this.router.navigate(['/config/engine/agent-binaries']);
  }

  Cracker(){
    this.router.navigate(['/config/engine/crackers']);
  }

  Prepro(){
    this.router.navigate(['/config/engine/preprocessors']);
  }

}
