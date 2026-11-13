import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { mockResponse } from '@src/app/testing/mock-response';

export function setupDatasource<T>(type: Type<T>) {
  const serializer = {
    deserialize: vi.fn().mockName('JsonAPISerializer.deserialize').mockReturnValue([])
  };
  const service = {
    getAll: vi.fn().mockName('GlobalService.getAll').mockReturnValue(of(mockResponse())),
    get: vi.fn().mockName('GlobalService.get').mockReturnValue(of(mockResponse()))
  } as MockedObject<Pick<GlobalService, 'get' | 'getAll'>>;
  TestBed.configureTestingModule({
    providers: [
      { provide: GlobalService, useValue: service },
      { provide: JsonAPISerializer, useValue: serializer },
      {
        provide: ChangeDetectorRef,
        useValue: {
          markForCheck: vi.fn().mockName('ChangeDetectorRef.markForCheck'),
          detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges')
        }
      },
      {
        provide: UIConfigService,
        useValue: { getUISettings: vi.fn().mockName('UIConfigService.getUISettings').mockReturnValue({}) }
      },
      { provide: PermissionService, useValue: {} },
      {
        provide: AutoRefreshService,
        useValue: {
          refresh$: of(),
          toggleAutoRefresh: vi.fn().mockName('AutoRefreshService.toggleAutoRefresh'),
          startAutoRefresh: vi.fn().mockName('AutoRefreshService.startAutoRefresh'),
          stopAutoRefresh: vi.fn().mockName('AutoRefreshService.stopAutoRefresh')
        }
      },
      { provide: HttpCacheService, useValue: { invalidate: vi.fn().mockName('HttpCacheService.invalidate') } },
      {
        provide: LocalStorageService,
        useValue: {
          getItem: vi.fn().mockName('LocalStorageService.getItem').mockReturnValue(null),
          setItem: vi.fn().mockName('LocalStorageService.setItem')
        }
      }
    ]
  });
  return { dataSource: new type(TestBed.inject(Injector)), service, serializer };
}
