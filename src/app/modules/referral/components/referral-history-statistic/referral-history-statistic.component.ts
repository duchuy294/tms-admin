import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReferralQueryModel } from '@/modules/referral/models/referral-query.model';
import { ReferralService } from '@/modules/referral/services/referral.service';

@Component({
    selector: 'referral-history-statistic',
    templateUrl: './referral-history-statistic.component.html',
    styleUrls: ['./referral-history-statistic.component.less'],
})
export class ReferralHistoryStatisticComponent implements OnInit {

    referralPolicyId = this.route.snapshot.paramMap.get('id');

    statisticData: any;
    loadingStatistic = false;

    constructor(
        private referralService: ReferralService,
        private route: ActivatedRoute
    ) { }

    async ngOnInit() {
        await this.getStatistic();
    }

    async getStatistic(modelQuery: ReferralQueryModel = new ReferralQueryModel({ referralPolicyId: this.referralPolicyId })) {
        this.loadingStatistic = true;
        this.statisticData = await this.referralService.getStatistic(modelQuery);
        this.loadingStatistic = false;
    }
}
