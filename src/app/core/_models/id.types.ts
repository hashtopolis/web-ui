/**
 * Semantic ID type aliases for domain entities.
 *
 * These are structural aliases (all equal to `number`) and provide
 * documentation-level clarity, not nominal type safety. They make
 * SelectOption<AgentId> and FormControl<HashlistId | null> self-documenting.
 */
export type AgentId = number;
export type TaskId = number;
export type HashlistId = number;
export type HashTypeId = number;
export type AccessGroupId = number;
export type UserId = number;
export type CrackerBinaryId = number;
export type CrackerBinaryTypeId = number;
export type FileId = number;
export type PreprocessorId = number;
export type PretaskId = number;
export type TaskWrapperId = number;
export type ChunkId = number;
export type GlobalPermissionGroupId = number;
export type HealthCheckId = number;
export type ConfigSectionId = number;
