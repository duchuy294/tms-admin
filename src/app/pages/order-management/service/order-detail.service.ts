import { ApiOrderHttpService } from 'app/modules/order/services/api-order-http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class OrderDetailService {
    constructor(private apiHttpService: ApiOrderHttpService) { }

    async putSkipDeliveryPoint(orderId: string, pointId: string, note?: string) {
        return await this.apiHttpService
            .put(`order/${orderId}/delivery-point/${pointId}/skipping`, { note });
    }

    async putCancelDeliveryPoint(orderId: string, pointId: string, note?: string) {
        return await this.apiHttpService
            .put(`order/${orderId}/delivery-point/${pointId}/deletion`, { note });
    }

    async deleteOrder(id: string, model?: Object) {
        const response = await this.apiHttpService.put(`order/${id}/cancel`, model);
        return response;
    }
}
