import * as _ from 'lodash';
import { QueryModel } from '@/models/query.model';
import { Injectable } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { ApiReportHttpServiceObservable } from './api-report-http.service.observable';
import { DashboardStatisticsQueryModel } from '../models/dashboard-statistics-query.model';

@Injectable()
export class ReportServiceObservable extends BaseService {
    constructor(private apiHttpService: ApiReportHttpServiceObservable) {
        super();
    }

    getStatistics(query: QueryModel) {
        return this.apiHttpService.get(`dashboard/statistics${query.url() ? query.url() : ''}`);
    }

    getTotalServicerState(query: QueryModel) {
        return this.apiHttpService.get(`dashboard/total-servicers${query.url() ? query.url() : ''}`);
    }

    getTotalCollectionDebt(query: DashboardStatisticsQueryModel) {
        return this.apiHttpService.get(`dashboard/servicers-with-collection-debt${query.url() ? query.url() : ''}`);
    }

    getOrders(query: DashboardStatisticsQueryModel) {
        return this.apiHttpService.get(`dashboard/orders${query.url() ? query.url() : ''}`);
    }

    getServicers(query: DashboardStatisticsQueryModel) {
        return this.apiHttpService.get(`dashboard/servicers${query.url() ? query.url() : ''}`);
    }
}
