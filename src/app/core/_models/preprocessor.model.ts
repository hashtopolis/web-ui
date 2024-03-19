export interface Preprocessor {
  _id: number;
  _self: string;
  preprocessorId: number;
  name: string;
  url: string;
  binaryName: string;
  keyspaceCommand: string;
  skipCommand: string;
  limitCommand: string;
}
