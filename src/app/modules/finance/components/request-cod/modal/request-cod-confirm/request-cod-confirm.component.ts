import * as _ from 'lodash';
import { CodBank, RequestCodListModel } from '@/modules/finance/models/request-cod-list.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestCod, RequestCodEnum } from '@/constants/RequestCod';
import { RequestCodService } from '@/modules/finance/services/request-cod.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'request-cod-confirm',
    templateUrl: 'request-cod-confirm.component.html',
})
export class RequestCodConfirmComponent implements OnInit  {

    constructor(
        private decimalPipe: DecimalPipe,
        private requestCodService: RequestCodService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private fb: FormBuilder
    ) { }

    @Input() model: RequestCodListModel;
    @Input() servicerGroups = {};
    @Input() visibleModal: boolean;
    @Input() visibleAction: boolean;
    @Input() loading: boolean;

    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() loadData = new EventEmitter<boolean>();
    requestCod = RequestCod;
    requestCodEnum = RequestCodEnum;
    validateForm!: FormGroup;
    banks: CodBank[];
    formatterVND = (value: number) => value > 0 ? `${this.decimalPipe.transform(value, '1.0-2')}đ` : 0;
    parserVND = (value: string) => value !== '' ? value.replace('đ', '') : '';
    hideTransCode = false;
    async ngOnInit() {
        this.validateForm = this.fb.group({
            confirmedPaid: [null, [Validators.required]],
            code: [null, [Validators.required]],
            note: [null],
            noTransCode: [true],
        });
        this.banks = await this.requestCodService.getBank();
    }

    requiredCode(required: boolean): void {
        if (required) {
        this.validateForm.get('code')!.clearValidators();
        this.validateForm.get('code')!.markAsPristine();
        } else {
        this.validateForm.get('code')!.setValidators(Validators.required);
        this.validateForm.get('code')!.markAsDirty();
        }
        this.validateForm.get('code')!.updateValueAndValidity();
    }

    handleVisibleModal(flag = false) {
        this.handleVisible.emit(!!flag);
    }

    async submitForm() {
        if (this.model.paid > this.model.confirmedPaid) {
            this.messageService.error(`${this.translateService.instant(`collectionTab.formError.confirmPaid.invalid`)}`);
            return;
        }
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
       }
       if (this.validateForm.valid) {
           const response = await this.requestCodService.confirm(this.model);
           this.loading = true;
           if (response.errorCode === 0) {
               this.messageService.success(`${this.translateService.instant(`collectionTab.detailTitleConfirmModal`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
               this.loadData.emit(true);
               this.handleVisibleModal(false);
               this.hideTransCode = false;
           } else {
               this.messageService.error(response.message);
           }
           this.loading = false;
       }
    }

}