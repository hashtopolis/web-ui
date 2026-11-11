import { HttpHeaderName } from '@constants/http.config';
import { zPreTaskListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { JPretask } from '@models/pretask.model';
import { FilterType, RequestParams } from '@models/request-params.model';

import { SERV } from '@services/main.config';
import { UIConfigService } from '@services/shared/storage.service';

import { HashlistPretaskBuilderDataSource } from '@src/app/core/_datasources/hashlist-pretask-builder.datasource';
import { setupDatasource } from '@src/app/core/_datasources/specs/datasource-test-setup-util';
import { mockValidResponse } from '@src/app/testing/mock-response';

const PRETASK = {
  id: 1,
  type: 'preTask',
  taskName: 'import',
  attackCmd: '#HL# wordlist.txt',
  chunkTime: 600,
  statusTimer: 5,
  color: 'FF0000',
  isSmall: false,
  isCpuTask: false,
  useNewBench: true,
  priority: 0,
  maxAgents: 0,
  isMaskImport: false,
  crackerBinaryTypeId: 1
} as unknown as JPretask;
const PRETASK_RESPONSE = (totalElements = 27) =>
  mockValidResponse(zPreTaskListResponse, {
    data: [
      {
        id: PRETASK.id,
        type: 'preTask',
        attributes: {
          taskName: PRETASK.taskName,
          attackCmd: '#HL# wordlist.txt',
          chunkTime: 600,
          statusTimer: 5,
          color: 'FF0000',
          isSmall: false,
          isCpuTask: false,
          useNewBench: true,
          priority: 0,
          maxAgents: 0,
          isMaskImport: false,
          crackerBinaryTypeId: 1
        }
      }
    ],
    links: {
      next: 'http://test/pretasks?page%5Bafter%5D=next-cursor',
      prev: 'http://test/pretasks?page%5Bbefore%5D=prev-cursor'
    },
    meta: { page: { total_elements: totalElements } }
  });

describe('HashlistPretaskBuilderDataSource', () => {
  let dataSource: HashlistPretaskBuilderDataSource;
  let service: ReturnType<typeof setupDatasource<HashlistPretaskBuilderDataSource>>['service'];
  let serializer: ReturnType<typeof setupDatasource<HashlistPretaskBuilderDataSource>>['serializer'];
  let uiService: UIConfigService;

  beforeEach(() => {
    const setup = setupDatasource(HashlistPretaskBuilderDataSource);
    dataSource = setup.dataSource;
    service = setup.service;
    serializer = setup.serializer;
    uiService = TestBed.inject(UIConfigService);
    serializer.deserialize.mockReturnValue([PRETASK]);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('requests pretasks with pretask files, suppresses the global error dialog, and excludes imported masks when configured', () => {
    vi.spyOn(uiService, 'getUISettings').mockReturnValue({ hideImportMasks: 1 } as unknown as ReturnType<
      UIConfigService['getUISettings']
    >);
    service.getAll.mockReturnValue(of(PRETASK_RESPONSE()));

    dataSource.loadAll();

    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.PRETASKS, expect.anything(), expect.anything());
    const params = service.getAll.mock.lastCall![1] as RequestParams;
    const options = service.getAll.mock.lastCall![2];
    expect(params!.include).toContain('pretaskFiles');
    expect(options?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');
    expect(params!.filter).toStrictEqual([{ field: 'isMaskImport', operator: FilterType.EQUAL, value: false }]);
    expect(serializer.deserialize).toHaveBeenCalledExactlyOnceWith(expect.anything(), zPreTaskListResponse);
    expect(dataSource.getOriginalData()).toStrictEqual([PRETASK]);
    expect(dataSource.totalItems).toBe(27);
    expect(dataSource.pageAfter).toBe('next-cursor');
    expect(dataSource.pageBefore).toBe('prev-cursor');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('omits the import-mask filter when the setting is disabled', () => {
    vi.spyOn(uiService, 'getUISettings').mockReturnValue({ hideImportMasks: 0 } as unknown as ReturnType<
      UIConfigService['getUISettings']
    >);

    dataSource.loadAll();

    expect((service.getAll.mock.lastCall![1] as RequestParams).filter).toBeUndefined();
  });

  it('clears selection and requests pretasks on reload', () => {
    dataSource.selection.select(PRETASK);
    service.getAll.mockClear();

    dataSource.reload();

    expect(dataSource.selection.isSelected(PRETASK)).toBe(false);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.PRETASKS, expect.anything(), expect.anything());
  });

  it('preserves existing rows, emits filter errors, and ends loading on request failure', () => {
    service.getAll.mockReturnValue(of(PRETASK_RESPONSE()));
    dataSource.loadAll();
    const errors: string[] = [];
    dataSource.filterError$.subscribe((error) => errors.push(error));
    service.getAll.mockReturnValue(throwError(() => ({ status: 400, error: { title: 'Invalid filter' } })));

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toStrictEqual([PRETASK]);
    expect(errors).toStrictEqual(['Invalid filter']);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
