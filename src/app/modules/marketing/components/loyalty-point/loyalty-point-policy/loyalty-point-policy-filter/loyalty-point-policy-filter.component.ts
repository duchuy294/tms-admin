import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { QueryModel } from '@/models/query.model';
import { Status } from 'app/constants/status.enum';

@Component({
    selector: 'loyalty-point-policy-filter',
    templateUrl: './loyalty-point-policy-filter.component.html'
})
export class LoyaltyPointPolicyFilterComponent {
    @Input() display: boolean = false;
    @Output() search: EventEmitter<QueryModel> = new EventEmitter<QueryModel>();
    private _endTime: Date;
    private _startTime: Date;
    model = new QueryModel();
    status = [Status.NEW, Status.ACTIVE, Status.SUSPENDED];

    get startTime(): Date {
        return this._startTime;
    }

    set startTime(start: Date) {
        this._startTime = start;
        this.model.startTime = start ? DateTimeService.convertDateToTimestamp(this._startTime) : null;
    }

    get endTime(): Date {
        return this._endTime;
    }

    set endTime(end: Date) {
        this._endTime = end;
        this.model.endTime = end ? DateTimeService.convertDateToTimestamp(this._endTime, null, true) : null;
    }

    searchFilter() {
        this.search.emit(this.model);
    }

    resetFilter() {
        this._startTime = null;
        this._endTime = null;
        this.model = new QueryModel();
        this.searchFilter();
    }
}
