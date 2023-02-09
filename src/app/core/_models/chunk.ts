export interface BaseChunk {
  chunkId: number,
  taskId: number,
  format: string,
  skip: string,
  length: number,
  agentId: number,
  dispatchTime: number,
  solveTime: number,
  checkpoINT: number,
  progress: number,
  state: number,
  cracked: number,
  speed: number,
  }

