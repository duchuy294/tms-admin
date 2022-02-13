import { Component, ViewChild } from '@angular/core';
import { LocationService } from '@/modules/location/services/location.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RegionGridComponent } from './../region-grid/region-grid.component';
import { FlatLocationModel } from '@/modules/location/components/address/address.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'region-list',
    templateUrl: './region-list.component.html'
})
export class RegionListComponent {
    addRegionModalVisible: boolean = false;
    regionName: string;
    regionToEdit: FlatLocationModel = null;
    @ViewChild('regionGrid') regionGrid: RegionGridComponent;

    constructor(
        private locationService: LocationService,
        private messageService: NzMessageService,
        private modalService: NzModalService,
        private translateService: TranslateService,
    ) { }

    handleAddRegionModalVisible(flag = true) {
        this.addRegionModalVisible = !!flag;
    }

    addRegion() {
        this.regionToEdit = null;
        this.handleAddRegionModalVisible();
    }

    async editRegion(regionId) {
        const regionInstance = await this.locationService.getId(regionId);
        this.regionToEdit = regionInstance;
        this.handleAddRegionModalVisible();
    }

    confirmDelete(regionId) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.deleteRegion(regionId),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async deleteRegion(regionId) {
        const response = await this.locationService.deleleLocation(regionId);
        if (response.errorCode === 0) {
            this.messageService.success(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.region').toLowerCase()} ${this.translateService.instant('common.successfully').toLowerCase()}`);
        } else {
            this.messageService.error(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.region').toLowerCase()} ${this.translateService.instant('common.failed').toLowerCase()}`);
        }
        this.handleAfterSubmit();
    }

    handleAfterSubmit() {
        this.regionGrid.loadData();
        this.regionName = null;
    }

    onRegionNameChange($event) {
        this.regionGrid.loadData($event);
    }
}
