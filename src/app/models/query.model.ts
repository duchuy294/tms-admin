import * as _ from 'lodash';
import { BaseModel } from './BaseModel';
import { DateTimeService } from './../modules/utility/services/datetime.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class QueryModel extends BaseModel {
    [index: string]: any;
    page: number = 1;
    limit: number = 20;
    team?: string = '';
    startTime?: NgbDateStruct | Date | number;
    endTime?: NgbDateStruct | Date | number;
    status?: string;
    groupId?: string;
    email?: string;
    phone?: string;
    teamId?: string = '';
    teamIds?: string;
    code?: string;
    externalCode?: String;
    name?: string;
    servicerId?: string;
    servicerIds?: string;
    servicerType?: string;
    userId?: string;
    userIds?: string;
    userCode?: string;
    notificationType?: string;
    serviceType?: string = '';
    fields?: string;
    codes?: string;
    orderId?: string;
    enterpriseId?: string;
    subEndUserIds?: string;
    endUserId?: string;
    hasIncident?: number;
    hasIncidentCollectionTime?: number;
    limitDays?: number;
    constructor(item = null) {
        super();
        this.mapFields(item);
    }

    public url(): string {
        let queryString = `?page=${this.page}&limit=${this.limit}`;
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const element = this[key];
                if (
                    this.hasOwnProperty(key) &&
                    !_.isUndefined(element) &&
                    !_.isFunction(element) &&
                    _.toString(element) !== ''
                ) {
                    switch (key) {
                        case 'page':
                        case 'limit':
                            break;

                        case 'startTime':
                            queryString += `&${key}=${
                                _.isNumber(element)
                                    ? element
                                    : _.isDate(element)
                                    ? DateTimeService.convertDateToTimestamp(
                                          element
                                      )
                                    : DateTimeService.convertDateStructToTimestamp(
                                          element
                                      )
                            }`;
                            break;

                        case 'endTime':
                            queryString += `&${key}=${
                                _.isNumber(element)
                                    ? element
                                    : _.isDate(element)
                                    ? DateTimeService.convertDateToTimestamp(
                                          element,
                                          true
                                      )
                                    : DateTimeService.convertDateStructToTimestamp(
                                          element,
                                          true
                                      )
                            }`;

                            break;
                        default:
                            queryString += `&${key}=${element}`;
                    }
                }
            }
        }

        return queryString;
    }

    public urlDetail(): string {
        let queryString = `/${this._id}?page=${this.page}&limit=${this.limit}`;
        if (this.startTime) {
            queryString += `&startTime=${this.startTime}`;
        }
        if (this.endTime) {
            queryString += `&endTime=${this.endTime}`;
        }
        if (this.status) {
            queryString += `&status=${this.status}`;
        }

        return queryString;
    }
}
