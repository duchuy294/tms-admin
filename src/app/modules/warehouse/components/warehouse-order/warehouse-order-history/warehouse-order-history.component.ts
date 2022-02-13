import * as _ from 'lodash';
import { ActivityModel } from 'app/modules/activity/models/activity.model';
import { ActivityService } from 'app/modules/activity/services/activity.service';
import { ActivityType } from './../../../../activity/constants/activity-type.enum';
import { AdminService } from 'app/modules/admin/services/admin.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderModel } from 'app/modules/order/models/order.model';
import { QueryModel } from '@/models/query.model';
import { WarehouseContactModel } from '@/modules/warehouse/models/warehouse-contact.model';

@Component({
    selector: 'warehouse-order-history',
    templateUrl: './warehouse-order-history.component.html',
    styleUrls: ['./warehouse-order-history.component.less']
})
export class WarehouseOrderHistoryComponent implements OnChanges {
    @Input() order: OrderModel = null;
    @Input() contact: WarehouseContactModel = null;
    @Input() dislayTitle: Boolean = true;
    public actions: ActivityModel[] = [];
    loading = false;
    accounts: any;

    constructor(private activityService: ActivityService,
        private adminService: AdminService) { }

    async ngOnChanges(_changes: SimpleChanges) {
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        let paging = null;
        if (this.order) {
            paging = await this.activityService.filter(
                new QueryModel({ limit: 1000, orderId: this.order._id })
            );
        }
        if (this.contact) {
            paging = await this.activityService.filter(
                new QueryModel({ limit: 1000, contactId: this.contact._id })
            );
        }
        if (paging) {
            const userIds = new Set();
            const servicerIds = new Set();
            const accountIds = new Set();
            const accountFilterRequest = { user: { userIds: null }, servicer: { servicerIds: null }, account: { accountIds: null } };
            _.forEach(paging.data, (item) => {
                if (item.userId) {
                    userIds.add(item.userId);
                }
                if (item.servicerId) {
                    servicerIds.add(item.servicerId);
                }
                if (item.accountId) {
                    accountIds.add(item.accountId);
                }
                if (item.clientBranchId) {
                    userIds.add(item.clientBranchId);
                }
            });
            if (userIds.size > 0) {
                accountFilterRequest.user.userIds = _.join(Array.from(userIds), ',');
            }
            if (servicerIds.size > 0) {
                accountFilterRequest.servicer.servicerIds = _.join(Array.from(servicerIds), ',');
            }
            if (accountIds.size > 0) {
                accountFilterRequest.account.accountIds = _.join(Array.from(accountIds), ',');
            }
            this.accounts = await this.adminService.listAccounts(accountFilterRequest);
            this.actions = paging.data.map((item) => {
                if (item.accountId) {
                    _.assignIn(item, {
                        accountName: this.getAccount(item.accountId)
                    });
                    if (item.clientBranchId) {
                        _.assignIn(item, {
                            subUserName: this.getUser(item.clientBranchId)
                        });
                    }
                    if (!this.allowServicerFooter(item)) {
                        return item;
                    }
                }
                if (item.servicerId) {
                    _.assignIn(item, {
                        servicerName: this.getServicer(item.servicerId)
                    });
                    return item;
                }
                if (item.userId) {
                    _.assignIn(item, {
                        userName: this.getUser(item.userId)
                    });
                    return item;
                }

                return item;
            }).reverse();
        }
        this.loading = false;
    }

    allowServicerFooter(item) {
        return item.type === ActivityType.ASSIGNED;
    }

    getUser(id) {
        const result = _.filter(this.accounts.data.user, (user) => user._id === id);
        return result.length > 0 ? result[0].fullName : '';
    }

    getServicer(id) {
        const result = _.filter(this.accounts.data.servicer, (servicer) => servicer._id === id);
        return result.length > 0 ? result[0].fullName : '';
    }

    getAccount(id) {
        const result = _.filter(this.accounts.data.account, (account) => account._id === id);
        return result.length > 0 ? result[0].fullName : '';
    }
}
