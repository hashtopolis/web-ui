import { faHomeAlt } from '@fortawesome/free-solid-svg-icons';
import { filter } from 'rxjs/operators';

import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  standalone: false
})
export class BreadcrumbComponent implements OnInit {
  faHomeAlt = faHomeAlt;
  allowViewBreadcrum: boolean;

  @Input()
  public deliminator = '>';

  breadcrumbs: Array<{ label: string; url: string }>;

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.breadcrumbs = [];
      let currentRoute: ActivatedRoute | null = this.activatedRoute.root,
        url = '';
      do {
        const childrenRoutes = currentRoute?.children ?? [];
        currentRoute = null;
        childrenRoutes.forEach((route) => {
          if (route.outlet === 'primary') {
            const routeSnapshot = route.snapshot;

            url += '/' + routeSnapshot.url.map((segment) => segment.path).join('/');
            this.breadcrumbs.push({
              label: route.snapshot.data['breadcrumb'],
              url: url
            });
            currentRoute = route;
          }
          // if(route.snapshot.data['breadcrumb'].length > 1) {
          //     this.allowViewBreadcrum = false;
          // }
        });
      } while (currentRoute);
    });
  }
}
