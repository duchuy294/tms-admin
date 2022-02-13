import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { HandoverSessions, HandoverSessionsModel, HandoverSessionsStatus } from '@/pages/order-management/models/handover-sessions.model';

import { ActivatedRoute } from '@angular/router';
import { AdminService } from '@/modules/admin/services/admin.service';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { HandoverSessionsQueryModel } from '@/pages/order-management/models/handover-sessions-query.model';
import { HandoverSessionsService } from '@/pages/order-management/service/handover-sessions.service';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'handover-sessions-detail',
    templateUrl: './handover-sessions-detail.component.html',
    styleUrls: ['./handover-sessions-detail.component.less']
})
export class HandoverSessionsDetailComponent implements OnInit {
    model: HandoverSessionsQueryModel = new HandoverSessionsQueryModel();
    tableData: HandoverSessionsModel;
    loading = false;
    servicers = {};
    visibleModal = false;
    reason = "";
    handoverId = null;
    handoverSessions = HandoverSessions;
    handoverSessionsStatus = HandoverSessionsStatus;
    customer: Customer;
    users: any;
    constructor(
        private handoverSessionsService: HandoverSessionsService,
        private routeActive: ActivatedRoute,
        private customerService: CustomerService,
        private adminService: AdminService,

    ) {
        this.handoverId = this.routeActive.snapshot.paramMap.get('id');

    }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        this.tableData = await this.handoverSessionsService.detail(this.handoverId);
        const userIds = []
        if (this.tableData) {
            if (!this.tableData._id) {
                this.tableData._id = this.handoverId;
            }
            this.customer = await this.customerService.getCustomer(this.tableData.userId);

            _.forEach(this.tableData.packages, (item) => {
                userIds.push(item.handovererId);
            });
            if (_.uniq(userIds).length > 0) {
                this.users = _.groupBy((await this.adminService.getAdmins(new QueryModel({ limit: 1000, fields: '_id,phone,fullName', accountIds: _.uniq(userIds).join(',') }))).data, x => x._id);
            }
        }
        this.loading = false;
    }

    codeSoPackage(code, index = 0) {
        if (_.isEmpty(code)) {
            return null;
        }
        return code.split('_')[index];
    }

    openModal() {
        this.visibleModal = true;
    }

    onComplete(flag) {
        this.visibleModal = flag;
        this.loadData();
    }

    checkRecived() {
        return [this.handoverSessionsStatus.new, this.handoverSessionsStatus.processing].includes(this.tableData.status)
    }

}
