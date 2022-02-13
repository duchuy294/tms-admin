
export class SessionCodListModel {
    _id?: string;
    cod: number;
    userId?: string;
    createdBy?: string;
    transferredBy?: string;
    transferredAt?: number;
    createdAt?: number;
    status?: number;
    orderQuantity?: number;
    code?: string;
    orders?: [{ code: string }];
}
