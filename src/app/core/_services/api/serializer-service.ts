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

import { inject, Injectable } from '@angular/core';

import { JsonApiPayload, RelationshipKeysOfSchema } from '@models/json-api.types';
import { AlertService } from '@services/shared/alert.service';
import { environment } from '@src/environments/environment';

interface IncludeOptions<K extends string> extends TDeserializeOptions {
  include: readonly K[];
}

/** Class for serializing/deserializing objects to and from JSON:API format
 * @class JsonAPISerializer
 * */
@Injectable({
  providedIn: 'root'
})
export class JsonAPISerializer {
  private formatter: Jsona;
  private alertService: AlertService | null;

  constructor() {
    this.formatter = new Jsona();
    try {
      this.alertService = inject(AlertService);
    } catch {
      this.alertService = null;
    }
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
   * @overload Pass a Zod envelope schema + include keys to get relationships required:
   *   `deserialize(body, zTaskResponse, { include: ['hashlist'] })`
   *
   * @overload Pass a Zod envelope schema to validate and auto-infer the flat return type:
   *   `deserialize(body, zAgentResponse)` → returns `JsonApiPayload<...>`
   *
   * @overload Omit the schema to get an unvalidated result:
   *   `deserialize<MyType>(body)` → returns `MyType`
   *
   * @param body  Response body received by an API call
   * @param schema  Zod envelope schema to validate the raw JSON:API body
   * @param options  Optional deserializer options; `include` is type-only
   */
  deserialize<TSchema extends z.ZodTypeAny, K extends RelationshipKeysOfSchema<TSchema>>(
    body: TJsonApiBody,
    schema: TSchema,
    options: IncludeOptions<K>
  ): JsonApiPayload<z.infer<TSchema>, K>;
  deserialize<TSchema extends z.ZodTypeAny>(
    body: TJsonApiBody,
    schema: TSchema,
    options?: TDeserializeOptions
  ): JsonApiPayload<z.infer<TSchema>>;
  deserialize<T = unknown>(body: TJsonApiBody, options?: TDeserializeOptions): T;
  deserialize<T>(
    body: TJsonApiBody,
    schemaOrOptions?: z.ZodTypeAny | TDeserializeOptions,
    options?: TDeserializeOptions | IncludeOptions<string>
  ): T {
    if (schemaOrOptions instanceof z.ZodType) {
      this.validateBody(body, schemaOrOptions);
      return this.formatter.deserialize(body, options) as T;
    }
    return this.formatter.deserialize(body, schemaOrOptions) as T;
  }

  /**
   * Validate a JSON:API body against a Zod envelope schema.
   */
  private validateBody(body: TJsonApiBody, schema: z.ZodTypeAny): void {
    const parseResult = schema.safeParse(body);
    if (!parseResult.success) {
      console.error('API response validation failed', parseResult.error);
      if (!environment.production) {
        this.alertService?.showErrorMessage('API response validation failed: ' + parseResult.error.message);
        throw parseResult.error;
      }
    }
  }
}
