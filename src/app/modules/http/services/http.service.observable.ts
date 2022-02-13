import * as _ from 'lodash';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpStatusCode } from '../types/HttpStatusCode';
import { Injectable } from '@angular/core';
import { IResponse } from '../models/IResponse';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SessionService } from '@/modules/utility/services/session.service';
import { throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

function checkStatus(response: IResponse) {
    if (response.errorCode === 1) {
        throw new Error(response.message);
    }
    return response;
}

@Injectable()
export class HttpServiceObservable {
    constructor(
        private http: HttpClient,
        private sessionService: SessionService,
        private notification: NzNotificationService,
        private translate: TranslateService
    ) { }

    public get(url: string, options = null) {
        return this.http.get(url, this.prepareSendRequest(options)).pipe(
            map(checkStatus),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    public post(url: string, body: any, options = null) {
        return this.http
            .post(url, body, this.prepareSendRequest(options))
            .pipe(
                map(checkStatus),
                catchError((error: any) => this.handleError(error)));
    }

    public put(url: string, body: any, options?: any) {
        return this.http
            .put(url, body, this.prepareSendRequest(options))
            .pipe(
                map(checkStatus),
                catchError((error: any) => this.handleError(error)));
    }

    public delete(url: string, options?: {}) {
        return this.http
            .delete(url, this.prepareSendRequest(options))
            .pipe(
                map(checkStatus),
                catchError((error: any) => this.handleError(error))
            );
    }

    public prepareSendRequest(options: any): {} {
        options =
            _.isEmpty(options)
                ? { headers: new HttpHeaders() }
                : options;
        options.headers = options.headers.set(
            'Authorization',
            `Bearer ${this.sessionService.getToken()}`
        );
        options.headers = options.headers.set(
            'Access-Control-Allow-Origin',
            'true'
        );
        options.responseType = 'json';

        options.headers = options.headers.set(
            'Access-Control-Allow-Methods',
            'DELETE,GET,HEAD,POST,PUT,OPTIONS'
        );
        return options;
    }

    handleError(error: HttpErrorResponse | IResponse) {
        let errorMessage = '';
        if (
            error.status &&
            (error.status === HttpStatusCode.Forbidden ||
                error.status === HttpStatusCode.Unauthorized)
        ) {
            errorMessage = this.translate.instant(`errorCodes.${error.status}`);
            this.sessionService.logout();
        }
        this.notification.error(
            this.translate.instant('errorCodes.request'),
            errorMessage
                ? errorMessage
                : error.message || this.translate.instant('errorCodes.common')
        );
        return throwError({
            success: false
        });
    }
}
