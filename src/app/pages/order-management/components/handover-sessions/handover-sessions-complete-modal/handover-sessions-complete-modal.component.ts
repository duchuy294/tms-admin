import * as _ from 'lodash';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HandoverSessionsModel, HandoverSessionsStatus } from '@/pages/order-management/models/handover-sessions.model';

import { HandoverSessionsService } from '@/pages/order-management/service/handover-sessions.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'handover-sessions-complete-modal',
    templateUrl: './handover-sessions-complete-modal.component.html',
})
export class HandoverSessionsCompleteModalComponent implements OnInit {
    @Input() model: HandoverSessionsModel;
    @Input() visibleModal: boolean;
    @Output() onClose = new EventEmitter<boolean>();;
    handoverSessionsStatus = HandoverSessionsStatus;
    loading = false;
    reason = "";
    constructor(
        private handoverSessionsService: HandoverSessionsService,
        private messageService: NzMessageService,
        private translateService: TranslateService,

    ) {

    }

    async ngOnInit() {
    }

    async confirm() {
        const res = await this.handoverSessionsService.completed(this.model._id, this.reason);
        if (res.errorCode === 0) {
            this.messageService.success(this.translateService.instant('common.successfully'));
            this.handleVisibleModal(false);
            this.reason = '';
        } else {
            this.messageService.error(this.translateService.instant(res.message));
        }
    }

    handleVisibleModal(flag = false) {
        if (!flag) {
            this.reason = '';
        }
        this.onClose.emit(!!flag);
    }

    checkRecived() {
        return [this.handoverSessionsStatus.new, this.handoverSessionsStatus.processing].includes(this.model.status)
    }

}
