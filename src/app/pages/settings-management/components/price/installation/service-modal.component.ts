import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceModel } from 'app/modules/price/models/service.model';
import { ServiceUnitModel } from 'app/modules/price/models/service-unit.model';

@Component({
    selector: 'service-modal',
    templateUrl: 'service-modal.component.html'
})
export class ServiceModalComponent {
    public units: ServiceUnitModel[] = [];
    public groups: ServiceModel[] = [];
    public service = new ServiceModel();
    public onSave: (service: ServiceModel) => void;

    constructor(public activeModal: NgbActiveModal) { }

    public async save() {
        await this.onSave(this.service);

        this.activeModal.close();
    }

    close() {
        this.activeModal.close();
    }

    public async updateIcon(picture) {
        this.service.imgUrl = picture;
    }
}
