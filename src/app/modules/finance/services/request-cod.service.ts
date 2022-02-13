import * as _ from 'lodash';
import { ApiFinanceHttpService } from './api-finance-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { QueryModel } from '@/models/query.model';
import { RequestCodListModel } from '../models/request-cod-list.model';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';

@Injectable()
export class RequestCodService extends BaseService {
    constructor(private apiHttpService: ApiFinanceHttpService) {
        super();
    }

    async filter(query: QueryModel) {
        const response = await this.apiHttpService.get(`cod-requests${query.url()}`);
        return this.returnObj<PagingModel<RequestCodListModel>>(response);
    }

    async get(id: string) {
        const response = await this.apiHttpService.get(`cod-request/${id}`);
        return this.returnObj<RequestCodListModel>(response);
    }

    async confirm(data: RequestCodListModel) {
        return await this.apiHttpService.post(`cod-request/${data._id}/confirmation`, {
            confirmedPaid: data.confirmedPaid,
            transCode: data.transCode,
            note: data.note,
        });
    }

    async confirmDebt(data) {
        return await this.apiHttpService.post(`cod-request/confirmed-cod`, data);
    }

    async reject(id: string, note: string) {
        return await this.apiHttpService.post(`cod-request/${id}/rejection`, { note });
    }

    async compare(list) {
        return await this.apiHttpService.post(`cod-request/verification`, list);
    }

    async accept(code: string) {
        return await this.apiHttpService.put(`cod-requests`, { code });
    }

    async getBank() {
        const response = await this.apiHttpService.get(`cod-banks`);
        return response.data;
    }

    async exportExcel(code: string) {
        return await this.apiHttpService.dowload(`cod-requests/export/order`, { code }, 'request-order-' + code);
    }


}
