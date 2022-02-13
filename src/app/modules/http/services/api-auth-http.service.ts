import { ApiHttpService } from './api-http.service';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiAuthHttpService extends ApiHttpService {
    public apiPrefix = environment.authApiUrl;
}
