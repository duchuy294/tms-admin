import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { OrderStatus } from '@/constants/OrderStatus';
import { OrderType } from '@/modules/order/constants/OrderType';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'warehouse-order-history-filter',
    templateUrl: './warehouse-order-history-filter.component.html'
})
export class WarehouseOrderHistoryFilterComponent {
    @ViewChild('form') form: NgForm;
    @Output() onSearch = new EventEmitter<QueryModel>();

    id = this.route.snapshot.paramMap.get('id');
    modelQuery = new QueryModel({ warehouseId: this.id, serviceType: OrderType.SHARING_WAREHOUSE });
    customerSearchCondition = {
        fields: 'fullName,phone,code'
    };
    _selectedRenter = null;
    ranges1 = {
        Today: [new Date(), new Date()]
    };
    createdAt: Date[];
    statuses = [
        OrderStatus.Accepted,
        OrderStatus.Finished,
        OrderStatus.WatingToConfirm,
        OrderStatus.ConfirmCompleted,
        OrderStatus.CanceledByAdmin,
        OrderStatus.CanceledByRenter,
        OrderStatus.CanceledByLessor
    ];

    set selectedRenter(value) {
        if (_.isArray(value) || (value === null)) {
            this._selectedRenter = value;
        }
    }

    get selectedRenter() {
        return this._selectedRenter;
    }

    constructor(
        private route: ActivatedRoute
    ) { }

    reset() {
        this.modelQuery = new QueryModel({ warehouseId: this.id, serviceType: OrderType.SHARING_WAREHOUSE });
        this.createdAt = [];
        this._selectedRenter = null;
        CommonHelper.resetForm(this.form);
        this.onSearch.emit(this.modelQuery);
    }

    search() {
        if (!_.isEmpty(this.createdAt)) {
            this.modelQuery.startTime = DateTimeService.convertDateToTimestamp(this.createdAt[0]);
            this.modelQuery.endTime = DateTimeService.convertDateToTimestamp(this.createdAt[1], null, true);
        } else {
            delete this.modelQuery.startTime;
            delete this.modelQuery.endTime;
        }

        if (!_.isEmpty(this._selectedRenter)) {
            this.modelQuery.userId = this._selectedRenter;
        } else {
            delete this.modelQuery.userId;
        }

        this.modelQuery.page = 1;
        this.onSearch.emit(this.modelQuery);
    }
}