import * as _ from 'lodash';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { BranchModel } from '@/modules/admin/models/branch.model';
import { BranchService } from '@/modules/admin/services/branch.service';
import { FlatLocationModel, LocationLevel } from '@/modules/location/components/address/address.model';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { LocationModel } from '@/models/location.model';
import { LocationService } from '@/modules/location/services/location.service';
import { MappComponent } from './../../../../../utility/components/mapp/mapp.component';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'add-adidi-branch-modal',
    templateUrl: './add-adidi-branch-modal.component.html',
    styleUrls: ['../modal.less']
})
export class AddAdidiBranchModalComponent implements OnInit, OnChanges {
    cityOptions: FlatLocationModel[] = [];
    currentLocation: LocationModel;
    districtOptions: FlatLocationModel[] = [];
    wardsOptions: FlatLocationModel[] = [];
    isDraggable: boolean = false;
    isProcessing: boolean = false;
    model: BranchModel = new BranchModel();
    numberMask = createNumberMask({ prefix: '' });
    showCurrentLocation: boolean = false;

    @Input() branchModel: BranchModel = new BranchModel();
    @Input() visible: boolean = false;
    @Output() handleVisible = new EventEmitter();
    @Output() afterSubmit = new EventEmitter();
    @ViewChild('addBranchForm') addBranchForm: NgForm;
    @ViewChild('mapInstance') mapInstance: MappComponent;

    get modelCity() {
        return this.model.address ? this.model.address.city : null;
    }

    set modelCity(city) {
        this.model.address.city = city;
    }

    get modelDistrict() {
        return this.model.address ? this.model.address.district : null;
    }

    set modelDistrict(district) {
        this.model.address.district = district;
    }

    set modelWards(ward) {
        this.model.address.ward = ward;
    }

    get modelWards() {
        return this.model.address ? this.model.address.ward : null;
    }

    get modelLocation() {
        return (this.model && this.model.location && this.model.location.lat && this.model.location.lng && !this.showCurrentLocation)
            ? this.model.location : this.currentLocation;
    }

    set modelLocation(location) {
        this.model.location = location;
    }

    constructor(
        private branchService: BranchService,
        private locationService: LocationService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private zone: NgZone,
    ) { }

    async ngOnInit() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(point => {
                this.currentLocation = new LocationModel({ lat: point.coords.latitude, lng: point.coords.longitude });
            });
        }
        const response = await this.locationService.filter(new QueryModel({ level: LocationLevel.CITY, limit: 100 }));
        this.cityOptions = response.data;
    }

    async ngOnChanges() {
        if (this.visible) {
            this.model = new BranchModel(this.branchModel);
            this.preProcessLocation(this.model.location);
        }
        if (this.model && this.model.address.city) {
            const response = await this.locationService.filter(new QueryModel({ limit: 500, parentCode: this.model.address.city }));
            this.districtOptions = response.data;
        }
        if (this.model && this.model.address.district) {
            const response = await this.locationService.filter(new QueryModel({ limit: 500, parentCode: this.model.address.district }));
            this.wardsOptions = response.data;
        }
    }

    preProcessLocation(location) {
        this.showCurrentLocation = false;
        if (location) {
            location.lng = location.longitude;
            location.lat = location.latitude;
        }
    }

    init() {
        if (this.branchModel) {
            this.model = new BranchModel(this.branchModel);
        } else {
            this.showCurrentLocation = true;
            this.model = new BranchModel();
        }
    }

    async onChangeCity($event) {
        this.model.address.district = null;
        const response = await this.locationService.filter(new QueryModel({ limit: 100, parentCode: $event }));
        this.districtOptions = response.data;
    }

    async onChangeDistrict($event) {
        this.model.address.ward = null;
        const response = await this.locationService.filter(new QueryModel({ limit: 500, parentCode: $event }));
        this.wardsOptions = response.data;
    }

    handleVisibleModal(flag = true) {
        this.handleVisible.emit(!!flag);
    }

    locationToCoordinates(location) {
        const { lat, lng } = location;
        this.model.location.type = 'Point';
        this.model.location = new LocationModel({
            type: 'Point'
        });
        this.model.location.coordinates = [lng, lat];
        this.showCurrentLocation = false;
    }

    async submit() {
        if (this.isProcessing) {
            return;
        }
        this.model = this.locationService.trimData(this.model);
        if (this.addBranchForm.valid) {
            if (_.isEmpty(this.model.mapAddress)) {
                this.messageService.warning(this.translateService.instant('validations-form.mapAddress.required'));
                return;
            }
            if (!this.model.location) {
                this.messageService.warning(this.translateService.instant('validations-form.mapAddress.invalid'));
                return;
            }
            this.locationToCoordinates(this.model.location);
            this.isProcessing = true;
            let response;
            if (this.branchModel) {
                response = await this.branchService.update(this.model);
            } else {
                response = await this.branchService.add(this.model);
            }
            this.isProcessing = false;
            if (response.errorCode === 0) {
                this.afterSubmit.emit();
                this.handleVisibleModal(false);
                this.messageService.success(`${this.translateService.instant(`actions.${this.branchModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
                this.reset();
            } else {
                this.messageService.error(response.message);
            }
        } else {
            CommonHelper.validateForm(this.addBranchForm);
        }
    }

    cancel() {
        this.reset();
        this.handleVisibleModal(false);
    }

    reset() {
        this.init();
        this.isDraggable = false;
        CommonHelper.resetForm(this.addBranchForm);
    }

    getMapsCenter(center) {
        this.zone.run(() => {
            this.model.location = new LocationModel({
                latitude: center.lat,
                longitude: center.lng,
                lat: center.lat,
                lng: center.lng
            });
            this.model.mapAddress = center.mapAddress;
        });
    }

    toggleDraggableFunction() {
        this.isDraggable = !this.isDraggable;
        this.mapInstance.toggleDraggableFunction();
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

    handleAutocompleteChange($event) {
        this.model.mapAddress = $event;
        this.model.location = null;
    }
}
