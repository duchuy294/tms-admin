import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HookTypeModel } from './../../models/hook-type.model';
import { HookTypeQueryModel } from '../../models/hook-type-query.model';
import { HookTypeService } from './../../services/hook-type.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'hook-type-grid',
    templateUrl: './hook-type-grid.component.html'
})

export class HookTypeGridComponent implements OnInit {
    @Input()
    set model(value: HookTypeQueryModel) {
        this.modelQuery = value;
    }

    get model() {
        return this.modelQuery;
    }

    @Output() detail = new EventEmitter<string>();

    modelQuery = new HookTypeQueryModel();
    loading: boolean = false;
    loadingStatus: boolean = false;
    statuses: { [_id: string]: boolean } = {};

    public tableData = new PagingModel<HookTypeModel>();

    constructor(
        private messageService: NzMessageService,
        private hookTypeService: HookTypeService,
        private translateService: TranslateService,
        private modalService: NzModalService
    ) { }

    async ngOnInit() {
        this.modelQuery.status = `${Status.NEW},${Status.ACTIVE}`;
        await this.loadData();
    }

    async loadData(modelQuery: HookTypeQueryModel = null) {
        this.loading = true;

        if (modelQuery) {
            this.modelQuery = modelQuery;
        }
        this.tableData = await this.hookTypeService.filter(this.modelQuery);

        const verifyQuery = this.hookTypeService.verifyPageQueryModel(this.tableData, this.modelQuery);
        if (verifyQuery.error) {
            this.modelQuery = verifyQuery.modelQuery;
            this.tableData = await this.hookTypeService.filter(this.modelQuery);
        }

        _.forEach(this.tableData.data, hookType => {
            this.statuses[hookType._id] = (hookType.status === Status.ACTIVE);
        });

        this.loading = false;
    }

    async loadDataByPage(event = 1) {
        this.modelQuery.page = event;
        await this.loadData();
    }

    async loadDataByPageSize(event = 20) {
        this.modelQuery.limit = event;
        await this.loadData();
    }

    edit(hookTypeId: string) {
        this.detail.emit(hookTypeId);
    }

    delete(hookTypeId: string = null) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.deleteConfirm(hookTypeId),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async deleteConfirm(hookTypeId: string = null) {
        const response = await this.hookTypeService.delete(hookTypeId);
        if (response) {
            this.messageService.success(this.translateService.instant('hook.hook-type-status.delete-complete'));
            await this.loadData();
        } else {
            this.messageService.error(this.translateService.instant('hook.hook-type-status.delete-fail'));
        }
    }

    activate(hookTypeId: string = null, active = false) {
        let response = true;
        this.modalService.confirm({
            nzTitle: this.translateService.instant(active ? 'common.confirmActivate' : 'common.confirmDeactivate'),
            nzOnOk: () => this.activateConfirm(hookTypeId, active),
            nzOnCancel: () => { response = false; },
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('button.confirm')
        });
        return response;
    }

    async activateConfirm(hookTypeId: string = null, active = false) {
        const response = await this.hookTypeService.activate({ _id: hookTypeId, active });
        if (response) {
            this.messageService.success(this.translateService.instant(`hook.hook-type-status.${(active) ? 'activate-complete' : 'deactivate-complete'}`));
            await this.loadData();
        } else {
            this.messageService.error(this.translateService.instant(`hook.hook-type-status.${(active) ? 'activate-fail' : 'deactivate-fail'}`));
        }
    }

    onChangeStatus(hookType = new HookTypeModel()) {
        this.loadingStatus = true;
        this.activate(hookType._id, !this.statuses[hookType._id]);
        this.loadingStatus = false;
    }
}