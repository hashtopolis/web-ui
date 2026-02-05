import { Buffer } from 'buffer';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '@services/access/auth.service';
import { PermissionService } from '@services/permission/permission.service';
import { ConfigService } from '@services/shared/config.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Create a working mock storage that actually stores/retrieves data
    const storageMock = {
      _store: {} as Record<string, any>,
      getItem(key: string) {
        return this._store[key] || null;
      },
      setItem(key: string, value: any) {
        this._store[key] = value;
      },
      removeItem(key: string) {
        delete this._store[key];
      }
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: ConfigService, useValue: { getEndpoint: () => 'http://localhost' } },
        { provide: LocalStorageService, useValue: storageMock },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: PermissionService, useValue: { loadPermissions: () => of([]), clearPermissionCache: () => {} } }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('encodes non-latin1 password using UTF-8 in Basic Authorization header', () => {
    const username = 'user';
    const password = 'pässwörd';

    service.logIn(username, password).subscribe();

    // Auth request
    const authReq = httpMock.expectOne((req) => req.url.endsWith('/auth/token'));
    expect(authReq.request.method).toBe('POST');

    const expectedBasic = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');

    expect(authReq.request.headers.get('Authorization')).toBe('Basic ' + expectedBasic);

    authReq.flush({
      token: 'eyJhbGciOiJub25lIn0.eyJzdWIiOjF9.',
      expires: Math.floor(Date.now() / 1000) + 3600
    });

    // User fetch request
    const userReq = httpMock.expectOne('http://localhost/ui/users/1');
    expect(userReq.request.method).toBe('GET');

    userReq.flush({ id: 1, name: 'Demo User' });
  });
});
