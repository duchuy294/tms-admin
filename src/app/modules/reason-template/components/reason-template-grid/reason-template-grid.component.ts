import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ReasonTemplateModel } from '../../models/reason-template.model';
import { ReasonTemplateService } from '../../services/reason-template.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'reason-template-grid',
    templateUrl: './reason-template-grid.component.html'
})

export class ReasonTemplateGridComponent implements OnInit {
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

    public tableData = new PagingModel<ReasonTemplateModel>();

    constructor(
        private reasonTemplateService: ReasonTemplateService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private modalService: NzModalService
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        if (!this.modelQuery.page) {
            this.modelQuery.page = 1;
        }
        this.tableData = await this.reasonTemplateService.filter(this.modelQuery);

        const verifyQuery = this.reasonTemplateService.verifyPageQueryModel(this.tableData, this.modelQuery);
        if (verifyQuery.error) {
            this.modelQuery = verifyQuery.modelQuery;
            this.tableData = await this.reasonTemplateService.filter(this.modelQuery);
        }

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

    edit(reasonTemplateId: string) {
        this.detail.emit(reasonTemplateId);
    }

    delete(reasonTemplateId) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.deleteConfirm(reasonTemplateId),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async deleteConfirm(reasonTemplateId) {
        const response = await this.reasonTemplateService.delete(reasonTemplateId);
        if (response) {
            this.messageService.success(this.translateService.instant('settings.reason-template-status.delete-complete'));
            await this.loadData();
        } else {
            this.messageService.error(this.translateService.instant('settings.reason-template-status.delete-fail'));
        }
    }

    reset() {
        this.modelQuery = new QueryModel();
    }
}