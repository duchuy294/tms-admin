import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from '../../../../../models/query.model';
import { Selection } from '../../../../utility/models/filter.model';
import { UserStatus } from '../../../../../constants/UserStatus';
import { UserType } from '@/constants/UserType';

@Component({
    selector: 'filter-customer',
    templateUrl: 'filter-customer.component.html'
})
export class FilterCustomerComponent {
    @Input() display: boolean = false;
    @Input() userLevels: Selection[] = [];
    model: QueryModel = new QueryModel();
    groups: Selection[] = [];
    searchTime: Date[];
    userTypes: number[] = [
        UserType.ENTERPRISE,
        UserType.INDIVIDUAL,
        UserType.OPERATOR,
        UserType.STAFF
    ];
    statues: UserStatus[] = [
        UserStatus.NEW,
        UserStatus.ACTIVE,
        UserStatus.SUSPENDED,
        UserStatus.DELETED
    ];
    _selectedCustomer = null;
    customerSearchCondition = {
        fields: 'fullName,phone,code'
    };

    @ViewChild('filterCustomer') filterCustomer: NgForm;

    @Output() search = new EventEmitter<QueryModel>();
    @Output() onReset = new EventEmitter<QueryModel>();
    ranges1 = {
        Today: [new Date(), new Date()]
    };
    set selectedCustomer(value) {
        if (_.isArray(value) || value === null) {
            this._selectedCustomer = value;
        }
    }

    get selectedCustomer() {
        return this._selectedCustomer;
    }

    reset() {
        this.model = new QueryModel();
        this.searchTime = [];
        this._selectedCustomer = null;
        CommonHelper.resetForm(this.filterCustomer);
        this.onReset.emit(new QueryModel({ page: 1, limit: 20 }));
    }

    searchEvent() {
        if (!_.isEmpty(this.searchTime)) {
            this.model.startTime = DateTimeService.convertDateToTimestamp(
                this.searchTime[0]
            );
            this.model.endTime = DateTimeService.convertDateToTimestamp(
                this.searchTime[1],
                null,
                true
            );
        } else {
            delete this.model.startTime;
            delete this.model.endTime;
        }
        if (!_.isEmpty(this._selectedCustomer)) {
            this.model.userIds = this._selectedCustomer;
        } else {
            delete this.model.userIds;
        }
        this.model.page = 1;
        this.search.emit(this.model);
    }
}
