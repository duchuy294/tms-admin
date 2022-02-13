import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { VehicleService } from './../../../../delivery/services/vehicle.service';
import { VehicleSize } from '@/models/vehicle-size.model';
import { VehicleSizeService } from '@/pages/settings-management/services/vehicle-size.service';
import { VehicleType } from './../../../../../models/vehicle-type.model';
import { VehicleTypeEnum } from '@/constants/VehicleTypeEnum';
import { VehicleTypeModel } from '@/modules/vehicle/model/vehicle-type.model';

@Component({
    selector: 'vehicle-editor',
    templateUrl: './vehicle-editor.component.html',
    styleUrls: ['./vehicle-editor.component.less']
})
export class VehicleEditorComponent implements OnChanges {
    @Input() visibleModal: boolean = false;
    @Output() visibleModalChange = new EventEmitter<boolean>();
    @Output() update = new EventEmitter();
    @ViewChild('form') userLevelForm: NgForm;
    @Input() model: VehicleType = new VehicleType();
    vehicleSizeList: VehicleSize[] = [];
    vehicleTypeList: VehicleTypeModel[] = [];
    isProcessing: boolean = false;
    imageSelected = [];
    imageNormal = [];
    imageMarkerLarge = [];
    imageMarkerNormal = [];
    imageMarkerProcessing = [];
    imageMarkerGrooving = [];
    imageMarkerReturn = [];
    imageMarkerCod = [];
    imageMarkerIncident = [];
    imageMarkerOffline = [];

    async ngOnChanges() {
        if (this.visibleModal) {
            this.isProcessing = true;
            this.loadEdit();
            this.isProcessing = false;
        }
    }

    async loadEdit() {
        this.vehicleSizeList = await this.vehicleSizeService.get();
        this.vehicleTypeList = [
            {
                name: this.translateService.instant(
                    'settings.vehicle.typeMotor'
                ),
                type: VehicleTypeEnum.MOTOR
            },
            {
                name: this.translateService.instant(
                    'settings.vehicle.typeTricycles'
                ),
                type: VehicleTypeEnum.TRYCYCLE
            },
            {
                name: this.translateService.instant(
                    'settings.vehicle.typeTruck'
                ),
                type: VehicleTypeEnum.TRUCK
            }
        ];
        if (this.model.imgUrl) {
            this.imageNormal = [{ url: this.model.imgUrl }];
        }

        if (this.model.selectedImgUrl) {
            this.imageSelected = [{ url: this.model.selectedImgUrl }];
        }

        if (this.model.markerIcon) {
            this.imageMarkerNormal = [{ url: this.model.markerIcon }];
        }

        if (this.model.markerSmIcon) {
            this.imageMarkerLarge = [{ url: this.model.markerSmIcon }];
        }

        if (this.model.markerProcessing) {
            this.imageMarkerProcessing = [{ url: this.model.markerProcessing }];
        }

        if (this.model.markerGrooving) {
            this.imageMarkerGrooving = [{ url: this.model.markerGrooving }];
        }

        if (this.model.markerReturn) {
            this.imageMarkerReturn = [{ url: this.model.markerReturn }];
        }

        if (this.model.markerCod) {
            this.imageMarkerCod = [{ url: this.model.markerCod }];
        }

        if (this.model.markerIncident) {
            this.imageMarkerIncident = [{ url: this.model.markerIncident }];
        }

        if (this.model.markerOffline) {
            this.imageMarkerOffline = [{ url: this.model.markerOffline }];
        }
    }

    constructor(
        private messageService: NzMessageService,
        private vehicleService: VehicleService,
        private vehicleSizeService: VehicleSizeService,
        private translateService: TranslateService
    ) { }

    handleVisibleModal(flag = false) {
        this.visibleModal = !!flag;
        this.visibleModalChange.emit(this.visibleModal);
        if (!this.visibleModal) {
            this.onReset();
        }
    }

