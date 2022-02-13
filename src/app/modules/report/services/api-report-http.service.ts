import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { ApiHttpService } from 'app/modules/http/services/api-http.service';

@Injectable()
export class ApiReportHttpService extends ApiHttpService {
    public apiPrefix = environment.reportUrl;
}
