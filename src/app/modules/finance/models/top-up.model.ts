import { TransactionModel } from './transaction.model';
import { TransactionType } from '@/modules/finance/const/transaction.const';

export class TopUpModel extends TransactionModel {
    userIds?: string[] = [];
    userTypes?: string[] = [];
    from = TransactionType.BANK;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
