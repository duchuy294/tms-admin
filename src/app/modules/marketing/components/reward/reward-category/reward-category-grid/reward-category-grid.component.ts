import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PagingModel } from './../../../../../utility/components/paging/paging.model';
import { QueryModel } from './../../../../../../models/query.model';
import { RewardCategoryModel } from 'app/modules/marketing/models/reward-category.model';
import { RewardCategoryService } from './../../../../services/reward-category.service';

@Component({
    selector: 'reward-category-grid',
    templateUrl: 'reward-category-grid.component.html'
})
export class RewardCategoryGridComponent implements OnInit {
    queryModel = new QueryModel({ status: null });
    loadingGrid = false;
    model = new PagingModel<RewardCategoryModel>();
    @Output() delete = new EventEmitter<RewardCategoryModel>();
    @Output() view = new EventEmitter<RewardCategoryModel>();
    @Output() edit = new EventEmitter<string>();

    constructor(
        public rewarCategoryService: RewardCategoryService,
    ) { }

    async ngOnInit() {
        this.loadData();
    }

    async loadData(queryModel: QueryModel = null) {
        if (queryModel) {
            this.queryModel = queryModel;
        }
        this.loadingGrid = true;
        this.model = await this.rewarCategoryService.filter(this.queryModel);
        this.loadingGrid = false;
    }

    async loadDataByPage($event: number = 1) {
        this.queryModel.page = $event;
        await this.loadData();
    }

    async loadDataByPageSize($event: number = 1) {
        this.queryModel.limit = $event;
        this.queryModel.page = 1;
        await this.loadData();
    }

    handleDelete(model: RewardCategoryModel = null) {
        this.delete.emit(model);
    }

    handleView(model: RewardCategoryModel = null) {
        this.view.emit(model);
    }

    handleEdit(id: string = null) {
        this.edit.emit(id);
    }
}