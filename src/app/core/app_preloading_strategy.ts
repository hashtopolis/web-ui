import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';

import { zPreloadRouteData } from '@models/routes.schema';

// If we have issue giving different network connections, we can add network types and preload only if its a fast network to avoid bottlenecks
@Injectable()
export class AppPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const loadRoute = (delay: boolean | undefined) => (delay ? timer(150).pipe(mergeMap(() => load())) : load());
    const { preload, delay } = zPreloadRouteData.parse(route.data ?? {});
    return preload ? loadRoute(delay) : of(null);
  }
}
