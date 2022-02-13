import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmailTemplateModel } from '../../models/email-template.model';
import { EmailTemplateQueryModel } from '../../models/email-template-query.model';
import { EmailTemplateService } from '../../services/email-template.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { Status } from 'app/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'email-template-grid',
    templateUrl: './email-template-grid.component.html'
})

export class EmailTemplateGridComponent implements OnInit {
    @Input()
    set model(value: EmailTemplateQueryModel) {
        this.modelQuery = value;
    }

    get model() {
        return this.modelQuery;
    }

    @Output() detail = new EventEmitter<string>();

    modelQuery = new EmailTemplateQueryModel();
    adminCreatedBy: { [_id: string]: AccountModel } = {};
    adminUpdatedBy: { [_id: string]: AccountModel } = {};
    loading: boolean = false;
    loadingStatus: boolean = false;
    statuses: { [_id: string]: boolean } = {};

    public tableData = new PagingModel<EmailTemplateModel>();

    constructor(
        private adminService: AdminService,
        private emailTemplateService: EmailTemplateService,
        private messageService: NzMessageService,
        private modalService: NzModalService,
        private translateService: TranslateService
    ) { }

    async ngOnInit() {
        this.modelQuery.status = `${Status.NEW},${Status.ACTIVE}`;
        await this.loadData();
    }

    async loadData(modelQuery: EmailTemplateQueryModel = null) {
        this.loading = true;

        if (modelQuery) {
            this.modelQuery = modelQuery;
        }
        this.tableData = await this.emailTemplateService.filter(this.modelQuery);

        const verifyQuery = this.emailTemplateService.verifyPageQueryModel(this.tableData, this.modelQuery);
        if (verifyQuery.error) {
            this.modelQuery = verifyQuery.modelQuery;
            this.tableData = await this.emailTemplateService.filter(this.modelQuery);
        }

        const createdBy = await this.getAdmins(this.tableData, 'createdBy');
        _.forEach(createdBy, admin => {
            this.adminCreatedBy[admin._id] = admin;
        });

        const updatedBy = await this.getAdmins(this.tableData, 'updatedBy');
        _.forEach(updatedBy, admin => {
            this.adminUpdatedBy[admin._id] = admin;
        });

        _.forEach(this.tableData.data, emailTemplate => {
            this.statuses[emailTemplate._id] = (emailTemplate.status === Status.ACTIVE);
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

    edit(emailTemplateId: string = null) {
        this.detail.emit(emailTemplateId);
    }

    delete(emailTemplateId: string = null) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.deleteConfirm(emailTemplateId),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async deleteConfirm(emailTemplateId: string = null) {
        const response = await this.emailTemplateService.delete(emailTemplateId);
        if (response) {
            this.messageService.success(this.translateService.instant('email.template.status-delete-complete'));
            await this.loadData();
        } else {
            this.messageService.error(this.translateService.instant('email.template.status-delete-fail'));
        }
    }

    async getAdmins(data: PagingModel<EmailTemplateModel>, field: string = '') {
        const accountIds = _.map(data.data, email => email[field]).join(',');
        const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: this.modelQuery.limit, accountIds }));
        return adminPaging.data;
    }

    activate(emailTemplateId: string = null, active = false) {
        let response = true;
        this.modalService.confirm({
            nzTitle: this.translateService.instant(active ? 'common.confirmActivate' : 'common.confirmDeactivate'),
            nzOnOk: () => this.activateConfirm(emailTemplateId, active),
            nzOnCancel: () => { response = false; },
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('button.confirm')
        });
        return response;
    }

    async activateConfirm(emailTemplateId: string = null, active = false) {
        const response = await this.emailTemplateService.activate({ _id: emailTemplateId, active });
        if (response) {
            this.messageService.success(this.translateService.instant(`email.template.status-${(active) ? 'activate-complete' : 'deactivate-complete'}`));
            await this.loadData();
        } else {
            this.messageService.error(this.translateService.instant(`email.template.status-${(active) ? 'activate-fail' : 'deactivate-fail'}`));
        }
    }

    onChangeStatus(emailTemplate = new EmailTemplateModel()) {
        this.loadingStatus = true;
        this.activate(emailTemplate._id, !this.statuses[emailTemplate._id]);
        this.loadingStatus = false;
    }
}