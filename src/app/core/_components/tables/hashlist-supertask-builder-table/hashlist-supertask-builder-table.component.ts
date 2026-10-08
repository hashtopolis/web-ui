import { zCrackerBinaryListResponse } from '@generated/api/zod';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { Component, DestroyRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';

import { JCrackerBinary } from '@models/cracker-binary.model';
import { CrackerBinaryId, CrackerBinaryTypeId, HashTypeId } from '@models/id.types';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JSuperTask } from '@models/supertask.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { CrackerBinaryTypesService, fallbackCrackerTypeName } from '@services/crackers/cracker-binary-types.service';
import {
  CrackerHashtypeSupportService,
  SUPPORT_LOOKUP_FAILED,
  SupportedCrackerBinaryIds,
  buildUnsupportedHashtypeMessage,
  filterSupportedCrackerVersions
} from '@services/crackers/cracker-hashtype-support.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';

import { HashlistSupertaskBuilderDataSource } from '@datasources/hashlist-supertask-builder.datasource';

import { CRACKER_VERSION_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

/**
 * Creates supertasks for a hashlist from the supertask templates. Each row shows the cracker type of its supertask
 * and offers the versions of that type supporting the hashtype of the hashlist.
 */
@Component({
  selector: 'app-hashlist-supertask-builder-table',
  templateUrl: './hashlist-supertask-builder-table.component.html',
  styleUrls: ['./hashlist-supertask-builder-table.component.scss'],
  standalone: false
})
export class HashlistSupertaskBuilderTableComponent implements OnInit, OnDestroy {
  @Input({ required: true }) hashlistId: number;

  /** Hashtype of the hashlist, only versions supporting it are offered */
  @Input() hashTypeId: HashTypeId | null = null;
  @Input() hashtypeDescription: string | null = null;

  /** Emitted after a supertask is created, so the host can refresh its tasks table. */
  @Output() created = new EventEmitter<void>();

  dataSource: HashlistSupertaskBuilderDataSource;
  supertasks: JSuperTask[] = [];

  readonly pageSizeOptions = [10, 25, 50, 100];

  /** Versions of the row's cracker type, filtered by hashtype support; undefined while loading */
  rowVersions: Partial<Record<number, SelectOption<CrackerBinaryId>[]>> = {};
  selectedVersionByRow: Partial<Record<number, CrackerBinaryId>> = {};
  rowLoading: Partial<Record<number, boolean>> = {};

  /** Block message when no accessible cracker version at all supports the hashtype of the hashlist */
  unsupportedHashtypeMessage: string | null = null;

  private typeNames: ReadonlyMap<CrackerBinaryTypeId, string> = new Map();
  private supportedCrackerBinaryIds: SupportedCrackerBinaryIds = null;

  private readonly serializer = new JsonAPISerializer();
  private readonly versionsByType = new Map<number, SelectOption<CrackerBinaryId>[]>();

  private readonly injector = inject(Injector);
  private readonly gs = inject(GlobalService);
  private readonly alert = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly crackerSupport = inject(CrackerHashtypeSupportService);
  private readonly crackerBinaryTypes = inject(CrackerBinaryTypesService);

  ngOnInit(): void {
    this.dataSource = new HashlistSupertaskBuilderDataSource(this.injector);
    this.dataSource.pageSize = this.pageSizeOptions[0];

    // This datasource is driven manually (not bound to a mat-table), so we own connect/disconnect
    // ourselves. connect() exposes the row BehaviorSubject; loadAll() fills it. CollectionViewer is unused.
    this.dataSource
      .connect(null as never)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rows) => {
        this.supertasks = rows;
        void this.initializeRows();
      });

    // The hashtype support and the type names must be known before rows initialize, but a failure must not stop
    // the rows from loading: without them the create controls stay disabled while the templates are still listed.
    void this.loadSupport()
      .catch((error) => {
        // The global HTTP interceptor already surfaces the error dialog for this request.
        console.error('Failed loading the hashtype support:', error);
      })
      .finally(() => {
        this.dataSource.loadAll();
      });
  }

  ngOnDestroy(): void {
    this.dataSource.disconnect(null as never);
  }

  onPageChange(event: PageEvent): void {
    let pageAfter = this.dataSource.pageAfter;
    let pageBefore = this.dataSource.pageBefore;
    let index = event.pageIndex;

    if (index > this.dataSource.index) {
      pageBefore = null;
    } else if (index < this.dataSource.index) {
      pageAfter = null;
    }

    if (event.pageSize !== this.dataSource.pageSize || index === 0) {
      index = 0;
      pageAfter = null;
      pageBefore = null;
    }

    this.dataSource.setPaginationConfig(event.pageSize, this.dataSource.totalItems, pageAfter, pageBefore, index);
    this.dataSource.reload();
  }

  /** Name of the supertask's cracker type */
  typeName(supertask: JSuperTask): string {
    return this.typeNames.get(supertask.crackerBinaryTypeId) ?? fallbackCrackerTypeName(supertask.crackerBinaryTypeId);
  }

  /** True once the versions of the row's type are loaded and none can be used */
  isRowBlocked(supertask: JSuperTask): boolean {
    return this.rowVersions[supertask.id]?.length === 0;
  }

  /** Why the row cannot create a supertask */
  rowBlockedMessage(supertask: JSuperTask): string {
    const type = this.typeName(supertask);
    if (this.supportedCrackerBinaryIds === SUPPORT_LOOKUP_FAILED) {
      return `Could not check which ${type} versions support this hashtype.`;
    }
    return this.hashTypeId !== null
      ? `No accessible ${type} version supports this hashtype.`
      : `No accessible ${type} version.`;
  }

  async createSupertask(supertaskTemplateId: number): Promise<void> {
    const crackerVersionId = this.selectedVersionByRow[supertaskTemplateId];
    if (!crackerVersionId) {
      this.alert.showErrorMessage('Select a binary version first.');
      return;
    }

    this.rowLoading[supertaskTemplateId] = true;

    try {
      await firstValueFrom(
        this.gs.chelper(SERV.HELPER, 'createSupertask', {
          supertaskTemplateId,
          hashlistId: this.hashlistId,
          crackerVersionId
        })
      );

      this.alert.showSuccessMessage('New Supertask created');
      this.created.emit();
    } catch (error) {
      // The global HTTP interceptor already surfaces the error dialog for this request.
      console.error('Failed creating supertask from template:', error);
    } finally {
      this.rowLoading[supertaskTemplateId] = false;
    }
  }

  /** Load the versions of each row's cracker type and preselect the newest one */
  private async initializeRows(): Promise<void> {
    try {
      for (const supertask of this.supertasks) {
        if (this.rowVersions[supertask.id]) {
          continue;
        }
        const versions = await this.getVersionsForType(supertask.crackerBinaryTypeId);
        this.rowVersions[supertask.id] = versions;
        this.selectedVersionByRow[supertask.id] = versions.slice(-1)[0]?.id as CrackerBinaryId;
      }
    } catch (error) {
      // The global HTTP interceptor already surfaces the error dialog for this request.
      console.error('Failed initializing supertask rows:', error);
    }
  }

  /** Load which versions support the hashtype (if any is known) and the names of the cracker types */
  private async loadSupport(): Promise<void> {
    if (this.hashTypeId !== null) {
      this.supportedCrackerBinaryIds = await firstValueFrom(
        this.crackerSupport.getSupportedCrackerBinaryIds(this.hashTypeId)
      );
    }
    this.typeNames = await firstValueFrom(this.crackerBinaryTypes.getTypeNames());
    // the support lookup is already restricted to accessible versions, an empty set means nothing supports it
    this.unsupportedHashtypeMessage =
      this.hashTypeId !== null && this.supportedCrackerBinaryIds?.size === 0
        ? buildUnsupportedHashtypeMessage(this.hashTypeId, this.hashtypeDescription, this.supportedCrackerBinaryIds)
        : null;
  }

  private async getVersionsForType(typeId: number): Promise<SelectOption<CrackerBinaryId>[]> {
    const cached = this.versionsByType.get(typeId);
    if (cached) {
      return cached;
    }

    const requestParams = new RequestParamBuilder()
      .addFilter({ field: 'crackerBinaryTypeId', operator: FilterType.EQUAL, value: typeId })
      .create();

    const response: ResponseWrapper = await lastValueFrom(this.gs.getAll(SERV.CRACKERS, requestParams));
    const crackers: JCrackerBinary[] = filterSupportedCrackerVersions(
      this.serializer.deserialize(response, zCrackerBinaryListResponse),
      this.supportedCrackerBinaryIds
    );
    const versions = transformSelectOptions(crackers, CRACKER_VERSION_FIELD_MAPPING);

    this.versionsByType.set(typeId, versions);
    return versions;
  }
}
