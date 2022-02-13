import { Component, ViewChild } from '@angular/core';
import { ReferralHistoryGridComponent } from './../referral-history-grid/referral-history-grid.component';
import { ReferralHistoryStatisticComponent } from './../referral-history-statistic/referral-history-statistic.component';
import { ReferralQueryModel } from '@/modules/referral/models/referral-query.model';

@Component({
    selector: 'referral-history',
    templateUrl: './referral-history.component.html'
})
export class ReferralHistoryComponent {
    @ViewChild('referralHistoryGrid')
    referralHistoryGrid: ReferralHistoryGridComponent;
    @ViewChild('referralHistoryStatistic')
    referralHistoryStatistic: ReferralHistoryStatisticComponent;
    modelQuery = new ReferralQueryModel();
    showFilter = false;

    async search(event) {
        this.modelQuery = event;
        await this.referralHistoryGrid.loadData(this.modelQuery);
        await this.referralHistoryStatistic.getStatistic(this.modelQuery);
    }

    toggleFilter() {
        this.showFilter = !this.showFilter;
    }
}
