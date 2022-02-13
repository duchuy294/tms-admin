import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { OrderStatus } from '@/constants/OrderStatus';
import { QueryModel } from '../../../../../models/query.model';
import { UserType } from '@/constants/UserType';

@Component({
    selector: 'filter-order-customer',
    templateUrl: './filter-order-customer.component.html'
})
export class FilterOrderCustomerComponent {
    @Input() display: boolean = false;
    @Input() isEnterprise: boolean = false;
    @Input() userId: string = null;
    model: QueryModel = new QueryModel();
    searchTime: Date[];
    statuses = [
        OrderStatus.FindingServicer,
        OrderStatus.Accepted,
        OrderStatus.CanceledByUser,
        OrderStatus.CanceledByServicer,
        OrderStatus.CanceledByAdmin,
        OrderStatus.InProgress,
        OrderStatus.Finished,
        OrderStatus.FinishedWithReturn,
        OrderStatus.FailedInstallation,
        OrderStatus.Return,
        OrderStatus.Incident,
        OrderStatus.ProcessingIncident,
        OrderStatus.Timeout
    ];
    _selectedCustomer = null;
    _selectedServicer = null;
    servicerSearchCondition = {
        fields: 'fullName,phone,code'
    };
    customerSearchCondition = {
        fields: 'fullName,phone,code',
        type: UserType.STAFF,
        _id: this.userId
    };

    @ViewChild('filterOrderCustomer') filterOrderCustomer: NgForm;

    @Output() search = new EventEmitter<QueryModel>();
    @Output() onReset = new EventEmitter<QueryModel>();

    set selectedCustomer(value) {
        if (_.isArray(value) || (value === null)) {
            this._selectedCustomer = value;
        }
    }

    get selectedCustomer() {
        return this._selectedCustomer;
    }

    set selectedServicer(value) {
        if (_.isArray(value) || (value === null)) {
            this._selectedServicer = value;
        }
    }

    get selectedServicer() {
        return this._selectedServicer;
    }

    reset() {
        this.model = new QueryModel();
        this.searchTime = [];
        this._selectedServicer = null;
        this._selectedCustomer = null;
        CommonHelper.resetForm(this.filterOrderCustomer);
        this.onReset.emit(new QueryModel({ page: 1, limit: 20 }));
    }

    searchEvent() {
        if (!_.isEmpty(this.searchTime)) {
            this.model.startTime = DateTimeService.convertDateToTimestamp(this.searchTime[0]);
            this.model.endTime = DateTimeService.convertDateToTimestamp(this.searchTime[1], null, true);
        } else {
            delete this.model.startTime;
            delete this.model.endTime;
        }

        if (!_.isEmpty(this._selectedServicer)) {
            this.model.servicerId = this._selectedServicer;
        } else {
            delete this.model.servicerId;
        }

        this.model.page = 1;
        this.search.emit(this.model);
    }
}