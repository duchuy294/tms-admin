import { ApiHttpService } from 'app/modules/http/services/api-http.service';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiPriceHttpService extends ApiHttpService {
    public apiPrefix = environment.priceApiUrl;
}
