import * as _ from 'lodash';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { VehicleService } from '@/modules/delivery/services/vehicle.service';
import { VehicleSize } from './../../../../models/vehicle-size.model';
import { VehicleSizeService } from './../../services/vehicle-size.service';
import { VehicleType } from '@/models/vehicle-type.model';
import { VehicleTypeEnum } from '@/constants/VehicleTypeEnum';

@Component({
    selector: 'vehicle',
    templateUrl: './vehicle.component.html'
})
export class VehicleComponent implements OnInit {
    @Output() modelChange = new EventEmitter();
    @Output() detail = new EventEmitter<string>();
    loading: boolean = false;
    tableModel: VehicleType[] = [];
    sizeModel: VehicleSize[] = [];
    visibleModal: boolean = false;
    vehicleModel: VehicleType = new VehicleType();
    checked: boolean = true;
    lang = this.translateService.currentLang;

    constructor(
        private vehicleService: VehicleService,
        private vehicleSizeService: VehicleSizeService,
        private translateService: TranslateService
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        this.tableModel = await this.vehicleService.getVehicleTypes(false);
        this.sizeModel = await this.vehicleSizeService.get();
        this.loading = false;
    }

    onUpdate() {
        this.loadData();
    }

    addUserLevel() {
        this.visibleModal = true;
    }

    async onEdit(vehicleType: VehicleType) {
        this.vehicleModel = _.cloneDeep(vehicleType);

        this.visibleModal = true;
    }

    isParentVehicle(id: string): boolean {
        return !_.isUndefined(_.find(this.tableModel, ['parentId', id]));
    }

    getVehicleNameBy(id: string): string {
        const vehicle = _.find(this.tableModel, ['_id', id]);
        return _.isUndefined(vehicle) ? '' : vehicle.name[this.lang];
    }

    getSizeNameBy(id: string): string {
        const size = _.find(this.sizeModel, ['_id', id]);
        return _.isUndefined(size) ? '' : size.name;
    }

    getVehicleNameBye(type: number): string {
        switch (type) {
            case VehicleTypeEnum.MOTOR:
                return this.translateService.instant(
                    'settings.vehicle.typeMotor'
                );
            case VehicleTypeEnum.TRYCYCLE:
                return this.translateService.instant(
                    'settings.vehicle.typeTricycles'
                );
            case VehicleTypeEnum.TRUCK:
                return this.translateService.instant(
                    'settings.vehicle.typeTruck'
                );
            default:
                return '';
        }
    }
}
