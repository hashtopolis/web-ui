import { BaseModel } from '@models/base.model';

/**
 * Interface definition for a cached benchmark result (issue #879).
 * @extends BaseModel
 * @prop crackerBinaryId   Cracker binary the benchmark was measured with
 * @prop hashMode          Hashcat hash-type (-m) the benchmark applies to
 * @prop attackParameters  SHA-256 signature of the attack (mode and rule use)
 * @prop deviceSignature   SHA-256 signature of the agent hardware
 * @prop benchmarkType     'speed' or 'run'
 * @prop benchmarkValue    The cached benchmark value
 * @prop createTime        Unix time the entry was stored
 * @prop expireTime        Unix time the entry expires
 */
export interface JBenchmark extends BaseModel {
  crackerBinaryId: number;
  hashMode: number;
  attackParameters: string;
  deviceSignature: string;
  benchmarkType: string;
  benchmarkValue: string;
  createTime: number;
  expireTime: number;
}