    updateContentImg($event, type = 'normalImage') {
        switch (type) {
            case 'imageNormal':
                this.model.imgUrl = !_.isEmpty($event) ? $event[0] : null;
                break;
            case 'imageSelected':
                this.model.selectedImgUrl = !_.isEmpty($event)
                    ? $event[0]
                    : null;
                break;
            case 'imageMarkerLarge':
                this.model.markerSmIcon = !_.isEmpty($event) ? $event[0] : null;
                break;
            case 'imageMarkerNormal':
                this.model.markerIcon = !_.isEmpty($event) ? $event[0] : null;
                break;
            case 'imageMarkerProcessing':
                this.model.markerProcessing = !_.isEmpty($event) ? $event[0] : null;
                break;
            case 'imageMarkerGrooving':
                this.model.markerGrooving = !_.isEmpty($event) ? $event[0] : null;
                break;
            case 'imageMarkerReturn':
                this.model.markerReturn = !_.isEmpty($event) ? $event[0] : null;
                break;
            case 'imageMarkerCod':
                this.model.markerCod = !_.isEmpty($event) ? $event[0] : null;
                break;
            case 'imageMarkerIncident':
                this.model.markerIncident = !_.isEmpty($event) ? $event[0] : null;
                break;
            case 'imageMarkerOffline':
                this.model.markerOffline = !_.isEmpty($event) ? $event[0] : null;
                break;
        }
    }

    async onCreate() {
        if (this.userLevelForm.valid) {
            if (!this.model.imgUrl) {
                this.messageService.warning(
                    this.translateService.instant(
                        'form.vehicle-validations.imageNormal'
                    )
                );
                return;
            }
            if (!this.model.selectedImgUrl) {
                this.messageService.warning(
                    this.translateService.instant(
                        'form.vehicle-validations.imageSelected'
                    )
                );
                return;
            }
            if (!this.model.markerIcon) {
                this.messageService.warning(
                    this.translateService.instant(
                        'form.vehicle-validations.imageMarkerNormal'
                    )
                );
                return;
            }
            if (!this.model.markerSmIcon) {
                this.messageService.warning(
                    this.translateService.instant(
                        'form.vehicle-validations.imageMarkerLarge'
                    )
                );
                return;
            }
            if (!this.model.markerProcessing) {
                this.messageService.warning(
                    this.translateService.instant(
                        'form.vehicle-validations.markerProcessing'
                    )
                );
                return;
            }
            if (!this.model.markerGrooving) {
                this.messageService.warning(
                    this.translateService.instant(
                        'form.vehicle-validations.markerGrooving'
                    )
                );
                return;
            }
            if (!this.model.markerReturn) {
                this.messageService.warning(
                    this.translateService.instant(
                        'form.vehicle-validations.markerReturn'
                    )
                );
                return;
            }
            if (!this.model.markerCod) {
                this.messageService.warning(
                    this.translateService.instant(
                        'form.vehicle-validations.markerCod'
                    )
                );
                return;
            }
            if (!this.model.markerIncident) {
                this.messageService.warning(
                    this.translateService.instant(
                        'form.vehicle-validations.markerIncident'
                    )
                );
                return;
            }
            if (!this.model.markerOffline) {
                this.messageService.warning(
                    this.translateService.instant(
                        'form.vehicle-validations.markerOffline'
                    )
                );
                return;
            }
            this.isProcessing = true;
            const response = await this.vehicleService.update(this.model);
            this.isProcessing = false;
            if (response.errorCode === 0) {
                this.onReset();
                this.update.emit();
                this.messageService.success(
                    this.translateService.instant('common.successfully')
                );
                this.handleVisibleModal();
            } else {
                this.messageService.error(response.message);
            }
        } else {
            CommonHelper.validateForm(this.userLevelForm);
        }
    }

    onReset() {
        this.imageSelected = [];
        this.imageNormal = [];
        this.imageMarkerLarge = [];
        this.imageMarkerNormal = [];
        this.imageMarkerProcessing = [];
        this.imageMarkerGrooving = [];
        this.imageMarkerReturn = [];
        this.imageMarkerCod = [];
        this.imageMarkerIncident = [];
        this.model = new VehicleType();
        CommonHelper.resetForm(this.userLevelForm);
    }
}
