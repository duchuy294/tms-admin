import { AddressModel, CityModel, DistrictModel } from './address.model';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FilterService } from '@/modules/utility/services/filter.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'address',
    templateUrl: 'address.component.html'
})
export class AddressComponent implements OnInit, OnChanges {
    @Input() required = true;
    @ViewChild('ward') ward: NgForm;
    @ViewChild('street') street: NgForm;
    @ViewChild('cityId') cityId: NgForm;
    @ViewChild('districtId') districtId: NgForm;
    @ViewChild('lat') lat: NgForm;
    @ViewChild('lng') lng: NgForm;
    @Input() model = new AddressModel();
    @Input() forceRender: boolean = false;
    @Input() showLatLngField: boolean = false;
    @Input() requireLatLngField: boolean = false;
    @Output() modelChange = new EventEmitter<AddressModel>();
    cities: CityModel[] = [];
    districts: DistrictModel[] = [];

    constructor(
        private filterService: FilterService
    ) { }
    ngOnChanges(changes) {
        if (changes.model) {
            this.updateDistricts(false);
            if (changes.model.currentValue.ward === '') {
                return;
            }
        }
        if (this.ward && this.ward.invalid) {
            this.ward.control.markAsDirty();
        }
        if (this.cityId && this.cityId.invalid) {
            this.cityId.control.markAsDirty();
        }
        if (this.districtId && this.districtId.invalid) {
            this.districtId.control.markAsDirty();
        }
        if (this.street && this.street.invalid) {
            this.street.control.markAsDirty();
        }
    }

    async ngOnInit() {
        await this.getCities();
        await this.updateDistricts(false);
    }

    async getCities() {
        this.cities = await this.filterService.getCities();
        if (this.model.cityId === '') {
            this.model.cityId = this.cities[0]._id;
        }
    }

    async updateDistricts(clear = true) {
        if (this.model && this.model.cityId) {
            this.districts = await this.filterService.getDistricts(
                this.model.cityId
            );
        }
        if (clear) {
            if (this.districts[0]) {
                this.model.districtId = this.districts[0]._id;
            }
        }
    }

    changeModel() {
        this.modelChange.emit(this.model);
    }

    reset() {
        this.ward.control.markAsPristine();
        this.cityId.control.markAsPristine();
        this.districtId.control.markAsPristine();
        this.street.control.markAsPristine();
    }
}
