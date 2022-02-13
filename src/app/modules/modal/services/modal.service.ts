import * as _ from 'lodash';
import { IModal } from './../models/IModal';
import { Injectable } from '@angular/core';
import { ModalContentComponent } from './../components/modal-content.component';
import { ModalType } from './../types/ModalType';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ModalService {
    constructor(private ngbModal: NgbModal) { }
    public open(data: IModal) {
        const modalContent: ModalContentComponent = this.ngbModal.open(
            ModalContentComponent
        ).componentInstance;
        modalContent.data = data;
    }

    public confirm(data: IModal, onYes?: () => any) {
        data.title =
            _.isNull(data.title) || _.isUndefined(data.title)
                ? 'Confirm'
                : data.title;
        data.type = ModalType.Confirm;
        const modalContent: ModalContentComponent = this.ngbModal.open(
            ModalContentComponent
        ).componentInstance;
        modalContent.data = data;
        modalContent.confirm.subscribe(() => {
            onYes();
        });
    }

    public info(errorCode: number, isUpdate = true) {
        const messageType = isUpdate ? 'Cập nhật' : 'Tạo';
        const message =
            errorCode === 0
                ? `${messageType} thành công!`
                : `${messageType} thất bại!`;
        this.open({
            title: 'Thông báo',
            message,
            type: ModalType.Alert
        });
    }

    public warning(message: string) {
        this.open({
            title: 'Thông báo',
            message,
            type: ModalType.Alert
        });
    }
}
