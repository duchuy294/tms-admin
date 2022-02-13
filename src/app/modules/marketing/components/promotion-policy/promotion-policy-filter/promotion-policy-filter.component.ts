import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { PromotionPolicyQueryModel } from '@/modules/marketing/models/promotion-policy-query.model';
import { Status } from '@/constants/status.enum';

@Component({
    selector: 'promotion-policy-filter',
    templateUrl: './promotion-policy-filter.component.html'
})
export class PromotionPolicyFilterComponent {
    @Input() display: boolean = false;
    @Output() search = new EventEmitter();
    private _endTime: Date;
    private _startTime: Date;
    queryModel = new PromotionPolicyQueryModel();
    status = [Status.NEW, Status.ACTIVE, Status.SUSPENDED];

    get startTime(): Date {
        return this._startTime;
    }

    set startTime(start) {
        this._startTime = start;
        this.queryModel.startTime = start ? DateTimeService.convertDateToTimestamp(this._startTime) : null;
    }

    get endTime(): Date {
        return this._endTime;
    }

    set endTime(end) {
        this._endTime = end;
        this.queryModel.endTime = end ? DateTimeService.convertDateToTimestamp(this._endTime, null, true) : null;
    }


    onSearch() {
        this.search.emit(this.queryModel);
    }

    onReset() {
        this.queryModel = new PromotionPolicyQueryModel();
        this._startTime = null;
        this._endTime = null;
        this.onSearch();
    }
}
