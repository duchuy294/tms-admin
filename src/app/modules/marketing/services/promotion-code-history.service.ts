import * as _ from 'lodash';
import { ApiMarketingHttpService } from './api-marketing-http.service';
import { AppliedPromotionCodeModel } from '../models/applied-promotioncode.model';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from '../../utility/components/paging/paging.model';
import { PromotionCodeHistoryModel } from './../models/promotion-code-history.model';
import { PromotionCodeModel } from './../models/promotion-code';
import { QueryModel } from './../../../models/query.model';

@Injectable()
export class PromotionCodeHistoryService extends BaseService {
  constructor(private apiHttpService: ApiMarketingHttpService) {
    super();
  }

  async getPromotionCodeHistorys(query: QueryModel): Promise<any> {
    const response = await this.apiHttpService.get(`used-promotion-codes${query.url()}`);
    return {
      pagingModel: new PagingModel<PromotionCodeHistoryModel>(
        response.errorCode === 0 ? response.data : {}
      ),
      statistics: response.data.statistic
    };
  }

  async filterPromotionCodeHistory(query: QueryModel): Promise<PagingModel<PromotionCodeModel>> {
    const response = await this.apiHttpService.get(`promotion-code-history-filter${query.url()}`);
    return new PagingModel<PromotionCodeModel>(
      response.errorCode === 0 ? response.data : {}
    );
  }

  async getAppliedPromotionCodes(query: QueryModel) {
    const response = await this.apiHttpService.get(`promotion-code-history/applied-promotion-codes${query.url()}`);
    return new PagingModel<AppliedPromotionCodeModel>(
      response.errorCode === 0 ? response.data : {}
    );
  }
}
