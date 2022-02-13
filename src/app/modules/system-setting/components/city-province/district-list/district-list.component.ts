import { Component, ViewChild } from '@angular/core';
import { DistrictGridComponent } from './../district-grid/district-grid.component';
import { FlatLocationModel } from '@/modules/location/components/address/address.model';
import { LocationService } from '@/modules/location/services/location.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'district-list',
  templateUrl: './district-list.component.html'
})
export class DistrictListComponent {
  @ViewChild('districtGrid', { static: true }) districtGrid: DistrictGridComponent;
  constructor(private modalService: NzModalService, private translateService: TranslateService, private locationService: LocationService, private messageService: NzMessageService) { }
  addEditDistrictModalVisible: boolean = false;
  districtToEdit: FlatLocationModel = null;
  districtName: string;

  addDistrict() {
    this.districtToEdit = null;
    this.handleAddEditDistrictModal();
  }

  confirmDelete(districtId) {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('common.confirmDelete'),
      nzOnOk: () => this.deleteDistrict(districtId),
      nzCancelText: this.translateService.instant('actions.cancel'),
      nzOkText: this.translateService.instant('common.delete')
    });
  }

  async deleteDistrict(districtId) {
    const response = await this.locationService.deleleLocation(districtId);
    if (response.errorCode === 0) {
      this.messageService.success(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.district').toLowerCase()} ${this.translateService.instant('common.successfully').toLowerCase()}`);
    } else {
      this.messageService.error(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.district').toLowerCase()} ${this.translateService.instant('common.failed').toLowerCase()}`);
    }
    this.handleAfterSubmit();
  }

  async editDistrict(districtId) {
    const district = await this.locationService.getId(districtId);
    this.districtToEdit = district;
    this.handleAddEditDistrictModal();

  }

  onDistrictNameChange($event) {
    this.districtGrid.loadDistrictList($event, 1);
  }

  handleAddEditDistrictModal(flag = true) {
    this.addEditDistrictModalVisible = !!flag;
  }

  handleAfterSubmit() {
    this.districtGrid.loadDistrictList();
    this.districtName = null;
  }
}
