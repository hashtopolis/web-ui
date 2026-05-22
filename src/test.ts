// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

@NgModule({
  providers: [provideZoneChangeDetection()]
})
export class ZoneTestingModule {}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  [BrowserDynamicTestingModule, ZoneTestingModule],
  platformBrowserDynamicTesting(),
);

// Patch TestBed.configureTestingModule to restore legacy zone behavior in Angular 21 tests
const originalConfigureTestingModule = TestBed.configureTestingModule;

TestBed.configureTestingModule = (moduleDef) => {
  return originalConfigureTestingModule.call(TestBed, {
    ...moduleDef,
    rethrowApplicationErrors: false,
    providers: [
      ...(moduleDef.providers || []),
      provideZoneChangeDetection(),
    ],
  });
};


