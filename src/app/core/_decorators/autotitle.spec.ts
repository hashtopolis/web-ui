import type { MockedObject } from 'vitest';

import { Injector } from '@angular/core';

import { AutoTitleService } from '@services/shared/autotitle.service';

import { AppModule } from '@src/app/app.module';
import { PageTitle } from '@src/app/core/_decorators/autotitle';

describe('PageTitle', () => {
  let titleService: MockedObject<AutoTitleService>;
  let injector: Injector;
  let originalInjector: Injector;

  beforeEach(() => {
    titleService = { set: vi.fn().mockName('AutoTitleService.set') } as unknown as MockedObject<AutoTitleService>;
    injector = Injector.create({ providers: [{ provide: AutoTitleService, useValue: titleService }] });
    originalInjector = AppModule.injector;
    AppModule.injector = injector;
  });

  afterEach(() => {
    AppModule.injector = originalInjector;
  });

  it('calls the original lifecycle before setting the title and caches the service per instance', () => {
    const order: string[] = [];
    titleService.set.mockImplementation(() => {
      order.push('title');
    });
    const get = vi.spyOn(injector, 'get');
    class Page {
      ngOnInit() {
        order.push('init');
      }
    }
    PageTitle(['Items', 'Edit'])(Page);
    const first = new Page();
    first.ngOnInit();
    first.ngOnInit();
    new Page().ngOnInit();
    expect(order).toStrictEqual(['init', 'title', 'init', 'title', 'init', 'title']);
    expect(get).toHaveBeenCalledTimes(2);
    expect(titleService.set).toHaveBeenCalledTimes(3);
    expect(titleService.set).toHaveBeenNthCalledWith(1, ['Items', 'Edit']);
  });

  it('adds a lifecycle hook when none exists', () => {
    class Page {}
    PageTitle('Dashboard')(Page);
    const page = new Page() as Page & { ngOnInit(): void };
    page.ngOnInit();
    expect(titleService.set).toHaveBeenCalledExactlyOnceWith('Dashboard');
  });
});
