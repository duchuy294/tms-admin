import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export class BaseModalComponent {
    callback: () => void;
    constructor(public activeModal: NgbActiveModal) { }

    close() {
        this.activeModal.close();
    }

    async callSuccessCallback() {
        if (this.callback) {
            await this.callback();
        }
    }
}
