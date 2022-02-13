import { FlatLocationModel } from '@/modules/location/components/address/address.model';
import { CityProvinceGridComponent } from './../city-province-grid/city-province-grid.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LocationService } from '@/modules/location/services/location.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'city-province-list',
    templateUrl: './city-province-list.component.html'
})
export class CityProvinceListComponent implements OnInit {
    addCityModalVisible: boolean = false;
    cityName: string;
    cityToEdit: FlatLocationModel = null;
    @ViewChild('cityGrid') cityGrid: CityProvinceGridComponent;

    constructor(
        private locationService: LocationService,
        private messageService: NzMessageService,
        private modalService: NzModalService,
        private translateService: TranslateService,
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);
    }

    handleAddCityModalVisible(flag = true) {
        this.addCityModalVisible = !!flag;
    }

    addCity() {
        this.cityToEdit = null;
        this.handleAddCityModalVisible();
    }

    async editCity(cityId: string = null) {
        const cityInstance = await this.locationService.getId(cityId);
        this.cityToEdit = cityInstance;
        this.handleAddCityModalVisible();
    }

    confirmDelete(cityId: string = null) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.deleteCity(cityId),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async deleteCity(cityId: string = null) {
        const response = await this.locationService.deleleLocation(cityId);
        if (response.errorCode === 0) {
            this.messageService.success(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.city').toLowerCase()} ${this.translateService.instant('common.successfully').toLowerCase()}`);
        } else {
            this.messageService.error(`${this.translateService.instant('actions.remove')} ${this.translateService.instant('common.city').toLowerCase()} ${this.translateService.instant('common.failed').toLowerCase()}`);
        }
        this.handleAfterSubmit();
    }

    handleAfterSubmit() {
        this.cityGrid.loadData();
        this.cityName = null;
    }

    onCityNameChange($event: string = null) {
        this.cityGrid.loadData($event);
    }
}
