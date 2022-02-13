import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { DebtCod } from '@/modules/finance/models/request-cod-list.model';
import { RequestCod } from '@/constants/RequestCod';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { DecimalPipe  } from '@angular/common';
import { RequestCodService } from '@/modules/finance/services/request-cod.service';
import * as _ from 'lodash';
import { QueryModel } from '@/models/query.model';
import { BankService } from '@/modules/finance/services/bank.service';
import { BankModel } from '@/modules/finance/models/bank.model';
import { TransactionType } from '@/modules/finance/const/transaction.const';
@Component({
    selector: 'request-debt-confirm',
    templateUrl: 'request-debt-confirm.component.html',
})
export class RequestDebtConfirmComponent implements OnInit  {

    constructor(
        private decimalPipe: DecimalPipe,
        private requestCodService: RequestCodService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private fb: FormBuilder,
        private bankService: BankService
    ) { }

    @Input() model: DebtCod;
    @Input() servicerGroups = {};
    @Input() visibleModal: boolean;
    @Input() visibleAction: boolean;
    @Input() loading: boolean;

    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() loadData = new EventEmitter<boolean>();
    requestCod = RequestCod;
    validateForm!: FormGroup;
    bankList: BankModel[];
    methodList = [TransactionType.CASH, TransactionType.BANK];
    formatterVND = (value: number) => value > 0 ? `${this.decimalPipe.transform(value, '1.0-2')}đ` : 0;
    parserVND = (value: string) => value !== '' ? value.replace('đ', '') : '';
    async ngOnInit() {
        this.validateForm = this.fb.group({
            amount: [null],
            type: [null, [Validators.required]],
            bank: [null, [Validators.required]],
            note: [null],
        });
        const response = await this.bankService.filter(new QueryModel({ limit: 1000 }));
        this.bankList = response.data;
    }

    requiredChange(type): void {
        if (type === TransactionType.CASH) {
            this.validateForm.get('bank')!.clearValidators();
            this.validateForm.get('bank')!.markAsPristine();
        } else {
            this.validateForm.get('bank')!.setValidators(Validators.required);
            this.validateForm.get('bank')!.markAsDirty();
        }
        this.validateForm.get('bank')!.updateValueAndValidity();
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
           const confirmData = {
               servicerId: this.model.servicerId,
               type: this.model.type,
               bank: this.model.bank,
               note: this.model.note
           }; 
           const response = await this.requestCodService.confirmDebt(confirmData);
           this.loading = true;
           if (response.errorCode === 0) {
               this.messageService.success(`${this.translateService.instant(`collectionTab.deleteDebt`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
               this.loadData.emit(true);
               this.handleVisibleModal(false);
               this.validateForm.reset();
           } else {
               this.messageService.error(response.message);
           }
           this.loading = false;
       }
    }

}