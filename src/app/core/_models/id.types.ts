/**
 * Semantic ID type aliases for domain entities.
 *
 * These are structural aliases and provide documentation-level clarity, not nominal
 * type safety. They make SelectOption<AgentId> and FormControl<HashlistId | null>
 * self-documenting.
 *
 * All of them are `string` (json:api serializes resource ids and their foreign keys as
 * strings), except `PreprocessorId`, which the API still reports as an int attribute.
 */
export type AgentId = string;
export type TaskId = string;
export type HashlistId = string;
export type HashTypeId = string;
export type AccessGroupId = string;
export type UserId = string;
export type CrackerBinaryId = string;
export type CrackerBinaryTypeId = string;
export type FileId = string;
export type PreprocessorId = number;
export type PretaskId = string;
export type TaskWrapperId = string;
export type ChunkId = string;
export type GlobalPermissionGroupId = string;
export type HealthCheckId = string;
export type ConfigSectionId = string;
