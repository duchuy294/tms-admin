import * as _ from 'lodash';
import { AccountModel } from 'app/modules/admin/models/admin.model';
import { AccountType } from '@/constants/AccountType';
import { AdminService } from 'app/modules/admin/services/admin.service';
import { Component, OnInit } from '@angular/core';
import { Customer } from 'app/modules/customer/models/customer-detail.model';
import { CustomerService } from 'app/modules/customer/services/customer.service';
import { GridAction } from 'app/models/grid-action.model';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { RedeemedRewardModel } from 'app/modules/marketing/models/redeemed-reward.model';
import { RedeemedRewardService } from 'app/modules/marketing/services/redeemed-reward.service';
import { RewardCategoryModel } from 'app/modules/marketing/models/reward-category.model';
import { RewardCategoryService } from 'app/modules/marketing/services/reward-category.service';
import { RewardModel } from 'app/modules/marketing/models/reward.model';
import { RewardProviderModel } from 'app/modules/marketing/models/reward-provider.model';
import { RewardProviderService } from '../../../services/reward-provider.service';
import { RewardService } from 'app/modules/marketing/services/reward.service';
import { Servicer } from 'app/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';

@Component({
    selector: 'redeemed-reward',
    templateUrl: 'redeemed-reward.component.html'
})
export class RedeemedRewardComponent implements OnInit {
    public pagingData = new PagingModel<RedeemedRewardModel>();
    public query = new QueryModel();
    public actions: GridAction[] = [];
    public accountGroups: { [index: string]: AccountModel[] } = {};
    public userGroups: { [index: string]: Customer[] } = {};
    public servicerGroups: { [index: string]: Servicer[] } = {};
    public rewardGroups: { [index: string]: RewardModel[] } = {};
    public visibleModal = false;
    public reward: RewardModel;
    public categories: RewardCategoryModel[] = [];
    public providers: RewardProviderModel[] = [];
    public rewards: RewardModel[] = [];

    constructor(
        private redeemedRewardService: RedeemedRewardService,
        private userService: CustomerService,
        private servicerService: ServicerService,
        private accountService: AdminService,
        private rewardService: RewardService,
        private rewardCategoryService: RewardCategoryService,
        private rewardProviderService: RewardProviderService
    ) { }

    public async ngOnInit() {
        await this.loadData();
        await this.loadProviders();
        await this.loadRewards();
        this.categories = (await this.rewardCategoryService.filter(new QueryModel({ limit: 1000 }))).data;
    }

    public async loadProviders(data: string = null) {
        const query = new QueryModel({ fields: '_id,name' });
        if (data && data.length === 8) {
            query.code = data;
        } else {
            query.name = data;
        }

        this.providers = (await this.rewardProviderService.filter(query)).data;
    }

    public async loadRewards(data: string = null) {
        const query = new QueryModel({ fields: '_id,name' });
        if (data && data.length === 8) {
            query.code = data;
        } else {
            query.name = data;
        }

        this.rewards = (await this.rewardService.filter(query)).data;
    }

    async loadData() {
        const paging = await this.redeemedRewardService.filter(this.query);
        this.pagingData = paging;

        const userIds = paging.data.filter(item => item.userType === AccountType.USER).map(item => item.userId);
        if (userIds.length > 0) {
            const userPaging = await this.userService.getCustomers(new QueryModel({ userIds: userIds.join(','), fields: 'fullName' }));
            this.userGroups = _.groupBy(userPaging.data, item => item._id);
        }

        const servicerIds = paging.data.filter(item => item.userType === AccountType.SERVICER).map(item => item.userId);
        if (servicerIds.length > 0) {
            const servicerPaging = await this.servicerService.filter(new QueryModel({ servicerIds: servicerIds.join(','), fields: 'fullName' }));
            this.servicerGroups = _.groupBy(servicerPaging.data, item => item._id);
        }

        const accountIds = paging.data.filter(item => item.userId).map(item => item.accountId);
        if (accountIds.length > 0) {
            const accountPaging = await this.accountService.getAdmins(new QueryModel({ accountIds: accountIds.join(','), fields: 'fullName' }));
            this.accountGroups = _.groupBy(accountPaging.data, item => item._id);
        }

        const rewardIds = paging.data.filter(item => item.userId).map(item => item.rewardId);
        if (rewardIds.length > 0) {
            const rewardPaging = await this.rewardService.filter(new QueryModel({ rewardIds: rewardIds.join(','), fields: 'name' }));
            this.rewardGroups = _.groupBy(rewardPaging.data, item => item._id);
        }
    }

    handleVisible(visible: boolean = false) {
        this.visibleModal = visible;
    }

    async openModifyModal(model: RewardModel = null) {
        this.reward = await this.rewardService.get(model._id);
        this.visibleModal = true;
    }
}