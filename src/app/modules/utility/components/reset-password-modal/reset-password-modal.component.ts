import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'reset-password-modal',
    templateUrl: 'reset-password-modal.component.html'
})
export class ResetPasswordModalComponent {
    public password: string = '';
    public rePassword: string = '';
    public id: string = '';
    public update: (userId: string, password: string) => boolean;

    constructor(public ngbActiveModal: NgbActiveModal) { }

    public async confirm() {
        if (this.password === this.rePassword) {
            if (this.update) {
                if (await this.update(this.id, this.password)) {
                    this.ngbActiveModal.close();
                }
            }
        }
    }
}
