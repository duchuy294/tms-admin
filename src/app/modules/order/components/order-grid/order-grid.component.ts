import * as _ from 'lodash';
import * as moment from 'moment';
import { AccountModel } from '@/modules/admin/models/admin.model';
import { AdminService } from '@/modules/admin/services/admin.service';
import {
    Component,
    EventEmitter,
    Input,
    NgZone,
    OnInit,
    Output
} from '@angular/core';
import { Customer } from '../../../customer/models/customer-detail.model';
import { CustomerService } from '../../../customer/services/customer.service';
import { ORDER_STATUS_COLOR } from '@/constants/OrderStatus';
import { OrderAction } from '../../models/order-action.model';
import { OrderDeliveryType } from '@/constants/OrderDeliveryType';
import { OrderModel } from './../../models/order.model';
import { OrderQueryModel } from '@/pages/order-management/models/order-query.model';
import { OrderService } from './../../services/order.service';
import { OrderStatisticModel } from '../../models/order-statistic.model';
import { OrderStatus } from '@/constants/OrderStatus';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { PointStatus } from 'app/modules/order/constants/PointStatus';
import { Profile } from '@/modules/profile/models/profile.model';
import { QueryModel } from './../../../../models/query.model';
import { RequestCodOrder } from '@/constants/RequestCod';
import { Servicer } from '../../../servicer/models/servicer/servicer.model';
import { ServicerService } from '../../../servicer/services/servicer.service';
import { ServiceStyle } from 'app/modules/price/constants/ServiceStyle';

@Component({
    selector: 'order-grid',
    templateUrl: 'order-grid.component.html',
    styleUrls: ['order-grid.component.less']
})
export class OrderGridComponent implements OnInit {
    @Input() hiddenFields: string[] = [];
    @Input() visibleFields: string[] = [];
    @Input() actions: OrderAction[] = [];
    @Input() model: OrderQueryModel = new OrderQueryModel();
    @Input() collectionOrder = false;
    @Output() noteAdmin = new EventEmitter();
    @Input() currentUser: Profile = null;
    @Input() width = '1200px';
    users: { [propName: string]: Customer } = {};
    servicers: { [propName: string]: Servicer } = {};
    ORDER_STATUS_COLOR = ORDER_STATUS_COLOR;
    orderDeliveryType = OrderDeliveryType;
    unreadMessage: { [id: string]: number } = {};
    totalMessages: { [id: string]: number } = {};
    noteStatues: { [id: string]: boolean } = {};
    admins: { [_id: string]: AccountModel } = {};
    loading = false;
    firstLoad = true;
    statisticData = new OrderStatisticModel();
    flagExpanding: { [id: string]: boolean } = {};
    @Output() dataNoteOrder = new EventEmitter<OrderModel>();
    requestCodOrder = RequestCodOrder;
    public tableData = new PagingModel<OrderModel>();

    constructor(
        public orderService: OrderService,
        private userService: CustomerService,
        private servicerService: ServicerService,
        private zone: NgZone,
        private adminService: AdminService
    ) {}

    async ngOnInit() {
        await this.loadData();
    }

    async orderChange(data) {
        if (this.firstLoad) {
            this.firstLoad = false;
        } else if (
            !this.loading &&
            !_.isNull(_.find(this.tableData, item => item === data.key))
        ) {
            this.loadData();
            this.zone.run(null);
        }
    }

    isOverduePayment(order: OrderModel) {
        if (this.visibleFields.includes('collectionMoney')) {
            const collectionPoint = order.detail.points.find(
                point =>
                    point.status === PointStatus.DELIVERED &&
                    point.costDetail &&
                    !!point.costDetail.find(
                        service =>
                            service.style === ServiceStyle.Delivery_Collection
                    )
            );
            return (
                collectionPoint &&
                moment()
                    .add(-1, 'days')
                    .valueOf() > collectionPoint.finishedAt
            );
        }

        return false;
    }

