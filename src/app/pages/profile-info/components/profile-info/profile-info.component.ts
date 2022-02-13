import * as _ from 'lodash';
import { ChangePassword } from '../../services/change-password.model';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { Component, OnInit } from '@angular/core';
import { ModalService } from 'app/modules/modal/services/modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from './../../../../modules/profile/models/profile.model';
import { ProfileInfoService } from '../../services/profile-info.service';
import { SessionService } from 'app/modules/utility/services/session.service';
import { UpdateProfileInfoComponent } from '../update-profile-info/update-profile-info.component';
import { UploadFilesModel } from 'app/modules/utility/models/upload-files.model';
import { UploadService } from 'app/modules/utility/services/upload.service';

@Component({
    selector: 'profile-info',
    templateUrl: 'profile-info.component.html'
})
export class ProfileInfoComponent implements OnInit {
    model: Profile;
    public roles: { id: number; value: string }[] = [
        { id: 1, value: 'Admin' },
        { id: 2, value: 'Admin giao hàng' }
    ];
    constructor(
        private ngbModalService: NgbModal,
        private sessionService: SessionService,
        private profileInfoService: ProfileInfoService,
        private uploadService: UploadService,
        private modalService: ModalService
    ) { }

    async ngOnInit() {
        const currentUser = this.sessionService.getCurrentUser();
        this.model = new Profile(currentUser);
    }

    openChangePasswordModal() {
        const modal = this.ngbModalService.open(ChangePasswordComponent, {
            size: 'sm'
        }).componentInstance as ChangePasswordComponent;

        modal.model = new ChangePassword();
        modal.model.userId = this.model._id;
    }

    openUpdateProfileInfoModal() {
        const modal = this.ngbModalService.open(UpdateProfileInfoComponent, {
            size: 'lg',
            windowClass: 'modal-50-percent'
        }).componentInstance as UpdateProfileInfoComponent;

        modal.model = this.model;
    }

    onFileChanged(event) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            const reader = new FileReader();
            reader.onload = () => (this.model.avatar = reader.result.toString());

            reader.readAsDataURL(file);
        }
    }

    async onUpload() {
        const images = await this.uploadService.upload(new UploadFilesModel({
            files: [this.model.avatar],
            path: 'avatar'
        }));

        if (images && images[0]) {
            this.model.avatar = images[0];
            const result = await this.profileInfoService.update(this.model);
            this.modalService.info(result.errorCode);
        }
    }
}
