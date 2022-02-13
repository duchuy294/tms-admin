import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { NewsCategoryModel } from '../../models/news-category.model';
import { NewsCategoryService } from '../../services/news-category.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'news-category-grid',
    templateUrl: './news-category-grid.component.html'
})

export class NewsCategoryGridComponent implements OnInit {
    @Input()
    set model(value: QueryModel) {
        this.modelQuery = value;
    }

    get model() {
        return this.modelQuery;
    }

    @Output() detail = new EventEmitter<string>();

    modelQuery = new QueryModel();
    loading: boolean = false;
    loadingStatus: boolean = false;
    updatedBy: { [_id: string]: AccountModel } = {};

    public tableData = new PagingModel<NewsCategoryModel>();

    constructor(
        private messageService: NzMessageService,
        private newsCategoryService: NewsCategoryService,
        private translateService: TranslateService,
        private modalService: NzModalService,
        private adminService: AdminService
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData(modelQuery: QueryModel = null) {
        this.loading = true;

        if (modelQuery) {
            this.modelQuery = modelQuery;
        }

        this.tableData = await this.newsCategoryService.filter(this.modelQuery);

        const verifyQuery = this.newsCategoryService.verifyPageQueryModel(this.tableData, this.modelQuery);
        if (verifyQuery.error) {
            this.modelQuery = verifyQuery.modelQuery;
            this.tableData = await this.newsCategoryService.filter(this.modelQuery);
        }

        const updatedBy = await this.getAdmins(this.tableData);
        _.forEach(updatedBy, admin => {
            this.updatedBy[admin._id] = admin;
        });

        this.loading = false;
    }

    async loadDataByPage(event) {
        this.modelQuery.page = event;
        await this.loadData();
    }

    async loadDataByPageSize(event) {
        this.modelQuery.limit = event;
        await this.loadData();
    }

    edit(categoryId: string) {
        this.detail.emit(categoryId);
    }


    activate(category, active = false) {
        let response = true;
        this.modalService.confirm({
            nzTitle: this.translateService.instant(active ? 'common.confirmActivate' : 'common.confirmDeactivate'),
            nzOnOk: () => this.activateConfirm(category, active),
            nzOnCancel: () => { response = false; },
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('button.confirm')
        });
        return response;
    }

    async activateConfirm(category, active) {
        category.status = active;
        const response = await this.newsCategoryService.update(category);
        if (response) {
            this.messageService.success(this.translateService.instant(`marketing.news-category.status-${(active) ? 'activate-complete' : 'deactivate-complete'}`));
            await this.loadData();
        } else {
            category.status = !category.status;
            this.messageService.error(this.translateService.instant(`marketing.news-category.status-${(active) ? 'activate-fail' : 'deactivate-fail'}`));
        }
    }

    onChangeStatus(category) {
        this.loadingStatus = true;
        this.activate(category, !category.status);
        this.loadingStatus = false;
    }

    async getAdmins(data: PagingModel<NewsCategoryModel>) {
        const accountIds = _.map(data.data, category => category['updatedBy']).join(',');
        const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: this.modelQuery.limit, accountIds }));
        return adminPaging.data;
    }
}