import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoyaltyPointConditionModel } from '@/modules/marketing/models/loyalty-policy-condition.model';
import { LoyaltyPointPolicyModel } from '@/modules/marketing/models/loyalty-point-policy.model';
import { LoyaltyPointPolicyService } from '@/modules/marketing/services/loyalty-point-policy.service';
import { PagingModelAppendable } from '@/utility/components/paging/paging.model';

@Component({
    selector: 'loyalty-point-policy-detail',
    templateUrl: './loyalty-point-policy-detail.component.html'
})
export class LoyaltyPointPolicyDetailComponent implements OnInit {
    modelData = new LoyaltyPointPolicyModel();
    tableData = new PagingModelAppendable<LoyaltyPointConditionModel>();
    visibleModal: boolean = false;
    loyaltyPointId: string = '';

    constructor(private route: ActivatedRoute, private promotionPolicyService: LoyaltyPointPolicyService, ) { }

    async ngOnInit() {
        this.loyaltyPointId = this.route.snapshot.paramMap.get('id');
        await this.getLoyaltyPointDetail();
    }

    async getLoyaltyPointDetail() {
        this.modelData = await this.promotionPolicyService.get(this.loyaltyPointId);
        if (this.modelData.details.length) {
            this.tableData = new PagingModelAppendable<LoyaltyPointConditionModel>();
            this.modelData.details.forEach(policyConditionItem => {
                this.tableData.add(policyConditionItem);
            });
        }
    }

    handleVisibleModal(flag = false) {
        this.visibleModal = !!flag;
    }

    editLoyaltyPoint() {
        this.handleVisibleModal(true);
    }

    async handleAfterModification() {
        this.getLoyaltyPointDetail();
    }
}
