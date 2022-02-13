import { ApiDeliveryHttpService } from './api-delivery-http.service';
import { BaseService } from '@/services/base.service';
import { Injectable } from '@angular/core';

@Injectable()
export class OrderReversionService extends BaseService {
    constructor(
        private apiHttpService: ApiDeliveryHttpService
    ) { super(); }

    async revertOrderStatus(codes: string[], reason: string) {
        return await this.apiHttpService.put('order/prev-status', { codes, reason });
    }
}