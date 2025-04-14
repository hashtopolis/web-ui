import { BaseModel } from '@src/app/core/_models/base.model';

export type LogLevel = 'warning' | 'error' | 'fatal error' | 'information';
export type Issuer = 'API' | 'User';

/**
 * Interface definition for log data
 * @extends BaseModel
 * @prop issuer       Issuer of log entry
 * @prop issuerId     ID of Issuer
 * @prop level        Log level
 * @prop message      Log message
 * @prop time         Log time
 */
export interface JLog extends BaseModel {
  issuer: Issuer;
  issuerId: string;
  level: LogLevel;
  message: string;
  time: number;
}

