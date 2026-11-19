import { EnvironmentProviders, Provider, provideZoneChangeDetection } from '@angular/core';

// Since Angular 21 TestBed defaults to zoneless change detection. The app still bootstraps
// with zone.js (see main.ts), so the tests have to opt back in to match it.
const testProviders: (EnvironmentProviders | Provider)[] = [provideZoneChangeDetection()];

export default testProviders;
