import { TestBed } from '@angular/core/testing';

import { AgentContextMenuService } from './agent-context-menu.service';

describe('AgentContextMenuService', () => {
  let service: AgentContextMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentContextMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
