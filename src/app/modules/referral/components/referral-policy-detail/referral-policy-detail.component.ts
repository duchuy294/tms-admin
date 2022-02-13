import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReferralPolicyModel } from '@/modules/referral/models/referral-policy.model';
import { ReferralPolicyService } from '@/modules/referral/services/referral-policy.service';

@Component({
    selector: 'referral-policy-detail',
    templateUrl: './referral-policy-detail.component.html'
})

export class ReferralPolicyDetailComponent implements OnInit {
    model = new ReferralPolicyModel();
    createModifyReferralPolicyModalVisible: boolean = false;

    constructor(
        private referralPolicyService: ReferralPolicyService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.loadData();
    }

    async loadData() {
        const id = this.route.snapshot.paramMap.get('id');
        this.model = await this.referralPolicyService.getReferralPolicy(id);
    }

    handleCreateModifyReferralPolicyModalVisible(flag = true) {
        this.createModifyReferralPolicyModalVisible = !!flag;
    }

    modifyReferralPolicy() {
        this.handleCreateModifyReferralPolicyModalVisible();
    }

    afterModified() {
        this.loadData();
    }
}