import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthService } from '@services/access/auth.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { ConfigService } from '@services/shared/config.service';

describe('GlobalService downloads', () => {
  let service: GlobalService;
  let httpMock: HttpTestingController;
  let anchor: jasmine.SpyObj<HTMLAnchorElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GlobalService,
        { provide: AuthService, useValue: { userId: 1 } },
        { provide: ConfigService, useValue: { getEndpoint: () => 'http://localhost:8080/api/v2' } },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(GlobalService);
    httpMock = TestBed.inject(HttpTestingController);

    anchor = jasmine.createSpyObj<HTMLAnchorElement>('a', ['click']);
    spyOn(document, 'createElement').and.returnValue(anchor);
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:mock');
    spyOn(window.URL, 'revokeObjectURL');
  });

  afterEach(() => httpMock.verify());

  it('downloadFromUrl fetches a blob and saves it under the given filename', () => {
    let done = false;
    service
      .downloadFromUrl('http://localhost:8080/api/download.php/crackerBinary/7', 'hashcat-7.1.2.7z')
      .subscribe(() => (done = true));

    const req = httpMock.expectOne('http://localhost:8080/api/download.php/crackerBinary/7');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['7z']));

    expect(anchor.download).toBe('hashcat-7.1.2.7z');
    expect(anchor.href).toBe('blob:mock');
    expect(anchor.click).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock');
    expect(done).toBeTrue();
  });

  it('downloadFromUrl bypasses the http cache so archives are not kept in memory', () => {
    service.downloadFromUrl('http://x/archive', 'f').subscribe();
    const req = httpMock.expectOne('http://x/archive');
    expect(req.request.headers.get('X-Cache-Skip')).toBe('true');
    req.flush(new Blob(['']));
  });

  it('downloadFromUrl forwards custom headers', () => {
    service.downloadFromUrl('http://x/file', 'f', new HttpHeaders({ 'X-Test': '1' })).subscribe();
    const req = httpMock.expectOne('http://x/file');
    expect(req.request.headers.get('X-Test')).toBe('1');
    expect(req.request.headers.get('X-Cache-Skip')).toBe('true');
    req.flush(new Blob(['']));
  });

  it('downloadFromUrl errors and does not save when the request fails', () => {
    let status = 0;
    service.downloadFromUrl('http://x/missing', 'f').subscribe({ error: (e) => (status = e.status) });
    httpMock.expectOne('http://x/missing').flush(new Blob(['Not found']), { status: 404, statusText: 'Not Found' });
    expect(status).toBe(404);
    expect(anchor.click).not.toHaveBeenCalled();
  });

  it('getFile still downloads via the helper endpoint', () => {
    service.getFile(SERV.GET_FILES, 5, 'rockyou.txt');
    const req = httpMock.expectOne('http://localhost:8080/api/v2/helper/getFile?file=5');
    req.flush(new Blob(['data']));
    expect(anchor.download).toBe('rockyou.txt');
  });
});

describe('GlobalService relationships', () => {
  let service: GlobalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GlobalService,
        { provide: AuthService, useValue: { userId: 1 } },
        { provide: ConfigService, useValue: { getEndpoint: () => 'http://localhost:8080/api/v2' } },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(GlobalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getRelationshipLink requests the ids of a to-many relationship', () => {
    service.getRelationshipLink(SERV.CRACKERS, 12, 'hashtypes').subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/v2/ui/crackers/12/relationships/hashtypes');
    expect(req.request.method).toBe('GET');
    req.flush({ data: [] });
  });

  it('getRelationships requests the related resources and forwards headers', () => {
    service
      .getRelationships(SERV.HASHTYPES, 0, 'crackerBinaries', { headers: new HttpHeaders({ 'X-Test': '1' }) })
      .subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/v2/ui/hashtypes/0/crackerBinaries');
    expect(req.request.headers.get('X-Test')).toBe('1');
    req.flush({ data: [] });
  });

  it('postRelationships forwards headers', () => {
    service
      .postRelationships(
        SERV.CRACKERS,
        12,
        'hashtypes',
        { data: [{ type: 'hashType', id: 0 }] },
        { headers: new HttpHeaders({ 'X-Test': '1' }) }
      )
      .subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/v2/ui/crackers/12/relationships/hashtypes');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X-Test')).toBe('1');
    expect(req.request.body).toEqual({ data: [{ type: 'hashType', id: 0 }] });
    req.flush({});
  });

  it('postRelationships sends no extra headers without options', () => {
    service.postRelationships(SERV.CRACKERS, 12, 'hashtypes', { data: [] }).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/v2/ui/crackers/12/relationships/hashtypes');
    expect(req.request.headers.keys()).toEqual([]);
    req.flush({});
  });
});
