import { ApiHttpServiceObservable } from '@/modules/http/services/api-http.service.observable';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiMarketingHttpServiceObservable extends ApiHttpServiceObservable {
    public apiPrefix = environment.marketingApiUrl;
}
