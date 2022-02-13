import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { PromotionPolicyModel } from '@/modules/marketing/models/promotion-policy';
import { PromotionPolicyService } from '@/modules/marketing/services/promotion-policy.service';
import { QueryModel } from '@/models/query.model';
import { Status } from 'app/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'promotion-policy-grid',
    templateUrl: './promotion-policy-grid.component.html'
})
export class PromotionPolicyGridComponent implements OnInit {
    public tableData = new PagingModel<PromotionPolicyModel>();
    queryModel: QueryModel = new QueryModel();
    loadingGrid: boolean = false;

    constructor(
        private messageService: NzMessageService,
        private promotionPolicyService: PromotionPolicyService,
        private translateService: TranslateService,
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

        this.tableData = await this.promotionPolicyService.getPromotionPolicies(this.queryModel);
        const verifyQuery = this.promotionPolicyService.verifyPageQueryModel(this.tableData, this.queryModel);
        if (verifyQuery.error) {
            this.queryModel = verifyQuery.modelQuery;
            this.tableData = await this.promotionPolicyService.getPromotionPolicies(this.queryModel);
        }

        this.loadingGrid = false;
    }

    async loadDataByPage($event) {
        await this.loadData(null, $event);
    }

    async loadDataByPageSize($event) {
        this.queryModel.limit = $event;
        await this.loadData(null, 1);
    }

    async onChangePromotionStatus($event, promotionItem) {
        promotionItem.status = $event ? Status.ACTIVE : Status.SUSPENDED;
        const response = await this.promotionPolicyService.updatePromotionPolicy(promotionItem);
        if (response.errorCode === 0) {
            this.messageService.success(this.translateService.instant('common.successfully'));
        } else {
            this.messageService.error(this.translateService.instant('common.failed'));
        }
        this.loadData();
    }
}
