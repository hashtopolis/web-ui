import { Agent } from './agent.model'


export interface Chunk {
  _id: number
  _self: string
  chunkId: number
  taskId: number
  task?: Task
  format: string
  skip: number
  length: number
  agentId: number
  agent?: Agent
  dispatchTime: number
  solveTime: number
  checkpoint: number
  progress: number
  state: number
  cracked: number
  speed: number
}

export interface ChunkData {
  dispatched: number
  searched: number
  cracked: number
  speed: number
}