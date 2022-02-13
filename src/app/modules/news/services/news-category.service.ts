import { ApiMarketingHttpService } from '../../marketing/services/api-marketing-http.service';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';
import { NewsCategoryModel } from '../models/news-category.model';
import { omit } from 'lodash';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Injectable()
export class NewsCategoryService extends BaseService {
    constructor(private apiService: ApiMarketingHttpService) {
        super();
    }

    public async get(id) {
        return this.returnObj<NewsCategoryModel>(await this.apiService.get(`news-category/${id}`));
    }

    public async filter(query = new QueryModel()) {
        return this.returnObj<PagingModel<NewsCategoryModel>>(await this.apiService.get(`news-categories${query.url()}`));
    }

    public async create(model: NewsCategoryModel) {
        const response = await this.apiService.post('news-category', model);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async update(model: NewsCategoryModel) {
        const response = await this.apiService.put(`news-category/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }
}