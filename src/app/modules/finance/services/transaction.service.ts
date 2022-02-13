import * as _ from 'lodash';
import { ApiFinanceHttpService } from './api-finance-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from './../../utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { TransactionModel } from '@/modules/finance/models/transaction.model';

@Injectable()
export class TransactionService extends BaseService {
    constructor(private apiHttpService: ApiFinanceHttpService) {
        super();
    }

    async filter(query: QueryModel) {
        const response = await this.apiHttpService.get(`transactions${query.url()}`);

        return this.returnObj<PagingModel<TransactionModel>>(response);
    }

    async getBalanceDetail(id: string) {
        const response = await this.apiHttpService.get(`transaction/${id}`);
        return response.errorCode === 0 ? response.data : {};
    }
}
