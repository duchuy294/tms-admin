import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderModel } from 'app/modules/order/models/order.model';
import { OrderService } from '../../services/order.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'operator-note',
    templateUrl: './operator-note.component.html',
    styleUrls: ['./operator-note.component.less']
})
export class OperatorNoteComponent implements OnChanges {
    @ViewChild('noteOperator') noteOperator: NgForm;

    @Input() order: OrderModel = null;
    @Input() visible: boolean = false;
    @Input()
    set loading(value: boolean) {
        this.loadingNoteoPeratorForm = value;
    }
    adminNoteEdit: string = this.order ? this.order.adminNote : null;
    processing: boolean = true;

    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() handleLoading = new EventEmitter<boolean>();
    @Output() submit = new EventEmitter<{
        success?: boolean;
        data?: string;
    }>();

    visibleNoteOperatorForm: boolean = false;
    loadingNoteoPeratorForm: boolean = false;

    constructor(
        private messageService: NzMessageService,
        private translateService: TranslateService,
        public orderService: OrderService) { }

    ngOnChanges() {
        if (this.processing && this.order) {
            this.adminNoteEdit = this.order.adminNote;
        }
    }

    async update() {
        this.processing = false;
        this.handleLoadingModal(true);
        if (this.noteOperator.valid && this.order) {
            const response = await this.orderService.update(this.order._id, new OrderModel({ adminNote: this.adminNoteEdit }));
            if (this.order) {
                this.order.adminNote = this.adminNoteEdit;
            }
            this.submit.emit({ success: response, data: this.adminNoteEdit });
            this.processing = true;
        } else {
            CommonHelper.validateForm(this.noteOperator);
            this.messageService.warning(this.translateService.instant('common.invalid-data'));
        }
    }

    reset() {
        if (this.order) {
            this.adminNoteEdit = this.order.adminNote;
        }
        CommonHelper.resetForm(this.noteOperator);
    }

    cancel() {
        this.reset();
        this.handleVisibleModal(false);
    }

    handleVisibleModal(flag?) {
        this.handleVisible.emit(!!flag);
    }

    handleLoadingModal(flag?) {
        this.handleLoading.emit(!!flag);
    }

}
