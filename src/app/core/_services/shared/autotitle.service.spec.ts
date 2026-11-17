import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { AutoTitleService } from '@services/shared/autotitle.service';

describe('AutoTitleService', () => {
  let service: AutoTitleService;
  let setTitleSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setTitleSpy = vi.fn().mockName('Title.setTitle');
    TestBed.configureTestingModule({
      providers: [AutoTitleService, { provide: Title, useValue: { setTitle: setTitleSpy } }]
    });
    service = TestBed.inject(AutoTitleService);
  });

  it('sets the prefixed title for a string', () => {
    const title = 'Dashboard';

    service.set(title);

    expect(setTitleSpy).toHaveBeenCalledExactlyOnceWith('Hashtopolis - Dashboard');
  });

  it('joins title parts with spaces', () => {
    const title = ['Agents', 'Details'];

    service.set(title);

    expect(setTitleSpy).toHaveBeenCalledExactlyOnceWith('Hashtopolis - Agents Details');
  });

  it('sets only the prefix for an empty array', () => {
    const title: string[] = [];

    service.set(title);

    expect(setTitleSpy).toHaveBeenCalledExactlyOnceWith('Hashtopolis - ');
  });
});
