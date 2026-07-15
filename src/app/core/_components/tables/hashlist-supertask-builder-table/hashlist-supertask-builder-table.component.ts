import { zCrackerBinaryListResponse, zCrackerBinaryTypeListResponse } from '@generated/api/zod';
import { firstValueFrom } from 'rxjs';
import { Subscription } from 'rxjs';

import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';

import { JCrackerBinary, JCrackerBinaryType, zCrackerBinaryTypeList } from '@models/cracker-binary.model';
import { CrackerBinaryId, CrackerBinaryTypeId } from '@models/id.types';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JSuperTask } from '@models/supertask.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';

import { HashlistSupertaskBuilderDataSource } from '@datasources/hashlist-supertask-builder.datasource';

import { CRACKER_TYPE_FIELD_MAPPING, CRACKER_VERSION_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

@Component({
  selector: 'app-hashlist-supertask-builder-table',
  templateUrl: './hashlist-supertask-builder-table.component.html',
  styleUrls: ['./hashlist-supertask-builder-table.component.scss'],
  standalone: false
})
export class HashlistSupertaskBuilderTableComponent implements OnInit, OnDestroy {
  @Input({ required: true }) hashlistId: number;

  /** Emitted after a supertask is created, so the host can refresh its tasks table. */
  @Output() created = new EventEmitter<void>();

  dataSource: HashlistSupertaskBuilderDataSource;
  supertasks: JSuperTask[] = [];

  crackerTypes: SelectOption<CrackerBinaryTypeId>[] = [];
  rowVersions: Partial<Record<number, SelectOption<CrackerBinaryId>[]>> = {};

  selectedTypeByRow: Partial<Record<number, CrackerBinaryTypeId>> = {};
  selectedVersionByRow: Partial<Record<number, CrackerBinaryId>> = {};
  rowLoading: Partial<Record<number, boolean>> = {};

  private readonly serializer = new JsonAPISerializer();
  private readonly versionsByType = new Map<number, SelectOption<CrackerBinaryId>[]>();
  private tableSubscription?: Subscription;

  private readonly injector = inject(Injector);
  private readonly gs = inject(GlobalService);
  private readonly alert = inject(AlertService);

  ngOnInit(): void {
    this.dataSource = new HashlistSupertaskBuilderDataSource(this.injector);

    // This datasource is driven manually (not bound to a mat-table), so we own connect/disconnect
    // ourselves. connect() exposes the row BehaviorSubject; loadAll() fills it. CollectionViewer is unused.
    this.tableSubscription = this.dataSource.connect(null as never).subscribe((rows) => {
      this.supertasks = rows;
      void this.initializeRows();
    });

    void this.loadCrackerTypes().then(() => {
      this.dataSource.loadAll();
    });
  }

  ngOnDestroy(): void {
    this.tableSubscription?.unsubscribe();
    this.dataSource.disconnect(null as never);
  }

  async onTypeChanged(rowId: number, typeId: number): Promise<void> {
    this.selectedTypeByRow[rowId] = typeId;
    try {
      const versions = await this.getVersionsForType(typeId);
      this.rowVersions[rowId] = versions;
      this.selectedVersionByRow[rowId] = versions.slice(-1)[0]?.id as CrackerBinaryId;
    } catch (error) {
      // The global HTTP interceptor already surfaces the error dialog for this request.
      console.error('Failed loading binary versions:', error);
    }
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

  private async initializeRows(): Promise<void> {
    if (!this.crackerTypes.length || !this.supertasks.length) {
      return;
    }

    const preferredType = this.crackerTypes.find((item) => item.name?.toLowerCase() === 'hashcat')?.id;
    const fallbackType = this.crackerTypes[0]?.id;
    const defaultType = (preferredType ?? fallbackType) as CrackerBinaryTypeId;

    if (!defaultType) {
      return;
    }

    try {
      for (const supertask of this.supertasks) {
        if (this.selectedTypeByRow[supertask.id]) {
          continue;
        }

        this.selectedTypeByRow[supertask.id] = defaultType;
        const versions = await this.getVersionsForType(defaultType);
        this.rowVersions[supertask.id] = versions;
        this.selectedVersionByRow[supertask.id] = versions.slice(-1)[0]?.id as CrackerBinaryId;
      }
    } catch (error) {
      // The global HTTP interceptor already surfaces the error dialog for this request.
      console.error('Failed initializing supertask rows:', error);
    }
  }

  private async loadCrackerTypes(): Promise<void> {
    const response = await firstValueFrom(this.gs.getAll(SERV.CRACKERS_TYPES, { include: ['crackerVersions'] }));
    const crackerTypes: JCrackerBinaryType[] = zCrackerBinaryTypeList.parse(
      this.serializer.deserialize(response, zCrackerBinaryTypeListResponse)
    );

    this.crackerTypes = transformSelectOptions(crackerTypes, CRACKER_TYPE_FIELD_MAPPING);
  }

  private async getVersionsForType(typeId: number): Promise<SelectOption<CrackerBinaryId>[]> {
    const cached = this.versionsByType.get(typeId);
    if (cached) {
      return cached;
    }

    const requestParams = new RequestParamBuilder()
      .addFilter({ field: 'crackerBinaryTypeId', operator: FilterType.EQUAL, value: typeId })
      .create();

    const response: ResponseWrapper = await firstValueFrom(this.gs.getAll(SERV.CRACKERS, requestParams));
    const crackers: JCrackerBinary[] = this.serializer.deserialize(response, zCrackerBinaryListResponse);
    const versions = transformSelectOptions(crackers, CRACKER_VERSION_FIELD_MAPPING);

    this.versionsByType.set(typeId, versions);
    return versions;
  }
}
