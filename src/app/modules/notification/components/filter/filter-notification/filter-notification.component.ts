import { ActivityType } from '@/modules/activity/constants/activity-type.enum';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'filter-notification',
    templateUrl: './filter-notification.component.html'
})

export class FilterNotificationComponent implements OnInit {
    modelQuery: QueryModel;
    isLoading = false;
    types = [
        ActivityType.CREATED,
        ActivityType.HAPPEN_INCIDENT,
        ActivityType.RESPONSE,
        ActivityType.WITHDRAWAL_REQUEST,
        ActivityType.NEW_MESSAGE
    ];
    startTime: Date;
    endTime: Date;

    @ViewChild('filterNotificationForm') filterNotificationForm: NgForm;

    @Output() onSearch = new EventEmitter<QueryModel>();

    @Output() onReset = new EventEmitter<QueryModel>();

    ngOnInit() {
        this.modelQuery = new QueryModel();
    }

    reset() {
        this.modelQuery = new QueryModel();
        this.startTime = null;
        this.endTime = null;
        CommonHelper.resetForm(this.filterNotificationForm);
        this.onReset.emit(new QueryModel());
    }

    search() {
        if (this.startTime) {
            this.modelQuery.startTime = DateTimeService.convertDateToTimestamp(this.startTime);
        } else {
            delete this.modelQuery.startTime;
        }
        if (this.endTime) {
            this.modelQuery.endTime = DateTimeService.convertDateToTimestamp(this.endTime, null, true);
        } else {
            delete this.modelQuery.endTime;
        }
        this.modelQuery.page = 1;
        this.onSearch.emit(this.modelQuery);
    }
}