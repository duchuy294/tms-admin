import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { PartnerProcessQueryModel } from '@/pages/statistic/models/parner-process-query.model';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';
import { PartnerProcessModel } from '../models/partner-process.model';
import { ApiPartnerProcessHttpService } from './api-partner-process.service';

@Injectable({
  providedIn: 'root'
})
export class PartnerProcesService extends BaseService {
    constructor(private apiHttpService: ApiPartnerProcessHttpService) {
        super();
    }

    async workings(query: PartnerProcessQueryModel) {
        const response = await this.apiHttpService.get(`rider-workings${query.url()}`);
        return response.errorCode === 0
            ? new PagingModel<PartnerProcessModel>(response.data)
            : new PagingModel<PartnerProcessModel>();
    }

    async workingsDetail(query: PartnerProcessQueryModel = null) {
        const response = await this.apiHttpService.get(`rider-working/detail${query.url()}`);
        return response.errorCode === 0
            ? new PartnerProcessModel(response.data)
            : new PartnerProcessModel();
    }
}