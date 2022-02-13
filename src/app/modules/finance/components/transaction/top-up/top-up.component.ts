import * as _ from 'lodash';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { BalanceAccountType, TransactionType } from '@/modules/finance/const/transaction.const';
import { BalanceService } from '@/modules/finance/services/balance.service';
import { BankModel } from '@/modules/finance/models/bank.model';
import { BankService } from '@/modules/finance/services/bank.service';
import { BranchService } from '@/modules/admin/services/branch.service';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { ServicerType } from '@/constants/ServicerType';
import { SessionService } from '@/utility/services/session.service';
import { Status } from '@/constants/status.enum';
import { TopUpModel } from '@/modules/finance/models/top-up.model';
import { TranslateService } from '@ngx-translate/core';
import { UserStatus } from '@/constants/UserStatus';
import { UserType } from '@/constants/UserType';

const tenBillion = 10000000000;

@Component({
    selector: 'top-up',
    templateUrl: './top-up.component.html',
    styleUrls: ['./top-up.component.less']
})
export class TopUpComponent implements OnInit {
    @Output() onConfirm = new EventEmitter<any>();
    @ViewChild('form') form: NgForm;
    numberMask = createNumberMask({ prefix: '' });
    isProcessing: boolean = false;
    method: string;
    methodList = [TransactionType.CASH, TransactionType.BANK];
    _selectedUser = null;
    showTargetExplain: boolean = false;
    public model = new TopUpModel();
    private _value: string;
    code: string;
    submitting: boolean = false;
    userTypes = [BalanceAccountType.PARTNER, BalanceAccountType.CUSTOMER];
    from = [TransactionType.BANK, TransactionType.CASH];
    userCodes = [];
    bankList: BankModel[];
    servicerSearchCondition = {
        status: UserStatus.ACTIVE,
        type: [ServicerType.Personal, ServicerType.Enterprise, ServicerType.truckHub],
        fields: 'fullName,phone,code'
    };
    customerSearchCondition = {
        status: UserStatus.ACTIVE,
        type: [UserType.INDIVIDUAL, UserType.ENTERPRISE, UserType.OPERATOR],
        fields: 'fullName,phone,code'
    };
    branchName: string = '';

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.model.value = CommonHelper.parseS2N(val);
    }

    set selectedUser(value) {
        if (_.isArray(value)) {
            this._selectedUser = value;
            this.model.userIds = [];
            this.model.userTypes = [];
            for (const item of value) {
                this.model.userIds.push(item._id);
                this.model.userTypes.push(item.userType);
            }
        } else if (value === null) {
            this._selectedUser = value;
        }
    }

    get selectedUser() {
        return this._selectedUser;
    }

    constructor(
        private balanceService: BalanceService,
        private bankService: BankService,
        private branchService: BranchService,
        private messageService: NzMessageService,
        private sessionService: SessionService,
        private translateService: TranslateService
    ) { }

    async ngOnInit() {
        this.isProcessing = true;
        await this.getBranch();
        await this.getBanks();
        this.init();
        this.isProcessing = false;
    }

    async getBranch() {
        const response = await this.sessionService.getCurrentUser();
        if (response) {
            const branchResponse = await this.branchService.getBranch(
                response.branchId,
                new QueryModel()
            );
            this.branchName =
                branchResponse && branchResponse.name
                    ? branchResponse.name
                    : '';
        }
    }

    async getBanks() {
        const query = new QueryModel({
            limit: 1000,
            status: `${Status.ACTIVE}`
        });
        const response = await this.bankService.filter(query);
        this.bankList = response.data;
    }

    init() {
        this.method = TransactionType.BANK;
        this.model = new TopUpModel();
        this.selectedUser = null;
        this._value = null;
        this.showTargetExplain = false;
    }

    reset() {
        this.init();
        CommonHelper.resetForm(this.form);
    }

    async confirm() {
        if (this.isProcessing) {
            return;
        }
        if (this.method === TransactionType.CASH && this.model.bankId) {
            delete this.model.bankId;
        }
        this.model.from = this.method;
        this.validate();

        if (this.form.valid && this.validTarget()) {
            if (this.model.value === 0) {
                this.messageService.warning(
                    this.translateService.instant(
                        'validations-form.moneyAmount.positiveValue'
                    )
                );
                return;
            }
            if (this.model.value > tenBillion) {
                this.messageService.warning(
                    this.translateService.instant(
                        'validations-form.moneyAmount.too-large-amount'
                    )
                );
                return;
            }
            this.isProcessing = true;
            const response = await this.balanceService.postTopUp(this.model);
            this.isProcessing = false;
            this.onConfirm.emit(response);
        } else {
            this.messageService.warning(
                this.translateService.instant('common.invalid-data')
            );
            CommonHelper.validateForm(this.form);
        }
    }

    validate() {
        this.showTargetExplain = !this.validTarget();
    }

    validTarget() {
        return (
            this.model.userIds &&
            this.model.userTypes &&
            !_.isEmpty(this.model.userIds) &&
            !_.isEmpty(this.model.userTypes)
        );
    }
}
