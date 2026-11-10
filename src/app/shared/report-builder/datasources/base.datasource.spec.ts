import { Subscription, of } from 'rxjs';
import type { MockedObject } from 'vitest';

import type { CollectionViewer } from '@angular/cdk/collections';
import type { ChangeDetectorRef } from '@angular/core';

import type { GlobalService } from '@src/app/core/_services/main.service';
import type { UIConfigService } from '@src/app/core/_services/shared/storage.service';
import { ReportBaseDataSource } from '@src/app/shared/report-builder/datasources/base.datasource';

// Mock class
class TestReportDataSource extends ReportBaseDataSource<string> {
  addSubscription(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }
}

describe('ReportBaseDataSource', () => {
  let dataSource: TestReportDataSource;
  let cdr: ChangeDetectorRef;
  let globalService: MockedObject<GlobalService>;
  let uiService: MockedObject<UIConfigService>;
  const viewer: CollectionViewer = { viewChange: of({ start: 0, end: 0 }) };

  beforeEach(() => {
    cdr = {
      markForCheck: vi.fn(),
      detach: vi.fn(),
      detectChanges: vi.fn(),
      reattach: vi.fn()
    };
    globalService = { getAll: vi.fn() } as MockedObject<GlobalService>;
    uiService = { getUISettings: vi.fn() } as MockedObject<UIConfigService>;
    dataSource = new TestReportDataSource(cdr, globalService, uiService);
  });

  it('starts with empty original data and a non-loading state', () => {
    const loadingStates: boolean[] = [];

    dataSource.loading$.subscribe((loading) => loadingStates.push(loading));

    expect(dataSource.getOriginalData()).toEqual([]);
    expect(loadingStates).toEqual([false]);
  });

  it('updates the loading state and triggers change detection', () => {
    const loadingStates: boolean[] = [];
    dataSource.loading$.subscribe((loading) => loadingStates.push(loading));

    dataSource.loading = true;

    expect(loadingStates).toEqual([false, true]);
    expect(cdr.detectChanges).toHaveBeenCalledOnce();
  });

  it('stores and emits the supplied data, including an empty list', () => {
    const received: string[][] = [];
    dataSource.connect(viewer).subscribe((data) => received.push(data));
    const rows = ['first', 'second'];

    dataSource.setData(rows);
    dataSource.setData([]);

    expect(received).toEqual([[], rows, []]);
    expect(dataSource.getOriginalData()).toEqual([]);
  });

  it('connects viewers to the data stream', () => {
    const received: string[][] = [];

    dataSource.connect(viewer).subscribe((data) => received.push(data));
    dataSource.setData(['row']);

    expect(received).toEqual([[], ['row']]);
  });

  it('completes both data streams and unsubscribes registered subscriptions on disconnect', () => {
    const dataComplete = vi.fn();
    const loadingComplete = vi.fn();
    dataSource.connect(viewer).subscribe({ complete: dataComplete });
    dataSource.loading$.subscribe({ complete: loadingComplete });
    const unsubscribe = vi.fn();
    dataSource.addSubscription(new Subscription(unsubscribe));

    dataSource.disconnect(viewer);

    expect(dataComplete).toHaveBeenCalledOnce();
    expect(loadingComplete).toHaveBeenCalledOnce();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it('disconnects cleanly when there are no registered subscriptions', () => {
    const dataComplete = vi.fn();
    dataSource.connect(viewer).subscribe({ complete: dataComplete });

    dataSource.disconnect(viewer);

    expect(dataComplete).toHaveBeenCalledOnce();
  });
});
