import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, timer, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Injectable } from "@angular/core";

// If we have issue giving different network connections, we can add network types and preload only if its a fast network to avoid bottlenecks
@Injectable()
export class AppPreloadingStrategy implements PreloadingStrategy {

  preload(route: Route, load: Function): Observable<any> {
    const loadRoute = delay =>
      delay ? timer(150).pipe(mergeMap(_ => load())) : load();
    return route.data && route.data['preload']
      ? loadRoute(route.data['delay'])
      : of(null);
  }

}
