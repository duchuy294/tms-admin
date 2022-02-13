import { ApiReasonTemplateHttpService } from './api-reason-template-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from './../../utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ReasonTemplateModel } from '../models/reason-template.model';

@Injectable()
export class ReasonTemplateService extends BaseService {
    constructor(private apiService: ApiReasonTemplateHttpService) {
        super();
    }

    public async get(id) {
        return this.returnObj<ReasonTemplateModel>(await this.apiService.get(`reason-template/${id}`));
    }

    public async filter(query = new QueryModel()) {
        return this.returnObj<PagingModel<ReasonTemplateModel>>(await this.apiService.get(`reason-templates/${query.url()}`));
    }

    public async delete(id) {
        return this.returnSuccess(await this.apiService.delete(`reason-template/${id}`));
    }

    public async create(model: ReasonTemplateModel) {
        const response = await this.apiService.post('reason-template', model);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async update(model: ReasonTemplateModel) {
        const response = await this.apiService.put(`reason-template/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }
}