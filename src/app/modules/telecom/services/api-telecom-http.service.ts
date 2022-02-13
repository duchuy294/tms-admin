import { ApiHttpService } from '../../http/services/api-http.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApiTelecomHttpService extends ApiHttpService {
    public apiPrefix = environment.telecomApiUrl;
}