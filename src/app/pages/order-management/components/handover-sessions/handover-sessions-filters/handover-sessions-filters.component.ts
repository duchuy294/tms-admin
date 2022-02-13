import * as _ from 'lodash';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { DateTimeService } from '@/modules/utility/services/datetime.service';
import { HandoverSessions } from '@/pages/order-management/models/handover-sessions.model';
import { HandoverSessionsQueryModel } from '@/pages/order-management/models/handover-sessions-query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Status } from '@/constants/status.enum';

@Component({
    selector: 'handover-sessions-filters',
    templateUrl: './handover-sessions-filters.component.html',
    styleUrls: ['./handover-sessions-filters.component.less']
})
export class HandoverSessionsFiltersComponent implements OnInit {
    createdAt: Date[];
    receivedDateFirst: Date[];
    receivedDateLast: Date[];
    ranges1 = {
        Today: [new Date(), new Date()]
    };
    customerSearchCondition = {
        fields: 'fullName,phone,code',
        status: `${Status.NEW},${Status.ACTIVE},${Status.SUSPENDED},${Status.DELETED}`
    };
    @Output() onSearch = new EventEmitter<HandoverSessionsQueryModel>();
    queryModel: HandoverSessionsQueryModel = new HandoverSessionsQueryModel();
    handoverSessions = HandoverSessions;
    _customer: any[] = [];;
    constructor(public servierService: ServicerService) { }

    ngOnInit(): void {
    }

    set selectedCustomer(value) {
        if (_.isArray(value) || (value === null)) {
            this._customer = value;
            this.queryModel.userId = value.join(',');
        }
    }

    get selectedCustomer() {
        return this._customer;
    }

    search() {
        if (!_.isEmpty(this.createdAt)) {
            this.queryModel.startTime = DateTimeService.convertDateToTimestamp(this.createdAt[0]);
            this.queryModel.endTime = DateTimeService.convertDateToTimestamp(this.createdAt[1], null, true);
        } else {
            delete this.queryModel.startTime;
            delete this.queryModel.endTime;
        }
        if (!_.isEmpty(this.receivedDateFirst)) {
            this.queryModel.firstScanAtFrom = DateTimeService.convertDateToTimestamp(this.receivedDateFirst[0]);
            this.queryModel.firstScanAtTo = DateTimeService.convertDateToTimestamp(this.receivedDateFirst[1], null, true);
        } else {
            delete this.queryModel.firstScanAtFrom;
            delete this.queryModel.firstScanAtTo;
        }
        if (!_.isEmpty(this.receivedDateLast)) {
            this.queryModel.lastScanAtFrom = DateTimeService.convertDateToTimestamp(this.receivedDateLast[0]);
            this.queryModel.lastScanAtTo = DateTimeService.convertDateToTimestamp(this.receivedDateLast[1], null, true);
        } else {
            delete this.queryModel.lastScanAtFrom;
            delete this.queryModel.lastScanAtTo;
        }
        for (const [key, value] of Object.entries( this.queryModel)) {
            if (typeof value === 'string') {
                this.queryModel[key] = _.trim(value);
            }
        }
        this.onSearch.emit(this.queryModel);
    }

    reset() {
        this.queryModel = new HandoverSessionsQueryModel();
        this._customer = [];
        this.createdAt = [];
        this.receivedDateFirst = [];
        this.receivedDateLast = [];
        this.onSearch.emit(this.queryModel);
    }

}
