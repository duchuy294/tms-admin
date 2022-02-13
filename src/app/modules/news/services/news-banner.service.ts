import * as _ from 'lodash';
import { ApiMarketingHttpService } from '@/modules/marketing/services/api-marketing-http.service';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';
import { NewsBannerModel } from '@/modules/news/models/news-banner.model';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Injectable()
export class NewsBannerService extends BaseService {
    constructor(private apiHttpService: ApiMarketingHttpService) {
        super();
    }

    async get(id): Promise<NewsBannerModel> {
        const response = await this.apiHttpService.get(`news-banner/${id}`);
        return new NewsBannerModel(
            response.errorCode === 0 ? response.data : {}
        );
    }

    async getList(query: QueryModel) {
        const response = await this.apiHttpService.get(`news-banners${query.url()}`);
        return response.errorCode === 0
            ? new PagingModel<NewsBannerModel>(response.data)
            : new PagingModel<NewsBannerModel>();
    }

    async create(model: NewsBannerModel) {
        return await this.apiHttpService.post(`news-banner`, model);
    }

    async update(model: NewsBannerModel) {
        return await this.apiHttpService.put(`news-banner/${model._id}`, _.omit(model, ['_id']));
    }
}
