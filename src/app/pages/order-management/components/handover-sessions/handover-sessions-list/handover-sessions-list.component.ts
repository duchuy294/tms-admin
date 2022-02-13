import * as _ from 'lodash';

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HandoverScanModel, HandoverSessions, HandoverSessionsModel, HandoverSessionsStatus } from '@/pages/order-management/models/handover-sessions.model';

import { CustomerService } from '@/modules/customer/services/customer.service';
import { HandoverSessionsQueryModel } from '@/pages/order-management/models/handover-sessions-query.model';
import { HandoverSessionsService } from '@/pages/order-management/service/handover-sessions.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'handover-sessions-list',
    templateUrl: './handover-sessions-list.component.html',
    styleUrls: ['./handover-sessions-list.component.less']
})
export class HandoverSessionsListComponent implements OnInit {
    @Input() model: HandoverSessionsQueryModel = new HandoverSessionsQueryModel();
    @ViewChild('singleScanPack') singleScanPack: ElementRef;

    tableData = new PagingModel<HandoverSessionsModel>();
    loading = false;
    customers = {};
    visibleModal = false;
    visibleModalComplete = false;
    currentHandover: HandoverSessionsModel;
    visibleSearch = false;
    handoverSessions = HandoverSessions;
    handoverSessionsStatus = HandoverSessionsStatus;

    package: HandoverScanModel;
    packages: HandoverScanModel[] = [];
    shownPackages: HandoverScanModel[] = [];
    state = [true, false];
    checkValid = true;
    checkInalid = true;

    constructor(
        private handoverSessionsService: HandoverSessionsService,
        private customerService: CustomerService,
        private messageService: NzMessageService,
        private translateService: TranslateService,

    ) { }

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
        if (modelQuery) {
            this.model = modelQuery;
        }
        this.tableData = await this.handoverSessionsService.filters(this.model);
        _.forEach(this.tableData.data, (item) => {
            customerIds.push(item.userId);
        });
        if (_.uniq(customerIds).length > 0) {
            this.customers = _.groupBy((await this.customerService.getCustomers(new QueryModel({ limit: 1000, fields: '_id,phone,fullName', userIds: _.uniq(customerIds).join(',') }))).data, x => x._id);
        }
        this.loading = false;
    }

    get totalValidPackage() {
        return this.packages.filter(x => x.valid).length;
    }

    async handleScan($event) {
        if ($event.key === 'Enter' &&
            $event.target.value) {
            const audioYes = new Audio('/assets/mp3/Co.mp3');
            const audioNo = new Audio('/assets/mp3/KhongCo.mp3');
            const scanValue = $event.target.value;
            if (scanValue) {
                if (!this.isExistedInPackages(scanValue)) {
                    this.loading = true;
                    this.package = await this.handoverSessionsService.scan(scanValue);
                    this.packages.push(this.package);
                    if (this.package.valid === undefined) {
                        this.package.valid = false;
                    }
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
        return _.some(this.packages, p => p.package === value);
    }

    choosePackageFilter(value) {
        this.state = value;
        this.updateShownPackages();
    }

    updateShownPackages() {
        this.shownPackages = this.packages.filter(x => this.state.indexOf(x.valid) !== -1);
    }

    onComplete(flag) {
        this.visibleModalComplete = flag;
        this.loadData(this.model);
    }

    cancel() {

    }

    completed(item: HandoverSessionsModel) {
        this.currentHandover = item;
        this.visibleModalComplete = true;
    }

    closePopup() {
        this.shownPackages = [];
        this.packages = [];
        this.visibleModal = false;
        this.loadData(this.model);
    }

    checkRecived(status) {
        return [this.handoverSessionsStatus.new, this.handoverSessionsStatus.processing].includes(status)
    }

}
