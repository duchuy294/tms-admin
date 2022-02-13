import { Component, ViewChild } from '@angular/core';
import { WardsGridComponent } from './../wards-grid/wards-grid.component';
import { FlatLocationModel } from '@/modules/location/components/address/address.model';
import { LocationService } from '@/modules/location/services/location.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wards-list',
  templateUrl: './wards-list.component.html'
})
export class WardsListComponent {
  @ViewChild('wardsGrid', { static: true }) wardsGrid: WardsGridComponent;
  constructor(private modalService: NzModalService, private translateService: TranslateService, private locationService: LocationService, private messageService: NzMessageService) { }
  addEditWardsModalVisible: boolean = false;
  wardsToEdit: FlatLocationModel = null;
  wardsName: string;

  addWards() {
    this.wardsToEdit = null;
    this.handleAddEditWardsModal();
  }

  confirmDelete(wardsId) {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('common.confirmDelete'),
      nzOnOk: () => this.deleteWards(wardsId),
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('common.delete')
    });
  }

  async deleteWards(wardsId) {
    const response = await this.locationService.deleleLocation(wardsId);
    if (response.errorCode === 0) {
      this.messageService.success(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.wards').toLowerCase()} ${this.translateService.instant('common.successfully').toLowerCase()}`);
    } else {
      this.messageService.error(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.wards').toLowerCase()} ${this.translateService.instant('common.failed').toLowerCase()}`);
    }
    this.handleAfterSubmit();
  }

  async editWards(wardsId) {
    const wards = await this.locationService.getId(wardsId);
    this.wardsToEdit = wards;
    this.handleAddEditWardsModal();

  }

  onWardsNameChange($event) {
    this.wardsGrid.loadWardstList($event, 1);
  }

  handleAddEditWardsModal(flag = true) {
    this.addEditWardsModalVisible = !!flag;
  }

  handleAfterSubmit() {
    this.wardsGrid.loadWardstList();
    this.wardsName = null;
  }
}