    async loadData(modelQuery: OrderQueryModel = null) {
        this.loading = true;

        if (modelQuery) {
            this.model = modelQuery;
        }

        if (this.collectionOrder) {
            this.tableData = await this.orderService.getCollectionOrders(
                this.model
            );
        } else {
            this.tableData = await this.orderService.getOrders(this.model);
        }

        if (this.tableData.data.length) {
            await this.loadUser(this.tableData);
            await this.loadServicer(this.tableData);
            this.loadMessageInfo(this.tableData);
            await this.getAdmins();
        }
        this.loading = false;
    }

    loadMessageInfo(data) {
        data.data.forEach(order => {
            this.unreadMessage[order._id] = _.sumBy(
                ['unread'],
                _.partial(_.sumBy, order.conversations)
            );
            this.totalMessages[order._id] = _.sumBy(
                ['totalMessages'],
                _.partial(_.sumBy, order.conversations)
            );
        });
    }

    loadStatusNote() {
        _.forEach(
            this.tableData.data,
            item =>
                (this.noteStatues[item._id] =
                    item.status === OrderStatus.ProcessedTimeout ||
                    item.status === OrderStatus.ProcessingTimeout)
        );
    }

    async getAdmins() {
        const accountIds = _.uniq(
            _.map(this.tableData.data, item => item.processedBy).filter(
                item => item && !this.admins[item]
            )
        ).join(',');
        if (accountIds) {
            const adminPaging = await this.adminService.getAdmins(
                new QueryModel({ limit: this.model.limit, accountIds })
            );
            _.forEach(adminPaging.data, item => {
                this.admins[item._id] = item;
            });
        }
    }

    async loadUser(data) {
        if (!this.hiddenFields.includes('user')) {
            let userIds = _.uniq(
                _.map(data.data, item => item.userId).filter(
                    item => item && !this.users[item]
                )
            ).join(',');
            const clientBranchIds = _.uniq(
                _.map(data.data, item => item.clientBranchId).filter(
                    item => item && !this.users[item]
                )
            ).join(',');
            if (userIds || clientBranchIds) {
                userIds = `${userIds},${clientBranchIds}`;
                const userPaging = await this.userService.getCustomers(
                    new QueryModel({ limit: 1000, userIds })
                );
                _.forEach(userPaging.data, item => {
                    this.users[item._id] = item;
                });
            }
        }
    }
    async loadServicer(data) {
        if (!this.hiddenFields.includes('servicer')) {
            const servicerIds = _.uniq(
                _.map(data.data, item => item.servicerId).filter(
                    item => item && !this.servicers[item]
                )
            ).join(',');
            if (servicerIds) {
                const servicerPaging = await this.servicerService.getServicers(
                    new QueryModel({ limit: this.model.limit, servicerIds })
                );
                _.forEach(servicerPaging.data, item => {
                    this.servicers[item._id] = item;
                });
            }
        }
    }

    async loadDataByPage(event) {
        this.model.page = event;
        await this.loadData();
    }

    async loadDataByPageSize(event) {
        this.model.limit = event;
        await this.loadData();
    }

    getOrder(orderMode: OrderModel = null) {
        this.dataNoteOrder.emit(orderMode);
        this.noteAdmin.emit();
    }

    displayNoteByOperator(orderModel: OrderModel = null) {
        return (
            ((orderModel &&
                orderModel.status === OrderStatus.ProcessingTimeout) ||
                orderModel.status === OrderStatus.ProcessedTimeout) &&
            this.currentUser &&
            this.currentUser._id === orderModel.processedBy
        );
    }

    async loadCollectionData(modelQuery: OrderQueryModel = null) {
        this.loading = true;

        if (modelQuery) {
            this.model = modelQuery;
        }

        this.tableData = await this.orderService.getCollectionOrders(
            this.model
        );
        if (this.tableData.data.length) {
            await this.loadUser(this.tableData);
            await this.loadServicer(this.tableData);
            this.loadMessageInfo(this.tableData);
        }

        this.loading = false;
    }
}
