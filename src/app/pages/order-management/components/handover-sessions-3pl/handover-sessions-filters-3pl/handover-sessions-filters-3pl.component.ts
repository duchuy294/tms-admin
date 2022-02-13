import * as _ from 'lodash';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { DateTimeService } from '@/modules/utility/services/datetime.service';
import { HandoverSessions3PL } from '@/pages/order-management/models/handover-sessions-3pl.model';
import { HandoverSessionsQueryModel } from '@/pages/order-management/models/handover-sessions-query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { Status } from '@/constants/status.enum';

@Component({
    selector: 'handover-sessions-filters-3pl',
    templateUrl: './handover-sessions-filters-3pl.component.html',
    styleUrls: ['./handover-sessions-filters-3pl.component.less']
})
export class HandoverSessionsFilters3PLComponent implements OnInit {
    createdAt: Date[];
    completedAt: Date[];
    receivedDateFirst: Date[];
    receivedDateLast: Date[];
    ranges1 = {
        Today: [new Date(), new Date()]
    };
    customerSearchCondition = {
        fields: 'fullName,phone,code',
        type: 2,
        status: `${Status.NEW},${Status.ACTIVE},${Status.SUSPENDED},${Status.DELETED}`
    };
    @Output() onSearch = new EventEmitter<HandoverSessionsQueryModel>();
    queryModel: HandoverSessionsQueryModel = new HandoverSessionsQueryModel();
    handoverSessions = HandoverSessions3PL;
    _customer: any[] = [];
    constructor(public servierService: ServicerService) {}

    ngOnInit(): void {}

    set selectedCustomer(value) {
        if (_.isArray(value) || value === null) {
            this._customer = value;
            this.queryModel.clientBranchId = value.join(',');
        }
    }

    get selectedCustomer() {
        return this._customer;
    }

    search() {
        if (!_.isEmpty(this.createdAt)) {
            this.queryModel.startTime = DateTimeService.convertDateToTimestamp(
                this.createdAt[0]
            );
            this.queryModel.endTime = DateTimeService.convertDateToTimestamp(
                this.createdAt[1],
                null,
                true
            );
        } else {
            delete this.queryModel.startTime;
            delete this.queryModel.endTime;
        }
        if (!_.isEmpty(this.completedAt)) {
            this.queryModel.finishedStart = DateTimeService.convertDateToTimestamp(
                this.completedAt[0]
            );
            this.queryModel.finishedEnd = DateTimeService.convertDateToTimestamp(
                this.completedAt[1],
                null,
                true
            );
        } else {
            delete this.queryModel.finishedStart;
            delete this.queryModel.finishedEnd;
        }
        for (const [key, value] of Object.entries(this.queryModel)) {
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
        this.completedAt = [];
        this.onSearch.emit(this.queryModel);
    }
}
