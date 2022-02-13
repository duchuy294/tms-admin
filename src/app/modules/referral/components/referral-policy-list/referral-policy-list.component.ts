import { Component, OnInit, ViewChild } from '@angular/core';
import { ReferralpolicyFilterComponent } from './../filter/referral-policy-filter/referral-policy-filter.component';
import { ReferralPolicyGridComponent } from './../referral-policy-grid/referral-policy-grid.component';
import { ReferralPolicyModel } from '@/modules/referral/models/referral-policy.model';
import { ReferralPolicyQueryModel } from '../../models/referral-policy-query.model';

@Component({
    selector: 'referral-policy-list',
    templateUrl: './referral-policy-list.component.html'
})
export class ReferralPolicyListComponent implements OnInit {
    @ViewChild('referralPolicyGrid') referralPolicyGrid: ReferralPolicyGridComponent;
    @ViewChild('referralPolicyFilter')
    referralPolicyFilter: ReferralpolicyFilterComponent;
    createModifyReferralPolicyModalVisible: boolean = false;
    referralPolicyToEdit: ReferralPolicyModel = null;

    modelQuery: ReferralPolicyQueryModel;

    ngOnInit() {
        window.scrollTo(0, 0);
        this.modelQuery = new ReferralPolicyQueryModel();
    }

    async search(event) {
        this.modelQuery = event;
        await this.referralPolicyGrid.loadData(this.modelQuery);
    }

    async toggleVisibleFilter() {
        await this.referralPolicyFilter.tonggleVisibleFilter();
    }

    handleCreateModifyReferralPolicyModalVisible(flag = true) {
        this.createModifyReferralPolicyModalVisible = !!flag;
    }

    addReferralPolicy() {
        this.referralPolicyToEdit = null;
        this.handleCreateModifyReferralPolicyModalVisible();
    }

    afterCreated() {
        this.referralPolicyGrid.loadData();
    }
}
