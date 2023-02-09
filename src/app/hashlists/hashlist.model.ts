export interface BaseHashlist {
    hashlistId: number;
    hashtypeId: number;
    name: string;
    format: number;
    hashCount: number;
}

export interface CreateHashlist extends BaseHashlist {
    dataSourceType: string;
    dataSource: string;
}

export interface Hashlist extends BaseHashlist {
    id: number;
    hashCount: number;
    crackedCount: number;
    notes: string;
}
