import * as _ from 'lodash';
import { AdminService } from '@/modules/admin/services/admin.service';
import { Component, Input, OnInit } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { SessionCodListModel } from '@/modules/finance/models/session-code-list.model';
import { SessionCodService } from '@/modules/finance/services/session-cod.service';
import { SessionCodStatusEnum, SessionCodStatusColor } from '@/modules/finance/const/SessionCodStatusEnum';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { ReportService } from '@/modules/report/services/report.service';
@Component({
    selector: 'session-cod-gird',
    templateUrl: './session-cod-gird.component.html',
})
export class SessionCodGridComponent implements OnInit {
    public tableData = new PagingModel<SessionCodListModel>();
    accountGroups = {};
    orderId: { [id: string]: string } = {};
    userGroups = {};
    transferredBy = {};
    @Input() queryModel: QueryModel = new QueryModel({ status: null });
    loadingGrid: boolean = false;
    statusColor = SessionCodStatusColor;
    confirmModal?: NzModalRef;
    sessionCodStatus = SessionCodStatusEnum;
    constructor(
        private adminService: AdminService,
        private customerService: CustomerService,
        private sessionCodService: SessionCodService,
        private modal: NzModalService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private reportService: ReportService
    ) { }

    async _loadMetaData() {
        const accountIds = [];
        const userIds = [];
        const transferredBy = [];
        _.forEach(this.tableData.data, (item) => {
            accountIds.push(item.createdBy);
            userIds.push(item.userId);
            transferredBy.push(item.transferredBy);
        });
        if (_.uniq(userIds).length > 0) {
            this.userGroups = _.groupBy((await this.customerService.getCustomers(new QueryModel({ limit: 1000, userIds: _.uniq(userIds).join(',') }))).data, x => x._id);
        }

        if (_.uniq(accountIds).length > 0) {
            this.accountGroups = _.groupBy((await this.adminService.getAdmins(new QueryModel({ limit: 1000, accountIds: _.uniq(accountIds).join(',') }))).data, x => x._id);
        }

        if (_.uniq(transferredBy).length > 0) {
            this.transferredBy = _.groupBy((await this.adminService.getAdmins(new QueryModel({ limit: 1000, accountIds: _.uniq(transferredBy).join(',') }))).data, x => x._id);
        }
    }

    async ngOnInit() {
        await this.loadData();
    }

    async triggerLoadData(queryModel: QueryModel, pageIndex?) {
        await this.loadData(queryModel, pageIndex);
    }

    async exPortData() {
        await this.reportService.exportSession(this.queryModel);
    }

    async loadData(query: QueryModel = null, page = 1) {
        if (query) {
            this.queryModel = new QueryModel(query);
        }
        if (page) {
            this.queryModel.page = page;
        }
        this.loadingGrid = true;

        this.tableData = await this.sessionCodService.filter(this.queryModel);
        this._loadMetaData();

        this.loadingGrid = false;
    }

    async loadDataByPage($event = 1) {
        await this.loadData(null, $event);
    }

    async loadDataByPageSize($event = 20) {
        this.queryModel.limit = $event;
        await this.loadData(null, 1);
    }

    async showDeleteConfirm(code: string) {
        const _this = this;
        this.modal.create({
            nzTitle: _this.translateService.instant(`finance.session-cod.delete`),
            nzContent: _this.translateService.instant(`finance.session-cod.delete-content`),
            nzFooter: [
                {
                    label: _this.translateService.instant(`button.confirm`),
                    type: 'primary',
                    loading: false,
                    async onClick() {
                        this.loading = true;
                        const response = await _this.sessionCodService.delete(code);
                        if (response.errorCode === 0) {
                            _this.modal.closeAll();
                            _this.messageService.success(`${_this.translateService.instant(`finance.session-cod.delete`)} ${_this.translateService.instant('common.successfully').toLowerCase()}`);
                            await _this.loadData();
                        } else {
                            _this.messageService.error(response.message);
                        }
                        this.loading = false;
                    },
                },
                {
                    label: _this.translateService.instant(`button.no`),
                    onClick: () => this.modal.closeAll()
                },
            ]
        });
    }

}
