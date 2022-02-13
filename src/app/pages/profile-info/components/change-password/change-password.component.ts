import { BaseModalComponent } from '../../../../components/base-modal.component';
import { ChangePassword } from '../../services/change-password.model';
import { Component, Input } from '@angular/core';
import { ModalService } from 'app/modules/modal/services/modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileInfoService } from '../../services/profile-info.service';

@Component({
    selector: 'change-password',
    templateUrl: 'change-password.component.html'
})
export class ChangePasswordComponent extends BaseModalComponent {
    @Input()
    model: ChangePassword = new ChangePassword();
    public errorModel: ChangePassword = new ChangePassword();
    public passwordNotMatch: boolean = false;

    constructor(
        public activeModal: NgbActiveModal,
        private profileInfoService: ProfileInfoService,
        private modalService: ModalService
    ) {
        super(activeModal);
    }

    async changePassword() {
        if (this.model.newPassword !== this.model.confirmNewPassword) {
            this.passwordNotMatch = true;
            return;
        }

        const result = await this.profileInfoService.changePassword(this.model);

        if (result.errorCode === 0) {
            this.close();
            this.modalService.info(0, true);
        } else {
            this.handleError(result.data);
        }
    }

    private handleError(data: { field: string; message: string }[]) {
        data.forEach(item => {
            this.errorModel[item.field] = item.message;
        });
    }
}
