import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateStore } from '@/modules/warranty-repair/models/create-store.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StoreQueryModel } from 'app/modules/warranty-repair/models/store-query.model';
import { StoreService } from '@/modules/warranty-repair/services/store.service';

@Component({
    selector: 'store-list',
    templateUrl: './store-list.component.html'
})
export class StoreListComponent implements OnInit {
    @ViewChild('storeModal') storeModal;
    @ViewChild('storeGrid') storeGrid;
    model: StoreQueryModel = new StoreQueryModel();
    storeModel: CreateStore = new CreateStore();
    loadingStatistic: boolean = false;
    showFilter: boolean = false;
    visibleModal: boolean = false;
    statisticData = [
        {
            key: 'totalStores',
            title: 'statistics.service-center.total-service-center',
            value: 0,
        },
        {
            key: 'totalWarrantyOrders',
            title: 'statistics.service-center.total-warranty-order',
            value: 0,
        },
        {
            key: 'totalRepairOrders',
            title: 'statistics.service-center.total-repair-order',
            value: 0,
        },
        {
            key: 'totalMembers',
            title: 'statistics.service-center.total-joined-adidi',
            value: 0,
        },
    ];

    constructor(
        private messageService: NzMessageService,
        private storeService: StoreService
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);
        (async () => {
            this.loadData();
        })();
    }

    async loadData() {
        await this.loadStatistics();
    }

    async loadStatistics() {
        this.loadingStatistic = true;
        const data = await this.storeService.getAllStatistics();

        this.statisticData.forEach(item => {
            item.value = data[item.key] ? data[item.key] : 0;
        });

        this.loadingStatistic = false;
    }
    toggleFilter() {
        this.showFilter = !this.showFilter;
    }

    handleVisibleModal(flag?: boolean | number | undefined) {
        this.visibleModal = !!flag;
        if (!this.visibleModal) {
            this.storeModal.reset();
        }
    }

    search() {
        this.storeGrid.loadData();
    }

    reset() {
        this.storeGrid.loadData();
    }

    saveStore($event) {
        if ($event.success) {
            this.messageService.success(
                `${
                $event.type === 'create' ? 'Thêm' : 'Cập nhật'
                } trung tâm thành công`
            );
            this.storeModal.reset();
            this.storeGrid.loadData();
            this.handleVisibleModal();
        } else {
            this.messageService.error($event.message);
        }
    }

    async editStore(storeId: string) {
        const response = await this.storeService.get(storeId);
        this.storeModel = response;
        this.handleVisibleModal(true);
    }
}
