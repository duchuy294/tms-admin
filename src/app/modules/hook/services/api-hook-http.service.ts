import { ApiHttpService } from '../../http/services/api-http.service';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiHookHttpService extends ApiHttpService {
    public apiPrefix = environment.hookApiUrl;
}