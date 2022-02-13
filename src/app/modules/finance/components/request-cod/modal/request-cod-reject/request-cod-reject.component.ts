import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { RequestCodListModel } from '@/modules/finance/models/request-cod-list.model';
import { RequestCod } from '@/constants/RequestCod';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RequestCodService } from '@/modules/finance/services/request-cod.service';
import * as _ from 'lodash';
@Component({
    selector: 'request-cod-reject',
    templateUrl: 'request-cod-reject.component.html',
})
export class RequestCodRejectComponent implements OnInit  {

    constructor(
        private requestCodService: RequestCodService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private fb: FormBuilder
    ) { }

    @Input() model: RequestCodListModel;
    @Input() visibleModal: boolean;
    @Input() visibleAction: boolean;
    @Input() loading: boolean;

    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() loadData = new EventEmitter<boolean>();
    requestCod = RequestCod;
    validateForm!: FormGroup;
    reason: number = 1;
    ngOnInit() {
        this.validateForm = this.fb.group({
            note: [null],
        });
    }


    handleVisibleModal(flag = false) {
        this.handleVisible.emit(!!flag);
    }


   async submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
       }
       if (this.validateForm.valid) {
           if (this.reason === 2 && _.isEmpty(this.model.note)) {
               this.messageService.error(this.translateService.instant(`validations-form.reason-template.required`));
               return;
           } 
           if (this.reason === 1) {
               this.model.note = 'Sai số tiền báo nộp';
           }
           const response = await this.requestCodService.reject(this.model._id, this.model.note);
           this.loading = true;
           if (response.errorCode === 0) {
               this.messageService.success(`${this.translateService.instant(`collectionTab.statusLabel.reject`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
               this.handleVisibleModal(false);
               this.reason = 1;
               this.model.note = '';
               this.loadData.emit(true);
           } else {
               this.messageService.error(response.message);
           }
           this.loading = false;
       }
    }

}