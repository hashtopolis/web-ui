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



export interface PreprocessorData {
  type: string;
  id: number;
  attributes: PreprocessorAttributes;
  links: PreprocessorDataLinks;
}

export interface PreprocessorAttributes {
  name: string;
  url: string;
  binaryName: string;
  keyspaceCommand: string;
  skipCommand: string;
  limitCommand: string;
}

export interface PreprocessorDataLinks {
  self: string;
}
