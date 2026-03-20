/**
 * This module contains wrapper class for Jsona JSON:API serializer/deserializer.
 * See https://github.com/olosegres/jsona.
 *  @module serializer
 * */

import Jsona from 'jsona';
import {
  TDeserializeOptions,
  TJsonApiBody,
  TJsonaDenormalizedIncludeNames,
  TJsonaModel,
  TJsonaNormalizedIncludeNamesTree
} from 'jsona/lib/JsonaTypes';
import { z } from 'zod';

import { Injectable } from '@angular/core';

import { JsonApiPayload } from '@models/json-api.types';

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
    return this.formatter.serialize({ stuff, includeNames });
  }

  /**
   * Deserialize a JSON:API response body into a typed model.
   *
   * @overload Pass a Zod envelope schema to validate the raw body pre-deserialization
   *   and auto-infer the flat return type via JsonApiPayload:
   *   `deserialize(body, zUserSingleResponse)` → returns `JsonApiPayload<...>`
   *
   * @overload Omit the schema to get an unvalidated result:
   *   `deserialize<MyType>(body)` → returns `MyType`
   *
   * @param body  Response body received by an API call
   * @param schema  Zod envelope schema to validate the raw JSON:API body (first overload)
   * @param options  Optional deserializer options
   */
  deserialize<TSchema extends z.ZodTypeAny>(
    body: TJsonApiBody,
    schema: TSchema,
    options?: TDeserializeOptions
  ): JsonApiPayload<z.infer<TSchema>>;
  deserialize<T = unknown>(body: TJsonApiBody, options?: TDeserializeOptions): T;
  deserialize<T>(
    body: TJsonApiBody,
    schemaOrOptions?: z.ZodTypeAny | TDeserializeOptions,
    options?: TDeserializeOptions
  ): T {
    if (schemaOrOptions instanceof z.ZodType) {
      const parseResult = schemaOrOptions.safeParse(body);
      if (!parseResult.success) {
        console.error('API response validation failed', parseResult.error);
        throw parseResult.error;
      }
      return this.formatter.deserialize(body, options) as T;
    }
    return this.formatter.deserialize(body, schemaOrOptions) as T;
  }
}
