/**
 * Interface definition for mapping API models to a select option
 * @prop name Model specific name attribute
 * @prop id   Model specific ID attribute
 */
export interface FieldMapping {
  name: string;
  id: string;
}

export const DEFAULT_FIELD_MAPPING: FieldMapping = {
  name: 'name',
  id: 'id'
};

export const ACCESS_GROUP_FIELD_MAPPING: FieldMapping = {
  name: 'groupName',
  id: 'id'
};

export const CRACKER_TYPE_FIELD_MAPPING: FieldMapping = {
  name: 'typeName',
  id: 'id'
};

export const CRACKER_VERSION_FIELD_MAPPING: FieldMapping = {
  name: 'version',
  id: 'id'
};

export const HASHTYPE_FIELD_MAPPING: FieldMapping = {
  name: 'description',
  id: 'id'
};

export const PRETASKS_FIELD_MAPPING: FieldMapping = {
  name: 'taskName',
  id: 'id'
};

export const SUPER_TASK_FIELD_MAPPING: FieldMapping = {
  name: 'taskName',
  id: 'id'
};

export const TASKS_FIELD_MAPPING: FieldMapping = {
  name: 'taskName',
  id: 'id'
};

// Access Group Permission
export const USER_AGP_FIELD_MAPPING: FieldMapping = {
  name: 'groupName',
  id: 'id'
};

