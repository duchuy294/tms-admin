import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, NgZone, OnChanges, Output, ViewChild } from '@angular/core';
import { DeliveryPointModel } from '@/modules/customer/models/delivery-point.model';
import { DeliveryPointService } from '@/modules/customer/services/deliveryPoint.service';
import { LocationModel } from '@/models/location.model';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'create-modify-delivery-point',
    templateUrl: './create-modify-delivery-point.component.html'
})
export class CreateModifyDeliveryPointComponent implements OnChanges {
    @Input() modifyingModel: DeliveryPointModel = null;
    @Input() visible: boolean = false;
    @Input() endUserId: string = null;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() afterSubmit = new EventEmitter();
    @ViewChild('createModifyForm') createModifyForm: NgForm;
    isProcessing: boolean = false;
    mapVisible: boolean = false;
    model: DeliveryPointModel = new DeliveryPointModel({ status: Status.NEW });
    statusList = [Status.NEW, Status.ACTIVE];
    currentLocation: LocationModel;
    showCurrentLocation: boolean = false;
    showLocationExplain: boolean = false;

    constructor(
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private enduserService: DeliveryPointService,
        private zone: NgZone,
    ) { }

    ngOnChanges() {
        if (this.visible) {
            this.init();
        }
    }

    handleVisibleModel(flag = false) {
        this.handleVisible.emit(!!flag);
    }

    init() {
        if (this.modifyingModel) {
            this.model = _.cloneDeep(this.modifyingModel);
            if (this.model.location && this.model.location.latitude && this.model.location.longitude) {
                this.model.location.lat = this.model.location.latitude;
                this.model.location.lng = this.model.location.longitude;
            }
        } else {
            this.model = new DeliveryPointModel({ status: Status.NEW });
            this.model.endUserId = this.endUserId;
        }
    }

    locationToCoordinates(location) {
        if (location && location.lat && location.lng) {
            const { lat, lng } = location;
            this.model.location.type = 'Point';
            this.model.location.coordinates = [lng, lat];
            this.showCurrentLocation = false;
        }
    }

    async submit() {
        if (this.isProcessing) {
            return;
        }
        this.enduserService.trimData(this.model);
        if (this.createModifyForm.valid && !_.isEmpty(this.model.name) && this.valid() && !_.isEmpty(this.model.phone) && !_.isEmpty(this.model.location)) {
            this.isProcessing = true;
            this.locationToCoordinates(this.model.location);
            const location = _.cloneDeep(this.model.location);
            this.model.location = new LocationModel();
            if (location.coordinates) {
                this.model.location.coordinates = location.coordinates;
                this.model.location.type = location.type;
            }
            let response;
            if (this.modifyingModel) {
                response = await this.enduserService.updateDeliveryPoint(this.model);
            } else {
                response = await this.enduserService.createDeliveryPoint(this.model);
            }
            this.model.location = location;
            this.isProcessing = false;
            if (response.errorCode === 0) {
                this.afterSubmit.emit();
                this.handleVisibleModel(false);
                this.messageService.success(`${this.translateService.instant(`actions.${this.modifyingModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
                this.reset();
            } else {
                this.messageService.error(response.message);
                this.messageService.warning(this.translateService.instant('common.invalid-data'));
            }
        } else {
            CommonHelper.validateForm(this.createModifyForm);
            this.messageService.warning(this.translateService.instant('common.invalid-data'));
        }
    }

    cancle() {
        this.reset();
        this.handleVisibleModel(false);
    }


    reset() {
        this.init();
        this.showLocationExplain = false;
        this.mapVisible = false;
        CommonHelper.resetForm(this.createModifyForm);
    }

    handleAutocompleteChange($event) {
        this.model.mapAddress = $event;
        this.model.location = null;
    }

    validLocation() {
        return this.model.mapAddress && this.model.location;
    }

    updateLocation($event) {
        this.model.location = new LocationModel({
            latitude: $event.geometry.location.lat(),
            longitude: $event.geometry.location.lng(),
            lat: $event.geometry.location.lat(),
            lng: $event.geometry.location.lng()
        });
        this.model.mapAddress = $event.formatted_address;
    }

    toggleMapVisible() {
        this.mapVisible = !this.mapVisible;
    }

    getMapsCenter(center) {
        this.model.location = new LocationModel({
            latitude: center.lat,
            longitude: center.lng,
            lat: center.lat,
            lng: center.lng
        });
        this.model.mapAddress = center.mapAddress;
        this.zone.run(() => { return; });
    }

    get modelLocation() {
        return (this.model && this.model.location && this.model.location.lat && this.model.location.lng && !this.showCurrentLocation)
            ? this.model.location : this.currentLocation;
    }

    set modelLocation(location) {
        this.model.location = location;
    }

    valid() {
        this.showLocationExplain = !this.validLocation();
        return this.createModifyForm.valid && this.validLocation();
    }
}
