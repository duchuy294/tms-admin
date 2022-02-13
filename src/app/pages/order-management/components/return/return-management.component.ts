import * as _ from 'lodash';
import { AdminPermission } from '@/constants/AdminPermissions';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderAction } from 'app/modules/order/models/order-action.model';
import { OrderGridComponent } from './../../../../modules/order/components/order-grid/order-grid.component';
import { OrderModel } from 'app/modules/order/models/order.model';
import { OrderService } from '@/modules/order/services/order.service';
import { OrderStatus } from 'app/constants/OrderStatus';
import { PackageModel } from '@/modules/order/models/package.model';
import { PagingModel } from 'app/modules/utility/components/paging/paging.model';
import { PointType } from 'app/modules/order/constants/PointType';
import { QueryModel } from 'app/models/query.model';
import { ReturnService } from 'app/modules/delivery/services/return.service';
import { SessionService } from '@/modules/utility/services/session.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'return-management',
    templateUrl: 'return-management.component.html'
})
export class ReturnManagementComponent {
    @ViewChild('orderGrid') orderGrid: OrderGridComponent;
    @ViewChild('singleScanPack') singleScanPack: ElementRef;
    public orderType = null;
    public orderPagination = new PagingModel<OrderModel>();
    public displayFilter = false;
    public query = new QueryModel({ hasReturn: true });
    public actions: OrderAction[] = [new OrderAction({
        name: 'service.return.getCode',
        visible: (order: OrderModel) => {
            const returnWarehouse = _.find(order.detail.points, point => point.type === PointType.ReturnAtWarehouse);
            return returnWarehouse && [OrderStatus.Return, OrderStatus.InProgress].includes(order.status);
        },
        perform: this.openGettingCodeModal.bind(this)
    }), new OrderAction({
        name: 'service.return-pending.receive',
        visible: (order: OrderModel) => {
            return [OrderStatus.Return, OrderStatus.Pending].includes(order.status) && this.canOpenReceiveReturnedProductsModal;
        },
        perform: async (order: OrderModel) => {
            this.packages = [{ orders: [order], soCode: '', valid: true }];
            await this.receiveHandle();
            this.search();
        }
    })];
    visibleModal: boolean = false;
    loading: boolean = false;
    receiving: boolean = false;
    packages: PackageModel[] = [];
    shownPackages: PackageModel[] = [];
    state = [true, false];
    closeAble = false;

    get canOpenReceiveReturnedProductsModal() {
        const profile = this.sessionService.getCurrentUser();
        return profile.roles.includes(AdminPermission.RECEIVER_RETURNED_PRODUCT);
    }

    constructor(
        public returnService: ReturnService,
        private orderService: OrderService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private sessionService: SessionService
    ) { }

    async _updateOrders() {
        this.orderGrid.loadData(this.query);
    }

    async onPageChange() {
        this.query.page = this.orderPagination.page;
        this.query.limit = this.orderPagination.limit;
        await this._updateOrders();
    }

    async search(query = this.query) {
        query.page = 1;
        query.limit = this.query.limit;
        this.query = query;

        await this._updateOrders();
    }

    async openGettingCodeModal(order: OrderModel) {
        const codes = await this.returnService.getCodes(new QueryModel({ orderId: order._id }));
        window.alert(_.join(codes, ', '));
    }

    showModalReceive() {
        this.visibleModal = true;
    }

    hideModalReceive() {
        this.visibleModal = false;
    }

    closePopup() {
        this.resetInputForm();
    }

    clearScanPackInput() {
        if (this.singleScanPack &&
            this.singleScanPack.nativeElement &&
            this.singleScanPack.nativeElement.value)
            this.singleScanPack.nativeElement.value = '';
    }

    resetInputForm() {
        this.shownPackages = [];
        this.packages = [];
        this.loading = false;
        this.receiving = false;
        this.clearScanPackInput();
    }

    isExistedInPackages(value: string) {
        return _.some(this.packages, p => p.packageNo === value);
    }

    getSOCode(packageNo, orders: OrderModel[]) {
        const point = orders.length ? orders[0].detail.points.find(p => _.includes(_.split(p.externalCode, '_'), packageNo)) : null;
        return point ? point.externalCode.split('_')[0] : null;
    }

    updateShownPackages() {
        this.shownPackages = this.packages.filter(x => this.state.indexOf(x.valid) !== -1);
    }

    async removePackage(item: PackageModel) {
        this.packages = this.packages.filter(x => x.packageNo !== item.packageNo);
        this.updateShownPackages();
    }

    async getListPackage(packageNos: string[]) {
        const orders = (await this.orderService.getOrders(new QueryModel({ externalCodes: packageNos, limit: 100000, hasReturn: true, status: `${OrderStatus.Pending},${OrderStatus.Return}`, fields: 'detail' }))).data;

        return packageNos.map((packageNo: string) => {
            const packageOrders = orders.filter(order => order.detail.points.some(point => _.includes(_.split(point.externalCode, '_'), packageNo)));
            return new PackageModel({
                packageNo,
                orders: packageOrders,
                valid: packageOrders.length > 0,
                soCode: this.getSOCode(packageNo, packageOrders)
            });
        });
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
                    this.packages = (await this.getListPackage([scanValue])).concat(this.packages);
                    if (this.packages[0].valid) {
                        audioYes.play();
                    } else {
                        audioNo.play();
                    }
                    this.updateShownPackages();
                    this.loading = false;
                } else {
                    this.messageService.error(
                        this.translateService.instant('common.existed-packages')
                    );
                }
                this.singleScanPack.nativeElement.value = '';
            } else {
                this.messageService.error(
                    this.translateService.instant('common.input-package-code')
                );
            }
        }
    }

    async receiveHandle() {
        const orderIds = [];
        this.packages.forEach(p => {
            orderIds.push(...p.orders.map(order => order._id));
        });
        const response = await this.returnService.returnOrder(orderIds);
        if (!response.success)
            this.messageService.error(response.message);
        else {
            this.hideModalReceive();
            this.messageService.success(
                `${this.translateService.instant('common.successfully')}`
            );
        }
    }
}
