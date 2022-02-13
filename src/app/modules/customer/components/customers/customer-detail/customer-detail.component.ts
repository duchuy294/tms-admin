import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../../../models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { OrderGridComponent } from './../../../../order/components/order-grid/order-grid.component';
import { OrderModel } from '../../../../order/models/order.model';
import { OrderStatisticModel } from '@/modules/order/models/order-statistic.model';
import { OrderStatisticService } from '@/modules/order/services/order-statistic.service';
import { PagingModel } from '../../../../utility/components/paging/paging.model';
import { QueryModel } from '../../../../../models/query.model';
import { UserType } from '@/constants/UserType';
import { WalletModel } from '../../../../finance/models/wallet.model';

@Component({
    selector: 'customer-detail',
    templateUrl: 'customer-detail.component.html',
    styleUrls: ['./customer-detail.component.less']
})

export class CustomerDetailComponent implements OnInit {
    @Input() model: Customer = new Customer();
    @ViewChild('orderGrid') orderGrid: OrderGridComponent;
    customerId = [this.route.snapshot.paramMap.get('id')];
    public orderPaging = new PagingModel<OrderModel>();
    public query: QueryModel = new QueryModel();
    public wallet = new WalletModel();
    public filterVisible: boolean = false;
    public visibleStaffDetail: boolean = false;
    visibleCollectionDebtHistory: boolean = false;
    visibleRatingDetailModal: boolean = false;
    visibleTransactionHistory: boolean = false;
    customerToModify: Customer;
    customerModifyModalVisible: boolean = false;
    isLoading: boolean = false;
    nameEnterprise = new Customer();
    orderStatisticData: OrderStatisticModel;
    public collectionDebtData = new PagingModel<OrderModel>();

    get isIndividual() {
        return this.model.type === UserType.INDIVIDUAL;
    }

    get isOperator() {
        return this.model.type === UserType.OPERATOR;
    }

    get isEnterprise() {
        return this.model.type === UserType.ENTERPRISE;
    }

    get isStaff() {
        return this.model.type === UserType.STAFF;
    }

    constructor(
        private customerService: CustomerService,
        private orderStatisticService: OrderStatisticService,
        private route: ActivatedRoute,
    ) { }

    async ngOnInit() {
        this.query.userId = this.route.snapshot.paramMap.get('id');
        this.query.page = this.orderPaging.page;
        this.query.limit = this.orderPaging.limit;
        await this.getCustomer();
        await this.loadOrderStatistic();
    }

    async getCustomer() {
        this.isLoading = true;
        this.model = await this.customerService.getCustomer(this.route.snapshot.paramMap.get('id'));
        this.customerToModify = _.cloneDeep(this.model);
        if (this.isStaff) {
            this.nameEnterprise = await this.customerService.getCustomer(this.model.enterpriseId);
        }
        this.isLoading = false;
    }


    toggleFilterVisible() {
        this.filterVisible = !this.filterVisible;
    }

    handleVisibleStaffDetail(flag = false) {
        this.visibleStaffDetail = !!flag;
    }

    async search(query: QueryModel) {
        this.orderPaging.page = 1;
        query.userId = this.query.userId;
        this.query = query;
        await this.getOrders();
    }

    async getOrders() {
        this.query.page = this.orderPaging.page;
        this.query.limit = this.orderPaging.limit;
        this.orderGrid.loadData(this.query);
        await this.loadOrderStatistic();
    }

    handleVisibleTransactionHistory(flag = false) {
        this.visibleTransactionHistory = !!flag;
    }

    showTransaction() {
        this.handleVisibleTransactionHistory(true);
    }

    handleVisibleCollectionDebtHistory(flag = false) {
        this.visibleCollectionDebtHistory = !!flag;
    }

    showCollectionDebt(model: WalletModel) {
        this.wallet = model;
        this.handleVisibleCollectionDebtHistory(true);
    }

    handleRatingDetailModal(flag = true) {
        this.visibleRatingDetailModal = !!flag;
    }

    showRatingDetail() {
        this.handleRatingDetailModal(true);
    }

    handleCustomerModifyModalVisible(flag = true) {
        this.customerModifyModalVisible = flag;
    }

    showModalModify() {
        this.customerToModify = _.cloneDeep(this.model);
        this.handleCustomerModifyModalVisible(true);
    }

    afterEdit() {
        this.getCustomer();
    }

    async loadOrderStatistic() {
        this.orderStatisticData = await this.orderStatisticService.filter(_.assignIn(_.cloneDeep(this.query), { fields: 'totalOrder,totalSuccessfulOrder,totalBaseUserCost' }));
    }
}
