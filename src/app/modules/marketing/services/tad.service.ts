import { ApiMarketingHttpService } from 'app/modules/marketing/services/api-marketing-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { TADModel } from './../models/TAD.model';

@Injectable()
export class TADService extends BaseService {
    constructor(private _apiHttpService: ApiMarketingHttpService) {
        super();
    }
    async list(): Promise<TADModel[]> {
        const response = await this._apiHttpService.get('term-and-conditions');

        return this.returnList(response);
    }

    async update(model: TADModel) {
        return await this._apiHttpService.put(`term-and-condition/${model._id}`, model);
    }

    async create(model: TADModel) {
        return await this._apiHttpService.post(`term-and-condition`, model);
    }
}
