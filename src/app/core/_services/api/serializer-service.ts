/**
 * This module contains wrapper class for Jsona JSON:API serializer/deserializer.
 * See https://github.com/olosegres/jsona.
 *  @module serializer
 * */

import {
  TDeserializeOptions,
  TJsonApiBody,
  TJsonaDenormalizedIncludeNames,
  TJsonaModel,
  TJsonaNormalizedIncludeNamesTree
} from 'jsona/lib/JsonaTypes';

import { Injectable } from '@angular/core';
import Jsona from 'jsona';

/** Class for serializing/deserializing objects to and from JSON:API format
 * @class JsonAPISerializer
 * */
@Injectable({
  providedIn: 'root'
})
export class JsonAPISerializer {
  private formatter: Jsona;

  constructor() {
    this.formatter = new Jsona();
  }

  /**
   * Serialize model to JSON:API format
   * @param stuff Object(s) to serialize (can handle array)
   * @param includeNames Relationship(s) to include (can handle deep relations via dot)
   */
  serialize({
    stuff,
    includeNames
  }: {
    stuff: TJsonaModel | Array<TJsonaModel>;
    includeNames?: TJsonaDenormalizedIncludeNames | TJsonaNormalizedIncludeNamesTree;
  }) {
    console.log(stuff);
    return this.formatter.serialize({ stuff, includeNames });
  }

  /**
   * Deserialize JSON:API response body to model
   * @param body Response body received by API call
   * @param options Optional deserializer options
   */
  deserialize<T>(body: TJsonApiBody, options?: TDeserializeOptions) {
    return this.formatter.deserialize(body, options) as T;
  }
}
