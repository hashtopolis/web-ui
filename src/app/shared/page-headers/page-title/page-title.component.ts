import { Component, Input } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html'
})
export class PageTitleComponent {
  @Input() title: string;
  @Input() buttontitle?: string;
  @Input() buttonlink?: string;
  @Input() subbutton?: boolean;
  @Input() usetoggle?: boolean;

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate([this.buttonlink]);
  }
}
