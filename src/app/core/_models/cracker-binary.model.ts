export interface CrackerBinary {
  _id: number
  _self: string
  binaryName: string
  crackerBinaryId: number
  crackerBinaryTypeId: number
  downloadUrl: string
  version: string
}

export interface CrackerBinaryType {
  crackerBinaryTypeId: number
  isChunkingAvailable: boolean
  typeName: string
  _id: number
  _self: string
}