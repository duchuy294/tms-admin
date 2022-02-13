import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Vehicle } from '@/models/vehicle.model';
import { VehicleType } from '@/models/vehicle-type.model';

@Component({
    selector: 'vehicle-item',
    templateUrl: './vehicle-item.component.html'
})
export class VehicleItemComponent implements OnInit {
    @Input() model: Vehicle = new Vehicle();
    @Output() modelChange = new EventEmitter<Vehicle>();
    @Input() vehicle: VehicleType[] = [];
    images = [];
    registrationCertificateImages = [];
    vehicleInsuranceImages = [];
    lang = 'vi';

    constructor(private readonly translateService: TranslateService) {
        this.lang = this.translateService.currentLang;
    }

    ngOnInit() {
        if (this.model.images && this.model.images.length) {
            this.model.images.forEach(image => {
                this.images.push({
                    status: 'done',
                    url: image
                });
            });
        }

        if (
            this.model.registrationCetificateImages &&
            this.model.registrationCetificateImages.length
        ) {
            this.model.registrationCetificateImages.forEach(image => {
                this.registrationCertificateImages.push({
                    status: 'done',
                    url: image
                });
            });
        }

        if (this.model.ensuranceImages && this.model.ensuranceImages.length) {
            this.model.ensuranceImages.forEach(image => {
                this.vehicleInsuranceImages.push({
                    status: 'done',
                    url: image
                });
            });
        }
        if (this.model.typeId) {
            this.loadVehicleChildren();
        }
    }

    changeImages($event, type = 'images') {
        this.model[type] = $event;
        this.modelChange.emit(this.model);
    }
    displayingParent(event) {
        if (this.model.vehicleChildrenType) {
            delete this.model['vehicleChildrenType'];
        }
        if (this.model.capacities) {
            delete this.model['capacities'];
        }
        this.vehicle.forEach(item => {
            if (item.children) {
                item.children.forEach(childrenItem => {
                    if (childrenItem._id === event) {
                        this.model.capacities = [...[event]];
                        const maxWightCurrent = childrenItem.maxWeight;
                        const data = _.filter(item.children, function (value) {
                            return value.maxWeight <= maxWightCurrent;
                        });
                        this.model.vehicleChildrenType = data.sort(
                            (a, b) => a.maxWeight - b.maxWeight
                        );
                        return;
                    }
                });
            }
        });
    }
    loadVehicleChildren() {
        if (this.model.capacities && !_.isEmpty(this.model.capacities)) {
            this.vehicle.forEach(item => {
                if (item.children) {
                    item.children.forEach(childrenItem => {
                        if (childrenItem._id === this.model.typeId) {
                            const maxWightCurrent = childrenItem.maxWeight;
                            const data = _.filter(item.children, function (
                                value
                            ) {
                                return value.maxWeight <= maxWightCurrent;
                            });
                            this.model.vehicleChildrenType = data.sort(
                                (a, b) => a.maxWeight - b.maxWeight
                            );
                            return;
                        }
                    });
                }
            });
        }
    }
    changeMultiSelect(event) {
        if (!_.includes(event, this.model.typeId)) {
            event.unshift(this.model.typeId);
        }
        this.model.capacities = event;
    }
}
