import { ApiHttpService } from 'app/modules/http/services/api-http.service';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ApiPartnerProcessHttpService extends ApiHttpService {
    public apiPrefix = environment.orderApiUrl;
}
