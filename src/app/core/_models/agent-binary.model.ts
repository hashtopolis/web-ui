export interface AgentBinary {
  _id: 1;
  _self: string;
  agentBinaryId: number;
  filename: string;
  operatingSystems: string;
  type: string;
  updateAvailable: string;
  updateTrack: string;
  version: string;
}


export interface AgentBinaryData {
  type: string;
  id: number;
  attributes: AgentBinaryAttributes;
  links: AgentBinaryDataLinks;
}

export interface AgentBinaryAttributes {
  type: string;
  version: string;
  operatingSystems: string;
  filename: string;
  updateTrack: string;
  updateAvailable: string;
}

export interface AgentBinaryDataLinks {
  self: string;
}
