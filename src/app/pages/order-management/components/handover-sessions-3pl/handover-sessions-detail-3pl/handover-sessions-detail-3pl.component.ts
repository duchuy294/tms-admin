import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import {
    HandoverSessions3PL,
    HandoverSessions3PLModel,
    HandoverSessions3PLStatus
} from '@/pages/order-management/models/handover-sessions-3pl.model';

import { ActivatedRoute } from '@angular/router';
import { AdminService } from '@/modules/admin/services/admin.service';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { HandoverSessionsQueryModel } from '@/pages/order-management/models/handover-sessions-query.model';
import { HandoverSessions3PLService } from '@/pages/order-management/service/handover-sessions-3pl.service';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'handover-sessions-detail-3pl',
    templateUrl: './handover-sessions-detail-3pl.component.html',
    styleUrls: ['./handover-sessions-detail-3pl.component.less']
})
export class HandoverSessionsDetail3PLComponent implements OnInit {
    model: HandoverSessionsQueryModel = new HandoverSessionsQueryModel();
    tableData: HandoverSessions3PLModel;
    loading = false;
    servicers = {};
    visibleModal = false;
    reason = '';
    handoverId = null;
    handoverSessions = HandoverSessions3PL;
    handoverSessionsStatus = HandoverSessions3PLStatus;
    customer: Customer;
    users: any;
    constructor(
        private handoverSessionsService: HandoverSessions3PLService,
        private routeActive: ActivatedRoute,
        private customerService: CustomerService,
        private adminService: AdminService
    ) {
        this.handoverId = this.routeActive.snapshot.paramMap.get('id');
    }

    async ngOnInit() {
        await this.loadData();
    }

    get detail() {
        const data = [];
        if (this.tableData && this.tableData.packages) {
            const soGroup = _.groupBy(this.tableData.packages, item => item.SO);

            for (const [key, value] of Object.entries(soGroup)) {
                const SO = {
                    ['SO']: key,
                    ['count']: value.length
                };
                data.push(SO);
            }
        }
        return data;
    }

    async loadData() {
        this.loading = true;
        this.tableData = await this.handoverSessionsService.detail(
            this.handoverId
        );
        const userIds = [];
        if (this.tableData) {
            if (!this.tableData._id) {
                this.tableData._id = this.handoverId;
            }

            this.customer = await this.customerService.getCustomer(
                this.tableData.clientBranchId
            );

            if (this.tableData.processedBy) {
                userIds.push(this.tableData.processedBy);
            }
            if (this.tableData.confirmedBy) {
                userIds.push(this.tableData.confirmedBy);
            }
            if (_.uniq(userIds).length > 0) {
                this.users = _.groupBy(
                    (
                        await this.adminService.getAdmins(
                            new QueryModel({
                                limit: 1000,
                                fields: '_id,phone,fullName',
                                accountIds: _.uniq(userIds).join(',')
                            })
                        )
                    ).data,
                    x => x._id
                );
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

    soRecived(val) {
        const confirmed = _.filter(val.saleOrders, item => item.userConfirmed);
        return `${confirmed.length}/${val.saleOrderQuantity}`;
    }
}
