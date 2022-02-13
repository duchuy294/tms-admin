import * as _ from 'lodash';
import { AdminService } from '@/modules/admin/services/admin.service';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { SessionCodListModel } from '@/modules/finance/models/session-code-list.model';
import { SessionCodService } from '@/modules/finance/services/session-cod.service';
import { SessionCodStatusEnum, SessionCodStatusColor } from '@/modules/finance/const/SessionCodStatusEnum';
import { OrderService } from '@/modules/order/services/order.service';
import { OrderModel } from '@/modules/order/models/order.model';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { Profile } from '@/modules/profile/models/profile.model';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { ReportService } from '@/modules/report/services/report.service';

@Component({
    selector: 'session-cod-gird',
    templateUrl: './session-cod-detail.component.html',
    styleUrls: ['session-cod-detail.component.less']

})
export class SessionCodDetailComponent implements OnInit {
    public tableData = new PagingModel<OrderModel>();
    public model = new SessionCodListModel();
    customer: Customer;
    createdBy: Profile;
    transferredBy: Profile;
    loading: boolean = false;
    public statuses: SessionCodStatusEnum[] = [
        SessionCodStatusEnum.NOTDELIVERED,
        SessionCodStatusEnum.DELIVERED,
    ];
    statusColor = SessionCodStatusColor;
    sessionCodId = this.route.snapshot.paramMap.get('id');
    flagExpanding: { [id: string]: boolean } = {};
    confirm: boolean = false;
    orderQueryModel: QueryModel = new QueryModel({ limit: 20, fields: 'code,_id,cod,createdAt,finishedAt,externalCode' });
    constructor(
        private adminService: AdminService,
        private customerService: CustomerService,
        private sessionCodService: SessionCodService,
        private orderService: OrderService,
        private route: ActivatedRoute,
        private modal: NzModalService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private reportService: ReportService

    ) { }

    async _loadMetaData() {
        this.model = await this.sessionCodService.get(this.sessionCodId);
        if (this.model.createdBy) {
            this.createdBy = await this.adminService.getAdmin(this.model.createdBy);
        }

        if (this.model.transferredBy) {
            this.transferredBy = await this.adminService.getAdmin(this.model.transferredBy);
        }

        if (this.model.userId) {
            this.customer = await this.customerService.getCustomer(this.model.userId);
        }
        if (this.model.orders && this.model.orders.length > 0) {
            this.orderQueryModel.codSession = this.model.code;
            await this.getOrders(this.orderQueryModel);
        }
    }

    async ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                if (params && parseFloat(params.confirm) === 1) {
                    this.confirm = true;
                }
            });
        await this.loadData();
    }


    async loadData() {
        this.loading = true;
        await this._loadMetaData();
        this.loading = false;
    }

    async loadDataByPage($event = 1) {
        await this.getOrders(null, $event);
    }

    async loadDataByPageSize($event = 20) {
        this.orderQueryModel.limit = $event;
        await this.getOrders(null, 1);
    }

    async getOrders(orderQueryModel: QueryModel, page = 1, reset: boolean = false) {
        if (orderQueryModel) {
            this.orderQueryModel = new QueryModel(orderQueryModel);
        }
        if (page) {
            this.orderQueryModel.page = page;
        }
        if (reset) {
            delete this.orderQueryModel.code;
        }
        this.tableData = await this.orderService.getOrders(this.orderQueryModel);
    }


    async showEditConfirm(code: string) {
        const _this = this;
        this.modal.create({
            nzTitle: this.translateService.instant(`finance.session-cod.confirm-transfer`),
            nzContent: this.translateService.instant(`finance.session-cod.confirm-transfer-content`),
            nzFooter: [
                {
                    label: this.translateService.instant(`button.confirm`),
                    type: 'primary',
                    loading: false,
                    async onClick() {
                        this.loading = true;
                        const response = await _this.sessionCodService.accept(code);
                        if (response.errorCode === 0) {
                            _this.modal.closeAll();
                            _this.confirm = false;
                            _this.messageService.success(`${_this.translateService.instant(`finance.session-cod.confirm-transfer`)} ${_this.translateService.instant('common.successfully').toLowerCase()}`);
                            await _this.loadData();
                        } else {
                            _this.messageService.error(response.message);
                        }
                        this.loading = false;
                    },
                },
                {
                    label: this.translateService.instant(`button.no`),
                    onClick: () => this.modal.closeAll()
                },
            ]
        });
    }

    async showDeleteConfirm(code: string, order: string) {
        const _this = this;
        this.modal.create({
            nzTitle: _this.translateService.instant(`finance.session-cod.delete-order`),
            nzContent: _this.translateService.instant(`finance.session-cod.delete-order-content`),
            nzFooter: [
                {
                    label: _this.translateService.instant(`button.confirm`),
                    type: 'primary',
                    loading: false,
                    async onClick() {
                        this.loading = true;
                        const response = await _this.sessionCodService.deleteOrder(code, [order]);
                        if (response.errorCode === 0) {
                            _this.modal.closeAll();
                            _this.messageService.success(`${_this.translateService.instant(`finance.session-cod.delete-order`)} ${_this.translateService.instant('common.successfully').toLowerCase()}`);
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

    async exportExcel(code: string) {
        await this.reportService.exportSessionOrder(new QueryModel({ code }));
    }

}
