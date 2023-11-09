export interface Hash {
  _id: number
  _self: string
  chunkId: number
  crackPos: number
  hash: string
  hashId: number
  hashlistId: number
  isCracked: boolean
  plaintext: string
  salt: string
  timeCracked: number
}  