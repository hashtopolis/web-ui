export interface IBenchmark {
    benchmarkId: number;
    benchmarkValue: string;
    hardwareGroupId: number;
    crackerBinaryId: number;
    attackParameters: string;
    ttl: number;
    hashMode: number;
    benchmarkType: string;
}