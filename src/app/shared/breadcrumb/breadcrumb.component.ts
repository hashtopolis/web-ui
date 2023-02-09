import { Component, OnInit } from "@angular/core";
import { faHomeAlt} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { Input } from "@angular/core";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})

export class BreadcrumbComponent implements OnInit {
  faHomeAlt=faHomeAlt;
  allowViewBreadcrum: boolean;

  @Input()
  public deliminator: string = ">";

  breadcrumbs: Array<{ label: string; url: string }>;

  constructor(private router: Router,
     private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.breadcrumbs = [];
        let currentRoute = this.activatedRoute.root,
          url = "";
        do {
          const childrenRoutes = currentRoute.children;
          currentRoute = null;
          childrenRoutes.forEach(route => {
            if (route.outlet === "primary") {
              const routeSnapshot = route.snapshot;

              url +=
                "/" + routeSnapshot.url.map(segment => segment.path).join("/");
              this.breadcrumbs.push({
                label: route.snapshot.data['breadcrumb'],
                url: url
              });
              currentRoute = route;
            };
            // if(route.snapshot.data['breadcrumb'].length > 1) {
            //     this.allowViewBreadcrum = false;
            // }
          });
        } while (currentRoute);
      });
  }

}
