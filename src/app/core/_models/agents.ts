export interface IAgents {
    _expandable?: string;
    startAt: number;
    maxResults: number;
    total: number;
    isLast: string;
    values: [{
      agentId: number;
      agentName: string;
      uid: string;
      os: number;
      devices: string;
      cmdPars: string;
      ignoreErrors: string;
      isActive: string;
      isTrusted: string;
      token: string;
      lastAct: string;
      lastTime: number;
      lastIp: string;
      userId: number;
      cpuOnly: number;
      clientSignature: string;
    }]
}
