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

import { AggregatesOfSchema } from '@models/aggregate-registry';
import { JsonApiPayload, RelationshipKeysOfSchema } from '@models/json-api.types';
import { RequestParams, TypedRequestParams } from '@models/request-params.model';

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
    return this.formatter.serialize({ stuff, ...(includeNames !== undefined && { includeNames }) });
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
   * @param optionsOrParams  Either `{ include: [...] as const }`, or the `RequestParams` produced by
   *   `RequestParamBuilder.create()` (single source of truth for both includes and aggregates).
   *
   * Aggregate fields are ALWAYS omitted from the result type unless requested. The full aggregate set is
   * derived automatically from the schema (`AggregatesOfSchema`), so passing the builder's params re-adds
   * exactly the aggregates that were `.addAggregate(...)`-ed — reading an un-requested aggregate is a
   * compile error.
   */
  deserialize<TSchema extends z.ZodTypeAny, Inc extends string, Agg extends string>(
    body: TJsonApiBody,
    schema: TSchema,
    params: TypedRequestParams<Inc, Agg>
  ): JsonApiPayload<z.infer<TSchema>, Inc & RelationshipKeysOfSchema<TSchema>, AggregatesOfSchema<TSchema>, Agg>;
  deserialize<TSchema extends z.ZodTypeAny, K extends RelationshipKeysOfSchema<TSchema>>(
    body: TJsonApiBody,
    schema: TSchema,
    options: IncludeOptions<K>
  ): JsonApiPayload<z.infer<TSchema>, K, AggregatesOfSchema<TSchema>, never>;
  deserialize<TSchema extends z.ZodTypeAny>(
    body: TJsonApiBody,
    schema: TSchema,
    options?: TDeserializeOptions
  ): JsonApiPayload<z.infer<TSchema>, never, AggregatesOfSchema<TSchema>, never>;
  deserialize<T = unknown>(body: TJsonApiBody, options?: TDeserializeOptions): T;
  deserialize<T>(
    body: TJsonApiBody,
    schemaOrOptions?: z.ZodTypeAny | TDeserializeOptions,
    options?: TDeserializeOptions | IncludeOptions<string> | RequestParams
  ): T {
    if (schemaOrOptions instanceof z.ZodType) {
      this.validateBody(body, schemaOrOptions);
      // `options` may be a RequestParams (single-source path); jsona ignores unknown keys at runtime.
      return this.formatter.deserialize(body, options as TDeserializeOptions | undefined) as T;
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
        // eslint-disable-next-line no-console
        console.log('Actual API response body:', JSON.stringify(body, null, 2));
        this.alertService?.showErrorMessage('API response validation failed: ' + parseResult.error.message);
      }
    }
  }
}
