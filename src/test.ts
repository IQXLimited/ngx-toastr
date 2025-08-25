// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { getTestBed } from '@angular/core/testing'
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing'

// Initialize the Angular testing environment without zones
getTestBed().initTestEnvironment (
  BrowserTestingModule,
  platformBrowserTesting ( )
)
