import { ApiTelecomHttpService } from './api-telecom-http.service';
import { Injectable } from '@angular/core';
import { BaseService } from '@/services/base.service';
import { SmsLogModel } from '../models/sms-log.model';
import { QueryModel } from '@/models/query.model';
import { PagingModel } from '@/utility/components/paging/paging.model';

@Injectable()
export class SmsLogService extends BaseService {
    constructor(private apiService: ApiTelecomHttpService) {
        super();
    }

    public async get(id) {
        return this.returnObj<SmsLogModel>(await this.apiService.get(`telecom-log/${id}`));
    }

    public async filter(query = new QueryModel()) {
        return this.returnObj<PagingModel<SmsLogModel>>(await this.apiService.get(`telecom-logs/${query.url()}`));
    }
}