import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AuthService } from '@services/access/auth.service';
import { ServiceConfig } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { ConfigService } from '@services/shared/config.service';

describe('GlobalService — debounced mutating requests', () => {
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

  it('does not send a request until the debounce window has elapsed with no further calls', fakeAsync(() => {
    service.update(serviceConfig, 1, { name: 'first' }).subscribe();

    tick(1999);
    expect(httpMock.match(() => true).length).toBe(0);

    tick(1);
    const req = httpMock.expectOne('http://localhost/hashlist/1');
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  }));

  it('coalesces rapid update() calls for the same id into a single request carrying the last payload', fakeAsync(() => {
    let result1: unknown;
    let result2: unknown;

    service.update(serviceConfig, 1, { name: 'first' }).subscribe((r) => (result1 = r));
    tick(500);
    service.update(serviceConfig, 1, { name: 'second' }).subscribe((r) => (result2 = r));
    tick(2000);

    const req = httpMock.expectOne('http://localhost/hashlist/1');
    expect(req.request.method).toBe('PATCH');
    expect(JSON.stringify(req.request.body)).toContain('second');
    expect(JSON.stringify(req.request.body)).not.toContain('first');

    req.flush({ ok: true });

    expect(result1).toEqual({ ok: true });
    expect(result2).toEqual({ ok: true });
  }));

  it('does not coalesce update() calls for different ids', fakeAsync(() => {
    service.update(serviceConfig, 1, { name: 'a' }).subscribe();
    service.update(serviceConfig, 2, { name: 'b' }).subscribe();
    tick(2000);

    const req1 = httpMock.expectOne('http://localhost/hashlist/1');
    const req2 = httpMock.expectOne('http://localhost/hashlist/2');
    expect(req1.request.method).toBe('PATCH');
    expect(req2.request.method).toBe('PATCH');
    req1.flush({});
    req2.flush({});
  }));

  it('sends a fresh request for a later call once the previous debounce window has already fired', fakeAsync(() => {
    service.update(serviceConfig, 1, { name: 'first' }).subscribe();
    tick(2000);
    const firstReq = httpMock.expectOne('http://localhost/hashlist/1');
    expect(JSON.stringify(firstReq.request.body)).toContain('first');
    firstReq.flush({});

    service.update(serviceConfig, 1, { name: 'second' }).subscribe();
    tick(2000);
    const secondReq = httpMock.expectOne('http://localhost/hashlist/1');
    expect(JSON.stringify(secondReq.request.body)).toContain('second');
    secondReq.flush({});
  }));
});
