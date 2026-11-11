import { throwError } from 'rxjs';

import { SERV } from '@services/main.config';

import { setupDatasource } from '@datasources/specs/datasource-test-setup-util';
import { SuperTasksPretasksDataSource } from '@datasources/supertasks-pretasks.datasource';

describe('SuperTasksPretasksDataSource', () => {
  it('loads pretasks from the selected supertask and requests the pretask relationship', () => {
    const { dataSource, service } = setupDatasource(SuperTasksPretasksDataSource);
    const ds = dataSource;
    ds.setSuperTaskId(8);
    ds.loadAll();
    expect(service.get).toHaveBeenCalledExactlyOnceWith(
      SERV.SUPER_TASKS,
      8,
      expect.objectContaining({ include: ['pretasks'] })
    );
  });

  it('sets pretasks from the decoded supertask response', () => {
    const { dataSource, service } = setupDatasource(SuperTasksPretasksDataSource);
    const pretasks = [{ id: 2, type: 'pretask', name: 'Mask' }] as never[];
    vi.spyOn(dataSource.serializer, 'deserialize').mockImplementation(() => ({ pretasks }) as never);
    dataSource.setSuperTaskId(3);

    dataSource.loadAll();

    expect(dataSource.getData()).toStrictEqual(pretasks);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
    dataSource.selection.select(pretasks[0]);
    dataSource.reload();
    expect(dataSource.selection.hasValue()).toBe(false);
    expect(service.get).toHaveBeenNthCalledWith(
      2,
      SERV.SUPER_TASKS,
      3,
      expect.objectContaining({ include: ['pretasks'] })
    );
  });

  it('ends loading and retains existing rows when the request fails', () => {
    const { dataSource, service } = setupDatasource(SuperTasksPretasksDataSource);
    const existingPretask = { id: 4, type: 'pretask', name: 'Existing' } as never;
    dataSource.setData([existingPretask]);
    service.get.mockReturnValue(throwError(() => new Error('request failed')));

    dataSource.loadAll();

    expect(dataSource.getData()).toStrictEqual([existingPretask]);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
