import { Subject, filter, take } from 'rxjs';
import * as tus from 'tus-js-client';

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { AuthService } from '@services/access/auth.service';
import { UploadTUSService } from '@services/files/files_tus.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { ConfigService } from '@services/shared/config.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { mockResponse } from '@src/app/testing/mock-response';

describe('UploadTUSService', () => {
  let service: UploadTUSService;
  let gs: jasmine.SpyObj<GlobalService>;
  let router: jasmine.SpyObj<Router>;
  let start: jasmine.Spy;
  let abort: jasmine.Spy;

  /** Lets the upload get past the async lookup of previous uploads */
  const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve));

  const file = new File(['hashes'], 'h.txt');

  beforeEach(() => {
    spyOn(tus.Upload.prototype, 'findPreviousUploads').and.resolveTo([]);
    start = spyOn(tus.Upload.prototype, 'start');
    abort = spyOn(tus.Upload.prototype, 'abort').and.resolveTo();
    gs = jasmine.createSpyObj('GlobalService', ['create']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        UploadTUSService,
        { provide: LocalStorageService, useValue: {} },
        { provide: ConfigService, useValue: { getEndpoint: () => 'http://localhost:8080/api/v2' } },
        { provide: GlobalService, useValue: gs },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: { token: 'token' } },
        { provide: AlertService, useValue: {} }
      ]
    });
    service = TestBed.inject(UploadTUSService);
  });

  it('aborts the upload without terminating it when the subscriber unsubscribes', async () => {
    const subscription = service.uploadFile(file, 'h.txt', SERV.HASHLISTS).subscribe();
    await settle();
    expect(start).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();

    expect(abort).toHaveBeenCalledOnceWith();
  });

  it('does not start the upload when the subscriber unsubscribes before it started', async () => {
    service.uploadFile(file, 'h.txt', SERV.HASHLISTS).subscribe().unsubscribe();
    await settle();

    expect(start).not.toHaveBeenCalled();
  });

  it('cancels the create after the upload when the subscriber unsubscribes before it finished', async () => {
    const create = new Subject<ResponseWrapper>();
    gs.create.and.returnValue(create);
    start.and.callFake(function (this: tus.Upload) {
      void this.options.onSuccess?.();
    });
    const subscription = service
      .uploadFile(file, 'h.txt', SERV.HASHLISTS, { name: 'h' }, ['/hashlists/hashlist'])
      .subscribe();
    await settle();
    expect(gs.create).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
    create.next(mockResponse({}));

    expect(create.observed).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('does not create when the subscriber unsubscribes on the final progress', async () => {
    gs.create.and.returnValue(new Subject<ResponseWrapper>());
    // tus reports the final progress and the success of the last chunk in the same tick
    start.and.callFake(function (this: tus.Upload) {
      this.options.onProgress?.(1, 1);
      void this.options.onSuccess?.();
    });
    service
      .uploadFile(file, 'h.txt', SERV.HASHLISTS, { name: 'h' }, ['/hashlists/hashlist'])
      .pipe(
        filter((progress) => progress === 100),
        take(1)
      )
      .subscribe();
    await settle();

    expect(gs.create).not.toHaveBeenCalled();
  });
});
