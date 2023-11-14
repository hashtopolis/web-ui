export interface CrackerBinary {
  _id: number;
  _self: string;
  binaryName: string;
  crackerBinaryId: number;
  crackerBinaryTypeId: number;
  downloadUrl: string;
  version: string;
}

export interface CrackerBinaryType {
  _id: number;
  _self: string;
  crackerBinaryTypeId: number;
  crackerVersions: CrackerBinary[];
  isChunkingAvailable: boolean;
  typeName: string;
}
