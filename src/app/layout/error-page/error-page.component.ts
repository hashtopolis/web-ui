import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { zErrorPageRouteData } from '@models/routes.schema';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ErrorPageComponent implements OnInit {
  private route = inject(ActivatedRoute);

  errorMessage: string;

  ngOnInit() {
    this.route.data.subscribe((data) => {
      const parsedRouteData = zErrorPageRouteData.parse(data);
      this.errorMessage = parsedRouteData.message;
    });
  }
}
