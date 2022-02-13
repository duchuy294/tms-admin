import { BankModel } from '@/modules/finance/models/bank.model';
import { BankService } from '@/modules/finance/services/bank.service';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';
import { Status } from 'app/constants/status.enum';
import { SystemBankAccountModel } from '@/modules/finance/models/system-bank-account.model';
import { SystemBankAccountService } from '@/modules/finance/services/system-bank-account.service';

@Component({
    selector: 'create-system-bank-account',
    templateUrl: './create-system-bank-account.component.html',
    styleUrls: ['./create-system-bank-account.component.less']
})
export class CreateSystemBankAccountComponent implements OnInit {
    visibleModal: boolean = false;
    modelQuery = new SystemBankAccountModel();
    banks: BankModel[] = [];
    loadingModal: boolean = false;

    @ViewChild('systemBankAccountForm') systemBankAccountForm: NgForm;

    @Input()
    set model(value) {
        this.modelQuery = value;
    }

    @Input()
    set visible(value: boolean) {
        this.visibleModal = value;
    }

    @Input()
    set loading(value: boolean) {
        this.loadingModal = value;
    }

    @Output() handleVisible = new EventEmitter<boolean>();

    @Output() handleLoading = new EventEmitter<boolean>();

    @Output() submit = new EventEmitter<{
        success?: boolean;
        message?: string;
        type?: string;
    }>();

    constructor(
        private systemBankAccountService: SystemBankAccountService,
        private bankService: BankService
    ) { }

    async ngOnInit() {
        await this.getBanks();
    }

    handleVisibleModal(flag = false) {
        this.handleVisible.emit(!!flag);
    }

    handleLoadingModal(flag = false) {
        this.handleLoading.emit(!!flag);
    }

    reset() {
        this.modelQuery = new SystemBankAccountModel();
        CommonHelper.resetForm(this.systemBankAccountForm);
    }

    async onCreateSystemBankAccount() {
        this.handleLoadingModal(true);
        this.modelQuery = this.systemBankAccountService.trimData(this.modelQuery);
        if (this.systemBankAccountForm.valid) {
            if (!this.modelQuery.bank || !this.modelQuery.agency || !this.modelQuery.accountNumber || !this.modelQuery.customerName) {
                this.handleLoadingModal(false);
                return;
            }
            const response = await this.systemBankAccountService[
                this.modelQuery._id ? 'update' : 'create'
            ](this.modelQuery);
            this.submit.emit({
                ...response,
                type: this.modelQuery._id ? 'update' : 'create'
            });
        } else {
            this.handleLoadingModal(false);
            CommonHelper.validateForm(this.systemBankAccountForm);
        }
    }

    async getBanks() {
        const query = new QueryModel({ limit: 1000, status: `${Status.ACTIVE}` });
        const bankPaging = await this.bankService.filter(query);
        this.banks = bankPaging.data;
    }
}
