import { Component } from "@angular/core";

@Component({
    selector: 'app-active-spinner',
    template: `
    <img style="width:25px;" src="/assets/img/loader.gif" alt="Running..." title="Running..."/>
  `,
    standalone: false
})
export class ActiveSpinnerComponent {

}


