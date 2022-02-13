import { BaseModel, BaseNameModel } from '../../../models/BaseModel';
import { TransactionType } from '@/modules/finance/const/transaction.const';

export class TransactionModel extends BaseModel {
    userId: string;
    userType: string;
    performerId: string;
    verifierId: string;
    requestCode: string;
    type: string;
    typeName: string;
    action: string;
    actionName: string;
    value: number;
    code: string;
    status: string;
    statusName: string;
    userName: string;
    userCode: string;
    note: string = '';
    adminNote: string;
    from: TransactionType;
    to: string;
    bankCode: string;
    orderId: string;
    orderCode: string;
    bankId: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}

export class MetaData {
    accounts?: BaseNameModel[] = [];
    users?: BaseNameModel[] = [];
}
