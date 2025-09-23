import { TestBed } from '@angular/core/testing';

import { AutoRefreshService } from './auto-refresh.service';

describe('AutoRefreshService', () => {
  let service: AutoRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoRefreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
