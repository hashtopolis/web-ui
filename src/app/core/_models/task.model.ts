// import { Hashlist } from "./hashlist"

import { Agent } from "./agent.model"
import { CrackerBinary, CrackerBinaryType } from "./cracker-binary.model"
import { Hashlist } from "./hashlist.model"

/**
 * @deprecated This interface is deprecated and should not be used.
 * Use the Task interface instead.
 */
export interface NormalTask {
  id: number
  name: string
  priority: number
  maxAgents: number

  hashlistId: number
  // hashlist: Hashlist
}

export interface Task {
  _id: number
  _self: string
  attackCmd: string
  chunkSize: number
  chunkTime: number
  color?: string
  crackerBinaryId: number
  crackerBinaryTypeId: number
  forcePipe: boolean
  isArchived: boolean
  isCpuTask: boolean
  isSmall: boolean
  keyspace: number
  keyspaceProgress: number
  maxAgents: number
  notes: string
  preprocessorCommand: number
  preprocessorId: number
  priority: number
  skipKeyspace: number
  staticChunks: number
  statusTimer: number
  taskId: number
  taskName: string
  taskWrapperId: number
  taskWrapperName?: string
  useNewBench: boolean
  assignedAgents?: Agent[]
  crackerBinary?: CrackerBinary
  crackerBinaryType?: CrackerBinaryType
  hashlist?: Hashlist[]
  taskType?: number
}