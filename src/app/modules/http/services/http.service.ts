import * as _ from 'lodash';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders
} from '@angular/common/http';
import { HttpStatusCode } from '../types/HttpStatusCode';
import { Injectable } from '@angular/core';
import { IResponse } from './../models/IResponse';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SessionService } from './../../utility/services/session.service';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpService {
    constructor(
        private http: HttpClient,
        private sessionService: SessionService,
        private notification: NzNotificationService,
        private translate: TranslateService
    ) {}

    public async get(url: string, options = null): Promise<IResponse> {
        return await this.http
            .get<IResponse>(url, this.prepareSendRequest(options))
            .toPromise()
            .then(x => JSON.parse(JSON.stringify(x)))
            .catch(this.handleError.bind(this));
    }

    public async post(
        url: string,
        body: any,
        options = null
    ): Promise<IResponse> {
        return await this.http
            .post(url, body, this.prepareSendRequest(options))
            .toPromise()
            .then(x => JSON.parse(JSON.stringify(x)))
            .catch(this.handleError.bind(this));
    }

    public async put(
        url: string,
        body: any,
        options = null
    ): Promise<IResponse> {
        return await this.http
            .put(url, body, this.prepareSendRequest(options))
            .toPromise()
            .then(x => JSON.parse(JSON.stringify(x)))
            .catch(this.handleError.bind(this));
    }

    public async delete(url: string, options = null): Promise<IResponse> {
        return await this.http
            .delete(url, this.prepareSendRequest(options))
            .toPromise()
            .then(x => JSON.parse(JSON.stringify(x)))
            .catch(this.handleError.bind(this));
    }

    public async download(
        url: string,
        options = null,
        fileName: string
    ): Promise<IResponse> {
        const self = this;
        options = this.prepareSendRequest(options);
        options['responseType'] = 'blob';
        return await this.http
            .get(url, options)
            .toPromise()
            .then(x => {
                self.downloadFile(x, fileName);
                return { data: null, errorCode: 0, message: null };
            })
            .catch(this.handleError.bind(this));
    }

    public async postDownload(
        url: string,
        body: any,
        options = null,
        fileName: string
    ): Promise<IResponse> {
        const self = this;
        options = this.prepareSendRequest(options);
        options['responseType'] = 'blob';
        return await this.http
            .post(url, body, options)
            .toPromise()
            .then(x => {
                self.downloadFile(x, fileName);
                return { data: null, errorCode: 0, message: null };
            })
            .catch(this.handleError.bind(this));
    }

    public prepareSendRequest(options = null) {
        const language = localStorage.getItem('language')
            ? localStorage.getItem('language')
            : this.translate.getDefaultLang();
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.sessionService.getToken()}`,
            'Access-Control-Allow-Origin': 'true',
            'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,POST,PUT,OPTIONS',
            'Accept-Language': language
        });
        options =
            _.isUndefined(options) || _.isNull(options)
                ? { headers, responseType: 'json' }
                : options;

        return options;
    }

    async handleError(error: HttpErrorResponse): Promise<IResponse> {
        let errorMessage = this.translate.instant('errorCodes.common');
        if (error.status === HttpStatusCode.Unauthorized) {
            errorMessage = this.translate.instant(`errorCodes.${error.status}`);
            this.sessionService.logout();
        }
        const errorData = await error.error;
        if (errorData.message) {
            errorMessage = errorData.message;
        }
        this.notification.error(
            this.translate.instant('errorCodes.request'),
            errorMessage
        );
        return {
            data: null,
            message: 'Catch error',
            errorCode: -1
        };
    }

    downloadFile(data, fileName = 'download.xlsx') {
        const url = window.URL.createObjectURL(data);
        const fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.download = fileName;
        fileLink.click();
    }
}
