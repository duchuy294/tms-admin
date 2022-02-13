import { ActivityModel } from './../models/activity.model';
import { ApiActivityHttpService } from './api-activity-http.service';
import { BaseService } from 'app/services/base.service';
import { Injectable } from '@angular/core';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';

@Injectable()
export class ActivityService extends BaseService {
    constructor(private apiHttpService: ApiActivityHttpService) { super(); }

    async filter(query = new QueryModel({ limit: 1000 })) {
        return this.returnObj<PagingModel<ActivityModel>>(await this.apiHttpService.get(`activities${query.url()}`));
    }

    async getTotalUnseen(query = new QueryModel()) {
        return (await this.apiHttpService.get(`activities/total-unseen${query.url()}`));
    }

    async seen(id: string) {
        const response = await this.apiHttpService.put(`activity/${id}/seen`, null);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }

    async seenAll(activityIds = null) {
        const response = await this.apiHttpService.put('activity/seen-all', activityIds);
        return {
            success: response.errorCode === 0,
            message: response.message || ''
        };
    }
}