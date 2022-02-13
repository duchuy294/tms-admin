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
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { SmsTemplateModel } from '../../models/sms-template.model';
import { SmsTemplateQueryModel } from '../../models/sms-template-query.model';
import { SmsTemplateService } from '../../services/sms-template.service';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'sms-template-grid',
    templateUrl: './sms-template-grid.component.html'
})

export class SmsTemplateGridComponent implements OnInit {
    @Input()
    set model(value: SmsTemplateQueryModel) {
        this.modelQuery = value;
    }

    get model() {
        return this.modelQuery;
    }

    @Output() detail = new EventEmitter<string>();
    adminCreatedBy: { [_id: string]: AccountModel } = {};
    adminUpdatedBy: { [_id: string]: AccountModel } = {};
    loading: boolean = false;
    loadingStatus: boolean = false;
    modelQuery = new SmsTemplateQueryModel();
    public tableData = new PagingModel<SmsTemplateModel>();
    statuses: { [_id: string]: boolean } = {};

    constructor(
        private messageService: NzMessageService,
        private smsTemplateService: SmsTemplateService,
        private translateService: TranslateService,
        private modalService: NzModalService,
        private adminService: AdminService
    ) { }

    async ngOnInit() {
        this.modelQuery.status = `${Status.NEW},${Status.ACTIVE}`;
        await this.loadData();
    }

    async loadData(modelQuery: QueryModel = null) {
        this.loading = true;

        if (modelQuery) {
            this.modelQuery = modelQuery;
        }

        this.tableData = await this.smsTemplateService.filter(this.modelQuery);

        const verifyQuery = this.smsTemplateService.verifyPageQueryModel(this.tableData, this.modelQuery);
        if (verifyQuery.error) {
            this.modelQuery = verifyQuery.modelQuery;
            this.tableData = await this.smsTemplateService.filter(this.modelQuery);
        }

        const createdBy = await this.getAdmins(this.tableData, 'createdBy');
        _.forEach(createdBy, admin => {
            this.adminCreatedBy[admin._id] = admin;
        });

        const updatedBy = await this.getAdmins(this.tableData, 'updatedBy');
        _.forEach(updatedBy, admin => {
            this.adminUpdatedBy[admin._id] = admin;
        });

        _.forEach(this.tableData.data, smsTemplate => {
            this.statuses[smsTemplate._id] = (smsTemplate.status === Status.ACTIVE);
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

    edit(smsTemplateId: string) {
        this.detail.emit(smsTemplateId);
    }

    delete(smsTemplateId) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.deleteConfirm(smsTemplateId),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async deleteConfirm(smsTemplateId) {
        const response = await this.smsTemplateService.delete(smsTemplateId);
        if (response) {
            this.messageService.success(this.translateService.instant('telecom.sms-template.status.delete-complete'));
            await this.loadData();
        } else {
            this.messageService.error(this.translateService.instant('telecom.sms-template.status.delete-fail'));
        }
    }

    async getAdmins(data: PagingModel<SmsTemplateModel>, field: string = '') {
        const accountIds = _.map(data.data, email => email[field]).join(',');
        const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: this.modelQuery.limit, accountIds }));
        return adminPaging.data;
    }

    activate(smsTemplateId, active = false) {
        let response = true;
        this.modalService.confirm({
            nzTitle: this.translateService.instant(active ? 'common.confirmActivate' : 'common.confirmDeactivate'),
            nzOnOk: () => this.activateConfirm(smsTemplateId, active),
            nzOnCancel: () => { response = false; },
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('button.confirm')
        });
        return response;
    }

    async activateConfirm(smsTemplateId, active) {
        const response = await this.smsTemplateService.activate({ _id: smsTemplateId, active });
        if (response) {
            this.messageService.success(this.translateService.instant(`telecom.sms-template.status.${(active) ? 'activate-complete' : 'deactivate-complete'}`));
            await this.loadData();
        } else {
            this.messageService.error(this.translateService.instant(`telecom.sms-template.status.${(active) ? 'activate-fail' : 'deactivate-fail'}`));
        }
    }

    onChangeStatus(smsTemplate) {
        this.loadingStatus = true;
        this.activate(smsTemplate._id, !this.statuses[smsTemplate._id]);
        this.loadingStatus = false;
    }
}