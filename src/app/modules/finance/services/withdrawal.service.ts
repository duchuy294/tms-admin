import * as _ from 'lodash';
import { ApiFinanceHttpService } from './api-finance-http.service';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { TransactionModel } from '../models/transaction.model';

@Injectable()
export class WithdrawService extends BaseService {
    constructor(private apiHttpService: ApiFinanceHttpService) {
        super();
    }

    async process(model: TransactionModel) {
        return await this.apiHttpService.post('withdrawal/processing', model);
    }

    async approve(model: TransactionModel) {
        return await this.apiHttpService.post('withdrawal/approval', model);
    }

    async reject(model: TransactionModel) {
        return await this.apiHttpService.post('withdrawal/rejection', model);
    }
}
