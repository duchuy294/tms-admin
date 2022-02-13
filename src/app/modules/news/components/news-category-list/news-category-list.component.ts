import { Component, ViewChild } from '@angular/core';
import { CreateModifyNewsCategoryComponent } from './../modals/create-modify-news-category/create-modify-news-category.component';
import { NewsCategoryGridComponent } from './../news-category-grid/news-category-grid.component';
import { NewsCategoryModel } from '../../models/news-category.model';
import { NewsCategoryService } from '../../services/news-category.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'news-category-list',
    templateUrl: './news-category-list.component.html'
})
export class NewsCategoryListComponent {
    @ViewChild('createModifyNewsCategory')
    createModifyNewsCategory: CreateModifyNewsCategoryComponent;
    @ViewChild('newsCategoryGrid') newsCategoryGrid: NewsCategoryGridComponent;
    modelQuery = new QueryModel();
    model = new NewsCategoryModel();
    loading = false;
    visibleModel = false;
    loadingModel = false;

    constructor(
        private newsCategoryService: NewsCategoryService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    async edit(categoryId) {
        this.model = await this.newsCategoryService.get(categoryId);
        this.handleVisible(true);
    }

    async search(event) {
        this.modelQuery = event;
        await this.newsCategoryGrid.loadData(this.modelQuery);
    }

    async submit($event) {
        if ($event.success) {
            this.handleVisible(false);
            this.messageService.success(
                this.translateService.instant(
                    $event.type === 'create'
                        ? 'marketing.news-category.status-create-complete'
                        : 'marketing.news-category.status-edit-complete'
                )
            );
            await this.newsCategoryGrid.loadData();
        } else {
            this.messageService.error($event.message);
        }
        this.handleLoading(false);
    }

    handleVisible(flag = true) {
        this.visibleModel = !!flag;
        if (!flag) {
            this.createModifyNewsCategory.reset();
        }
    }

    handleLoading(flag = true) {
        this.loadingModel = !!flag;
    }
}
