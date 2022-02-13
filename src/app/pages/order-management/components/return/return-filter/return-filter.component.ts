import * as _ from 'lodash';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { OrderStatus } from '@/constants/OrderStatus';
import { OrderType } from '@/modules/order/constants/OrderType';
import { QueryModel } from '../../../../../models/query.model';
import { UserType } from '@/constants/UserType';
import { OrderDeliveryType } from '@/constants/OrderDeliveryType';
import { OrderSource } from '@/constants/OrderSource';

@Component({
    selector: 'return-filter',
    templateUrl: 'return-filter.component.html'
})
export class ReturnFilterComponent {
    @Output() search = new EventEmitter<QueryModel>();
    @Input() display: boolean = false;
    @Input() hiddens: string[] = [];
    @Input() query = new QueryModel({ serviceType: null });
    ranges1 = {
        Today: [new Date(), new Date()]
    };
    startTime: Date[];
    orderTypes = [OrderType.DELIVERY, OrderType.DELIVERY_INSTALL, OrderType.INSTALL, OrderType.WARRANTY_REPAIR, OrderType.SHARING_WAREHOUSE];
    orderStatuses = [
        OrderStatus.Return,
        OrderStatus.FinishedWithReturn,
        OrderStatus.Pending,
        OrderStatus.PendingReturned,
    ];
    customerSearchCondition = {
        fields: 'fullName,phone,code'
    };
    servicerSearchCondition = {
        fields: 'fullName,phone,code',
    };
    constUserType = UserType;
    _selectedCustomer = null;
    _selectedServicer = null;
    _deliveryType: string = '';
    _source: string = '';
    orderDeliveryType = OrderDeliveryType;
    orderSource = OrderSource;
    visibleLocation: boolean = false;
    searchEvent() {
        if (!_.isEmpty(this.startTime)) {
            this.query.startTime = DateTimeService.convertDateToTimestamp(this.startTime[0]);
            this.query.endTime = DateTimeService.convertDateToTimestamp(this.startTime[1], null, true);
        } else {
            delete this.query.startTime;
            delete this.query.endTime;
        }

        if (!_.isEmpty(this._selectedCustomer)) {
            this.query.userId = this._selectedCustomer;
        } else {
            delete this.query.userId;
        }

        if (!_.isEmpty(this._selectedServicer)) {
            this.query.servicerId = this._selectedServicer;
        } else {
            delete this.query.servicerId;
        }

        if (!_.isEmpty(this._source)) {
            this.query.source = this._source;
        } else {
            delete this.query.source;
        }

        if (!_.isEmpty(this._deliveryType)) {
            this.query.deliveryType = this._deliveryType;
        } else {
            delete this.query.deliveryType;
        }


        this.search.emit(this.query);
    }

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
        this.query = new QueryModel({ hasReturn: true });
        this.startTime = [];
        this.selectedCustomer = null;
        this.selectedServicer = null;
        this._deliveryType = null;
        this.searchEvent();
    }

    handelVisibleLocation(flag) {
        this.visibleLocation = flag;
    }
}