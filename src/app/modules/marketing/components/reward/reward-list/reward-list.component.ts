import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter } from '@angular/core';
import { GridAction } from 'app/models/grid-action.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OnInit, Output } from '@angular/core';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { RewardCategoryModel } from 'app/modules/marketing/models/reward-category.model';
import { RewardCategoryService } from 'app/modules/marketing/services/reward-category.service';
import { RewardModel } from 'app/modules/marketing/models/reward.model';
import { RewardProviderModel } from 'app/modules/marketing/models/reward-provider.model';
import { RewardProviderService } from 'app/modules/marketing/services/reward-provider.service';
import { RewardService } from 'app/modules/marketing/services/reward.service';
import { Status } from '@/constants/status.enum';

@Component({
    selector: 'reward-list',
    templateUrl: 'reward-list.component.html'
})
export class RewardListComponent implements OnInit {
    @Output() afterSendReward: EventEmitter<any> = new EventEmitter();
    public rewardPaging = new PagingModel<RewardModel>();
    public query = new QueryModel();
    public actions = [
        new GridAction({ name: 'button.edit', perform: this.openModifyModal.bind(this), visible: this.showModify.bind(this) }),
        new GridAction({ name: 'button.send-gift', perform: this.sendReward.bind(this), visible: this.showGift.bind(this) }),
        new GridAction({ name: 'button.remove', perform: this.removeReward.bind(this), visible: this.showRemove.bind(this) })];
    public currentModel: RewardModel;
    searchValue: string = '';
    visibleModal = false;
    sendRewardModalVisible: boolean = false;
    providers: RewardProviderModel[] = [];
    categories: RewardCategoryModel[] = [];
    adminUpdatedBy: { [_id: string]: AccountModel } = {};
    rewardToSend: RewardModel = null;

    constructor(
        private adminService: AdminService,
        public rewardService: RewardService,
        private rewardCategoryService: RewardCategoryService,
        private rewardProviderService: RewardProviderService,
        private messageService: NzMessageService) { }

    public async ngOnInit() {
        await this.loadData();
        await this.loadProviders();
        this.categories = (await this.rewardCategoryService.filter(new QueryModel({ fields: '_id,name', limit: 1000 }))).data;
    }

    async getAdmins(data: PagingModel<RewardModel>, field: string = '') {
        const accountIds = _.map(data.data, response => response[field]).join(',');
        const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: 1000, accountIds }));
        return adminPaging.data;
    }

    public async loadData() {
        this.rewardPaging = await this.rewardService.filter(this.query);
        const updatedBy = await this.getAdmins(this.rewardPaging, 'createdBy');
        _.forEach(updatedBy, admin => {
            this.adminUpdatedBy[admin._id] = admin;
        });

    }

    handleVisible(visible: boolean) {
        this.visibleModal = visible;
    }

    handleSendRewardModalVisible(flag = true) {
        this.sendRewardModalVisible = !!flag;
    }

    openModifyModal(model = null) {
        this.currentModel = model ? _.cloneDeep(model) : new RewardModel();
        this.visibleModal = true;
    }

    async removeReward(reward: RewardModel) {
        reward.status = Status.DELETED;
        const response = await this.rewardService.update(reward);
        if (response.errorCode || (response.status && response.status !== 200)) {
            this.messageService.error(CommonHelper.errorMessage(response, 'Có lỗi khi  xoá đổi thưởng'));
        } else {
            this.messageService.success('Xoá đổi thưởng thành công');
            await this.loadData();
        }
    }

    async sendReward(reward: RewardModel) {
        this.handleSendRewardModalVisible();
        this.rewardToSend = reward;
    }

    async rewardChange() {
        await this.loadData();
    }

    async loadProviders(data: string = null) {
        const query = new QueryModel({ fields: '_id,name' });
        if (data && data.length === 8) {
            query.code = data;
        } else {
            query.name = data;
        }

        this.providers = (await this.rewardProviderService.filter(query)).data;
    }

    handleAfterSendReward() {
        this.afterSendReward.emit();
    }

    showModify(reward) {
        return !!reward;
    }

    showGift(reward) {
        return (reward.status === Status.ACTIVE);
    }

    showRemove(reward) {
        return (reward.status !== Status.DELETED);
    }
}