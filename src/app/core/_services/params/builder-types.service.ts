/**
 * Interface and intermediate type definitions for request param builder design pattern
 */
import { Filter, type RequestParams } from '@src/app/core/_models/request-params.model';
import { BaseDataSource } from '@datasources/base.datasource';

/**
 * Intermediate class to build RequestParams from using a builder interface implementation
 */
export class RequestParamsIntermediate {
  public pageSize?: number;
  public pageBefore?: number;
  public pageAfter?: number;
  public includes?: Array<string>;
  public filters?: Array<Filter>;
  public sortOrder?: Array<string>;
  public includeTotal?: boolean;
}

/**
 * Interface definition for a RequestParamBuilder
 */
export interface IParamBuilder {
  setPageSize(pageSize: number): IParamBuilder;

  setPageBefore(pageBefore: number): IParamBuilder;

  setPageAfter(pageAfter: number): IParamBuilder;

  addInclude(include: string): IParamBuilder;

  addSorting(sortingColumn: any): IParamBuilder;

  addFilter(filter: Filter): IParamBuilder;

  addIncludeTotal(includeTotal: boolean): IParamBuilder;

  addInitial(datasource: BaseDataSource<any>): IParamBuilder;

  create(): RequestParams;
}
