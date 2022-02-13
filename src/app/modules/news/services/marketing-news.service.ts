import * as _ from 'lodash';
import { ApiMarketingHttpService } from '@/modules/marketing/services/api-marketing-http.service';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';
import { NewsModel } from '@/modules/news/models/news.model';
import { NewsType } from '@/modules/marketing/models/NewsType';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { SendNewsNotificationRequest } from '../models/send-news-notification-request';

@Injectable()
export class MarketingNewsService extends BaseService {
    constructor(private apiHttpService: ApiMarketingHttpService) {
        super();
    }

    async get(id: string) {
        const response = await this.apiHttpService.get(`news/${id}`);
        return response.errorCode === 0 ? response.data : null;
    }

    async getList(query: QueryModel) {
        const newQuery = _.cloneDeep(query);
        const response = await this.apiHttpService.get(`news${newQuery.url()}`);
        return response.errorCode === 0
            ? new PagingModel<NewsModel>(response.data)
            : new PagingModel<NewsModel>();
    }

    async create(model: NewsModel) {
        return await this.apiHttpService.post(`news`, model);
    }

    async update(model: NewsModel) {
        return await this.apiHttpService.put(`news/${model._id}`, model);
    }

    async sendNews(_id: string, type: NewsType, target: string[]) {
        return await this.apiHttpService.post(`news/${_id}/notification`, { type, target });
    }

    async sendNotification(_id: string, body: SendNewsNotificationRequest) {
        return await this.apiHttpService.post(`news/${_id}/notification`, body);
    }
}
