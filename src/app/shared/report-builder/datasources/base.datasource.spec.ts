import { Subscription, of } from 'rxjs';

import type { CollectionViewer } from '@angular/cdk/collections';
import type { ChangeDetectorRef } from '@angular/core';

import type { GlobalService } from '@src/app/core/_services/main.service';
import type { UIConfigService } from '@src/app/core/_services/shared/storage.service';
import { ReportBaseDataSource } from '@src/app/shared/report-builder/datasources/base.datasource';

class TestReportDataSource extends ReportBaseDataSource<string> {
  addSubscription(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }
}

describe('ReportBaseDataSource', () => {
  let dataSource: TestReportDataSource;
  let cdr: ChangeDetectorRef;
  let globalService: GlobalService;
  let uiService: UIConfigService;
  const viewer: CollectionViewer = { viewChange: of({ start: 0, end: 0 }) };

  beforeEach(() => {
    cdr = {
      markForCheck: vi.fn().mockName('ChangeDetectorRef.markForCheck'),
      detach: vi.fn().mockName('ChangeDetectorRef.detach'),
      detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges'),
      reattach: vi.fn().mockName('ChangeDetectorRef.reattach')
    };
    globalService = {} as GlobalService;
    uiService = {} as UIConfigService;
    dataSource = new TestReportDataSource(cdr, globalService, uiService);
  });

  it('starts with empty original data and a non-loading state', () => {
    const loadingStates: boolean[] = [];

    dataSource.loading$.subscribe((loading) => loadingStates.push(loading));

    expect(dataSource.getOriginalData()).toStrictEqual([]);
    expect(loadingStates).toStrictEqual([false]);
  });

  it('updates the loading state and triggers change detection', () => {
    const loadingStates: boolean[] = [];
    dataSource.loading$.subscribe((loading) => loadingStates.push(loading));

    dataSource.loading = true;

    expect(loadingStates).toStrictEqual([false, true]);
    expect(cdr.detectChanges).toHaveBeenCalledOnce();
  });

  it('stores and emits the supplied data, including an empty list', () => {
    const received: string[][] = [];
    dataSource.connect(viewer).subscribe((data) => received.push(data));
    const rows = ['first', 'second'];

    dataSource.setData(rows);
    const storedAfterRows = dataSource.getOriginalData();
    dataSource.setData([]);

    expect(storedAfterRows).toStrictEqual(rows);
    expect(received).toStrictEqual([[], rows, []]);
    expect(dataSource.getOriginalData()).toStrictEqual([]);
  });

  it('completes both data streams and unsubscribes registered subscriptions on disconnect', () => {
    const dataComplete = vi.fn().mockName('dataComplete');
    const loadingComplete = vi.fn().mockName('loadingComplete');
    dataSource.connect(viewer).subscribe({ complete: dataComplete });
    dataSource.loading$.subscribe({ complete: loadingComplete });
    const unsubscribe = vi.fn().mockName('unsubscribe');
    dataSource.addSubscription(new Subscription(unsubscribe));

    dataSource.disconnect(viewer);

    expect(dataComplete).toHaveBeenCalledOnce();
    expect(loadingComplete).toHaveBeenCalledOnce();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });
});
