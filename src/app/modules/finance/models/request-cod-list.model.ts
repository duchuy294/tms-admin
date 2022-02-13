
export class RequestCodListModel {
    _id?: string;
    code?: string;
    transCode?: string;
    servicerId?: string;
    amount?: number;
    paid?: number;
    confirmedPaid?: number;
    status?: string;
    images?: string[];
    note?: string;
    confirmationMethod?: string;
    performerId?: string;
    orderCodes?: string[];
    bank?: string;
    createdBy?: string;
    createdAt?: number;
    performedAt?: number;
}

export class CodBank {
    _id?: string;
    code?: string;
    name?: string;
}

export class DebtCod {
    servicerId?: string;
    amount?: number;
    type?: string;
    bank?: string;
    note?: string;
}

