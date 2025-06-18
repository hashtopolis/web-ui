import { BaseDataSource } from "./base.datasource";

export class AgentErrorDatasource extends BaseDataSource<any> {
    override reload(): void {
        throw new Error("Method not implemented.");
    }
}
