import { Component, OnInit } from '@angular/core';
import { LoyaltyPointPolicyModel } from 'app/modules/marketing/models/loyalty-point-policy.model';
import { LoyaltyPointPolicyService } from '@/modules/marketing/services/loyalty-point-policy.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { Status } from 'app/constants/status.enum';

@Component({
    selector: 'loyalty-point-policy-grid',
    templateUrl: './loyalty-point-policy-grid.component.html'
})
export class LoyaltyPointPolicyGridComponent implements OnInit {
    loadingGrid: boolean = false;
    public tableData = new PagingModel<LoyaltyPointPolicyModel>();
    queryModel: QueryModel = new QueryModel();
    status = [Status.NEW, Status.ACTIVE, Status.SUSPENDED];
    loadingUpdateStatus = {};

    constructor(
        private promotionPolicyService: LoyaltyPointPolicyService,
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async triggerLoadData(queryModel: QueryModel, pageIndex?) {
        await this.loadData(queryModel, pageIndex);
    }

    async loadData(query = null, page = null) {
        if (query) {
            this.queryModel = new QueryModel(query);
        }
        if (page) {
            this.queryModel.page = page;
        }
        this.loadingGrid = true;

        this.tableData = await this.promotionPolicyService.filter(this.queryModel);
        const verifyQuery = this.promotionPolicyService.verifyPageQueryModel(this.tableData, this.queryModel);
        if (verifyQuery.error) {
            this.queryModel = verifyQuery.modelQuery;
            this.tableData = await this.promotionPolicyService.filter(this.queryModel);
        }

        this.loadingGrid = false;
    }

    async loadDataByPage($event = 1) {
        await this.loadData(null, $event);
    }

    async loadDataByPageSize($event = 20) {
        this.queryModel.limit = $event;
        await this.loadData(null, 1);
    }

    async onChangePromotionStatus($event, promotionItem) {
        this.loadingUpdateStatus = { ...this.loadingUpdateStatus, [promotionItem._id]: true };
        promotionItem.status = $event ? Status.ACTIVE : Status.SUSPENDED;
        await this.promotionPolicyService.update(promotionItem);
        this.loadingUpdateStatus = { ...this.loadingUpdateStatus, [promotionItem._id]: false };
    }
}
