import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceModel } from 'app/modules/price/models/service.model';

@Component({
    selector: 'service-group-modal',
    templateUrl: 'service-group-modal.component.html'
})
export class ServiceGroupModalComponent {
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
