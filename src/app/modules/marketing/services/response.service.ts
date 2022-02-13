import * as _ from 'lodash';
import { ApiMarketingHttpService } from './api-marketing-http.service';
import { BaseService } from '../../../services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from '../../utility/components/paging/paging.model';
import { QueryModel } from '../../../models/query.model';
import { ReplyModel, ResponseModel } from '@/modules/marketing/models/response';

@Injectable()
export class ResponseService extends BaseService {
  constructor(private apiHttpService: ApiMarketingHttpService) {
    super();
  }

  async filter(query: QueryModel): Promise<PagingModel<ResponseModel>> {
    const response = await this.apiHttpService.get(`responses${query.url()}`);
    return new PagingModel<ResponseModel>(
      response.errorCode === 0 ? response.data : {}
    );
  }

  async getReplies(id, query: QueryModel): Promise<any[]> {
    const response = await this.apiHttpService.get(`response/${id}${query.url()}`);
    return response.errorCode === 0 ? response.data : [];
  }

  async reply(model: ReplyModel) {
    return await this.apiHttpService.post(`response`, model);
  }
}
