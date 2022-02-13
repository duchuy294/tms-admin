import * as _ from 'lodash';
import { environment } from './../../../../environments/environment';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { IResponse } from './../models/IResponse';

@Injectable()
export class ApiHttpService {
    public apiPrefix = environment.accountApiUrl;
    constructor(private httpService: HttpService) {}

    public async get(subUrl: string, options = null): Promise<IResponse> {
        return await this.httpService.get(
            `${this.apiPrefix}/${subUrl}`,
            options
        );
    }

    public async post(
        subUrl: string,
        body: any,
        options = null
    ): Promise<IResponse> {
        return await this.httpService.post(
            `${this.apiPrefix}/${subUrl}`,
            body,
            options
        );
    }

    public async put(
        subUrl: string,
        body: any,
        options = null
    ): Promise<IResponse> {
        return await this.httpService.put(
            `${this.apiPrefix}/${subUrl}`,
            body,
            options
        );
    }

    public async delete(subUrl: string, options = null): Promise<IResponse> {
        return await this.httpService.delete(
            `${this.apiPrefix}/${subUrl}`,
            options
        );
    }

    public async dowload(
        subUrl: string,
        options = null,
        fileName: string
    ): Promise<IResponse> {
        return await this.httpService.download(
            `${this.apiPrefix}/${subUrl}`,
            options,
            fileName
        );
    }

    public async postDowload(
        subUrl: string,
        body: any,
        options = null,
        fileName: string
    ): Promise<IResponse> {
        return await this.httpService.postDownload(
            `${this.apiPrefix}/${subUrl}`,
            body,
            options,
            fileName
        );
    }
}
