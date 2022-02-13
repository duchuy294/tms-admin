import { HandoverScanModel, HandoverSessionsModel } from '../models/handover-sessions.model';

import { ApiDeliveryHttpService } from '@/modules/delivery/services/api-delivery-http.service';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Injectable({
    providedIn: 'root'
})
export class HandoverSessionsService extends BaseService {
    constructor(private apiHttpService: ApiDeliveryHttpService) {
        super();
    }

    async filters(query: QueryModel) {
        const response = await this.apiHttpService.get(`handovers${query.url()}`);
        return response.errorCode === 0
            ? new PagingModel<HandoverSessionsModel>(response.data)
            : new PagingModel<HandoverSessionsModel>();
    }

    async detail(id: string) {
        const response = await this.apiHttpService.get(`handover/${id}`);
        return response.errorCode === 0
            ? new HandoverSessionsModel(response.data)
            : new HandoverSessionsModel();
    }
    async completed(id: string, reason: string = null) {
        return await this.apiHttpService.post(`handover/${id}/completed`, { reason });
    }

    async scan(code: string) {
        const response = await this.apiHttpService.post(`handover/scan`, { package: code });
        return response.errorCode === 0
            ? new HandoverScanModel(response.data)
            : new HandoverScanModel();
    }
}