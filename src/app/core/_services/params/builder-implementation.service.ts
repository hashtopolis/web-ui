import { Filter, RequestParams } from '@src/app/core/_models/request-params.model';
import { IParamBuilder, RequestParamsIntermediate } from '@src/app/core/_services/params/builder-types.service';

/**
 * Builder class fpr request parameters, implements the IParamBuilder interface
 */
export class RequestParamBuilder implements IParamBuilder {
  private params: RequestParamsIntermediate;

  private addToArray<T>(field: undefined | Array<T>, value: T): Array<T> {
    if (field === undefined || field === null) {
      field = [];
    }
    field.push(value)
    return field
  }

  /**
   * Create a new instance of the builder and init an empty intermediate object
   */
  constructor() {
    this.params = new RequestParamsIntermediate();
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
    return this
  }

  addIncludeTotal(includeTotal: boolean): IParamBuilder {
    this.params.includeTotal = includeTotal;
    return this;
  }

/*
  addFilter(filter: Filter): IParamBuilder {
    return this.addToArray(this.params.filters, filter);
  }

  addSortByAscending(sortBy: string): IParamBuilder {
    return this.addToArray(this.params.sortOrder, sortBy);
  }

  addSortByDescending(sortBy: string): IParamBuilder {
    return this.addToArray(this.params.sortOrder, `-${sortBy}`);
  }
*/
  create(): RequestParams {
    const requestParams: RequestParams = {}
    if (this.params.pageSize || this.params.pageBefore || this.params.pageAfter) {
      requestParams.page = {size: this.params.pageSize, after: this.params.pageAfter, before: this.params.pageBefore};
    }
    requestParams.include = this.params.includes

    return requestParams
  }

}
