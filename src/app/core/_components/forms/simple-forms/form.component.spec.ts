import { BehaviorSubject, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';
import { z } from 'zod';

import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { FormRouteKind, FormRouteType } from '@models/routes.schema';

import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { GlobalService } from '@services/main.service';
import { InfoMetadataForm, MetadataService } from '@services/metadata.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { FormComponent } from '@src/app/core/_components/forms/simple-forms/form.component';
import { mockResponse } from '@src/app/testing/mock-response';

describe('FormComponent', () => {
  const config = { URL: '/items', RESOURCE: 'items' };
  let data: BehaviorSubject<Record<string, unknown>>;
  let params: BehaviorSubject<{ id: string }>;
  let metadata: MockedObject<MetadataService>;
  let global: MockedObject<GlobalService>;
  let title: MockedObject<AutoTitleService>;
  let alert: MockedObject<AlertService>;
  let router: MockedObject<Router>;
  let confirm: MockedObject<ConfirmDialogService>;
  let info: InfoMetadataForm;

  beforeEach(() => {
    data = new BehaviorSubject<Record<string, unknown>>({
      kind: FormRouteKind.EditWordlist,
      type: FormRouteType.Create,
      serviceConfig: config
    });
    params = new BehaviorSubject({ id: '42' });
    info = {
      title: 'Items',
      submitok: 'Saved',
      submitokredirect: '/items',
      deltitle: 'Delete',
      delsubmitok: 'Deleted',
      delsubmitokredirect: '/items',
      delsubmitcancel: 'Cancelled'
    };
    metadata = {
      getInfoMetadata: vi.fn().mockName('MetadataService.getInfoMetadata'),
      getFormMetadata: vi.fn().mockName('MetadataService.getFormMetadata')
    } as unknown as MockedObject<MetadataService>;
    metadata.getInfoMetadata.mockImplementation(() => [info]);
    metadata.getFormMetadata.mockReturnValue([]);
    global = {
      get: vi.fn().mockName('GlobalService.get'),
      create: vi.fn().mockName('GlobalService.create'),
      update: vi.fn().mockName('GlobalService.update'),
      delete: vi.fn().mockName('GlobalService.delete')
    } as unknown as MockedObject<GlobalService>;
    global.get.mockReturnValue(
      of(mockResponse({ data: { type: 'items', id: '42', attributes: { name: 'alpha', version: '2' } } }))
    );
    global.create.mockReturnValue(of(mockResponse()));
    global.update.mockReturnValue(of(mockResponse()));
    global.delete.mockReturnValue(of(mockResponse()));
    title = { set: vi.fn().mockName('AutoTitleService.set') } as unknown as MockedObject<AutoTitleService>;
    alert = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage'),
      showInfoMessage: vi.fn().mockName('AlertService.showInfoMessage')
    } as unknown as MockedObject<AlertService>;
    router = {
      navigate: vi.fn().mockName('Router.navigate').mockResolvedValue(true),
      navigateByUrl: vi.fn().mockName('Router.navigateByUrl').mockResolvedValue(true)
    } as unknown as MockedObject<Router>;
    confirm = {
      confirmDeletion: vi.fn().mockName('ConfirmDialogService.confirmDeletion').mockReturnValue(of(true))
    } as unknown as MockedObject<ConfirmDialogService>;
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { data, params } },
        { provide: MetadataService, useValue: metadata },
        { provide: GlobalService, useValue: global },
        { provide: AutoTitleService, useValue: title },
        { provide: AlertService, useValue: alert },
        { provide: Router, useValue: router },
        { provide: ConfirmDialogService, useValue: confirm }
      ]
    });
  });

  function create() {
    return TestBed.runInInjectionContext(() => new FormComponent());
  }
  function edit() {
    data.next({ kind: FormRouteKind.EditWordlist, type: FormRouteType.Edit, serviceConfig: config });
  }

  it('initializes create metadata and loads immediately', () => {
    const component = create();
    expect(metadata.getInfoMetadata).toHaveBeenCalledExactlyOnceWith('editwordlistInfo');
    expect(metadata.getFormMetadata).toHaveBeenCalledExactlyOnceWith('editwordlist');
    expect(component.isCreate).toBe(true);
    expect(component.isloaded).toBe(true);
    expect(component.customform).toBe(false);
    expect(title.set).toHaveBeenCalledExactlyOnceWith(['Items']);
    expect(global.get).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(global.get).not.toHaveBeenCalled();
  });

  it('loads edit data and reloads on initialization', () => {
    edit();
    const component = create();
    expect(component.isCreate).toBe(false);
    expect(component.editedIndex).toBe(42);
    expect(component.formValues).toMatchObject({ name: 'alpha', version: '2' });
    expect(component.isloaded).toBe(true);
    expect(global.get).toHaveBeenCalledExactlyOnceWith(config, 42);
    component.ngOnInit();
    expect(global.get).toHaveBeenCalledTimes(2);
  });

  it('uses the response schema and constructs a dynamic title from multiple fields', () => {
    info.titlePrefix = 'Wordlist';
    info.titleField = ['name', 'missing', 'version'];
    const schema = z.any();
    data.next({
      kind: FormRouteKind.EditWordlist,
      type: FormRouteType.Edit,
      serviceConfig: config,
      responseSchema: schema
    });
    const component = create();
    expect(component.responseSchema).toBe(schema);
    expect(component.title).toBe('Wordlist alpha 2');
    expect(title.set).toHaveBeenNthCalledWith(2, ['Wordlist alpha 2']);
  });

  it('keeps the static title when a title field has no value', () => {
    info.titleField = 'missing';
    edit();
    const component = create();
    expect(component.title).toBe('Items');
    expect(title.set).toHaveBeenCalledExactlyOnceWith(['Items']);
  });

  it.each([
    [403, '/forbidden'],
    [404, '/not-found']
  ])('routes status %i to %s', (status, url) => {
    global.get.mockReturnValue(throwError(() => new HttpErrorResponse({ status })));
    edit();
    const component = create();
    expect(router.navigateByUrl).toHaveBeenCalledExactlyOnceWith(url);
    expect(component.isloaded).toBe(false);
    expect(alert.showErrorMessage).not.toHaveBeenCalled();
  });

  it.each([
    [500, 'Error loading data (server returned 500).'],
    [0, 'Error loading data.']
  ])('reports loading error %i', (status, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    global.get.mockReturnValue(throwError(() => new HttpErrorResponse({ status })));
    edit();
    const component = create();
    expect(alert.showErrorMessage).toHaveBeenCalledExactlyOnceWith(message);
    expect(component.isloaded).toBe(false);
  });

  it('creates an item and reports success', () => {
    const component = create();
    component.onFormSubmit({ name: 'new' });
    expect(global.create).toHaveBeenCalledExactlyOnceWith(config, { name: 'new' });
    expect(alert.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('Saved');
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/items']);
  });

  it('updates an item and replaces custom fields with the route id', () => {
    info.customform = true;
    metadata.getFormMetadata.mockReturnValue([
      { name: 'owner', replacevalue: 'id' },
      { name: 'name' },
      { replacevalue: 'id' }
    ]);
    edit();
    const component = create();
    const values = { owner: 1, name: 'updated' };
    component.onFormSubmit(values);
    expect(values).toStrictEqual({ owner: 42, name: 'updated' });
    expect(global.update).toHaveBeenCalledExactlyOnceWith(config, 42, values);
    expect(alert.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('Saved');
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/items']);
  });

  it('uses default submission messages and redirects', () => {
    info = { title: 'Items' };
    const component = create();
    component.onFormSubmit({});
    expect(alert.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('');
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/']);
  });

  it('deletes after confirmation and reports success after navigation', async () => {
    const component = create();
    component.onDeleteAction();
    expect(confirm.confirmDeletion).toHaveBeenCalledExactlyOnceWith('Delete', '42');
    expect(global.delete).toHaveBeenCalledExactlyOnceWith(config, 42);
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/items']);
    await Promise.resolve();
    expect(alert.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('Deleted');
  });

  it('reports cancellation without deleting', () => {
    confirm.confirmDeletion.mockReturnValue(of(false));
    const component = create();
    component.onDeleteAction();
    expect(global.delete).not.toHaveBeenCalled();
    expect(alert.showInfoMessage).toHaveBeenCalledExactlyOnceWith('Cancelled');
  });

  it('uses deletion defaults when metadata omits them', async () => {
    info = { title: 'Items' };
    const component = create();
    component.editedIndex = 7;
    component.onDeleteAction();
    expect(confirm.confirmDeletion).toHaveBeenCalledExactlyOnceWith('', '7');
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/']);
    await Promise.resolve();
    expect(alert.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('');
  });
});
