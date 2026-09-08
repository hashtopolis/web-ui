import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AuthService } from '@services/access/auth.service';
import { ServiceConfig } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { ConfigService } from '@services/shared/config.service';

describe('GlobalService — debounced mutating requests (leading + trailing)', () => {
  let service: GlobalService;
  let httpMock: HttpTestingController;

  const serviceConfig: ServiceConfig = { URL: '/hashlist', RESOURCE: 'hashlist' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        GlobalService,
        { provide: ConfigService, useValue: { getEndpoint: () => 'http://localhost' } },
        { provide: AuthService, useValue: { userId: 1 } }
      ]
    });

    service = TestBed.inject(GlobalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fires the first update() call for a resource immediately, without waiting out the debounce window', fakeAsync(() => {
    service.update(serviceConfig, 1, { name: 'first' }).subscribe();

    const req = httpMock.expectOne('http://localhost/hashlist/1');
    expect(req.request.method).toBe('PATCH');
    expect(JSON.stringify(req.request.body)).toContain('first');
    req.flush({});

    tick(2000); // settle the cooldown timer this leading call started
  }));

  it('coalesces a call made during the cooldown window into a single trailing request with the latest payload, without dropping the leading request', fakeAsync(() => {
    let result1: unknown;
    let result2: unknown;

    service.update(serviceConfig, 1, { name: 'first' }).subscribe((r) => (result1 = r));
    const leadingReq = httpMock.expectOne('http://localhost/hashlist/1');
    expect(JSON.stringify(leadingReq.request.body)).toContain('first');
    leadingReq.flush({ ok: 'first' });
    expect(result1).toEqual({ ok: 'first' });

    tick(200);
    service.update(serviceConfig, 1, { name: 'second' }).subscribe((r) => (result2 = r));
    // Still inside the cooldown window started by the leading call — nothing sent yet.
    expect(httpMock.match(() => true).length).toBe(0);

    tick(1800); // reach the end of the 2s cooldown window
    const trailingReq = httpMock.expectOne('http://localhost/hashlist/1');
    expect(JSON.stringify(trailingReq.request.body)).toContain('second');
    trailingReq.flush({ ok: 'second' });
    expect(result2).toEqual({ ok: 'second' });

    tick(2000); // settle the new cooldown timer the trailing call started
  }));

  it('does not coalesce update() calls for different ids — both fire immediately', fakeAsync(() => {
    service.update(serviceConfig, 1, { name: 'a' }).subscribe();
    service.update(serviceConfig, 2, { name: 'b' }).subscribe();

    const req1 = httpMock.expectOne('http://localhost/hashlist/1');
    const req2 = httpMock.expectOne('http://localhost/hashlist/2');
    expect(req1.request.method).toBe('PATCH');
    expect(req2.request.method).toBe('PATCH');
    req1.flush({});
    req2.flush({});

    tick(2000); // settle both leading calls' cooldown timers
  }));

  it('fires a fresh immediate call for a later edit once the previous cooldown has fully elapsed with nothing pending', fakeAsync(() => {
    service.update(serviceConfig, 1, { name: 'first' }).subscribe();
    httpMock.expectOne('http://localhost/hashlist/1').flush({});

    tick(2000); // let the cooldown window close out with no trailing call pending

    service.update(serviceConfig, 1, { name: 'second' }).subscribe();
    const req = httpMock.expectOne('http://localhost/hashlist/1');
    expect(JSON.stringify(req.request.body)).toContain('second');
    req.flush({});

    tick(2000); // settle the new cooldown timer the second leading call started
  }));
});
