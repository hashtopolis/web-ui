/**
 * Interface definition for mapping API models to a select option.
 *
 * When parameterized (e.g. `FieldMapping<'agentName' | 'id'>`), restricts
 * values to specific string-literal keys, enabling compile-time validation
 * that mapped fields actually exist on the source type.
 *
 * @typeParam K - Allowed key strings (defaults to `string` for untyped usage)
 * @prop name Model specific name attribute
 * @prop id   Model specific ID attribute
 */
export interface FieldMapping<K extends string = string> {
  name: K;
  id: K;
}

export const DEFAULT_FIELD_MAPPING = { name: 'name', id: 'id' } as const satisfies FieldMapping;

export const ACCESS_GROUP_FIELD_MAPPING = { name: 'groupName', id: 'id' } as const satisfies FieldMapping;

export const AGENT_MAPPING = { name: 'agentName', id: 'id' } as const satisfies FieldMapping;

export const CRACKER_TYPE_FIELD_MAPPING = { name: 'typeName', id: 'id' } as const satisfies FieldMapping;

export const CRACKER_VERSION_FIELD_MAPPING = { name: 'version', id: 'id' } as const satisfies FieldMapping;

export const HASHTYPE_FIELD_MAPPING = { name: 'description', id: 'id' } as const satisfies FieldMapping;

export const PRETASKS_FIELD_MAPPING = { name: 'taskName', id: 'id' } as const satisfies FieldMapping;

export const SUPER_TASK_FIELD_MAPPING = { name: 'taskName', id: 'id' } as const satisfies FieldMapping;

export const TASKS_FIELD_MAPPING = { name: 'taskName', id: 'id' } as const satisfies FieldMapping;

// Access Group Permission
export const USER_AGP_FIELD_MAPPING = { name: 'groupName', id: 'id' } as const satisfies FieldMapping;
