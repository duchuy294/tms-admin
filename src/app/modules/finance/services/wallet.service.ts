import { AccountType } from 'app/constants/AccountType';
import { ApiFinanceHttpService } from './api-finance-http.service';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from './../../../models/query.model';
import { WalletModel } from '../models/wallet.model';
import { WalletEditModel } from '../models/wallet-edit.model';

@Injectable()
export class WalletService extends BaseService {
  constructor(private apiService: ApiFinanceHttpService) {
    super();
  }

  public async get(userId: string, userType: AccountType) {
    const result = await this.apiService.get(`wallet/${userId}/${userType}`);
    return this.returnObj<WalletModel>(result);
  }

  public async filter(query = new QueryModel()) {
    return this.returnObj<PagingModel<WalletModel>>(await this.apiService.get(`wallets${query.url()}`));
  }

  public async activatePostpaid(id: string, query = {}) {
    return await this.apiService.put(`wallet/activate/${id}`, query);
  }

  public async getStatistics(query = new QueryModel()) {
    return await this.apiService.get(`wallet/statistics${query.url()}`);
  }

  public async updateWallet(id: string, model: WalletEditModel) {
    return await this.apiService.put(`wallet/${id}`, model);
  }
}
