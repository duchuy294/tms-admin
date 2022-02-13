import * as _ from 'lodash';
import { BaseModalComponent } from 'app/components/base-modal.component';
import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'app/modules/modal/services/modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from './../../../../modules/profile/models/profile.model';
import { ProfileInfoService } from '../../services/profile-info.service';

@Component({
    selector: 'update-profile-info',
    templateUrl: 'update-profile-info.component.html'
})
export class UpdateProfileInfoComponent extends BaseModalComponent
    implements OnInit {
    @Input()
    model: Profile;
    public defaultModel: Profile;
    public errorModel: Profile = new Profile();
    public selectedRoleId: number = 1;

    constructor(
        public activeModal: NgbActiveModal,
        private profileInfoService: ProfileInfoService,
        private modalService: ModalService
    ) {
        super(activeModal);
    }

    async ngOnInit() {
        this.defaultModel = _.clone(this.model);
    }

    async updateProfile() {
        const result = await this.profileInfoService.update(this.model);

        if (result.errorCode === 0) {
            this.close();
            this.modalService.info(0, true);
        } else {
            this.modalService.info(1, true);
            this.handleError(result.data);
        }
    }

    resetData() {
        this.model = this.defaultModel;
    }

    private handleError(data: { field: string; message: string }[]) {
        data.forEach(item => {
            this.errorModel[item.field] = item.message;
        });
    }
}
