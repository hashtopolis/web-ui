import { firstValueFrom, of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';

import { BreakpointService } from '@services/shared/breakpoint.service';

const breakpointCases = [
  {
    name: 'XSmall',
    breakpoint: Breakpoints.XSmall,
    observe: (service: BreakpointService) => service.isXSmall()
  },
  {
    name: 'Small',
    breakpoint: Breakpoints.Small,
    observe: (service: BreakpointService) => service.isSmall()
  },
  {
    name: 'Medium',
    breakpoint: Breakpoints.Medium,
    observe: (service: BreakpointService) => service.isMedium()
  },
  {
    name: 'Large',
    breakpoint: Breakpoints.Large,
    observe: (service: BreakpointService) => service.isLarge()
  },
  {
    name: 'XLarge',
    breakpoint: Breakpoints.XLarge,
    observe: (service: BreakpointService) => service.isXLarge()
  }
];

describe('BreakpointService', () => {
  let service: BreakpointService;
  let mockBreakpointObserver: MockedObject<BreakpointObserver>;

  beforeEach(() => {
    mockBreakpointObserver = {
      observe: vi.fn().mockName('BreakpointObserver.observe')
    } as MockedObject<BreakpointObserver>;

    TestBed.configureTestingModule({
      providers: [BreakpointService, { provide: BreakpointObserver, useValue: mockBreakpointObserver }]
    });

    service = TestBed.inject(BreakpointService);
  });

  it.each(breakpointCases)(
    'observes the $name breakpoint and emits its active state',
    async ({ breakpoint, observe }) => {
      mockBreakpointObserver.observe
        .mockReturnValueOnce(of({ matches: true, breakpoints: {} }))
        .mockReturnValueOnce(of({ matches: false, breakpoints: {} }));

      const active = await firstValueFrom(observe(service));
      const inactive = await firstValueFrom(observe(service));

      expect(mockBreakpointObserver.observe).toHaveBeenCalledTimes(2);
      expect(mockBreakpointObserver.observe).toHaveBeenNthCalledWith(1, breakpoint);
      expect(mockBreakpointObserver.observe).toHaveBeenNthCalledWith(2, breakpoint);
      expect(active).toBe(true);
      expect(inactive).toBe(false);
    }
  );
});
