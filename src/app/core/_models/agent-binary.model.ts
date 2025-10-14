import { BaseModel } from '@models/base.model';

/**
 * Interface for the agent binary running on the nodes
 * @prop filename         Filename of agent binary
 * @prop operatingSystems Comma separated operating systems the binary runs
 * @prop binaryType       Type of agent (e.g. 'python')
 * @prop updateAvailable  Indicating if update is available
 * @prop updateTrack      e.g 'stable'
 * @prop version          Version of agent binary
 */
export interface JAgentBinary extends BaseModel {
  filename: string;
  operatingSystems: string;
  binaryType: string;
  updateAvailable: string;
  updateTrack: string;
  version: string;
}
