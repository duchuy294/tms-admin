import * as _ from 'lodash';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Servicer } from '@/modules/servicer/models/servicer/servicer.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'limit-orders-modify',
    templateUrl: 'limit-orders-modify.component.html'
})
export class LimitOrdersModifyComponent {
    @Input() visibleModal = false;
    @Input() model = new Servicer();
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() updated = new EventEmitter();
    @ViewChild('limitOrdersModifyForm') limitOrdersModifyForm: NgForm;
    numberMask = createNumberMask({ prefix: '', includeThousandsSeparator: false });

    constructor(
        private servicerService: ServicerService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    async confirm() {
        if (this.limitOrdersModifyForm.valid) {
            const isSuccess = await this.servicerService.updateLimitOrder(this.model._id, this.model.limitOrder);
            if (isSuccess) {
                this.reset();
                this.handleVisibleModal(false);
                this.updated.emit();
                this.messageService.success(this.translateService.instant('common.successfully'));
            }
        } else {
            CommonHelper.validateForm(this.limitOrdersModifyForm);
            this.messageService.warning(this.translateService.instant('common.invalid-data'));
        }
    }

    reset() {
        this.limitOrdersModifyForm.reset();
        CommonHelper.resetForm(this.limitOrdersModifyForm, this.model);
    }

    handleVisibleModal(flag = true) {
        this.handleVisible.emit(flag);
    }
}
