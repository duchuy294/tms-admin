import { ApiTelecomHttpService } from './api-telecom-http.service';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { SmsTemplateModel } from '../models/sms-template.model';
import { omit } from 'lodash';

@Injectable()
export class SmsTemplateService extends BaseService {
    constructor(private apiService: ApiTelecomHttpService) {
        super();
    }

    public async get(id) {
        return this.returnObj<SmsTemplateModel>(await this.apiService.get(`sms-template/${id}`));
    }

    public async filter(query = new QueryModel()) {
        return this.returnObj<PagingModel<SmsTemplateModel>>(await this.apiService.get(`sms-templates/${query.url()}`));
    }

    public async delete(id) {
        return this.returnSuccess(await this.apiService.delete(`sms-template/${id}`));
    }

    public async create(model: SmsTemplateModel) {
        const response = await this.apiService.post('sms-template', model);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async update(model: SmsTemplateModel) {
        const response = await this.apiService.put(`sms-template/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    public async activate(model) {
        const response = await this.apiService.put(`sms-template/activate/${model._id}`, omit(model, ['_id']));
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }
}