export interface Preprocessor {
  preprocessorId: number
  name: string;
  url: string;
  binaryName: string;
  keyspaceCommand: string;
  skipCommand: string;
  limitCommand: string;
}
