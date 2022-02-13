import * as _ from 'lodash';
import { environment } from './../../../../environments/environment';
import { HttpServiceObservable } from './http.service.observable';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiHttpServiceObservable {
    public apiPrefix = environment.accountApiUrl;
    constructor(private httpService: HttpServiceObservable) { }

    public get(subUrl: string, options?) {
        return this.httpService.get(`${this.apiPrefix}/${subUrl}`, options);
    }

    public post(subUrl: string, body: any, options?) {
        return this.httpService.post(
            `${this.apiPrefix}/${subUrl}`,
            body,
            options
        );
    }

    public put(subUrl: string, body: any, options?: any) {
        return this.httpService.put(
            `${this.apiPrefix}/${subUrl}`,
            body,
            options
        );
    }

    public delete(subUrl: string) {
        return this.httpService.delete(`${this.apiPrefix}/${subUrl}`);
    }
}
