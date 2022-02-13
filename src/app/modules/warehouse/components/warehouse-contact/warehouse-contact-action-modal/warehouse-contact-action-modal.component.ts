import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { WarehouseContactService } from '@/modules/warehouse/services/warehouse-contact.service';

@Component({
    selector: 'warehouse-contact-action-modal',
    templateUrl: './warehouse-contact-action-modal.component.html',
    styleUrls: ['./warehouse-contact-action-modal.component.less']
})
export class WarehouseContactActionModalComponent {
    @ViewChild('form') form: NgForm;
    @Input() model: any;
    @Input() type: number;
    @Input()
    set visible(value: boolean) {
        this.visibleModal = value;
    }
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() submit = new EventEmitter();
    adminNote: string = '';
    visibleModal = false;
    isProcessing = false;

    constructor(
        private warehouseContactService: WarehouseContactService,
        private messageService: NzMessageService,
    ) { }

    handleVisibleModal(flag = false) {
        this.adminNote = '';
        this.handleVisible.emit(!!flag);
    }

    async onSubmit() {
        if (this.form.valid) {
            this.isProcessing = true;
            const response = await this.warehouseContactService.updateStatus(this.model._id, { adminNote: this.adminNote, status: this.type });
            if (response.success) {
                this.submit.emit();
            } else {
                this.messageService.error(response.message);
            }
            this.isProcessing = false;
        } else {
            CommonHelper.validateForm(this.form);
        }
    }
}