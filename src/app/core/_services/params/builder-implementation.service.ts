import { Filter, type RequestParams } from '@src/app/core/_models/request-params.model';
import { IParamBuilder, RequestParamsIntermediate } from '@src/app/core/_services/params/builder-types.service';
import { BaseDataSource } from '@src/app/core/_datasources/base.datasource';

/**
 * Builder class fpr request parameters, implements the IParamBuilder interface
 */
export class RequestParamBuilder implements IParamBuilder {
  private params: RequestParamsIntermediate;

  /**
   * Create a new instance of the builder and init an empty intermediate object
   */
  constructor() {
    this.params = new RequestParamsIntermediate();
  }

  /**
   * Sets page size, page after and sorting from datasource
   * @param dataSource the datasoutce to get the values from
   */
  addInitial(dataSource: BaseDataSource<any>) {
    if (dataSource.pageSize != undefined) {
      this.setPageSize(dataSource.pageSize);
    }
    if (dataSource.currentPage != undefined) {
      this.setPageAfter(dataSource.currentPage * dataSource.pageSize);
    }
    if (dataSource.sortingColumn != undefined) {
      this.addSorting(dataSource.sortingColumn);
    }

    return this;
  }

  /**
   * Sets the current page size
   * @param pageSize
   * @returns object instance
   */
  setPageSize(pageSize: number): IParamBuilder {
    this.params.pageSize = pageSize;
    return this;
  }


  /**
   * Sets the page befopre
   * @param pageBefore
   * @returns object instance
   */
  setPageBefore(pageBefore: number): IParamBuilder {
    this.params.pageBefore = pageBefore;
    return this;
  }

  /**
   * Sets the page after
   * @param pageAfter
   * @returns object instance
   */
  setPageAfter(pageAfter: number): IParamBuilder {
    this.params.pageAfter = pageAfter;
    return this;
  }

  /**
   * Adds a new value to the includes array
   * @param include new include value
   * @returns object instance
   */
  addInclude(include: string): IParamBuilder {
    this.params.includes = this.addToArray<string>(this.params.includes, include);
    return this;
  }

  /**
   * Adds a new filter to the filters array
   * @param filter new filter value
   * @returns object instance
   */
  addFilter(filter: Filter): IParamBuilder {
    this.params.filters = this.addToArray<Filter>(this.params.filters, filter);
    return this;
  }

  /**
   * Sets the include total boolean value
   * @param includeTotal include_total setting
   * @returns object instance
   */
  addIncludeTotal(includeTotal: boolean): IParamBuilder {
    this.params.includeTotal = includeTotal;
    return this;
  }

  /**
   * Adds a new value from the given column to the sort array
   * @param sortingColumn column to get sort values from
   * @returns object instance
   */
  addSorting(sortingColumn: any): IParamBuilder {
    if (sortingColumn.dataKey && sortingColumn.isSortable) {
      const direction = sortingColumn.direction === 'asc' ? '' : '-';
      this.params.sortOrder = this.addToArray<string>(this.params.sortOrder, `${direction}${sortingColumn.dataKey}`);
    }
    return this;
  }

  /**
   * Creates a RequestParam object from the internal intermediate object
   * @returns new RequestParam object
   */
  create(): RequestParams {
    const requestParams: RequestParams = {};
    if (this.params.pageSize || this.params.pageBefore || this.params.pageAfter) {
      requestParams.page = {};
      if (this.params.pageSize !== undefined) requestParams.page.size = this.params.pageSize;
      if (this.params.pageAfter !== undefined) requestParams.page.after = this.params.pageAfter;
      if (this.params.pageBefore !== undefined) requestParams.page.before = this.params.pageBefore;
    }
    if (this.params.includes) requestParams.include = this.params.includes;
    if (this.params.sortOrder) requestParams.sort = this.params.sortOrder;
    if (this.params.filters) requestParams.filter = this.params.filters;
    if (this.params.includeTotal !== undefined) requestParams.include_total = this.params.includeTotal;
    return requestParams;
  }

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
}
