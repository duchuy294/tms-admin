import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '@/modules/admin/services/admin.service';
import { CodBank, RequestCodListModel } from '@/modules/finance/models/request-cod-list.model';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderModel } from '@/modules/order/models/order.model';
import { OrderService } from '@/modules/order/services/order.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { Profile } from '@/modules/profile/models/profile.model';
import { QueryModel } from '@/models/query.model';
import { RequestCod, RequestCodEnum } from '@/constants/RequestCod';
import { RequestCodService } from '@/modules/finance/services/request-cod.service';
import { Servicer } from '@/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'request-cod-detail',
    templateUrl: './request-cod-detail.component.html',
    styleUrls: ['request-cod-detail.component.less']

})
export class RequestCodDetailComponent implements OnInit {
    public tableData = new PagingModel<OrderModel>();
    public model = new RequestCodListModel();
    public modelForm = new RequestCodListModel();
    servicer: Servicer;
    performer: Profile;
    loading: boolean = false;
    requestCodId = this.route.snapshot.paramMap.get('id');
    flagExpanding: { [id: string]: boolean } = {};
    confirm: boolean = false;
    requestCod = RequestCod;
    bank: CodBank;
    users: {};
    orderQueryModel: QueryModel = new QueryModel({ limit: 20, fields: 'code,_id,cod,finishedAt,serviceType,userId,externalCode' });
    visibleModalConfirm: boolean = false;
    visibleModalReject: boolean = false;
    images = [];
    constructor(
        private adminService: AdminService,
        private requestCodService: RequestCodService,
        private orderService: OrderService,
        private route: ActivatedRoute,
        private modal: NzModalService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private serviceService: ServicerService,
        private customerService: CustomerService,

    ) { }
    
    handelVisibleModalConfirm(flag = true) {
        this.visibleModalConfirm = !!flag;
    }

    handelVisibleModalReject(flag = true) {
        this.visibleModalReject = !!flag;
    }

    async _loadMetaData() {
        this.model = await this.requestCodService.get(this.requestCodId);
        if (this.model.performerId) {
            this.performer = await this.adminService.getAdmin(this.model.performerId);
        }
        if (this.model.servicerId) {
            this.servicer = await this.serviceService.get(this.model.servicerId);
        }
        if (this.model.orderCodes && this.model.orderCodes.length > 0) {
            this.orderQueryModel.orderCode = this.model.orderCodes;
            await this.getOrders(this.orderQueryModel);
        }
        const banks = await this.requestCodService.getBank();
        if (this.model.bank) {
            this.bank = _.find(banks, item => item.code === this.model.bank);
        }
        this.modelForm = _.cloneDeep(this.model);
        if (!this.modelForm.confirmedPaid) {
            this.modelForm.confirmedPaid = _.cloneDeep(this.modelForm.paid);
        }

        if (this.model.images) {
            _.each(this.model.images, image => {
                this.images.push({
                    url: image,
                    status: 'done'
                });
            });
        }
    }

    async ngOnInit() {
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
        const userIds = [];
        _.forEach(this.tableData.data, (item) => {
            userIds.push(item.userId);
        });
        if (_.uniq(userIds).length > 0) {
            this.users = _.groupBy((await this.customerService.getCustomers(new QueryModel({ limit: 1000, userIds: _.uniq(userIds).join(',') }))).data, x => x._id);
        }
    }

    checkVisibleAction(status: string) {
        return RequestCodEnum.request === status || status == RequestCodEnum.processing;
    }

    checkVisibleEnterCodeTransaction(status: string) {
        return RequestCodEnum.holding === status;
    }

    checkUpdate(status: string) {
        return this.checkVisibleAction(status) || this.checkVisibleEnterCodeTransaction(status);
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
                        const response = await _this.requestCodService.accept(code);
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

}
