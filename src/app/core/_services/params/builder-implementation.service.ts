import { Filter, RequestParams } from '@src/app/core/_models/request-params.model';
import { IParamBuilder, RequestParamsIntermediate } from '@src/app/core/_services/params/builder-types.service';

/**
 * Builder class fpr request parameters, implements the IParamBuilder interface
 */
export class RequestParamBuilder implements IParamBuilder {
  private params: RequestParamsIntermediate;

  /**
   * Adds a new value to ome of the params arrays, create the array if it's undefined
   * @param field params array to add value to, must be of template type T
   * @param value value to add, must be of template type T
   * @returns params array including the new value
   * @private
   */
  private addToArray<T>(field: undefined | Array<T>, value: T): Array<T> {
    if (field === undefined || field === null) {
      field = [];
    }
    field.push(value);
    return field;
  }

  /**
   * Create a new instance of the builder and init an empty intermediate object
   */
  constructor() {
    this.params = new RequestParamsIntermediate();
  }

  addInitial(dataSource) {
    this.setPageSize(dataSource.pageSize);
    this.setPageAfter(dataSource.currentPage * dataSource.pageSize)
    this.addSorting(dataSource.sortingColumn);

    return this;
  }

  setPageSize(pageSize: number): IParamBuilder {
    this.params.pageSize = pageSize;
    return this;
  }

  setPageBefore(pageBefore: number): IParamBuilder {
    this.params.pageBefore = pageBefore;
    return this;
  }

  setPageAfter(pageAfter: number): IParamBuilder {
    this.params.pageAfter = pageAfter;
    return this;
  }

  addInclude(include: string): IParamBuilder {
    this.params.includes = this.addToArray<string>(this.params.includes, include);
    return this;
  }

  addFilter(filter: Filter): IParamBuilder {
    this.params.filters = this.addToArray<Filter>(this.params.filters, filter);
    return this;
  }

  addIncludeTotal(includeTotal: boolean): IParamBuilder {
    this.params.includeTotal = includeTotal;
    return this;
  }

  addSorting(sortingColumn: any): IParamBuilder {
    if (sortingColumn.dataKey && sortingColumn.isSortable) {
      const direction = sortingColumn.direction === 'asc' ? '' : '-';
      this.params.sortOrder = this.addToArray<string>(this.params.sortOrder, `${direction}${sortingColumn.dataKey}`);
    }
    return this;
  }

  create(): RequestParams {
    const requestParams: RequestParams = {};
    if (this.params.pageSize || this.params.pageBefore || this.params.pageAfter) {
      requestParams.page = {}
      if (this.params.pageSize !== undefined) requestParams.page.size = this.params.pageSize;
      if (this.params.pageAfter !== undefined) requestParams.page.after = this.params.pageAfter;
      if (this.params.pageBefore !== undefined) requestParams.page.before = this.params.pageBefore;
    }
    if (this.params.includes) requestParams.include = this.params.includes;
    if (this.params.sortOrder) requestParams.sort = this.params.sortOrder;
    if (this.params.filters) requestParams.filter = this.params.filters;
    return requestParams;
  }
}
