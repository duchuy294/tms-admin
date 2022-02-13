import * as _ from 'lodash';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { LoyaltyPointQueryModel } from '@/modules/marketing/models/loyalty-point-query.model';
import { QueryModel } from '@/models/query.model';
import { Type } from '@/constants/LoyaltyPoint';
import { UserStatus } from '@/constants/UserStatus';

@Component({
    selector: 'loyalty-point-history-filter',
    templateUrl: './loyalty-point-history-filter.component.html'
})
export class LoyaltyPointHistoryFilterComponent {
    @Input() display: boolean = false;
    @Output() search: EventEmitter<QueryModel> = new EventEmitter<QueryModel>();
    type = [Type.order, Type.redeem, Type.adjustIncrease, Type.adjustDecrease];
    private _endTime: Date;
    private _startTime: Date;
    private _selectedUser: string;
    model: LoyaltyPointQueryModel = new LoyaltyPointQueryModel();
    customerSearchCondition = {
        status: `${UserStatus.ALL}`
    };
    servicerSearchCondition = {
        status: `${UserStatus.ALL}`
    };

    get selectedUser() {
        return this._selectedUser;
    }

    set selectedUser(value) {
        if (value === null || _.isObject(value)) {
            this._selectedUser = value;
            this.model.userId = value ? value['_id'] : null;
        }
    }

    get startTime(): Date {
        return this._startTime;
    }

    set startTime(start) {
        this._startTime = start;
        this.model.startTime = start ? DateTimeService.convertDateToTimestamp(this._startTime) : null;
    }

    get endTime(): Date {
        return this._endTime;
    }

    set endTime(end) {
        this._endTime = end;
        this.model.endTime = end ? DateTimeService.convertDateToTimestamp(this._endTime, null, true) : null;
    }

    searchFilter() {
        this.search.emit(this.model);
    }

    resetFilter() {
        this._startTime = null;
        this._endTime = null;
        this._selectedUser = null;
        this.model = new LoyaltyPointQueryModel();
        this.searchFilter();
    }
}
