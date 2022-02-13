import * as _ from 'lodash';
import { FlatLocationModel, LocationLevel } from '@/modules/location/components/address/address.model';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { LocationService } from '@/modules/location/services/location.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'add-city-modal',
    templateUrl: './add-city-modal.component.html',
    styleUrls: ['../modal.less']
})
export class AddCityModalComponent implements OnChanges, OnInit {
    isProcessing: boolean = false;
    model: FlatLocationModel = new FlatLocationModel();
    @Input() cityModel: FlatLocationModel = new FlatLocationModel();
    @Input() visible: boolean = false;
    @Output() handleVisible = new EventEmitter();
    @Output() afterSubmit = new EventEmitter();
    @ViewChild('addCityForm') addCityForm: NgForm;
    @ViewChild('inputElement') inputElement: ElementRef;
    inputVisible = false;
    inputValue = '';

    set order(value) {
        this.model.order = value;
    }

    get order() {
        return this.model.order;
    }

    constructor(
        private locationService: LocationService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
    ) { }

    async ngOnInit() {
    }

    async ngOnChanges() {
        if (this.visible) {
            this.model = new FlatLocationModel(this.cityModel);
        }
    }

    init() {
        if (this.cityModel) {
            this.model = new FlatLocationModel(this.cityModel);
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
        if (!Number.isInteger(this.model.order)) {
            this.messageService.warning(this.translateService.instant('validations-form.orderNo.invalid'));
            this.model.order = Math.floor(this.model.order);
            return;
        }
        if (this.model.order < 0) {
            this.messageService.warning(this.translateService.instant('validations-form.orderNo.invalid'));
            return;
        }
        if (this.addCityForm.valid) {
            if (_.isEmpty(this.model.name)) {
                return;
            }
            this.isProcessing = true;
            let response;
            this.model.level = LocationLevel.CITY;
            if (this.cityModel) {
                response = await this.locationService.updateLocation(this.model);
            } else {
                response = await this.locationService.addLocation(this.model);
            }
            this.isProcessing = false;
            if (response.errorCode === 0) {
                this.afterSubmit.emit();
                this.handleVisibleModal(false);
                this.messageService.success(`${this.translateService.instant(`actions.${this.cityModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
                this.reset();
            } else {
                this.messageService.error(response.message);
            }
        } else {
            CommonHelper.validateForm(this.addCityForm);
        }
    }

    cancel() {
        this.reset();
        this.handleVisibleModal(false);
    }

    reset() {
        this.init();
        CommonHelper.resetForm(this.addCityForm);
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
