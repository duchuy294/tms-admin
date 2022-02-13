import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserLevelModel } from '@/modules/user/models/user-level.model';
import { UserLevelService } from '@/modules/user/services/user-level.service';
import { UserStatus } from '@/constants/UserStatus';

@Component({
    selector: 'create-user-level',
    templateUrl: './create-user-level.component.html'
})
export class CreateUserLevelComponent {
    @Input() visibleModal: boolean = false;
    @Output() visibleModalChange = new EventEmitter<boolean>();
    @Output() update = new EventEmitter();
    @ViewChild('userLevelForm') userLevelForm: NgForm;
    modelQuery: UserLevelModel = new UserLevelModel();
    userType: number = 0;
    statuses = [UserStatus.NEW, UserStatus.ACTIVE];
    coverImage = [];
    image = [];
    statusDisabled: boolean = false;

    @Input()
    set model(value) {
        this.modelQuery = value;
        this.loadEdit();
    }

    async loadEdit() {
        if (this.model.image) {
            this.image = [
                {
                    url: this.model.image,
                    status: 'done'
                }
            ];
        }

        if (this.model.coverImage) {
            this.coverImage = [
                {
                    url: this.model.coverImage,
                    status: 'done'
                }
            ];
        }
        this.userType = 0;
        if (this.model.minPoint === -1) {
            this.userType = 1;
        }
        if (this.model.status === UserStatus.ACTIVE) {
            this.statusDisabled = true;
        }
    }

    get model() {
        return this.modelQuery;
    }

    constructor(
        private messageService: NzMessageService,
        private userLevelService: UserLevelService
    ) { }

    handleVisibleModal(flag?) {
        this.visibleModal = !!flag;
        this.visibleModalChange.emit(this.visibleModal);
        if (!this.visibleModal) {
            this.onReset();
        }
    }

    updateContentImg($event, type = 'image') {
        this.model[type] = '';
        if ($event.length) {
            this.model[type] = $event[0];
        }
    }

    async onCreate() {
        if (this.userLevelForm.valid) {
            if (!this.model.image) {
                this.messageService.warning('Vui lòng chọn ảnh đại diện');
                return;
            }
            if (this.userType === 1) {
                this.model.minPoint = -1;
            }
            const response = await this.userLevelService[
                this.model._id ? 'update' : 'create'
            ](this.model);

            this.messageService[response.success ? 'success' : 'error'](
                CommonHelper.errorMessage(
                    response,
                    !response.success
                        ? response.message
                        : `${
                        this.model._id ? 'Sửa' : 'Thêm'
                        } cấp thành viên thành công'`
                )
            );
            if (response.success) {
                this.update.emit(response);
                this.handleVisibleModal();
            }
        } else {
            CommonHelper.validateForm(this.userLevelForm);
        }
    }

    onReset() {
        this.coverImage = [];
        this.image = [];
        this.statusDisabled = false;
        this.modelQuery = new UserLevelModel();
        CommonHelper.resetForm(this.userLevelForm);
    }
}
