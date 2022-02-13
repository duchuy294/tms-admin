import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ReferralModel } from '@/modules/referral/models/referral.model';
import { ReferralQueryModel } from '@/modules/referral/models/referral-query.model';
import { ReferralService } from '@/modules/referral/services/referral.service';
import { RewardService } from '@/modules/marketing/services/reward.service';
import { ServicerService } from '@/modules/servicer/services/servicer.service';

@Component({
    selector: 'referral-history-grid',
    templateUrl: './referral-history-grid.component.html'
})

export class ReferralHistoryGridComponent implements OnInit {
    @Input() model: ReferralQueryModel = new ReferralQueryModel();

    users: { [_id: string]: string } = {};
    rewards: { [_id: string]: string } = {};
    referralPolicyId = this.route.snapshot.paramMap.get('id');

    loading = false;

    public tableData = new PagingModel<ReferralModel>();

    constructor(
        private referralService: ReferralService,
        private route: ActivatedRoute,
        private customerService: CustomerService,
        private servicerService: ServicerService,
        private rewardService: RewardService
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData(modelQuery: ReferralQueryModel = null) {
        this.loading = true;

        if (modelQuery) {
            this.model = modelQuery;
        }

        this.model.referralPolicyId = this.referralPolicyId;

        this.tableData = await this.referralService.filter(this.model);

        const userIds = _.filter(_.concat(_.map(this.tableData.data, item => item.referralId),
            _.map(this.tableData.data, item => item.userId)), item => item).join(',');
        await this.getCustomers(userIds);
        await this.getServicers(userIds);

        const redeemedRewardIds = _.map(this.tableData.data, item => _.join(item.redeemedRewardIds, ',')).join(',');
        await this.getRedeemedRewards(redeemedRewardIds);

        this.loading = false;
    }

    async loadDataByPage(event) {
        this.model.page = event;
        await this.loadData();
    }

    async loadDataByPageSize(event) {
        this.model.limit = event;
        await this.loadData();
    }

    async getCustomers(data: string) {
        const customers = await this.customerService.getCustomers(new QueryModel({
            limit: this.model.limit,
            userIds: data,
            fields: 'fullName'
        }));
        _.forEach(customers.data, (item) => {
            this.users[item._id] = item.fullName;
        });
    }

    async getServicers(data: string) {
        const servicers = await this.servicerService.getServicers(new QueryModel({
            limit: this.model.limit,
            servicerIds: data,
            fields: 'fullName'
        }));
        _.forEach(servicers.data, (item) => {
            this.users[item._id] = item.fullName;
        });
    }

    async getRedeemedRewards(data: string) {
        const rewards = await this.rewardService.filter(new QueryModel({
            limit: this.model.limit,
            rewardIds: data,
            fields: 'code'
        }));
        _.forEach(rewards.data, (item) => {
            this.rewards[item._id] = item.code;
        });
    }
}
