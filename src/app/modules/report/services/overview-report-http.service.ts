import { Injectable } from '@angular/core';
import { ApiReportHttpService } from './api-report-http.service';
import { QueryModel } from '@/models/query.model';

@Injectable()
export class OverViewReportHttpService extends ApiReportHttpService {
    async getOverViewReport(query: QueryModel) {
        return await this.get(`report/overview${query && query.url() ? query.url() : ''}`);
    }

    async getPeriodicOrder(query: QueryModel) {
        return await this.get(`report/periodic/orders${query.url() ? query.url() : ''}`);
    }

    async getPeriodicTotalServicers(query: QueryModel) {
        return await this.get(`report/periodic/total-servicers${query.url() ? query.url() : ''}`);
    }

    async getPeriodicTotalUsers(query: QueryModel) {
        return await this.get(`report/periodic/total-users${query.url() ? query.url() : ''}`);
    }

    async getTotalOrders(query: QueryModel) {
        return await this.get(`report/orders${query.url() ? query.url() : ''}`);
    }
}
