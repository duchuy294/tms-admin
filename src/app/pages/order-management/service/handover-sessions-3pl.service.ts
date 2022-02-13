import { HandoverScan3PLModel, HandoverSessions3PLModel } from '../models/handover-sessions-3pl.model';

import { ApiDeliveryHttpService } from '@/modules/delivery/services/api-delivery-http.service';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Injectable({
    providedIn: 'root'
})
export class HandoverSessions3PLService extends BaseService {
    constructor(private apiHttpService: ApiDeliveryHttpService) {
        super();
    }

    async filters(query: QueryModel) {
        const response = await this.apiHttpService.get(`handovers-client${query.url()}`);
        return response.errorCode === 0
            ? new PagingModel<HandoverSessions3PLModel>(response.data)
            : new PagingModel<HandoverSessions3PLModel>();
    }

    async detail(id: string) {
        const response = await this.apiHttpService.get(`handover-client/${id}`);
        return response.errorCode === 0
            ? new HandoverSessions3PLModel(response.data)
            : new HandoverSessions3PLModel();
    }

    async create(so: string[]) {
        return await this.apiHttpService.post(`handover-client/create`, { saleOrder: so });
    }

    async cancel(clientHandoverId: string, reason: string) {
        return await this.apiHttpService.post(`handover-client/cancel`, { clientHandoverId, reason });
    }

    async confirm(clientHandoverId: string) {
        return await this.apiHttpService.post(`handover-client/confirm`, { clientHandoverId });
    }

    async scan(code: string) {
        const response = await this.apiHttpService.get(`handover-client/scan?SO=${code}`);
        return response.errorCode === 0
            ? new HandoverScan3PLModel(response.data)
            : new HandoverScan3PLModel();
    }
}