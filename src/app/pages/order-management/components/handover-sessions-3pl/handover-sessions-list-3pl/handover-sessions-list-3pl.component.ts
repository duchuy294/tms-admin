import * as _ from 'lodash';

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
    HandoverScan3PLModel,
    HandoverSessions3PL,
    HandoverSessions3PLModel,
    HandoverSessions3PLStatus
} from '@/pages/order-management/models/handover-sessions-3pl.model';

import { CustomerService } from '@/modules/customer/services/customer.service';
import { HandoverSessionsQueryModel } from '@/pages/order-management/models/handover-sessions-query.model';
import { HandoverSessions3PLService } from '@/pages/order-management/service/handover-sessions-3pl.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from '@/modules/admin/services/admin.service';

@Component({
    selector: 'handover-sessions-list-3pl',
    templateUrl: './handover-sessions-list-3pl.component.html',
    styleUrls: ['./handover-sessions-list-3pl.component.less']
})
export class HandoverSessionsList3PLComponent implements OnInit {
    @Input()
    model: HandoverSessionsQueryModel = new HandoverSessionsQueryModel();
    @ViewChild('singleScanPack') singleScanPack: ElementRef;

    tableData = new PagingModel<HandoverSessions3PLModel>();
    loading = false;
    customers = {};
    accounts = {};
    visibleModal = false;
    visibleCancelModal = false;
    currentHandover: HandoverSessions3PLModel;
    visibleSearch = false;
    handoverSessions = HandoverSessions3PL;
    handoverSessionsStatus = HandoverSessions3PLStatus;

    package: HandoverScan3PLModel;
    packages: HandoverScan3PLModel[] = [];
    shownPackages: HandoverScan3PLModel[] = [];
    state = [true, false];
    checkValid = true;
    checkInalid = true;

    reason = '';
    currentId = '';

    constructor(
        private handoverSessions3PLService: HandoverSessions3PLService,
        private customerService: CustomerService,
        private adminService: AdminService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private modal: NzModalService
    ) {}

    async ngOnInit() {
        await this.loadData();
    }

    async loadDataByPage(event) {
        this.model.page = event;
        await this.loadData();
    }

    async loadDataByPageSize(event) {
        this.model.limit = event;
        await this.loadData();
    }

    async loadData(modelQuery: HandoverSessionsQueryModel = null) {
        this.loading = true;
        const customerIds = [];
        const accountIds = [];
        if (modelQuery) {
            this.model = modelQuery;
        }
        this.tableData = await this.handoverSessions3PLService.filters(
            this.model
        );
        _.forEach(this.tableData.data, item => {
            if (item.clientBranchId) {
                customerIds.push(item.clientBranchId);
            }
            if (item.processedBy) {
                accountIds.push(item.processedBy);
            }
        });
        if (_.uniq(customerIds).length > 0) {
            this.customers = _.groupBy(
                (
                    await this.customerService.getCustomers(
                        new QueryModel({
                            limit: 1000,
                            fields: '_id,phone,fullName',
                            userIds: _.uniq(customerIds).join(',')
                        })
                    )
                ).data,
                x => x._id
            );
        }
        if (_.uniq(customerIds).length > 0) {
            this.accounts = _.groupBy(
                (
                    await this.adminService.getAdmins(
                        new QueryModel({
                            limit: 1000,
                            fields: '_id,phone,fullName',
                            userIds: _.uniq(customerIds).join(',')
                        })
                    )
                ).data,
                x => x._id
            );
        }
        this.loading = false;
    }

    get totalValidPackage() {
        return this.packages.filter(x => x.valid).length;
    }

    get totalInValidPackage() {
        return this.packages.filter(x => !x.valid).length;
    }

