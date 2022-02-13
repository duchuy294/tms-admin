import { ApiCloudHttpService } from './api-cloud-http.service';
import { BaseService } from './../../../services/base.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CloudService extends BaseService {
    constructor(private apiService: ApiCloudHttpService) {
        super();
    }

    public async uploadFile(file: File, path = '') {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('path', path);
        return await this.apiService.post('file/upload', formData);
    }
}