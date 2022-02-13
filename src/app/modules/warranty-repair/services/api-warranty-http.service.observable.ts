import { ApiHttpServiceObservable } from 'app/modules/http/services/api-http.service.observable';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiWarrantyHttpServiceObservable extends ApiHttpServiceObservable {
    public apiPrefix = environment.wrtrApiUrl;
}
