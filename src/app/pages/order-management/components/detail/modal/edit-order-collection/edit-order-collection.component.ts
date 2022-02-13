import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'edit-order-collection',
    templateUrl: './edit-order-collection.component.html'
})
export class EditOrderCollectionComponent {
    constructor(public activeModal: NgbActiveModal) { }
}
