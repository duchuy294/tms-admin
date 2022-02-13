import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseGridComponent } from './../warehouse-grid/warehouse-grid.component';
import { WarehouseModel } from '@/modules/warehouse/models/warehouse.model';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';

@Component({
    selector: 'warehouse-list',
    templateUrl: './warehouse-list.component.html'
})
export class WarehouseListComponent implements OnInit {
    @ViewChild('grid') grid: WarehouseGridComponent;
    createModifyModalVisible: boolean = false;
    instanceToEdit: WarehouseModel;
    filterVisible: boolean = false;
    statisticData = [
        {
            key: 'totalWarehouse',
            title: 'statistics.warehouse.total-warehouse',
            value: 0
        },
        {
            key: 'totalRentArea',
            title: 'statistics.warehouse.total-lease-area',
            value: 0
        },
        {
            key: 'totalOrders',
            title: 'statistics.warehouse.total-order',
            value: 0
        }
    ];

    ngOnInit() {
        window.scrollTo(0, 0);
    }

    constructor(
        private messageService: NzMessageService,
        private modalService: NzModalService,
        private translateService: TranslateService,
        private warehouseService: WarehouseService
    ) { }

    handleModalVisible(flag = true) {
        this.createModifyModalVisible = !!flag;
    }

    create() {
        this.instanceToEdit = null;
        this.handleModalVisible();
    }

    async modify(id: string = null) {
        const instance = await this.warehouseService.getWarehouse(id);
        this.instanceToEdit = instance;
        this.handleModalVisible();
    }

    confirmDelete(id: string = null) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.delete(id),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async delete(id: string = null) {
        const response = await this.warehouseService.deleteWarehouse(id);
        if (response.errorCode === 0) {
            this.messageService.success(
                `${this.translateService.instant(
                    'actions.remove'
                )} ${this.translateService
                    .instant('common.successfully')
                    .toLowerCase()}`
            );
        } else {
            this.messageService.error(
                `${this.translateService.instant(
                    'actions.remove'
                )} ${this.translateService
                    .instant('common.failed')
                    .toLowerCase()}`
            );
        }
        this.handleAfterSubmit();
    }

    search(query: QueryModel) {
        this.grid.triggerLoadData(query);
    }

    handleAfterSubmit() {
        this.grid.loadData();
    }

    toggleFilter() {
        this.filterVisible = !this.filterVisible;
    }

    callbackStatistics(data) {
        this.statisticData.forEach(item => {
            item.value = data[item.key] ? data[item.key] : 0;
        });
    }
}
