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

import { JsonApiPayload, RelationshipKeysOfSchema } from '@models/json-api.types';

import { AlertService } from '@services/shared/alert.service';

import { environment } from '@src/environments/environment';

interface IncludeOptions<K extends string> extends TDeserializeOptions {
  include: readonly K[];
}

interface AggregateOptions<A extends string> extends TDeserializeOptions {
  aggregate: readonly A[];
}

interface IncludeAndAggregateOptions<K extends string, A extends string> extends TDeserializeOptions {
  include: readonly K[];
  aggregate: readonly A[];
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
   * @param options  Optional deserializer options; `include` and `aggregate` are type-only
   *
   * Aggregate keys are not derivable from the schema, so when requesting aggregates name the entity's
   * aggregate union explicitly, e.g.
   *   `deserialize<typeof zTaskResponse, never, JTaskAggregates>(body, schema, { aggregate: ['dispatched'] })`
   * By default (no `aggregate`) every aggregate field is absent from the result type; the requested subset
   * is added back as present.
   */
  deserialize<
    TSchema extends z.ZodTypeAny,
    K extends RelationshipKeysOfSchema<TSchema>,
    AAll extends string,
    A extends AAll = AAll
  >(
    body: TJsonApiBody,
    schema: TSchema,
    options: IncludeAndAggregateOptions<K, A>
  ): JsonApiPayload<z.infer<TSchema>, K, AAll, A>;
  deserialize<TSchema extends z.ZodTypeAny, AAll extends string, A extends AAll = AAll>(
    body: TJsonApiBody,
    schema: TSchema,
    options: AggregateOptions<A>
  ): JsonApiPayload<z.infer<TSchema>, never, AAll, A>;
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
    options?:
      | TDeserializeOptions
      | IncludeOptions<string>
      | AggregateOptions<string>
      | IncludeAndAggregateOptions<string, string>
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
        // eslint-disable-next-line no-console
        console.log('Actual API response body:', JSON.stringify(body, null, 2));
        this.alertService?.showErrorMessage('API response validation failed: ' + parseResult.error.message);
      }
    }
  }
}
