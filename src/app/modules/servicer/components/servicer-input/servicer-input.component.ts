import * as _ from 'lodash';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Servicer } from '../../../servicer/models/servicer/servicer.model';
import { ServicerSelectionComponent } from '../servicer-selection/servicer-selection.component';
import { ServicerService } from '../../../../modules/servicer/services/servicer.service';


@Component({
    selector: 'servicer-input',
    templateUrl: './servicer-input.component.html'
})
export class ServicerInputComponent {
    @Input() multiple = true;
    @Output() select = new EventEmitter<Servicer[]>();
    servicers: Servicer[] = [];

    constructor(
        public ngbModal: NgbModal,
        public servicerService: ServicerService
    ) { }

    async showSelectionModal() {
        const modal = this.ngbModal.open(ServicerSelectionComponent, { size: 'lg', windowClass: 'modal-75-percent' })
            .componentInstance as ServicerSelectionComponent;
        modal.multiple = this.multiple;
        modal.select = this.emitData.bind(this);
    }

    async emitData(servicers: Servicer[]) {
        this.select.emit(servicers);
        this.servicers = servicers;
        return true;
    }

    getValue() {
        return _.map(this.servicers, x => `${x.fullName}`).join(', ');
    }

    reset() {
        this.servicers = [];
    }
}
