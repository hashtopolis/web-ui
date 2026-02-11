import { catchError, finalize, of } from 'rxjs';

import { JAccessGroup } from '@models/access-group.model';
import { JAgent } from '@models/agent.model';
import { ResponseWrapper } from '@models/response.model';
import { JUser } from '@models/user.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class AccessGroupsExpandDataSource extends BaseDataSource<JUser | JAgent> {
  private _accessgroupId = 0;
  private _include = '';
  private allData: (JUser | JAgent)[] = []; // Store all data for client-side filtering/sorting
  private currentFilterValue = ''; // Store current filter value
  private currentFilterColumn = ''; // Store current filter column

  setAccessGroupId(accessgroupId: number) {
    this._accessgroupId = accessgroupId;
  }

  setAccessGroupExpand(include: string) {
    this._include = include;
  }

  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInclude(this._include).create();

    const accessGroup$ = this.service.get(SERV.ACCESS_GROUPS, this._accessgroupId, params);

    this.subscriptions.push(
      accessGroup$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const accessGroup = new JsonAPISerializer().deserialize<JAccessGroup>({
            data: response.data,
            included: response.included
          });
          const expandedData = accessGroup[this._include];

          // Store all data for client-side filtering/sorting
          this.allData = expandedData || [];

          // Apply current processing
          this.applyClientSideProcessing();
        })
    );
  }

  /**
   * Apply client-side filtering
   */
  filterData(filterValue: string, filterColumn?: string): void {
    this.currentFilterValue = filterValue.toLowerCase();
    if (filterColumn) {
      this.currentFilterColumn = filterColumn;
    }
    this.applyClientSideProcessing();
  }

  /**
   * Apply both filtering and sorting to the data
   */
  private applyClientSideProcessing(): void {
    let processedData = [...this.allData];

    // Apply filtering if there's a filter value
    if (this.currentFilterValue) {
      processedData = processedData.filter((item) => {
        // Filter based on selected column
        if (this.currentFilterColumn === 'id' || this.currentFilterColumn === '_id') {
          // Filter by ID only
          return item.id?.toString().includes(this.currentFilterValue);
        } else if (this.currentFilterColumn === 'name') {
          // Filter by name only (for JUser)
          if ('name' in item) {
            return item.name?.toLowerCase().includes(this.currentFilterValue);
          }
        } else if (this.currentFilterColumn === 'agentName') {
          // Filter by agentName only (for JAgent)
          if ('agentName' in item) {
            return item.agentName?.toLowerCase().includes(this.currentFilterValue);
          }
        }
        // If no column specified, search in both (fallback)
        if ('name' in item) {
          // It's a JUser
          return (
            item.name?.toLowerCase().includes(this.currentFilterValue) ||
            item.id?.toString().includes(this.currentFilterValue)
          );
        } else if ('agentName' in item) {
          // It's a JAgent
          return (
            item.agentName?.toLowerCase().includes(this.currentFilterValue) ||
            item.id?.toString().includes(this.currentFilterValue)
          );
        }
        return false;
      });
    }

    // Apply sorting if configured
    if (this.sortingColumn) {
      processedData = this.applySorting(processedData);
    }

    // Set pagination info
    this.setPaginationConfig(this.pageSize, processedData.length, null, null, 0);
    this.setData(processedData);
  }

  /**
   * Apply client-side sorting to the data
   */
  private applySorting(data: (JUser | JAgent)[]): (JUser | JAgent)[] {
    if (!this.sortingColumn) {
      return data;
    }

    const isAscending = this.sortingColumn.direction === 'asc';
    let sortKey = this.sortingColumn.dataKey;

    // Map display dataKey to actual property name
    if (sortKey === '_id') {
      sortKey = 'id';
    }

    return data.sort((a: JUser | JAgent, b: JUser | JAgent) => {
      const aValue = a[sortKey as keyof (JUser | JAgent)];
      const bValue = b[sortKey as keyof (JUser | JAgent)];

      if (aValue == null || bValue == null) {
        return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return isAscending ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return isAscending ? comparison : -comparison;
      }

      return 0;
    });
  }

  getData(): (JUser | JAgent)[] {
    return this.getOriginalData();
  }

  reload(): void {
    this.clearSelection();
    // When reloading, re-apply client-side processing to current data
    if (this.allData.length > 0) {
      this.applyClientSideProcessing();
    } else {
      this.loadAll();
    }
  }
}
