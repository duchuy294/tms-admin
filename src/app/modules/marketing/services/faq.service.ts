import { ApiMarketingHttpService } from 'app/modules/marketing/services/api-marketing-http.service';
import { BaseService } from './../../../services/base.service';
import { FAQModel } from './../models/FAQ.model';
import { Injectable } from '@angular/core';

@Injectable()
export class FAQService extends BaseService {
    constructor(private _apiHttpService: ApiMarketingHttpService) {
        super();
    }
    async list(): Promise<FAQModel[]> {
        const response = await this._apiHttpService.get('faqs');

        return this.returnList(response);
    }

    async update(model: FAQModel) {
        return await this._apiHttpService.put(`faq/${model._id}`, model);
    }

    async create(model: FAQModel) {
        return await this._apiHttpService.post(`faq`, model);
    }
}
