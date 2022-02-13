import { Component, EventEmitter, Output } from '@angular/core';
import { IModal } from './../models/IModal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'modal-content',
    templateUrl: './modal-content.component.html'
})
export class ModalContentComponent {
    public data: IModal = {};
    @Output() confirm = new EventEmitter();

    constructor(public activeModal: NgbActiveModal) { }

    confirmClick() {
        this.confirm.emit();
        this.activeModal.close('Confirm Click');
    }
}
