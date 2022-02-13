import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseService } from '../../../services/warehouse.service';
import { WarehouseServiceGridComponent } from './../warehouse-service-grid/warehouse-service-grid.component';
import { WarehouseServiceModel } from '../../../models/warehouseService.model';

@Component({
  selector: 'warehouse-service-list',
  templateUrl: './warehouse-service-list.component.html',
})
export class WarehouseServiceListComponent {
  createModifyModalVisible: boolean = false;
  instanceToEdit: WarehouseServiceModel;
  @ViewChild('grid') grid: WarehouseServiceGridComponent;

  constructor(
    private messageService: NzMessageService,
    private modalService: NzModalService,
    private translateService: TranslateService,
    private warehouseService: WarehouseService,
  ) { }

  handleModalVisible(flag = true) {
    this.createModifyModalVisible = !!flag;
  }

  create() {
    this.instanceToEdit = null;
    this.handleModalVisible();
  }

  async modify(id: string = null) {
    const instance = await this.warehouseService.getService(id);
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
    const response = await this.warehouseService.deleteService(id);
    if (response.errorCode === 0) {
      this.messageService.success(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.successfully').toLowerCase()}`);
    } else {
      this.messageService.error(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.failed').toLowerCase()}`);
    }
    this.handleAfterSubmit();
  }

  confirmActivate({ id = null, active = false }) {
    this.modalService.confirm({
      nzTitle: this.translateService.instant(active ? 'common.confirmActivate' : 'common.confirmDeactivate'),
      nzOnOk: () => this.activate(id, active),
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('button.confirm')
    });
  }

  async activate(id: string = null, active = false) {
    const response = await this.warehouseService.activateService(id, active);
    this.handleAfterSubmit();
    if (response.errorCode === 0) {
      this.messageService.success(`${this.translateService.instant('common.successfully')}`);
    } else {
      this.messageService.error(`${this.translateService.instant('common.failed')}`);
    }
  }

  handleAfterSubmit() {
    this.grid.loadData();
  }
}
