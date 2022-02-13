import { Component, OnInit, ViewChild } from '@angular/core';
import { RedeemedRewardComponent } from './../../../../modules/marketing/components/reward/redeemed-reward/redeemed-reward.component';

@Component({
    selector: 'reward-management',
    templateUrl: 'reward-management.component.html'
})
export class RewardManagementComponent implements OnInit {
    selectedTabIndex = 0;
    @ViewChild('redeemedRewardList') redeemedRewardList: RedeemedRewardComponent;
    ngOnInit() {
        window.scrollTo(0, 0);
    }

    reloadRedeemedReward() {
        this.redeemedRewardList.loadData();
    }
}