import { HttpHeaderName } from '@constants/http.config';
import { lastValueFrom, materialize, of, throwError, toArray } from 'rxjs';
import * as tus from 'tus-js-client';
import type { MockedObject } from 'vitest';

import { HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthData } from '@models/auth-user.model';

import { AuthService } from '@services/access/auth.service';
import { UploadTUSService } from '@services/files/files_tus.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { ConfigService } from '@services/shared/config.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { mockResponse } from '@src/app/testing/mock-response';

describe('UploadTUSService', () => {
  let gs: MockedObject<GlobalService>;
  let router: MockedObject<Router>;
  beforeEach(() => {
    const auth = { token: 'current-token' } as MockedObject<AuthService>;
    const storage = { getItem: vi.fn().mockName('LocalStorageService.getItem') } as MockedObject<
      LocalStorageService<AuthData>
    >;
    gs = { create: vi.fn().mockName('GlobalService.create') } as MockedObject<GlobalService>;
    router = { navigate: vi.fn().mockName('Router.navigate') } as MockedObject<Router>;
    const config = {
      getEndpoint: vi.fn().mockName('ConfigService.getEndpoint').mockReturnValue('https://api.example')
    } as MockedObject<ConfigService>;
    const alert = { showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage') } as MockedObject<AlertService>;
    TestBed.configureTestingModule({
      providers: [
        UploadTUSService,
        { provide: LocalStorageService, useValue: storage },
        { provide: ConfigService, useValue: config },
        { provide: GlobalService, useValue: gs },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: auth },
        { provide: AlertService, useValue: alert }
      ]
    });
  });

  it('starts an upload with the current token and reports progress', async () => {
    vi.spyOn(tus.Upload.prototype, 'findPreviousUploads').mockResolvedValue([]);
    const start = vi.spyOn(tus.Upload.prototype, 'start').mockImplementation(() => {});
    const values: number[] = [];
    const completion = new Promise<void>((resolve, reject) =>
      TestBed.inject(UploadTUSService)
        .uploadFile(new File(['abc'], 'source.txt', { type: 'text/plain' }), 'words.txt', SERV.FILES)
        .subscribe({ next: (value) => values.push(value), error: reject, complete: resolve })
    );
    await vi.waitFor(() => expect(start).toHaveBeenCalledExactlyOnceWith());
    const upload = start.mock.contexts[0] as tus.Upload;
    expect(upload.options.endpoint).toBe('https://api.example/helper/importFile');
    expect(upload.options.headers?.['Authorization']).toBe('Bearer current-token');
    expect(upload.options.metadata).toStrictEqual({ filename: 'words.txt', filetype: 'text/plain' });
    upload.options.onProgress?.(1, 4);
    upload.options.onSuccess?.();
    await completion;
    expect(values).toStrictEqual([25]);
    expect(start).toHaveBeenCalledExactlyOnceWith();
  });

  it('emits zero and propagates an upload error', async () => {
    vi.spyOn(tus.Upload.prototype, 'findPreviousUploads').mockResolvedValue([]);
    const start = vi.spyOn(tus.Upload.prototype, 'start').mockImplementation(() => {});
    const error = new Error('network failure');
    const result = lastValueFrom(
      TestBed.inject(UploadTUSService)
        .uploadFile(new File(['a'], 'a.txt'), 'a.txt', SERV.FILES)
        .pipe(materialize(), toArray())
    );
    await vi.waitFor(() => expect(start).toHaveBeenCalledExactlyOnceWith());
    const upload = start.mock.contexts[0] as tus.Upload;
    upload.options.onError?.(error);
    const notifications = await result;
    expect(notifications.map(({ kind, value }) => ({ kind, value }))).toStrictEqual([
      { kind: 'N', value: 0 },
      { kind: 'E', value: undefined }
    ]);
    expect(notifications[1].error).toBe(error);
    expect(gs.create).not.toHaveBeenCalled();
  });

  it('treats an existing upload as complete and creates its form', async () => {
    vi.spyOn(tus.Upload.prototype, 'findPreviousUploads').mockResolvedValue([]);
    const start = vi.spyOn(tus.Upload.prototype, 'start').mockImplementation(() => {});
    gs.create.mockReturnValue(of(mockResponse()));
    router.navigate.mockResolvedValue(true);
    const form = { filename: 'a.txt' };
    const result = lastValueFrom(
      TestBed.inject(UploadTUSService)
        .uploadFile(new File(['a'], 'a.txt'), 'a.txt', SERV.FILES, form, ['/files'])
        .pipe(toArray())
    );
    await vi.waitFor(() => expect(start).toHaveBeenCalledExactlyOnceWith());
    const upload = start.mock.contexts[0] as tus.Upload;
    upload.options.onError?.(new Error('File already exists'));
    await expect(result).resolves.toStrictEqual([100]);
    expect(gs.create).toHaveBeenCalledExactlyOnceWith(SERV.FILES, form, {
      headers: expect.any(HttpHeaders)
    });
    expect(gs.create.mock.calls[0][2]?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/files']);
  });

  it('creates the form and redirects after a successful upload', async () => {
    vi.spyOn(tus.Upload.prototype, 'findPreviousUploads').mockResolvedValue([]);
    const start = vi.spyOn(tus.Upload.prototype, 'start').mockImplementation(() => {});
    gs.create.mockReturnValue(of(mockResponse()));
    router.navigate.mockResolvedValue(true);
    const form = { filename: 'a.txt' };
    const result = lastValueFrom(
      TestBed.inject(UploadTUSService)
        .uploadFile(new File(['a'], 'a.txt'), 'a.txt', SERV.FILES, form, ['/files'])
        .pipe(toArray())
    );
    await vi.waitFor(() => expect(start).toHaveBeenCalledExactlyOnceWith());
    const upload = start.mock.contexts[0] as tus.Upload;
    upload.options.onSuccess?.();
    await expect(result).resolves.toStrictEqual([]);
    expect(gs.create).toHaveBeenCalledExactlyOnceWith(SERV.FILES, form, {
      headers: expect.any(HttpHeaders)
    });
    expect(gs.create.mock.calls[0][2]?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/files']);
  });

  it('creates the form after upload and propagates creation errors', async () => {
    vi.spyOn(tus.Upload.prototype, 'findPreviousUploads').mockResolvedValue([]);
    const start = vi.spyOn(tus.Upload.prototype, 'start').mockImplementation(() => {});
    const error = new Error('creation failed');
    gs.create.mockReturnValue(throwError(() => error));
    const form = { filename: 'a.txt' };
    const result = lastValueFrom(
      TestBed.inject(UploadTUSService)
        .uploadFile(new File(['a'], 'a.txt'), 'a.txt', SERV.FILES, form, ['/files'])
        .pipe(materialize(), toArray())
    );
    await vi.waitFor(() => expect(start).toHaveBeenCalledExactlyOnceWith());
    const upload = start.mock.contexts[0] as tus.Upload;
    upload.options.onSuccess?.();
    const notifications = await result;
    expect(notifications.map(({ kind, value }) => ({ kind, value }))).toStrictEqual([
      { kind: 'N', value: 0 },
      { kind: 'E', value: undefined }
    ]);
    expect(notifications[1].error).toBe(error);
    expect(gs.create).toHaveBeenCalledExactlyOnceWith(SERV.FILES, form, {
      headers: expect.any(HttpHeaders)
    });
    expect(gs.create.mock.calls[0][2]?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('resumes the newest upload inside the three-hour window', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
      const previous = [
        { size: 1, metadata: { name: 'boundary' }, creationTime: '2026-01-01T09:00:00Z' },
        { size: 1, metadata: { name: 'newest' }, creationTime: '2026-01-01T11:30:00Z' },
        { size: 1, metadata: { name: 'older' }, creationTime: '2026-01-01T10:00:00Z' }
      ];
      vi.spyOn(tus.Upload.prototype, 'findPreviousUploads').mockResolvedValue(previous);
      const resume = vi.spyOn(tus.Upload.prototype, 'resumeFromPreviousUpload').mockImplementation(() => {});
      const start = vi.spyOn(tus.Upload.prototype, 'start').mockImplementation(() => {});
      const result = lastValueFrom(
        TestBed.inject(UploadTUSService)
          .uploadFile(new File(['a'], 'a.txt'), 'a.txt', SERV.FILES)
          .pipe(toArray())
      );
      await vi.waitFor(() => expect(start).toHaveBeenCalledExactlyOnceWith());
      expect(resume).toHaveBeenCalledExactlyOnceWith({
        ...previous[1],
        creationDate: new Date(previous[1].creationTime)
      });
      (start.mock.contexts[0] as tus.Upload).options.onSuccess?.();
      await expect(result).resolves.toStrictEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not resume uploads at or before the three-hour boundary', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
      vi.spyOn(tus.Upload.prototype, 'findPreviousUploads').mockResolvedValue([
        { size: 1, metadata: {}, creationTime: '2026-01-01T09:00:00Z' },
        { size: 1, metadata: {}, creationTime: '2026-01-01T08:59:59Z' }
      ]);
      const resume = vi.spyOn(tus.Upload.prototype, 'resumeFromPreviousUpload').mockImplementation(() => {});
      const start = vi.spyOn(tus.Upload.prototype, 'start').mockImplementation(() => {});
      const result = lastValueFrom(
        TestBed.inject(UploadTUSService)
          .uploadFile(new File(['a'], 'a.txt'), 'a.txt', SERV.FILES)
          .pipe(toArray())
      );
      await vi.waitFor(() => expect(start).toHaveBeenCalledExactlyOnceWith());
      expect(resume).not.toHaveBeenCalled();
      (start.mock.contexts[0] as tus.Upload).options.onSuccess?.();
      await expect(result).resolves.toStrictEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('starts a new upload when resuming fails', async () => {
    vi.spyOn(tus.Upload.prototype, 'findPreviousUploads').mockResolvedValue([
      { size: 1, metadata: {}, creationTime: new Date().toISOString() }
    ]);
    const resume = vi.spyOn(tus.Upload.prototype, 'resumeFromPreviousUpload').mockImplementation(() => {
      throw new Error('resume failed');
    });
    const start = vi.spyOn(tus.Upload.prototype, 'start').mockImplementation(() => {});
    const result = lastValueFrom(
      TestBed.inject(UploadTUSService)
        .uploadFile(new File(['a'], 'a.txt'), 'a.txt', SERV.FILES)
        .pipe(toArray())
    );
    await vi.waitFor(() => expect(start).toHaveBeenCalledExactlyOnceWith());
    expect(resume).toHaveBeenCalledTimes(1);
    (start.mock.contexts[0] as tus.Upload).options.onSuccess?.();
    await expect(result).resolves.toStrictEqual([]);
  });

  it('completes a duplicate upload without a form', async () => {
    vi.spyOn(tus.Upload.prototype, 'findPreviousUploads').mockResolvedValue([]);
    const start = vi.spyOn(tus.Upload.prototype, 'start').mockImplementation(() => {});
    const result = lastValueFrom(
      TestBed.inject(UploadTUSService)
        .uploadFile(new File(['a'], 'a.txt'), 'a.txt', SERV.FILES)
        .pipe(toArray())
    );
    await vi.waitFor(() => expect(start).toHaveBeenCalledExactlyOnceWith());
    (start.mock.contexts[0] as tus.Upload).options.onError?.(new Error('exists!'));
    await expect(result).resolves.toStrictEqual([100]);
    expect(gs.create).not.toHaveBeenCalled();
  });

  it('emits zero and propagates creation failure for a duplicate', async () => {
    vi.spyOn(tus.Upload.prototype, 'findPreviousUploads').mockResolvedValue([]);
    const start = vi.spyOn(tus.Upload.prototype, 'start').mockImplementation(() => {});
    const error = new Error('creation failed');
    gs.create.mockReturnValue(throwError(() => error));
    const result = lastValueFrom(
      TestBed.inject(UploadTUSService)
        .uploadFile(new File(['a'], 'a.txt'), 'a.txt', SERV.FILES, { filename: 'a.txt' })
        .pipe(materialize(), toArray())
    );
    await vi.waitFor(() => expect(start).toHaveBeenCalledExactlyOnceWith());
    (start.mock.contexts[0] as tus.Upload).options.onError?.(new Error('already exists'));
    const notifications = await result;
    expect(notifications.map(({ kind, value }) => ({ kind, value }))).toStrictEqual([
      { kind: 'N', value: 100 },
      { kind: 'N', value: 0 },
      { kind: 'E', value: undefined }
    ]);
    expect(notifications[2].error).toBe(error);
    expect(gs.create).toHaveBeenCalledExactlyOnceWith(
      SERV.FILES,
      { filename: 'a.txt' },
      { headers: expect.any(HttpHeaders) }
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
