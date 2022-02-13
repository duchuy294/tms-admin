import * as _ from 'lodash';
import { AddressModel, FlatLocationModel } from '@/modules/location/components/address/address.model';
import { CommonHelper } from '@/utility/common/common.helper';
import { LocationModel } from '@/models/location.model';
import { LocationService } from '@/modules/location/services/location.service';
import { NgForm } from '@angular/forms';
import { NzUploadFileType } from '@/constants/nz-upload-file-type.enum';
import { QueryModel } from '@/models/query.model';
import { Status } from '@/constants/status.enum';
import { WarehouseModel } from '@/modules/warehouse/models/warehouse.model';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';
import { WarehouseServiceModel } from '@/modules/warehouse/models/warehouseService.model';
import {
    Component,
    EventEmitter,
    Input,
    NgZone,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'warehouse-information-tab',
    templateUrl: './warehouse-information-tab.component.html'
})

export class WarehouseInformationTabComponent implements OnInit {
    @Input() model: WarehouseModel = new WarehouseModel();
    @Output() handleSubmit: EventEmitter<any> = new EventEmitter();
    @ViewChild('form') form: NgForm;
    isLoading: boolean = false;
    limit = 100;
    _city: any;
    cities: FlatLocationModel[] = [];
    districts: FlatLocationModel[] = [];
    wards: FlatLocationModel[] = [];

    serviceList: WarehouseServiceModel[] = [];
    fileType = NzUploadFileType.IMAGE;

    showAvatarExplain: boolean = false;
    showLocationExplain: boolean = false;
    mapVisible: boolean = false;
    currentLocation: LocationModel;
    showCurrentLocation: boolean = false;

    imageFields = ['images', 'fireProtectLicenseImages', 'warehouseMapImages', 'contractImages'];
    _images = [];
    _fireProtectLicenseImages = [];
    _warehouseMapImages = [];
    _contractImages = [];

    get district() {
        return this.model.address && this.model.address.district ? this.model.address.district : null;
    }

    set district(value) {
        this.model.address.district = value;
    }

    get ward() {
        return this.model.address && this.model.address.ward ? this.model.address.ward : null;
    }

    set ward(value) {
        this.model.address.ward = value;
    }

    get street() {
        return this.model.address && this.model.address.street ? this.model.address.street : null;
    }

    set street(value) {
        this.model.address.street = value;
    }

    get modelLocation() {
        return (this.model && this.model.location && this.model.location.lat && this.model.location.lng && !this.showCurrentLocation)
            ? this.model.location : this.currentLocation;
    }

    set modelLocation(location) {
        this.model.location = location;
    }

    constructor(
        private locationService: LocationService,
        private warehouseService: WarehouseService,
        private zone: NgZone,
    ) { }

    async ngOnInit() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(point => {
                this.currentLocation = new LocationModel({ lat: point.coords.latitude, lng: point.coords.longitude });
            });
        }
        this.isLoading = true;
        const response = await this.getCities();
        const response2 = await this.getServices();
        if (response && response2) {
            this.loadData();
        }
        this.isLoading = false;
    }

    async loadData() {
        if (this.model.address && this.model.address.city) {
            await this.initCity();
        } else {
            if (!this.model.address) {
                this.model.address = new AddressModel();
            }
        }
        for (const field of this.imageFields) {
            if (this.model[field] && this.model[field].length) {
                this.model[field].forEach(image => {
                    this[`_${field}`] = [
                        ...this[`_${field}`],
                        {
                            uid: _.uniqueId('i'),
                            status: 'done',
                            url: image
                        }
                    ];
                });
            }
        }
        if (this.model._id) {
            this.preProcessLocation(this.model.location);
        }
    }

    async getCities() {
        const response = await this.locationService.filter(new QueryModel({ level: 2, limit: this.limit }));
        this.cities = response.data;
        return true;
    }

    async initCity() {
        const response = await this.locationService.filter(new QueryModel({ code: this.model.address.city }));
        const cityObject = !_.isEmpty(response.data) ? response.data[0] : null;
        if (cityObject) {
            this._city = cityObject.name;
            this.getDistricts(cityObject.code);
        }

        if (this.model && this.model.address.district) {
            const response = await this.locationService.filter(new QueryModel({ limit: 500, parentCode: this.model.address.district }));
            this.wards = response.data;
        }
    }

    async getDistricts(code: string = null) {
        const response = await this.locationService.filter(new QueryModel({ limit: this.limit, parentCOde: `${code}` }));
        this.districts = response.data;
    }

    async getServices() {
        const response = await this.warehouseService.filterService(new QueryModel({ limit: this.limit, status: Status.ACTIVE }));
        this.serviceList = response.data;
        return true;
    }

    async onCityChange($event) {
        if (!this.model.address) {
            this.model.address = new AddressModel();
        }
        this.model.address.city = $event;
        delete this.model.address.district;

        const response = await this.locationService.filter(new QueryModel({ code: this.model.address.city }));
        const cityObject = !_.isEmpty(response.data) ? response.data[0] : null;
        if (cityObject) {
            await this.getDistricts(cityObject.code);
        }
    }

    preProcessLocation(location) {
        this.showCurrentLocation = false;
        if (location) {
            location.lng = location.longitude;
            location.lat = location.latitude;
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

    toggleMapVisible() {
        this.mapVisible = !this.mapVisible;
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

    validLocation() {
        return this.model.mapAddress && this.model.location;
    }

    hasAvatar() {
        return this.model.images && this.model.images.length > 0;
    }

    updateImg($event, field) {
        if ($event.length > 0) {
            this.model[field] = $event;
        } else {
            this.model[field] = null;
        }
    }

    submit() {
        this.locationToCoordinates(this.model.location);
        this.handleSubmit.emit({
            model: this.model,
            fields: 'infoFields'
        });
    }

    valid() {
        this.showAvatarExplain = !this.hasAvatar();
        this.showLocationExplain = !this.validLocation();
        return this.form.valid && this.validLocation() && this.hasAvatar();
    }

    validateForm() {
        CommonHelper.validateForm(this.form);
    }

    reset() {
        CommonHelper.resetForm(this.form);
    }
}
