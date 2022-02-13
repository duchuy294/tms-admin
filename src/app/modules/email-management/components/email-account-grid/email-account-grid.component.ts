import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmailAccountModel } from '../../models/email-account.model';
import { EmailAccountQueryModel } from '../../models/email-account-query.model';
import { EmailAccountService } from '../../services/email-account.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'email-account-grid',
    templateUrl: './email-account-grid.component.html'
})

export class EmailAccountGridComponent implements OnInit {
    @Input()
    set model(value: EmailAccountQueryModel) {
        this.modelQuery = value;
    }

    get model() {
        return this.modelQuery;
    }

    @Output() detail = new EventEmitter<string>();

    @Output() password = new EventEmitter<string>();

    modelQuery = new EmailAccountQueryModel();
    adminCreatedBy: { [_id: string]: AccountModel } = {};
    adminUpdatedBy: { [_id: string]: AccountModel } = {};
    loading: boolean = false;
    loadingStatus: boolean = false;
    statuses: { [_id: string]: boolean } = {};

    public tableData = new PagingModel<EmailAccountModel>();

    constructor(
        private messageService: NzMessageService,
        private emailAccountService: EmailAccountService,
        private translateService: TranslateService,
        private modalService: NzModalService,
        private adminService: AdminService
    ) { }

    async ngOnInit() {
        this.modelQuery.status = `${Status.NEW},${Status.ACTIVE}`;
        await this.loadData();
    }

    async loadData(modelQuery: EmailAccountQueryModel = null) {
        this.loading = true;

        if (modelQuery) {
            this.modelQuery = modelQuery;
        }
        this.tableData = await this.emailAccountService.filter(this.modelQuery);

        const verifyQuery = this.emailAccountService.verifyPageQueryModel(this.tableData, this.modelQuery);
        if (verifyQuery.error) {
            this.modelQuery = verifyQuery.modelQuery;
            this.tableData = await this.emailAccountService.filter(this.modelQuery);
        }

        const createdBy = await this.getAdmins(this.tableData, 'createdBy');
        _.forEach(createdBy, admin => {
            this.adminCreatedBy[admin._id] = admin;
        });

        const updatedBy = await this.getAdmins(this.tableData, 'updatedBy');
        _.forEach(updatedBy, admin => {
            this.adminUpdatedBy[admin._id] = admin;
        });

        _.forEach(this.tableData.data, emailAccount => {
            this.statuses[emailAccount._id] = (emailAccount.status === Status.ACTIVE);
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

    edit(emailAccountId: string) {
        this.detail.emit(emailAccountId);
    }

    changePassword(emailAccountId: string) {
        this.password.emit(emailAccountId);
    }

    delete(emailAccountId: string = null) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.deleteConfirm(emailAccountId),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async deleteConfirm(emailAccountId: string = null) {
        const response = await this.emailAccountService.delete(emailAccountId);
        if (response) {
            this.messageService.success(this.translateService.instant('email.account.status-delete-complete'));
            await this.loadData();
        } else {
            this.messageService.error(this.translateService.instant('email.account.status-delete-fail'));
        }
    }

    async getAdmins(data: PagingModel<EmailAccountModel>, field: string = '') {
        const accountIds = _.map(data.data, email => email[field]).join(',');
        const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: this.modelQuery.limit, accountIds }));
        return adminPaging.data;
    }

    activate(emailAccountId: string = null, active = false) {
        let response = true;
        this.modalService.confirm({
            nzTitle: this.translateService.instant(active ? 'common.confirmActivate' : 'common.confirmDeactivate'),
            nzOnOk: () => this.activateConfirm(emailAccountId, active),
            nzOnCancel: () => { response = false; },
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('button.confirm')
        });
        return response;
    }

    async activateConfirm(emailAccountId: string = null, active = false) {
        const response = await this.emailAccountService.activate({ _id: emailAccountId, active });
        if (response) {
            this.messageService.success(this.translateService.instant(`email.account.status-${(active) ? 'activate-complete' : 'deactivate-complete'}`));
            await this.loadData();
        } else {
            this.messageService.error(this.translateService.instant(`email.account.status-${(active) ? 'activate-fail' : 'deactivate-fail'}`));
        }
    }

    onChangeStatus(emailAccount = new EmailAccountModel()) {
        this.loadingStatus = true;
        this.activate(emailAccount._id, !this.statuses[emailAccount._id]);
        this.loadingStatus = false;
    }
}