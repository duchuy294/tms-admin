import * as _ from 'lodash';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { ORDER_STATUS_COLOR } from '@/constants/OrderStatus';
import { OrderModel } from '@/modules/order/models/order.model';
import { OrderService } from '@/modules/order/services/order.service';
import { OrderType } from '@/modules/order/constants/OrderType';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { WarehouseModel } from '@/modules/warehouse/models/warehouse.model';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';

@Component({
    selector: 'warehouse-order-grid',
    templateUrl: './warehouse-order-grid.component.html',
    styleUrls: ['./warehouse-order-grid.component.less']
})
export class WarehouseOrderGridComponent implements OnInit {
    @Input() model: QueryModel = new QueryModel({ serviceType: OrderType.SHARING_WAREHOUSE });
    @Output() onProcess = new EventEmitter<string>();

    loading = false;
    ORDER_STATUS_COLOR = ORDER_STATUS_COLOR;
    admins: { [_id: string]: AccountModel } = {};
    warehouses: { [_id: string]: WarehouseModel } = {};
    users: { [_id: string]: Customer } = {};
    unreadMessage: { [id: string]: number } = {};
    totalMessages: { [id: string]: number } = {};
    public warehouseOrderData = new PagingModel<OrderModel>();

    constructor(
        private orderService: OrderService,
        private customerService: CustomerService,
        private adminService: AdminService,
        private warehouseService: WarehouseService
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData(modelQuery: QueryModel = null) {
        this.loading = true;

        if (modelQuery) {
            this.model = modelQuery;
        }

        this.warehouseOrderData = await this.orderService.getOrders(this.model);

        if (this.warehouseOrderData.data.length) {
            await this.getAdmins(this.warehouseOrderData);
            await this.getCustomers(this.warehouseOrderData);
            await this.getWarehouses(this.warehouseOrderData);
            await this.loadMessageInfo(this.warehouseOrderData);
        }

        this.loading = false;
    }

    async loadDataByPage(event = 1) {
        this.model.page = event;
        await this.loadData();
    }

    async loadDataByPageSize(event = 20) {
        this.model.limit = event;
        await this.loadData();
    }

    async getAdmins(data: PagingModel<OrderModel>) {
        const accountIds = _.uniq(_.map(data.data, item => item.processedBy).filter(item => item && !this.admins[item])).join(',');
        if (accountIds) {
            const adminPaging = await this.adminService.getAdmins(new QueryModel({ limit: this.model.limit, accountIds }));
            _.forEach(adminPaging.data, item => {
                this.admins[item._id] = item;
            });
        }
    }

    async getWarehouses(data: PagingModel<OrderModel>) {
        const warehouseIds = _.uniq(_.map(data.data, item => item.warehouseId).filter(item => item && !this.warehouses[item])).join(',');
        if (warehouseIds) {
            const warehousePaging = await this.warehouseService.filterWarehouse(new QueryModel({ limit: this.model.limit, warehouseId: warehouseIds }));
            _.forEach(warehousePaging.data, item => {
                this.warehouses[item._id] = item;
            });
        }
    }

    async getCustomers(data: PagingModel<OrderModel>) {
        const userIds = _.uniq(_.map(data.data, item => item.userId).filter(item => item && !this.users[item])).join(',');
        if (userIds) {
            const userPaging = await this.customerService.getCustomers(new QueryModel({ limit: this.model.limit, userIds }));
            _.forEach(userPaging.data, item => {
                this.users[item._id] = item;
            });
        }
    }

    loadMessageInfo(data = new PagingModel<OrderModel>()) {
        data.data.forEach(order => {
            this.unreadMessage[order._id] = _.sumBy(['unread'], _.partial(_.sumBy, order.conversations));
            this.totalMessages[order._id] = _.sumBy(['totalMessages'], _.partial(_.sumBy, order.conversations));
        });
    }

    processOrder(id: string = null) {
        this.onProcess.emit(id);
    }
}