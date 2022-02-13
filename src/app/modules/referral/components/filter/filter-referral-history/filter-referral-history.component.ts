import { ActivatedRoute } from '@angular/router';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NgForm } from '@angular/forms';
import { ReferralHistoryType } from '@/modules/referral/constants/referral-history-type.enum';
import { ReferralQueryModel } from '@/modules/referral/models/referral-query.model';

@Component({
    selector: 'filter-referral-history',
    templateUrl: './filter-referral-history.component.html'
})

export class FilterReferralHistoryComponent {
    modelQuery = new ReferralQueryModel();
    isLoading = false;
    types = [ReferralHistoryType.PRESENTEE, ReferralHistoryType.PRESENTER];
    startTime: Date;
    endTime: Date;
    referralPolicyId = this.route.snapshot.paramMap.get('id');

    @ViewChild('filterReferralHistoryForm') filterReferralHistoryForm: NgForm;

    @Output() onSearch = new EventEmitter<ReferralQueryModel>();

    @Output() onReset = new EventEmitter<ReferralQueryModel>();

    constructor(
        private route: ActivatedRoute
    ) { }

    reset() {
        this.modelQuery = new ReferralQueryModel({ referralPolicyId: this.referralPolicyId });
        this.startTime = null;
        this.endTime = null;
        CommonHelper.resetForm(this.filterReferralHistoryForm);
        this.onReset.emit(new ReferralQueryModel({ page: 1, limit: 20 }));
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