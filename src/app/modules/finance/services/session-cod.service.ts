import * as _ from 'lodash';
import { ApiFinanceHttpService } from './api-finance-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';
import { SessionCodModel } from '../models/session-code-create.model';
import { QueryModel } from '@/models/query.model';
import { SessionCodListModel } from '../models/session-code-list.model';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';

@Injectable()
export class SessionCodService extends BaseService {
    constructor(private apiHttpService: ApiFinanceHttpService) {
        super();
    }

    async create(session: SessionCodModel) {
        const response = await this.apiHttpService.post(`cod-session`, session);
        return response;
    }

    async filter(query: QueryModel) {
        const response = await this.apiHttpService.get(`cod-session${query.url()}`);
        return this.returnObj<PagingModel<SessionCodListModel>>(response);
    }

    async get(id: string) {
        const response = await this.apiHttpService.get(`cod-session/${id}`);
        return this.returnObj<SessionCodListModel>(response);
    }

    async delete(code: string) {
        return await this.apiHttpService.put(`cod-session/remove`, { code });
    }
    async deleteOrder(sessionCode: string, orderCodes: string[]) {
        return await this.apiHttpService.put(`cod-session/remove/order`, { sessionCode, orderCodes });
    }
    async accept(code: string) {
        return await this.apiHttpService.put(`cod-session`, { code });
    }

    async exportExcel(code: string) {
        return await this.apiHttpService.dowload(`cod-session/export/order`, { code }, 'session-order-' + code);
    }


}
