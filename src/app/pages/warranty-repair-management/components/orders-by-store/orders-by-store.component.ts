import { ActivatedRoute } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { CreateStore } from '@/modules/warranty-repair/models/create-store.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderStoreQueryModel } from '@/modules/warranty-repair/models/order-store-query.model';
import { StoreService } from '@/modules/warranty-repair/services/store.service';

@Component({
    selector: 'store-list',
    templateUrl: './orders-by-store.component.html',
    styleUrls: ['./orders-by-store.component.less']
})
export class OrdersByStoreComponent {
    @ViewChild('storeGrid') storeGrid;
    @ViewChild('createStoreModal') createStoreModal;
    model: OrderStoreQueryModel = new OrderStoreQueryModel();
    storeModel: CreateStore = new CreateStore();
    showFilter: boolean = false;
    visibleModal: boolean = false;
    storeId: string = '';
    statisticData = [
        {
            key: 'totalOrders',
            title: 'statistics.order-store.total-order',
            value: 0,
        },
        {
            key: 'totalSuccessfulOrders',
            title: 'statistics.order-store.total-successful-order',
            value: 0,
        },
        {
            key: 'totalIncome',
            title: 'statistics.order-store.total-income',
            value: 0,
        },
        {
            key: 'totalCommissionFee',
            title: 'statistics.order-store.total-commission-fee',
            value: 0,
        },
    ];

    constructor(
        private storeService: StoreService,
        private messageService: NzMessageService,
        private activeRoute: ActivatedRoute
    ) {
        this.activeRoute.params.subscribe(params => {
            if (params.id) {
                this.storeId = params.id;
                (async () => {
                    await this.loadData();
                })();
            }
        });
    }

    async loadData() {
        await this.loadStore();
        await this.loadStatistics();
    }
    async loadStatistics() {
        const data = await this.storeService.getStatistics(this.storeId);
        this.statisticData.forEach(item => {
            item.value = data[item.key] ? data[item.key] : 0;
        });
    }

    async loadStore() {
        this.storeModel = await this.storeService.get(this.storeId);
    }

    handleVisibleModal(flag?: boolean | number | undefined) {
        this.visibleModal = !!flag;
        if (!this.visibleModal) {
            this.createStoreModal.reset();
        }
    }

    async editStore() {
        if (this.storeModel._id) {
            this.storeModel = await this.storeService.get(this.storeModel._id);
            this.handleVisibleModal(true);
        }
    }

    saveStore($event) {
        if ($event.success) {
            this.messageService.success(
                `${
                $event.type === 'create' ? 'Thêm' : 'Cập nhật'
                } trung tâm thành công`
            );
            this.createStoreModal.reset();
            this.handleVisibleModal();
        } else {
            this.messageService.error($event.message);
        }
    }

    toggleFilter() {
        this.showFilter = !this.showFilter;
    }

    search() {
        this.storeGrid.loadData();
    }

    reset() {
        this.storeGrid.loadData();
    }
}
