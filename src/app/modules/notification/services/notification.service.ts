import * as _ from 'lodash';
import { ApiNotificationHttpService } from './api-notification.service';
import { BaseService } from 'app/services/base.service';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService extends BaseService {
    constructor(private apiHttpService: ApiNotificationHttpService) {
        super();
    }

    async addToken(token: string) {
        return await this.apiHttpService.post('token', { token, userType: 'admin' });
    }
}
