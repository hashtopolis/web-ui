# Project Style Guide

This document outlines the coding, documentation, and architecture conventions for
the Hashtopolis web-ui (Angular) project.

It has two parts:

- **Part A - General Conventions** covers language-level style: naming, comments,
  and Angular-specific conventions.
- **Part B - Architecture and Project Conventions** covers the systems that make
  this app work the way it does: the backend data contract, the JSON:API layer,
  includes/aggregates and their typing, forms, HTTP caching, theming, local
  storage, and tooling. Read Part B before adding a feature.

## Table of Contents

### Part A - General Conventions

1. [General Guidelines](#1-general-guidelines)
2. [Naming Conventions](#2-naming-conventions)
3. [Comments](#3-comments)
4. [Angular-Specific Guidelines](#4-angular-specific-guidelines)

### Part B - Architecture and Project Conventions

5. [Backend contract and generated types](#5-backend-contract-and-generated-types)
6. [JSON:API, Jsona serializer and services](#6-jsonapi-jsona-serializer-and-services)
7. [Includes, aggregates, relationships and typing](#7-includes-aggregates-relationships-and-typing)
8. [Data layer: datasources and ht-table](#8-data-layer-datasources-and-ht-table)
9. [Reactive forms and typed controls](#9-reactive-forms-and-typed-controls)
10. [HTTP caching and stale-while-revalidate](#10-http-caching-and-stale-while-revalidate)
11. [Theming and CSS variables](#11-theming-and-css-variables)
12. [Local storage validation](#12-local-storage-validation)
13. [Tooling and repo conventions](#13-tooling-and-repo-conventions)

---

## Part A - General Conventions

### 1. General Guidelines

- Write clear and concise code.
- Keep functions and methods focused on a single responsibility.
- Follow the [Code of Conduct](CONTRIBUTING.md).
- Prefer strong types over loose ones. This codebase runs TypeScript in strict
  mode (see [section 13](#13-tooling-and-repo-conventions)); anything you add
  should be typed as precisely as the data allows.

**Model discrete values as `const` object enums, not bare `string` / `number`.**
When a value can only be one of a fixed set, encode that set in the type instead of
a loose `string` or `number`. The project convention is a `const` object with an
`as const` assertion plus a matching type alias (see
`src/app/core/_models/api-token.model.ts`):

```ts
// Good as function is typed as strict as possible 
export const ApiTokenStatus = {
  ACTIVE: 'active',
  REVOKED: 'revoked',
  EXPIRED: 'expired'
} as const;
export type ApiTokenStatus = (typeof ApiTokenStatus)[keyof typeof ApiTokenStatus];

function badge(status: ApiTokenStatus) {
  /* status is 'active' | 'revoked' | 'expired' */
}

// Bad - any string compiles
function badge(status: string) {
  /* ... */
}
```

Prefer this over both bare primitives and TypeScript `enum`s (a few older `enum`s
such as `AgentOS` / `IgnoreErrors` in `_constants/agentsc.config.ts` predate the
convention). On the zod side the same idea is a literal union - see "Type anything
you add" in [section 5](#5-backend-contract-and-generated-types).

### 2. Naming Conventions

Choose variable names that are descriptive, clear, and contextually relevant,
avoiding ambiguity, generic terms, and "magic" values, and strive for consistency
and single responsibility to enhance readability and maintainability.

- **Boolean variables**: use prefixes like `is` (`isVisible`, `isFinished`) or
  `has` (`hasPermission`, `hasErrors`).
- **Constants**: uppercase with underscores (`MAX_ATTEMPTS`, `API_URL`). App-wide
  constants live under `src/app/core/_constants/`.
- **Classes**: PascalCase (`AppComponent`, `UserService`); suffix services with
  `Service`.
- **Components**: kebab-case selectors with no prefix (`<my-component>`),
  PascalCase class names, suffix `Component`.
- **Directives**: `app`-prefixed camelCase selectors (`appMyDirective`), PascalCase
  class names, suffix `Directive`.
- **Files**: kebab-case (`user-list.component.ts`), matching the primary class.
- **Modules**: PascalCase.
- **Enums**: PascalCase names, uppercase values.
- **Routes**: kebab-case paths.

**Interfaces and types - project prefixes.** Do not use the generic `I` prefix.
This project has established prefixes that carry meaning:

- **`J` prefix** for JSON:API resource models: `JAgent`, `JTask`, `JHashlist`
  (see `src/app/core/_models/*.model.ts`).
- **`z` prefix** for generated and hand-written zod schemas: `zAgentListResponse`,
  `zCrackerBinaryTypeList`.
- **Unprefixed interfaces** for local shapes such as reactive-form typings:
  `NewTaskForm`, `EditTaskForm`.

### 3. Comments

- Use comments sparingly; prefer self-explanatory code.
- Add comments for non-obvious logic or to explain _why_, not _what_.
- Keep comments up to date.

```typescript
// Good - the comment explains *why*, which the code alone cannot
const calculateTotal = (items: number[]): number => {
  // Seed with 0 so an empty list returns a valid total instead of undefined
  return items.reduce((sum, item) => sum + item, 0);
};

// Bad - the comment just restates *what* the next line already says
const calculateTotal = (items: number[]): number => {
  // Reduce the items into a sum
  return items.reduce((sum, item) => sum + item, 0);
};
```

### 4. Angular-Specific Guidelines

- Follow the official [Angular Style Guide](https://angular.io/guide/styleguide)
  for anything not covered here.
- For the project-specific patterns that the Angular guide does not cover (data
  fetching, tables, forms, caching, theming, storage), see Part B.
- The app currently uses classic reactive patterns (RxJS with `@Input()` /
  `@Output()`). Angular **signals are not used yet**, but may be adopted in the
  future - do not introduce signal-based APIs ad hoc without aligning first.

---

## Part B - Architecture and Project Conventions

The frontend talks to a slim PHP backend over a [JSON:API](https://jsonapi.org/)
interface. Type safety runs end to end: the backend's OpenAPI spec generates zod
schemas and TypeScript types, responses are validated against those schemas at
runtime, and the request that asked for optional data also determines the static
type of the result. The sections below explain each link in that chain and how to
extend it.

### 5. Backend contract and generated types

zod schemas and TypeScript types are generated from the backend's OpenAPI spec.

> **Do not run the generation pipeline right now.** The committed types and zod
> schemas under `src/generated/api/` have since been hand-edited, and re-running
> `npm run generate` (or its `generate:api` step) would overwrite those edits with
> weaker generated output. Until the backend's OpenAPI spec is rich enough to
> regenerate cleanly (see "Generated schemas are hand-edited" below), treat the
> committed generated files as the source of truth and edit them by hand. The
> pipeline is documented here for reference and for the eventual regeneration.

**Pipeline.** `npm run generate` runs two steps:

1. `fetch:openapi` - curls the running backend's
   `.../api/v2/openapi-compliant.json` into `openapi.json` at the repo root and
   prettifies it.
2. `generate:api` - runs `@hey-api/openapi-ts` (config in `openapi-ts.config.mjs`,
   plugins `@hey-api/typescript` and `zod`), then `scripts/split-generated.mjs`,
   then prettier.

`scripts/split-generated.mjs` post-processes the raw output: it rewrites int64
`bigint` chains to `z.number()` (JavaScript has no native int64), splits the
monolithic `zod.gen.ts` / `types.gen.ts` into per-resource files, and deletes the
`.gen.ts` originals so the split files are the source of truth.

**Output.** Generated code lives under `src/generated/api/`:

- `src/generated/api/zod/*.ts` - one file per resource (`agent.ts`, `task.ts`,
  `hashlist.ts`, ...) plus `common.ts`, `helper.ts`, `login.ts`, and an `index.ts`
  barrel.
- `src/generated/api/types/*.ts` - the matching TypeScript types.

Import generated code through the `@generated/*` path alias. The `src/generated`
tree is committed to git and ignored by ESLint.

**Generated schemas are hand-edited (for now).** The PHP backend is slim and its
OpenAPI spec is missing some distinct type information, so generated schemas are
hand-edited after generation until the spec is rich enough to generate them fully.
There are two accepted approaches, in order of preference:

1. **Widen the type in `openapi.json` and regenerate.** Preferred, because the fix
   survives the next regeneration. Example: a notification's `objectId` is not
   always tied to an object, so the spec was widened to `["integer", "null"]`,
   which the generator turns into `objectId: z.int().nullish()` in
   `zod/notification-setting.ts`.
2. **Patch the generated file directly.** Used for fields the spec still omits
   entirely, in particular aggregate fields (see
   [section 7](#7-includes-aggregates-relationships-and-typing)). Examples:
   `crackingTime: z.int().optional()` added to `zod/agent.ts`, and
   `totalNumberOfChunks: z.number().optional().default(0)` in `zod/task.ts`.

**Type anything you add - properly.** When you add a field (whether by editing the
spec or the generated file), give it a precise type rather than a loose one:

- integers: `z.int()`, not bare `z.number()` where an integer is meant;
- optional or nullable: `z.nullish()` (null or undefined) or `z.nullable()`,
  matching the backend's real behaviour;
- fixed value sets: `z.union([z.literal(0), z.literal(1), z.literal(2)])` rather
  than `z.number()`;
- sensible defaults: `.default(0)` so consumers never see `undefined` unexpectedly.

Never leave an added field as `z.any()`. The whole point of the generated layer is
that the type describes the data.

**Layering stricter validation.** Where the generated envelope schema is not strict
enough, hand-written model schemas can wrap it. For example
`src/app/core/_models/cracker-binary.model.ts` runs a strict
`zCrackerBinaryTypeList.parse(...)` on the already-deserialized result.

### 6. JSON:API, Jsona serializer and services

The backend speaks [JSON:API](https://jsonapi.org/). A response is an envelope: a
`data` array (or object) of resources, each with a `type`, an `id`, an `attributes`
object, and a `relationships` object; related resources are side-loaded in a
top-level `included` array. Reads accept query params `include`, `filter`, `sort`,
`page`, and the backend's custom `aggregate[...]` (see the spec's
[fetching data](https://jsonapi.org/format/#fetching) chapter and
[section 7](#7-includes-aggregates-relationships-and-typing)).

**What `include` and `aggregate` put on the wire.** Both are query params on a read:

- `include=user,accessGroups` side-loads those relationships into the top-level
  `included` array (standard JSON:API).
- `aggregate[<type>]=a,b` requests computed fields; the builder emits it as, for
  example, `aggregate[agent]=crackingTime` (see `setParameter` in `buildparams.ts`).
  The computed values arrive as extra keys inside the resource's own `attributes`
  (this is why `crackingTime` was patched onto `data.attributes` in `zod/agent.ts`).

**End-to-end read flow.** A read moves through five stages - request, raw envelope,
zod validation, jsona flattening, typed model:

```text
RequestParamBuilder (section 7)
  -> GET /api/v2/ui/agents/12?include=user&aggregate[agent]=crackingTime
       |
       v   HTTP response: raw JSON:API envelope
  {
    data: {
      id: 12, type: "agent",
      attributes: { agentName: "gpu-01", ..., crackingTime: 4211 }    // aggregate -> attributes
    },
    relationships: { user: { data: { type: "user", id: 3 } } },       // include -> relationships ...
    included: [ { type: "user", id: 3, attributes: { name: "..." } } ] //        ... resolved via included
  }
       |
       v   JsonAPISerializer.deserialize(body, zAgentResponse, params)
  1. validateBody(body, zAgentResponse)  // zod safeParse on the RAW envelope (non-throwing)
  2. jsona.deserialize(body, params)     // flatten attributes + resolve `included` into nested models
       |
       v   typed result
  JAgentWith<'user' | 'crackingTime'>    // base JAgent + requested include + requested aggregate
```

Note the order: `zAgentResponse` describes the *envelope*, so zod validation runs on
the raw body **before** jsona flattens it - the two are independent steps, not a
chain. And because the same `params` object carries a phantom type of what was
requested ([section 7](#7-includes-aggregates-relationships-and-typing)), reading an
include or aggregate you did not ask for is a compile error.

**Jsona flattens the envelope.** The [`jsona`](https://www.npmjs.com/package/jsona)
library turns a JSON:API envelope into plain nested model objects (and back). It is
wrapped by `JsonAPISerializer` in
`src/app/core/_services/api/serializer-service.ts`:

- `serialize(...)` on writes, producing a JSON:API body from a model.
- `deserialize(body, schema, params?)` on reads. It first calls `validateBody`,
  then hands the body to jsona.

**Validation is non-throwing by design.** `validateBody` runs `schema.safeParse`.
On failure it logs `console.error`, and in non-production shows an `AlertService`
message with the mismatch, but it does **not** throw and does not block
deserialization:

```ts
private validateBody(body: TJsonApiBody, schema: z.ZodTypeAny): void {
  const parseResult = schema.safeParse(body);
  if (!parseResult.success) {
    console.error('API response validation failed', parseResult.error);
    // non-prod: also alertService.showErrorMessage(...)
  }
}
```

This surfaces contract drift loudly during development without breaking the UI in
production when the backend adds a harmless field.

**Only responses are validated today - not requests.** The read path validates every
response body against its zod envelope schema (above), but the write path does not:
`serialize(...)` runs the model through jsona and sends it without a `safeParse`
against a request schema, so outgoing bodies are effectively unchecked at runtime.
Validating request bodies against the generated `*Create` / `*Patch` schemas (for
example `zAgentPatch`) before sending would be a worthwhile improvement.

**The gateway service.** `GlobalService`
(`src/app/core/_services/main.service.ts`) is the single HTTP gateway: `getAll`,
`get`, `create`, `update`, `delete`, the `bulk*` operations, and relationship ops.
Writes are serialized through jsona before being sent. The resource-to-endpoint map
is `SERV` in `src/app/core/_services/main.config.ts`.

**Backend helpers.** Some server-side operations are exposed as helper endpoints
rather than CRUD (for example `getBestTasksAgent`, `abortChunk`, `createSupertask`).
They are registered in `HELPER_ENDPOINTS` (`main.config.ts`, `/helper` resource) and
called from the frontend through three methods on `GlobalService`, named after the
HTTP verb they wrap: **`ghelper()`** = GET helper, **`chelper()`** = "create" helper
(POST by default, GET optional), **`uhelper()`** = "update" helper (PATCH). Their
generated schemas live in `src/generated/api/zod/helper.ts` (for example
`zAbortChunkHelperApi`) and the response is validated the same way as any other
response.

The helper API is loosely typed and is a known area for improvement: the caller
picks the operation by passing a string `option: HelperEndpoint` plus an untyped
`arr: Record<string, unknown>` payload, so neither the chosen operation nor its
arguments are checked by the compiler. A better design would give every helper its
own properly typed method (typed params in, typed result out) instead of routing
through a stringly-typed `option` argument.

**Two meanings of "service" - do not conflate them.** `GlobalService` is the HTTP
gateway. The `*-role.service.ts` files under `src/app/core/_services/roles/` are
**permission** services that extend `RoleService` and declare required permissions;
they are not the backend gateway. See [section 13](#13-tooling-and-repo-conventions).

**Where response validation actually runs.** Datasources
([section 8](#8-data-layer-datasources-and-ht-table)) call `getAll(...)` then
`serializer.deserialize(response, zXxxResponse)`. So the safeParse in
`validateBody` is the main validation point for every list and detail view. Other
validation points in the app: strict `.parse` on a flattened result
(`crackers.datasource.ts`), filter input (`hashes.datasource.ts`), route resolver
data (`zFormRouteData` in the simple-forms components), and local storage
([section 12](#12-local-storage-validation)).

### 7. Includes, aggregates, relationships and typing

This is the mechanism that makes optional related data type-safe: the same request
object that asks the server for extra data also determines the static type of the
result.

**The three JSON:API concepts.**

- **Relationships** are links between resources declared in a resource's
  `relationships` object (a task belongs to a hashlist, an agent has chunks). See
  the spec's [relationships](https://jsonapi.org/format/#document-resource-object-relationships)
  chapter.
- **Includes** side-load related resources so you avoid an N+1 of follow-up
  requests: `?include=user,task` returns those relations in the `included` array.
  See [inclusion of related resources](https://jsonapi.org/format/#fetching-includes).
- **Aggregates** are a backend extension (not core JSON:API): computed fields
  requested per resource type via `aggregate[<field>]=a,b`, for example
  `aggregate[taskwrapperdisplay]=totalAssignedAgents,searched,dispatched`.

**Building the request.** Use the fluent `RequestParamBuilder<Inc, Agg>`
(`src/app/core/_services/params/builder-implementation.service.ts`). Every
`.addInclude(...)` / `.addAggregate({ field, values })` widens the builder's generic
parameters, and `.create()` returns a `TypedRequestParams<Inc, Agg>` - a normal
`RequestParams` object carrying a phantom brand of the requested includes and
aggregates (`src/app/core/_models/request-params.model.ts`). The query-string is
emitted by `setParameter()` in `src/app/core/_services/buildparams.ts`
(`include=a,b` and `aggregate[field]=x,y`).

```ts
// tasks.datasource.ts
const params = new RequestParamBuilder().addInitial(this).addAggregate({
  field: 'taskwrapperdisplay',
  values: ['totalAssignedAgents', 'searched', 'dispatched', 'status', 'currentSpeed'] as const
});
const requestParams = params.create();
// ...same requestParams drives both the request and the result type:
const rows = this.serializer.deserialize(response, zTaskWrapperDisplayListResponse, requestParams);
```

Pass aggregate `values` as `as const` so the literal string union flows into the
type.

**Typing includes and aggregates.** The primitives are in
`src/app/core/_models/base.model.ts`:

```ts
export type Thin<T, Conditional extends keyof T> = Omit<T, Conditional>;
export type With<T, Conditional extends keyof T, K extends Conditional> = Omit<T, Conditional> & Pick<T, K>;
```

`Thin<T, ...>` is the default response shape with all on-demand fields removed;
`With<T, ..., K>` re-adds only the requested subset. Both cover `?include=`
relationships and `aggregate[..]=` fields.

Each entity model follows the same pattern (see `agent.model.ts`, `task.model.ts`):

```ts
export type JAgentIncludes = 'user' | 'task' | 'chunks' | 'assignments' | /* ... */;
export interface JAgentAggregateFields { crackingTime: number | null; }
export type JAgentAggregates = keyof JAgentAggregateFields;
export type JAgentConditional = JAgentIncludes | JAgentAggregates;
export type ThinJAgent = Thin<JAgent, JAgentIncludes>;
export type JAgentWith<K extends JAgentConditional> =
    Omit<JAgent, JAgentIncludes>
  & Pick<JAgent, K & JAgentIncludes>
  & Pick<JAgentAggregateFields, K & JAgentAggregates>;
```

Aggregate fields are deliberately kept **off** the base model and surfaced only
through `...With<K>`. Common combinations get a pre-baked alias, for example
`JTaskWrapperDisplayOverview` in `task.model.ts`.

**How the request type reaches the result.** `aggregate-registry.ts` maps each
JSON:API resource `type` literal to its aggregate-key union (`ResourceAggregateMap`).
The `deserialize` overloads in `serializer-service.ts`, together with the
compile-time transforms in `json-api.types.ts`, consume the phantom brand on
`TypedRequestParams<Inc, Agg>`:

```ts
deserialize<TSchema, Inc extends string, Agg extends string>(
  body: TJsonApiBody, schema: TSchema, params: TypedRequestParams<Inc, Agg>
): JsonApiPayload<z.infer<TSchema>, Inc & RelationshipKeysOfSchema<TSchema>, AggregatesOfSchema<TSchema>, Agg>;
```

The result type is therefore exactly the base model plus the requested includes
plus the requested aggregates. Reading an aggregate you did not request is a
compile error.

**When adding a new aggregate or include:**

1. Add the field to the model's `...AggregateFields` interface (aggregates) or the
   `...Includes` union (relationships), typed properly
   ([section 5](#5-backend-contract-and-generated-types)).
2. For aggregates, register the type in `aggregate-registry.ts`.
3. Request it through the builder with `as const` values.

### 8. Data layer: datasources and ht-table

Almost every list view is a **datasource** feeding an **ht-table**.

**BaseDataSource.** `src/app/core/_datasources/base.datasource.ts` is an abstract
`BaseDataSource<T>` implementing the CDK `DataSource`: it owns loading state
(`loading$`), selection, sorting, filtering, pagination, and error state
(`filterError$`), and holds both the `JsonAPISerializer` and `GlobalService`.
Roughly 35 concrete datasources sit next to it (`agents.datasource.ts`,
`tasks.datasource.ts`, ...). A concrete datasource builds its request
([section 7](#7-includes-aggregates-relationships-and-typing)), calls
`getAll(...)`, and deserializes the response.

**ht-table columns are defined in TypeScript, not templates.** A table subclass
returns a `getColumns(): HTTableColumn[]` array. `HTTableColumn`
(`src/app/core/_components/tables/ht-table/ht-table.models.ts`) is a set of
callbacks: `render(row)`, `async(row)`, `export(row)`, `routerLink(row)`,
`icon(row)`, `editable(...)`, `checkbox(...)`, plus flags `isNumeric`,
`isSortable`, `isSearchable`, `truncate`.

```ts
{
  id: TasksTableCol.NAME,
  dataKey: 'taskName',
  isSortable: true,
  render: (task) => task.taskName,
  export: async (task) => task.taskName
}
```

Because cells render in TypeScript, Angular pipes do not apply inside a cell -
share formatting through util functions instead (see the `*.util.ts` helpers used
across tables), and sanitize any HTML you build.

### 9. Reactive forms and typed controls

Define forms as a typed `FormGroup<Interface>`, usually in a dedicated `*.form.ts`
factory (for example `src/app/tasks/new-tasks/new-tasks.form.ts`):

```ts
export interface NewTaskForm {
  taskName: FormControl<string>;
  hashlistId: FormControl<HashlistId | null>;
}
export const getNewTaskForm = () =>
  new FormGroup<NewTaskForm>({
    /* ... */
  });
```

**Access controls via `.controls.<name>`, not `form.get('name')`.** `.controls.name`
is fully typed (you get `FormControl<string>` and a typed `.value`). `form.get(name)`
returns `AbstractControl | null` - untyped, nullable, and it loses the value type.

```ts
// Preferred - typed
const value = this.form.controls.attackCmd.value;
this.form.controls.preprocessorId.setValue(newId, { emitEvent: false });

// Discouraged - untyped, returns AbstractControl | null
const value = this.form.get('attackCmd')?.value;
```

Both patterns exist today on the very same group in
`ht-table.component.ts` (`filterQueryFormGroup.controls.textFilter` vs
`filterQueryFormGroup.get('textFilter')`), which is a useful before/after. This is
a code convention, not lint-enforced, so apply it in review.

### 10. HTTP caching and stale-while-revalidate

A stale-while-revalidate (SWR) cache is on **by default** for GET requests.

**How it works.** `HttpCacheInterceptor`
(`src/app/core/_interceptors/http-cache.interceptor.ts`), backed by
`HttpCacheService` (`src/app/core/_services/shared/http-cache.service.ts`):

- A fresh cached GET is returned immediately.
- A stale cached GET (past its TTL but inside the stale window) emits the cached
  value first, then revalidates in the background and emits the fresh value.
- Any mutation (POST/PUT/PATCH/DELETE) invalidates the cache.

TTL and stale window are read from the response `Cache-Control`
(`max-age` and `stale-while-revalidate`, per RFC 5861). The cache key is namespaced
per user (a hash of the auth token) plus the full URL with params, so one user's
data never leaks into another's view.

**Opting out per request.** Send the `X-Cache-Skip` header (any value) to bypass
the cache entirely for that request:

```ts
this.http.get(url, { headers: { 'X-Cache-Skip': 'true' } });
```

Thread it through `GlobalService.get(...)` / `getAll(...)` via the `httpOptions`
argument when a caller must have guaranteed-fresh data.

**Do not confuse it with `X-Skip-Error-Dialog`**, a different, widely used header
that suppresses the global error dialog for a request. That one has nothing to do
with caching.

### 11. Theming and CSS variables

**Runtime theming.** `ThemeService`
(`src/app/core/_services/shared/theme.service.ts`) sets `data-theme` and a `<body>`
class (`light-theme` / `dark-theme` / `<id>-theme`), exposes `isDark()` /
`isDarkMode$` / `detectedTheme$`, and persists the choice to the localStorage key
`theme`. `ThemeCatalogService`
(`src/app/core/_services/shared/theme-catalog.service.ts`) merges the built-in
themes with a runtime `custom-themes.json` manifest. Built-in themes are `light`
and `dark`. Angular Material M3 is wired up in `src/styles/theme.scss`.

**The CSS variable contract (add new theme-dependent variables here).**
Theme-dependent custom properties live in three coordinated files. To add one:

1. Declare its default in `src/styles/base/_tokens.scss` - the common `:root {}`
   file. This file also holds all **non-theme** design tokens: spacing
   (`--space-*`), radius (`--radius-*`), font sizes (`--text-*`), z-index
   (`--z-*`), durations and easings, and status colors.
2. Add the per-theme override in `src/styles/light.scss` (`.light-theme { ... }`).
3. Add the per-theme override in `src/styles/dark.scss` (`.dark-theme { ... }`).
4. If the token should be usable as a Tailwind utility (for example `bg-<name>` or
   `gap-<name>`), also mirror it in the `@theme inline` block of
   `src/styles/tailwind.css` (see "Tailwind and tokens" below).

```scss
/* src/styles/base/_tokens.scss - common defaults + all non-theme tokens */
:root {
  --background: #0f0f0f;
  --foreground: rgba(255, 255, 255, 0.86);
  --space-md: 16px; /* non-theme token: declare here only */
}
```

```scss
/* src/styles/light.scss - light overrides */
.light-theme {
  --background: #ffffff;
  --foreground: #52525b;
}
```

```scss
/* src/styles/dark.scss - dark overrides */
.dark-theme {
  --background: #0f0f0f;
  --foreground: rgba(255, 255, 255, 0.86);
}
```

**Rule: theme-dependent colors and lengths must be CSS variables, never
hardcoded.** This is enforced by `lint:tokens` (part of `npm run lint`), which
fails the build on raw hex / rgb / hsl / px / rem values used in HTML `class`
attributes. Reference tokens instead.

**Tailwind and tokens.** The project uses Tailwind v4 (CSS-first: no
`tailwind.config.js`; wired through PostCSS in `.postcssrc.json`, entry
`src/styles/tailwind.css`). `tailwind.css` bridges every design token into
Tailwind's theme with an `@theme inline` block (`--color-primary: var(--primary)`,
`--spacing-md: var(--space-md)`, `--radius-md: var(--radius-md)`, and so on). The
`inline` keyword keeps the `var()` unevaluated, so toggling `.light-theme` /
`.dark-theme` re-cascades the utilities automatically. In practice **the utility
classes are the tokens**: write `bg-primary`, `text-muted-foreground`, `gap-md`,
`rounded-md` rather than raw colors or arbitrary `[16px]` values. Angular Material
reads the same tokens - its overrides in `components/_material.scss` (which starts
with `@reference './tailwind.css';`) map `--mat-*` variables onto the token vars -
so Material components and Tailwind utilities share one source of truth. The
`@theme inline` list is hand-maintained, so a new utility-facing token must be
added there as well as in `_tokens.scss`.

**SCSS structure.** The entry point is `src/styles/styles.scss` (referenced by
`angular.json`); it `@use`s `theme.scss` and the directory barrels under
`src/styles/{base,components,layout,pages,designs}`. `_m3-palette.scss` holds the
SCSS Material palettes; `components/_material.scss` holds Material component
overrides. There is no `_variables.scss` - `_tokens.scss` fills that role.

**Design skins.** `src/styles/designs/` is a swappable skin layer on top of the
tokens. `designs/index` is `@use`d **last** in `styles.scss`, so a skin's values
win the cascade. The bundled `alpine-snow` skin (`designs/alpine-snow/`) only
**re-declares token variables** (scoped under `.light-theme`) plus a few
skin-specific component tweaks; it changes neither components nor utilities. The
full cascade is: `_tokens.scss` defaults -> `light.scss` / `dark.scss` per-theme
values -> `designs/*` skin overrides. Touch this layer only when building or
adjusting a skin; for feature work, consume tokens through utilities and Material
and never hardcode a skin's values.

**Custom themes.** Drop a CSS file that redeclares the variable set under a
`.<id>-theme { ... }` block; on container start, `sync_custom_themes()` in
`docker-entrypoint.sh` copies it into assets and generates the manifest. See
`custom-themes/HOW_TO_CREATE_CUSTOM_THEME.md` for the full variable list and rules
(reserved ids `light` / `dark`, ids must match `^[a-z0-9-]+$`).

**Dev note.** `ng serve` does not always pick up edits to `@use`d SCSS partials via
HMR. If a token change does not show up, touch `src/styles/styles.scss` to force a
rebuild.

### 12. Local storage validation

Persisted client state is validated with zod on read, and the wrapper self-heals
when it finds invalid data.

**The wrappers.**

- `TypedStorage` (`src/app/core/_services/storage/local-storage.ts`) replaces
  `window.localStorage` at module load and augments the global `Storage` interface,
  so `localStorage.getItem` / `setItem` accept an optional zod schema everywhere
  without an import. On read it JSON-parses and, if a schema is passed,
  `safeParse`s; on invalid data it removes the key, returns the default, and warns.
  On write it validates first and refuses to persist invalid data.
- `LocalStorageService<T>` (`.../storage/local-storage.service.ts`, extends
  `BaseStorageService`) is the injectable, DI-friendly variant with expiry support
  (`StorageWrapper<T> = { value, expires }`). Session and cookie siblings exist
  alongside it.

```ts
const result = schema.safeParse(value);
if (!result.success) {
  console.warn(/* ... */);
  this.nativeStorage.removeItem(key);
  return defaultValue ?? null; // self-heal
}
```

**Keys and their schemas.**

| Key                | Owner                                  | Schema                        |
| ------------------ | -------------------------------------- | ----------------------------- |
| `theme`            | `theme.service.ts`                     | inline `z.string().min(1)`    |
| `userData`         | `auth.service.ts` (JWT token + expiry) | `_models/user-data.schema.ts` |
| `ui-config`        | `shared/utils/config.ts`               | `_models/config-ui.schema.ts` |
| `uis`              | cached server settings                 | `uisSettingsSchema`           |
| `user_permissions` | `permission/permission.service.ts`     | validated, 15-min TTL         |

`ui-config` holds theme, layout, time format, `refreshPage`, `refreshInterval`, and
per-table `tableSettings`.

**Conventions.**

- Every schema field uses `.default(...)`, so adding a new field never wipes a
  user's existing stored data - missing fields backfill.
- Use `z.preprocess` for migrations (the `uis` format migration is an example),
  and `z.coerce.number()` to tolerate API strings.
- If you add a **required** field to `tableSettings`, also add it to
  `uiConfigDefault.tableSettings`, or a single invalid entry self-heals the whole
  `ui-config` away.

### 13. Tooling and repo conventions

- **Path aliases** (`tsconfig.json`): `@src`, `@models`, `@components` (core
  components), `@datasources`, `@services`, `@constants`, `@interceptors`,
  `@generated`. Relative imports are forbidden by ESLint - always use an alias.
  Core folders are underscore-prefixed: `_services`, `_models`, `_components`,
  `_datasources`, `_guards`, `_directives`, `_constants`, `_interceptors`.
- **Strict TypeScript**: `strict`, `noImplicitOverride`,
  `noPropertyAccessFromIndexSignature`, `exactOptionalPropertyTypes`,
  `strictTemplates`. Note `exactOptionalPropertyTypes`: an optional model field must
  be typed `?: T | undefined`, not just `?: T`, or assignments fail (TS2375).
- **ESLint / Prettier**: `no-console` except `warn` / `error`; `window.location.reload()`
  is banned - use `ReloadService.reloadPage()`
  (`src/app/core/_services/reload.service.ts`); import order is enforced. Extra lint
  gates: `lint:tokens` ([section 11](#11-theming-and-css-variables)) and
  `lint:openapi`.
- **Permissions / ACL** are enforced with route guards, not template directives:
  `permission.guard.ts` exposes `CheckRole`, which reads `route.data['roleName']`
  and `route.data['roleServiceClass']` and calls the role service's `hasRole(...)`.
  Role services live under `src/app/core/_services/roles/`; permission constants in
  `src/app/core/_constants/userpermissions.config.ts`. Other guards: `auth.guard.ts`,
  `login.guard.ts`, `pendingchanges.guard.ts`.
- **Notifications** use `AlertService`
  (`src/app/core/_services/shared/alert.service.ts`): `showSuccessMessage` /
  `showErrorMessage` / `showInfoMessage`, wrapping `MatSnackBar`. This is distinct
  from the in-app "notifications" feature under `src/app/account/notifications/`.
- **Testing**: Karma + Jasmine with a custom `ChromeHeadlessNoKeychain` launcher
  (puppeteer, keychain-free) in `karma.conf.js`; specs are colocated as `*.spec.ts`.
  Be mindful of cross-spec state when a suite is flaky.
- **i18n**: there is none today - UI strings are hardcoded English even though
  `@angular/localize` is present. Do not assume a translation pipeline exists.
