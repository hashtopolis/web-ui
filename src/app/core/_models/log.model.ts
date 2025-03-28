import { BaseModel } from '@src/app/core/_models/base.model';

export type LogLevel = 'warning' | 'error' | 'fatal error' | 'information';
export type Issuer = 'API' | 'User';

export interface Log {
  _id: number;
  _self: string;
  issuer: Issuer;
  issuerId: string;
  level: LogLevel;
  logEntryId: number;
  message: string;
  time: number;
}

export interface JLog extends BaseModel {
  issuer: Issuer;
  issuerId: string;
  level: LogLevel;
  message: string;
  time: number;
}



export interface LogData {
  type: string;
  id: number;
  attributes: LogDataAttributes;
  links: LogDataLinks;
}

export interface LogDataAttributes {
  issuer: string;
  issuerId: string;
  level: string;
  message: string;
  time: number;
}

export interface LogDataLinks {
  self: string;
}
