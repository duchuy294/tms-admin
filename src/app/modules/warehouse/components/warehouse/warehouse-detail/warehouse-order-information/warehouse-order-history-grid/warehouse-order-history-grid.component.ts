import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { OrderModel } from '@/modules/order/models/order.model';
import { OrderService } from '@/modules/order/services/order.service';
import { OrderType } from '@/modules/order/constants/OrderType';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'warehouse-order-history-grid',
    templateUrl: './warehouse-order-history-grid.component.html',
    styleUrls: ['./warehouse-order-history-grid.component.less']
})
export class WarehouseOrderHistoryGridComponent implements OnInit {
    id = this.route.snapshot.paramMap.get('id');
    loading = false;
    users: { [_id: string]: Customer } = {};
    public warehouseOrderData = new PagingModel<OrderModel>();

    @Input() model: QueryModel = new QueryModel({ warehouseId: this.id, serviceType: OrderType.SHARING_WAREHOUSE });

    constructor(
        private orderService: OrderService,
        private customerService: CustomerService,
        private route: ActivatedRoute
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
            await this.getCustomers(this.warehouseOrderData);
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

    async getCustomers(data: PagingModel<OrderModel>) {
        const userIds = _.uniq(_.map(data.data, item => item.userId).filter(item => item && !this.users[item])).join(',');
        if (userIds) {
            const userPaging = await this.customerService.getCustomers(new QueryModel({ limit: this.model.limit, userIds }));
            _.forEach(userPaging.data, item => {
                this.users[item._id] = item;
            });
        }
    }
}