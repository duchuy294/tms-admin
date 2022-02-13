import { ApiEmailHttpService } from './api-email-http.service';
import { BaseService } from '@/services/base.service';
import { EmailTemplateModel } from '../models/email-template.model';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Injectable()
export class EmailTemplateService extends BaseService {
    constructor(private apiService: ApiEmailHttpService) {
        super();
    }

    public async get(id) {
        return this.returnObj<EmailTemplateModel>(await this.apiService.get(`email-template/${id}`));
    }

    public async filter(query = new QueryModel()) {
        return this.returnObj<PagingModel<EmailTemplateModel>>(await this.apiService.get(`email-templates/${query.url()}`));
    }

    public async delete(id) {
        return this.returnSuccess(await this.apiService.delete(`email-template/${id}`));
    }

    public async create(model: EmailTemplateModel) {
        const response = await this.apiService.post('email-template', model);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async update(model: EmailTemplateModel) {
        const response = await this.apiService.put(`email-template/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async activate(model) {
        const response = await this.apiService.put(`email-template/activate/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }
}