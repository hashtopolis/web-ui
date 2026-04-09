import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';

// If we have issue giving different network connections, we can add network types and preload only if its a fast network to avoid bottlenecks
@Injectable()
export class AppPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    const loadRoute = (delay: any) => (delay ? timer(150).pipe(mergeMap(() => load())) : load());
    return route.data && route.data['preload'] ? loadRoute(route.data['delay']) : of(null);
  }
}
