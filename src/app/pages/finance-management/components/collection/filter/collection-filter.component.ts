import * as _ from 'lodash';
import { CollectionFilterType } from '@/pages/service-management/constants/collection-filter-type';
import { CommonHelper } from './../../../../../modules/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { OrderType } from '@/modules/order/constants/OrderType';
import { QueryModel } from '@/models/query.model';
import { RequestCodOrder } from '@/constants/RequestCod';
@Component({
    selector: 'collection-filter',
    templateUrl: './collection-filter.component.html'
})
export class CollectionFilterComponent {
    @Output() search = new EventEmitter<QueryModel>();
    @Input() display: boolean = false;
    @Input() visibles = [];
    model = new QueryModel();
    collectionFilterTypes = [CollectionFilterType.ALL, CollectionFilterType.UNFINISHED_ORDER, CollectionFilterType.FINISHED_ORDER, CollectionFilterType.UNFINISHED_SUBMIT, CollectionFilterType.FINISHED_SUBMIT];
    collectionFilterType = CollectionFilterType.ALL;
    @ViewChild('filterOrderForm') filterOrderForm: NgForm;
    serviceTypes = [
        OrderType.DELIVERY,
        OrderType.INSTALL,
        OrderType.DELIVERY_INSTALL,
        OrderType.WARRANTY_REPAIR
    ];
    _serviceType = [];
    _requestCodStatus = [];
    servicerSearchCondition = {
        fields: 'fullName,phone,code',
    };
    _selectedServicer = null;
    ranges1 = {
        Today: [new Date(), new Date()]
    };
    startTime: Date[];
    requestCodOrder = RequestCodOrder;

    set selectedServicer(value) {
        if (_.isArray(value) || (value === null)) {
            this._selectedServicer = value;
        }
    }

    get selectedServicer() {
        return this._selectedServicer;
    }
    searchEvent() {
        if (!_.isEmpty(this.startTime)) {
            this.model.startTime = DateTimeService.convertDateToTimestamp(this.startTime[0]);
            this.model.endTime = DateTimeService.convertDateToTimestamp(this.startTime[1], null, true);
        } else {
            delete this.model.startTime;
            delete this.model.endTime;
        }
        if (this._serviceType) {
            this.model.serviceType = _.join(this._serviceType, ',');
        } else {
            delete this.model.serviceType;
        }
        if (this._requestCodStatus) {
            this.model.codRequestStatus = _.join(this._requestCodStatus, ',');
        } else {
            delete this.model.codRequestStatus;
        }
        if (this._selectedServicer) {
            this.model.servicerId = this._selectedServicer;
        } else {
            delete this.model.servicerId;
        }
        this.search.emit(this.model);
    }

    reset() {
        this.model = new QueryModel();
        this.collectionFilterType = CollectionFilterType.ALL;
        this._selectedServicer = null;
        this.startTime = [];
        this._requestCodStatus = [];
        this._serviceType = [];
        CommonHelper.resetForm(this.filterOrderForm);
        this.searchEvent();
    }
}
