import * as _ from 'lodash';
import { FlatLocationModel, LocationLevel } from '@/modules/location/components/address/address.model';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { LocationService } from '@/modules/location/services/location.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'add-edit-wards-modal',
    templateUrl: './add-edit-wards-modal.component.html',
    styleUrls: ['../modal.less']
})
export class AddEditWardsModalComponent implements OnInit, OnChanges {
    districtOptions: FlatLocationModel[] = [];
    isProcessing: boolean = false;
    model: FlatLocationModel = new FlatLocationModel();
    selectedDistrict: string;
    cityOptions: FlatLocationModel[] = [];
    selectedCity: string = null;
    @Input() wardsModel: FlatLocationModel;
    @Input() visible: boolean = false;
    @Output() handleVisible = new EventEmitter();
    @Output() afterSubmit = new EventEmitter();
    @ViewChild('addEditForm') addEditForm: NgForm;
    @ViewChild('inputElement') inputElement: ElementRef;
    inputVisible = false;
    inputValue = '';

    get modelDistrict() {
        return this.model ? this.model.parentCode : null;
    }

    set modelDistrict(code) {
        this.model.parentCode = code;
        this.selectedDistrict = code;
    }

    constructor(
        private locationService: LocationService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    async ngOnInit() {
        const citis = await this.locationService.filter(new QueryModel({ level: LocationLevel.CITY, limit: 500 }));
        this.cityOptions = citis.data;
        const districts = await this.locationService.filter(new QueryModel({ level: LocationLevel.DISTRICT, limit: 500 }));
        this.districtOptions = districts.data;
    }

    async ngOnChanges() {
        if (this.visible) {
            this.model = new FlatLocationModel(this.wardsModel);
            if (this.model.parentCode) {
                const districtSelected = await this.locationService.filter(new QueryModel({ codes: this.model.parentCode, limit: 1 }));
                if (districtSelected.data && districtSelected.data[0] && districtSelected.data[0].parentCode) {
                    this.selectedCity = districtSelected.data[0].parentCode;
                    const districts = await this.locationService.filter(new QueryModel({ parentCode: districtSelected.data[0].parentCode, limit: 500 }));
                    this.districtOptions = districts.data;
                }
            }
        } else {
            this.selectedCity = null;
        }

    }

    init() {
        if (this.wardsModel) {
            this.model = new FlatLocationModel(this.wardsModel);
        } else {
            this.model = new FlatLocationModel();
        }
    }

    handleVisibleModal(flag = true) {
        this.handleVisible.emit(!!flag);
    }

    async submit() {
        if (this.isProcessing) {
            return;
        }
        this.model = this.locationService.trimData(this.model);
        if (this.addEditForm.valid) {
            if (_.isEmpty(this.model.name)) {
                return;
            }
            this.model.parentCode = this.selectedDistrict;
            this.isProcessing = true;
            let response;
            this.model.level = LocationLevel.WARD;
            if (this.wardsModel) {
                response = await this.locationService.updateLocation(this.model);
            } else {
                response = await this.locationService.addLocation(this.model);
            }
            this.isProcessing = false;
            if (response.errorCode === 0) {
                this.afterSubmit.emit();
                this.handleVisibleModal(false);
                this.messageService.success(`${this.translateService.instant(`actions.${this.wardsModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
                this.reset();
            } else {
                this.messageService.error(response.message);
            }
        } else {
            CommonHelper.validateForm(this.addEditForm);
        }
    }

    cancel() {
        this.reset();
        this.handleVisibleModal(false);
    }

    reset() {
        this.init();
        CommonHelper.resetForm(this.addEditForm);
    }

    async onChangeCity($event) {
        this.model.parentCode = null;
        const response = await this.locationService.filter(new QueryModel({ limit: 500, parentCode: $event }));
        this.districtOptions = response.data;
    }

    handleClose(removedTag: {}) {
        this.model.matches = this.model.matches.filter(tag => tag !== removedTag);
    }

    sliceTagName(tag: string) {
        const isLongTag = tag.length > 20;
        return isLongTag ? `${tag.slice(0, 20)}...` : tag;
    }

    showInput() {
        this.inputVisible = true;
        const _this = this;
        setTimeout(() => {
            _this.inputElement.nativeElement && _this.inputElement.nativeElement.focus();
        }, 10);
    }

    handleInputConfirm() {
        if (this.inputValue && this.model.matches.indexOf(this.inputValue) === -1) {
            this.model.matches = [...this.model.matches, this.inputValue];
        }
        this.inputValue = '';
        this.inputVisible = false;
    }

}
