import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ReturnWarehouseModel } from '@/modules/delivery/models/return-warehouse.model';
import { ReturnWarehouseService } from '@/modules/delivery/services/return-warehouse.service';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseGridComponent } from './../../../../warehouse/components/warehouse/warehouse-grid/warehouse-grid.component';


@Component({
  selector: 'return-warehouse-list',
  templateUrl: './return-warehouse-list.component.html'
})

export class ReturnWarehouseListComponent {
  addEditReturnWarehouseModalVisible: boolean = false;
  warehouseToEdit: ReturnWarehouseModel = null;
  nameSearch: string;
  @ViewChild('warehouseGrid', { static: true }) warehouseGrid: WarehouseGridComponent;

  constructor(
    private messageService: NzMessageService,
    private modalService: NzModalService,
    private translateService: TranslateService,
    private warehouseService: ReturnWarehouseService
  ) { }
  handleAddEditReturnWarehouseModal(flag = true) {
    this.addEditReturnWarehouseModalVisible = !!flag;
  }

  addWarehouse() {
    this.warehouseToEdit = null;
    this.handleAddEditReturnWarehouseModal();
  }

  async editWarehouse(warehouseId) {
    const warehouse = await this.warehouseService.get(warehouseId);
    this.warehouseToEdit = warehouse;
    this.handleAddEditReturnWarehouseModal();
  }

  confirmDelete(warehouseId) {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('common.confirmDelete'),
      nzOnOk: () => this.deleteWarehouse(warehouseId),
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('common.delete')
    });
  }

  async deleteWarehouse(warehouseId) {
    const response = await this.warehouseService.remove(warehouseId);
    if (response.errorCode === 0) {
      this.messageService.success(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.return-warehouse').toLowerCase()} ${this.translateService.instant('common.successfully').toLowerCase()}`);
      await this.warehouseGrid.loadData();
    } else {
      this.messageService.error(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.return-warehous').toLowerCase()} ${this.translateService.instant('common.failed').toLowerCase()}`);
    }
  }

  handleAfterSubmit() {
    this.warehouseGrid.loadData();
  }

  onNameChange($event) {
    this.warehouseGrid.loadData($event);
  }
}