    async handleScan($event) {
        if ($event.key === 'Enter' && $event.target.value) {
            const audioYes = new Audio('/assets/mp3/Co.mp3');
            const audioNo = new Audio('/assets/mp3/KhongCo.mp3');
            const scanValue = $event.target.value;
            if (scanValue) {
                if (!this.isExistedInPackages(scanValue)) {
                    this.loading = true;
                    this.package = await this.handoverSessions3PLService.scan(
                        scanValue
                    );
                    if (this.package.valid === undefined) {
                        this.package.valid = false;
                    }
                    const packegeValid = this.packages.filter(
                        item => item.valid
                    );
                    if (
                        packegeValid[0] &&
                        packegeValid[0].clientBranch &&
                        this.package.clientBranch
                    ) {
                        if (
                            packegeValid[0].clientBranch._id !==
                            this.package.clientBranch._id
                        ) {
                            this.package.valid = false;
                            this.package.message = `Lỗi SO (${this.package.SO}) phải có 3PL trùng với 3PL của SO (${packegeValid[0].SO})`;
                        }
                    }
                    this.packages.push(this.package);

                    if (!this.package.valid) {
                        audioNo.play();
                    } else {
                        audioYes.play();
                    }
                    this.updateShownPackages();
                    this.loading = false;
                } else {
                    this.messageService.error(
                        this.translateService.instant('common.existed-packages')
                    );
                }
                this.singleScanPack.nativeElement.value = '';
                setTimeout(() => {
                    this.singleScanPack.nativeElement.focus();
                }, 200);
            } else {
                this.messageService.error(
                    this.translateService.instant('common.input-package-code')
                );
            }
        }
    }

    isExistedInPackages(value: string) {
        return _.some(this.packages, p => p.SO === value);
    }

    choosePackageFilter(value) {
        this.state = value;
        this.updateShownPackages();
    }

    updateShownPackages() {
        this.shownPackages = this.packages.filter(
            x => this.state.indexOf(x.valid) !== -1
        );
    }

    remove(item) {
        this.packages = this.packages.filter(x => item.SO !== x.SO);
        this.updateShownPackages();
    }

    async onConfirm() {
        this.loading = true;
        const res = await this.handoverSessions3PLService.cancel(
            this.currentId,
            this.reason
        );
        if (res.errorCode === 1) {
            this.messageService.error(res.message);
            this.loading = false;
            return;
        }
        this.messageService.success(
            this.translateService.instant('common.successfully')
        );
        setTimeout(() => {
            this.loadData(this.model);
        }, 1000);
        this.loading = false;
        this.closeCancelModal();
    }

    openCancelModal(id) {
        this.currentId = id;
        this.visibleCancelModal = true;
    }

    closeCancelModal() {
        this.currentId = null;
        this.reason = null;
        this.visibleCancelModal = false;
    }

    async submit() {
        const so = this.packages.filter(x => x.valid);
        if (so.length === 0) {
            this.messageService.error(
                this.translateService.instant(
                    'handoverSessions3PL.errorSOValid'
                )
            );
            return;
        }
        this.loading = true;
        const res = await this.handoverSessions3PLService.create(
            so.map(item => item.SO)
        );
        if (res.errorCode === 1) {
            this.messageService.error(res.message);
            this.loading = false;
            return;
        }
        this.messageService.success(
            this.translateService.instant('common.successfully')
        );
        this.loading = false;
        this.closePopup();
    }

    cancelHanover(id) {
        this.currentId = id;
        this.modal.confirm({
            nzTitle: this.translateService.instant(
                'handoverSessions3PL.confirmCancle'
            ),
            nzContent: this.translateService.instant(
                'handoverSessions3PL.contentConfirmCancle'
            ),
            nzOnOk: async () => {},
            nzCancelText: 'No',
            nzOkText: 'Yes',
            nzOkType: 'primary'
        });
    }

    adminConfirm(id) {
        this.modal.confirm({
            nzTitle: this.translateService.instant(
                'handoverSessions3PL.buttonConfirm'
            ),
            nzContent: this.translateService.instant(
                'handoverSessions3PL.contentConfirm'
            ),
            nzOnOk: async () => {
                this.loading = true;
                const res = await this.handoverSessions3PLService.confirm(id);
                if (res.errorCode === 1) {
                    this.messageService.error(res.message);
                }
                setTimeout(() => {
                    this.loadData(this.model);
                }, 1000);
                this.loading = false;
            },
            nzCancelText: this.translateService.instant('button.cancel'),
            nzOkText: this.translateService.instant('button.yes'),
            nzOkType: 'primary'
        });
    }

    closePopup() {
        this.shownPackages = [];
        this.packages = [];
        this.visibleModal = false;
        setTimeout(() => {
            this.loadData(this.model);
        }, 1000);
    }

    soRecived(val) {
        const confirmed = _.filter(val.saleOrders, item => item.userConfirmed);
        return `${confirmed.length}/${val.saleOrderQuantity}`;
    }
}
