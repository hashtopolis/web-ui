import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-subtitle',
  template: `
<h2 class="h5 mb-4 display-col">{{ subtitle }}</h2>
  `
})
export class PageSubTitleComponent  {

  @Input() subtitle: any;

}
