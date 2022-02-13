import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output
    } from '@angular/core';
import { DateTimeService } from 'app/modules/utility/services/datetime.service';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';
import { RewardCategoryModel } from 'app/modules/marketing/models/reward-category.model';
import { RewardCategoryService } from 'app/modules/marketing/services/reward-category.service';
import { RewardModel } from 'app/modules/marketing/models/reward.model';
import { RewardProviderModel } from 'app/modules/marketing/models/reward-provider.model';
import { RewardProviderService } from 'app/modules/marketing/services/reward-provider.service';
import { RewardService } from 'app/modules/marketing/services/reward.service';

@Component({
    selector: 'reward-modal',
    templateUrl: 'reward-modal.component.html'
})
export class RewardModalComponent implements OnChanges {
    private _query: QueryModel;
    @Input() visibleModal = false;
    @Input() provider: RewardProviderModel;
    @Input() category: RewardCategoryModel;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Input() set query(value: QueryModel) {
        this._query = value;
    }
    rewardPaging = new PagingModel<RewardModel>();
    providers: RewardProviderModel[] = [];
    categories: RewardCategoryModel[] = [];
    get query() {
        return this._query ? this._query : new QueryModel();
    }

    constructor(
        private rewardService: RewardService,
        private rewardCategoryService: RewardCategoryService,
        private rewardProviderService: RewardProviderService
    ) { }

    async ngOnChanges() {
        await this.loadData();
        await this.loadProviders();
        this.categories = (await this.rewardCategoryService.filter(new QueryModel({ fields: '_id,name', limit: 1000 }))).data;
    }

    async loadData() {
        if (this._query) {
            this.rewardPaging = await this.rewardService.filter(this.query);
        }
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

    handleVisibleModal(flag) {
        this.handleVisible.emit(flag);
    }

    onChangeStartDate(date: Date) {
        this.query.startTime = DateTimeService.convertDateToTimestamp(date);
    }

    onChangeEndDate(date) {
        this.query.endTime = DateTimeService.convertDateToTimestamp(date, true);
    }
}