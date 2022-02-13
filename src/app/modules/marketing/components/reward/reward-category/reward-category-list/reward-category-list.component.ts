import * as _ from 'lodash';
import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryModel } from 'app/models/query.model';
import { RewardCategoryFilterComponent } from './../reward-category-filter/reward-category-filter.component';
import { RewardCategoryGridComponent } from './../reward-category-grid/reward-category-grid.component';
import { RewardCategoryModel } from 'app/modules/marketing/models/reward-category.model';
import { RewardCategoryService } from 'app/modules/marketing/services/reward-category.service';
import { Status } from 'app/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'reward-category-list',
    templateUrl: 'reward-category-list.component.html'
})
export class RewardCategoryListComponent {
    public displayFilter: boolean = false;
    @ViewChild('rewardCategoryFilter')
    rewardCategoryFilter: RewardCategoryFilterComponent;
    @ViewChild('rewardCategoryGrid')
    rewardCategoryGrid: RewardCategoryGridComponent;
    createModifyModalVisible = false;
    modifyingModel = new RewardCategoryModel();
    model: RewardCategoryModel;
    rewardQuery: QueryModel;
    visibleModal = false;

    constructor(
        public rewarCategorydService: RewardCategoryService,
        private messageService: NzMessageService,
        public translateService: TranslateService,
        public modalService: NzModalService) { }

    async search(query: QueryModel) {
        this.rewardCategoryGrid.loadData(query);
    }

    confirmDelete(model: RewardCategoryModel) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.delete(model),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async delete(model: RewardCategoryModel) {
        model = _.cloneDeep(model);
        model.status = Status.DELETED;
        const response = await this.rewarCategorydService.update(model);

        if (response.errorCode === 0) {
            this.messageService.success(
                this.translateService.instant('common.sucessful-delete')
            );
            await this.rewardCategoryGrid.loadData();
        } else {
            this.messageService.error(
                this.translateService.instant('common.unsucessful-delete')
            );
        }
    }

    handleModelVisible(flag = true) {
        this.createModifyModalVisible = !!flag;
    }

    handleAfterSubmit(loading = false) {
        if (!loading) {
            this.rewardCategoryGrid.loadData();
        } else {
            const queryModal = new QueryModel();
            this.rewardCategoryGrid.loadData(queryModal);
            this.rewardCategoryFilter.reset();
        }
    }
    create() {
        this.modifyingModel = null;
        this.handleModelVisible(true);
    }

    viewRewardModal(category: RewardCategoryModel) {
        this.rewardQuery = new QueryModel({ rewardCatIds: category._id });
        this.model = category;
        this.visibleModal = true;
    }

    handleVisible(flag) {
        this.visibleModal = flag;
    }

    async editModal(id: string = null) {
        this.modifyingModel = await this.rewarCategorydService.get(id);
        this.handleModelVisible(true);
    }
}