import * as _ from 'lodash';
import { ApiFinanceHttpService } from './api-finance-http.service';
import { BaseService } from './../../../services/base.service';
import { BonusForfeitModel } from '../models/bonus-forfeit.model';
import { Injectable } from '@angular/core';
import { TopUpModel } from 'app/modules/finance/models/top-up.model';
import { TransactionModel } from '@/modules/finance/models/transaction.model';

@Injectable()
export class BalanceService extends BaseService {
    constructor(private apiHttpService: ApiFinanceHttpService) {
        super();
    }

    public async payCollectionForServicer(data: TransactionModel) {
        return await this.apiHttpService.post(`collection-debt`, data);
    }

    async postTopUp(query: TopUpModel) {
        return await this.apiHttpService.post(`balance/deposit`, query);
    }

    async postBonus(query: BonusForfeitModel) {
        query = _.omit(query, query.omitFields()) as BonusForfeitModel;
        return await this.apiHttpService.post(`balance/promotion`, query);
    }

    async postForfeit(query: BonusForfeitModel) {
        query = _.omit(query, query.omitFields()) as BonusForfeitModel;
        return await this.apiHttpService.post(`balance/fine`, query);
    }

    async adjustDeposit(model: TransactionModel) {
        return await this.apiHttpService.post(`balance/adjust-deposit`, model);
    }
}
