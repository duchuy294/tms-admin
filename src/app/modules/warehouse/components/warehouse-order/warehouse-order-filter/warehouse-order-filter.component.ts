import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { OrderStatus } from '@/constants/OrderStatus';
import { OrderType } from '@/modules/order/constants/OrderType';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'warehouse-order-filter',
    templateUrl: './warehouse-order-filter.component.html'
})
export class WarehouseOrderFilterComponent {
    @ViewChild('form') form: NgForm;
    @Output() onSearch = new EventEmitter<QueryModel>();

    modelQuery = new QueryModel({ serviceType: OrderType.SHARING_WAREHOUSE });
    isLoading = false;
    customerSearchCondition = {
        fields: 'fullName,phone,code'
    };
    _selectedRenter = null;
    _selectedLessor = null;
    _selectedWarehouse = null;
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

    set selectedLessor(value) {
        if (_.isArray(value) || (value === null)) {
            this._selectedLessor = value;
        }
    }

    get selectedLessor() {
        return this._selectedLessor;
    }

    set selectedWarehouse(value) {
        this._selectedWarehouse = value;
        if (_.isArray(value) || (value === null)) {
            this._selectedWarehouse = value;
        }
    }

    get selectedWarehouse() {
        return this._selectedWarehouse;
    }

    reset() {
        this.modelQuery = new QueryModel({ serviceType: OrderType.SHARING_WAREHOUSE });
        this.createdAt = [];
        this._selectedRenter = null;
        this._selectedLessor = null;
        this._selectedWarehouse = null;
        CommonHelper.resetForm(this.form);
        this.onSearch.emit(new QueryModel({ serviceType: OrderType.SHARING_WAREHOUSE }));
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

        if (!_.isEmpty(this._selectedLessor)) {
            this.modelQuery.hostId = this._selectedLessor;
        } else {
            delete this.modelQuery.hostId;
        }

        if (!_.isEmpty(this._selectedWarehouse)) {
            this.modelQuery.warehouseId = this._selectedWarehouse;
        } else {
            delete this.modelQuery.warehouseId;
        }

        this.modelQuery.page = 1;
        this.onSearch.emit(this.modelQuery);
    }
}