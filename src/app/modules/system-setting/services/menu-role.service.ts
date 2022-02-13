import { ApiSystemHttpService } from './api-system-http.service';
import { Injectable } from '@angular/core';
@Injectable()
export class MenuRoleService {
    constructor(public apiHttpService: ApiSystemHttpService) { }
}