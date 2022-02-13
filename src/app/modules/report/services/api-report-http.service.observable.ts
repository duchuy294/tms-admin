import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { ApiHttpServiceObservable } from '@/modules/http/services/api-http.service.observable';

@Injectable()
export class ApiReportHttpServiceObservable extends ApiHttpServiceObservable {
    public apiPrefix = environment.reportUrl;
}
