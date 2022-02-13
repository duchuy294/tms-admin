export class BalanceAccountType {
    static readonly PARTNER = 'servicer';
    static readonly CUSTOMER = 'user';
    static readonly OWNER = 'owner';
}

export class TransactionType {
    static readonly BANK = 'bank';
    static readonly CASH = 'cash';
    static readonly COLLECTION = 'collection';
    static readonly DEPOSIT = 'deposit';
    static readonly MAIN = 'main';
    static readonly SUB = 'sub';
}

export class TransactionAction {
    static readonly ALL = '';
    static readonly DEPOSIT = 'deposit';
    static readonly WITHDRAW = 'withdraw';
    static readonly PROMOTION = 'promotion';
    static readonly FINE = 'fine';
    static readonly COMMISSION = 'commission';
    static readonly COLLECTION_MONEY = 'collection-money';
    static readonly ADJUST_ORDER = 'adjust-order';
    static readonly ADJUST_DEPOSIT = 'adjust-deposit';
    static readonly PAYMENT = 'payment';
    static readonly REFUND = 'refund';
    static readonly REFERRAL_BONUS = 'referral-bonus';
}

export class TransactionStatus {
    static readonly ALL = '';
    static readonly SUCCESS = 'success';
    static readonly PROCESSING = 'processing';
    static readonly REQUEST = 'request';
    static readonly REJECT = 'reject';
}
