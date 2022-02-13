import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Customer } from './../../../customer/models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { HookLinkModel } from './../../models/hook-link.model';
import { HookLinkQueryModel } from './../../models/hook-link-query.model';
import { HookLinkService } from '@/modules/hook/services/hook-link.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { Servicer } from '@/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'hook-link-grid',
    templateUrl: './hook-link-grid.component.html'
})

export class HookLinkGridComponent implements OnInit {
    @Input()
    set model(value: HookLinkQueryModel) {
        this.modelQuery = value;
    }

    get model() {
        return this.modelQuery;
    }

    @Output() detail = new EventEmitter<string>();

    modelQuery = new HookLinkQueryModel();
    loading: boolean = false;
    users: { [_id: string]: Customer } = {};
    servicers: { [_id: string]: Servicer } = {};

    public tableData = new PagingModel<HookLinkModel>();

    constructor(
        private messageService: NzMessageService,
        private hookLinkService: HookLinkService,
        private translateService: TranslateService,
        private modalService: NzModalService,
        private customerService: CustomerService,
        private servicerService: ServicerService
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData(modelQuery: HookLinkQueryModel = null) {
        this.loading = true;

        if (modelQuery) {
            this.modelQuery = modelQuery;
        }
        this.tableData = await this.hookLinkService.filter(this.modelQuery);

        const verifyQuery = this.hookLinkService.verifyPageQueryModel(this.tableData, this.modelQuery);
        if (verifyQuery.error) {
            this.modelQuery = verifyQuery.modelQuery;
            this.tableData = await this.hookLinkService.filter(this.modelQuery);
        }

        const users = await this.getUsers(this.tableData);
        _.forEach(users, (user) => {
            this.users[user._id] = user;
        });

        const servicers = await this.getServicers(this.tableData);
        _.forEach(servicers, (servicer) => {
            this.servicers[servicer._id] = servicer;
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

    edit(hookLinkId: string) {
        this.detail.emit(hookLinkId);
    }

    delete(hookLinkId: string = null) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.deleteConfirm(hookLinkId),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async deleteConfirm(hookLinkId: string = null) {
        const response = await this.hookLinkService.delete(hookLinkId);
        if (response) {
            this.messageService.success(this.translateService.instant('hook.link-status.delete-complete'));
            await this.loadData();
        } else {
            this.messageService.error(this.translateService.instant('hook.link-status.delete-fail'));
        }
    }

    async getUsers(data: PagingModel<HookLinkModel>) {
        const userIds = _.map(data.data, link => link.userId).join(',');
        const userPaging = await this.customerService.getCustomers(new QueryModel({ limit: this.modelQuery.limit, userIds }));
        return userPaging.data;
    }

    async getServicers(data: PagingModel<HookLinkModel>) {
        const servicerIds = _.map(data.data, link => link.servicerId).join(',');
        const servicerPaging = await this.servicerService.getServicers(new QueryModel({ limit: this.modelQuery.limit, servicerIds }));
        return servicerPaging.data;
    }

}