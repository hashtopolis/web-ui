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

import { Injectable, inject } from '@angular/core';

import { AlertService } from '@src/app/core/_services/shared/alert.service';

/** Class for serializing/deserializing objects to and from JSON:API format
 * @class JsonAPISerializer
 * */
@Injectable({
  providedIn: 'root'
})
export class JsonAPISerializer {
  private formatter: Jsona;
  private alert = inject(AlertService);

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
   * @overload Pass a Zod schema to validate and type the result:
   *   `deserialize(body, MySchema)` → returns `z.infer<typeof MySchema>`
   *
   * @overload Omit the schema to get an unvalidated result:
   *   `deserialize<MyType>(body)` → returns `MyType`
   *
   * @param body  Response body received by an API call
   * @param schema  Zod schema to validate and type the result (first overload)
   * @param options  Optional deserializer options
   */
  deserialize<TSchema extends z.ZodTypeAny>(
    body: TJsonApiBody,
    schema: TSchema,
    options?: TDeserializeOptions
  ): z.infer<TSchema>;
  deserialize<T = unknown>(body: TJsonApiBody, options?: TDeserializeOptions): T;
  deserialize<T>(
    body: TJsonApiBody,
    schemaOrOptions?: z.ZodTypeAny | TDeserializeOptions,
    options?: TDeserializeOptions
  ): T {
    if (schemaOrOptions instanceof z.ZodType) {
      const result = this.formatter.deserialize(body, options);
      const parseResult = schemaOrOptions.safeParse(result);
      if (!parseResult.success) {
        console.error('API response validation failed', parseResult.error);
        this.alert.showErrorMessage('Unexpected data received from server.');
        throw parseResult.error;
      }
      return parseResult.data as T;
    }
    return this.formatter.deserialize(body, schemaOrOptions) as T;
  }
}
