import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PriceSettingService } from './../../../services/price-setting.service';
import { QueryModel } from '@/models/query.model';
import { ServiceGroupModalComponent } from './service-group-modal.component';
import { ServiceModalComponent } from './service-modal.component';
import { ServiceModel } from 'app/modules/price/models/service.model';
import { ServiceService } from 'app/modules/price/services/service.service';
import { ServiceStyle } from 'app/modules/price/constants/ServiceStyle';
import { ServiceType } from 'app/modules/price/constants/ServiceType';
import { ServiceUnitModel } from 'app/modules/price/models/service-unit.model';
import { ServiceUnitService } from './../../../services/service-unit.service';
import { TranslateService } from '@ngx-translate/core';
import { UploadFilesModel } from 'app/modules/utility/models/upload-files.model';
import { UploadService } from 'app/modules/utility/services/upload.service';

@Component({
    selector: 'price-installation',
    templateUrl: 'price-installation.component.html',
    styles: ['.group-icon { width: 50px }']
})
export class PriceInstallationComponent implements OnInit {
    units: ServiceUnitModel[] = [];
    @Input() public priceFormId;
    public services: ServiceModel[] = [];
    public query: QueryModel;

    constructor(
        public priceSettingService: PriceSettingService,
        public translate: TranslateService,
        public uploadService: UploadService,
        private modalService: NgbModal,
        public serviceUnitService: ServiceUnitService,
        public serviceService: ServiceService,
        private messageService: NzMessageService) { }

    async ngOnInit() {
        this.query = new QueryModel({ limit: 1000, structure: true, style: `${ServiceStyle.Installation},${ServiceStyle.Installation_AddonService}`, priceFormId: this.priceFormId });
        this.units = await this.serviceUnitService.list();
        await this._reloadData();
    }

    async _reloadData() {
        this.services = (await this.serviceService.filter(this.query)).data;
    }

    async confirmDeleteService(service: ServiceModel) {
        if (confirm(this.translate.instant('common.confirmDelete'))) {
            const response = await this.serviceService.delete(service._id);
            if (response.errorCode === 0) {
                await this._reloadData();
            } else {
                this.messageService.error(response.message);
            }
        }
    }

    async updatePrice(service: ServiceModel) {
        service.priceFormId = this.priceFormId;
        if (await this.serviceService.update(service._id, service)) {
            service.changed = false;
        }
    }

    async onPriceChange(value: any, service: ServiceModel) {
        if (value.type !== 'change') {
            service.price = value;
            service.changed = true;
        }
    }

    async onUserPriceChange(value: any, service: ServiceModel) {
        if (value.type !== 'change') {
            service.userPrice = value;
            service.changed = true;
        }
    }

    async onServicerPriceChange(value: any, service: ServiceModel) {
        if (value.type !== 'change') {
            service.servicerPrice = value;
            service.changed = true;
        }
    }

    async openServiceModal(serviceGroup: ServiceModel) {
        const modalRef = this.modalService.open(ServiceModalComponent).componentInstance as ServiceModalComponent;
        modalRef.groups = serviceGroup.children;
        modalRef.units = this.units;
        modalRef.service = new ServiceModel({
            style: serviceGroup.style,
            type: ServiceType.SelectAndInput,
            parentId: modalRef.groups[0]._id,
            price: 0,
            unit: this.units[0].value,
            priceFormId: this.priceFormId
        });
        modalRef.onSave = this._addService.bind(this);
    }

    async openServiceGroupModal(serviceGroup: ServiceModel) {
        const modalRef = this.modalService.open(ServiceGroupModalComponent).componentInstance as ServiceGroupModalComponent;
        modalRef.service = new ServiceModel({
            style: serviceGroup.style,
            type: ServiceType.SelectAndInput,
            parentId: serviceGroup._id
        });
        modalRef.onSave = this._addService.bind(this);
    }

    async _addService(service: ServiceModel) {
        if (service.imgUrl) {
            const files = await this.uploadService.uploadBase64(new UploadFilesModel({
                files: [service.imgUrl],
                path: 'services'
            }));

            service.imgUrl = files[0].fullPath;
        }
        if (await this.serviceService.add(service)) {
            await this._reloadData();
        }
    }
}
