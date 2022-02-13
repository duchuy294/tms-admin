import * as _ from 'lodash';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { BalanceAccountType } from '@/modules/finance/const/transaction.const';
import { BalanceService } from '@/modules/finance/services/balance.service';
import { BonusForfeitModel } from '@/modules/finance/models/bonus-forfeit.model';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { Selection } from '@/modules/utility/models/filter.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { ServicerType } from '../../../../../constants/ServicerType';
import { TeamServicer } from '@/modules/servicer/models/team-servicer/team-servicer.model';
import { TransactionType } from '@/modules/finance/const/transaction.const';
import { TranslateService } from '@ngx-translate/core';
import { UserLevelService } from '@/modules/user/services/user-level.service';
import { UserStatus } from '../../../../../constants/UserStatus';

export class BonusForfeit {
    static readonly BONUS = 0;
    static readonly FORFEIT = 1;
}

@Component({
    selector: 'bonus-forfeit',
    templateUrl: './bonus-forfeit.component.html',
    styleUrls: ['./bonus-forfeit.component.less']
})
export class BonusForfeitComponent implements OnInit {
    @Input() type: BonusForfeit = BonusForfeit.BONUS;
    @Output() onConfirm = new EventEmitter<{ error?; success?}>();
    @ViewChild('bonusForm') bonusForm: NgForm;
    public model = new BonusForfeitModel();
    userCode: string;
    userCodes = [];
    teams: TeamServicer[] = [];
    isProcessing: boolean = false;
    balanceAccountType = BalanceAccountType;

    methodType: string = 'individual';
    userTypes = [BalanceAccountType.PARTNER, BalanceAccountType.CUSTOMER];
    walletTypes = [TransactionType.MAIN, TransactionType.SUB];
    groups: Selection[] = [];
    team: TeamServicer;
    selectedTeams: TeamServicer[] = [];
    onlyServicer = false;
    userLevelOptionList = [];
    formatterVnd = value => `${value} vnđ`;
    parserVnd = value => value.replace(' vnđ', '');
    _selectedUser: any = null;
    _value: string;
    numberMask = createNumberMask({ prefix: '' });
    servicerSearchCondition = {
        status: UserStatus.ACTIVE,
        type: [ServicerType.Personal, ServicerType.Enterprise, ServicerType.truckHub],
        fields: 'fullName,phone,code'
    };
    customerSearchCondition = {
        status: UserStatus.ACTIVE,
        fields: 'fullName,phone,code'
    };

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

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.model.value = CommonHelper.parseS2N(val);
    }

    constructor(
        private messageService: NzMessageService,
        private service: BalanceService,
        private userLevelService: UserLevelService,
        public servicerService: ServicerService,
        private translateService: TranslateService,
        public userService: CustomerService
    ) { }

    async ngOnInit() {
        await this.getWalletType();
        await this.getGroups();
        await this.getUserLevel();
    }

    async getWalletType() {
        this.model.type = this.walletTypes[0];
    }

    async getUserLevel() {
        const response = await this.userLevelService.getUserLevels(
            new QueryModel()
        );
        this.userLevelOptionList = response.data;
    }

    async getGroups() {
        const result = await this.servicerService.getGroupServicers(
            new QueryModel({ limit: 1000 })
        );
        this.groups = result.data;
    }

    async changeGroup() {
        if (this.model.groupId) {
            this.model.teamId = 'all';
            this.teams = (
                await this.servicerService.getTeamServicers(
                    new QueryModel({ groupId: this.model.groupId })
                )
            ).data;
        } else {
            this.teams = [];
        }
        this.selectedTeams = [];
    }

    onlyChangeServicer() {
        if (!this.onlyServicer) {
            this.bonusForm.form.addControl(
                'userCode',
                new FormControl('', Validators.required)
            );
            this.bonusForm.controls['userCode'].markAsDirty();
            this.bonusForm.controls['userCode'].updateValueAndValidity();
        } else {
            this.bonusForm.form.removeControl('userCode');
        }
    }

    reset() {
        this.model = new BonusForfeitModel();
        this.model.type = this.walletTypes[0];
        this.isProcessing = false;
        CommonHelper.resetForm(this.bonusForm);
    }

    onChangeMethodType() {
        switch (this.methodType) {
            case BalanceAccountType.CUSTOMER:
                this.model.userLevelId = 'all';
                this.makeModelCustomerCase();
                break;
            case 'individual':
                this.makeModelIndividualCase();
                break;
            case BalanceAccountType.PARTNER:
                this.model.groupId = 'all';
                this.makeModelServicerCase();
        }
    }

    makeModelCustomerCase() {
        delete this.model.groupId;
        delete this.model.teamId;
        delete this.model.userIds;
        delete this.model.userTypes;
        this._selectedUser = null;
    }

    makeModelIndividualCase() {
        delete this.model.groupId;
        delete this.model.teamId;
        delete this.model.userLevelId;
    }

    makeModelServicerCase() {
        delete this.model.userLevelId;
        delete this.model.userIds;
        delete this.model.userTypes;
        this._selectedUser = null;
        if (this.model.groupId === 'all') {
            delete this.model.teamId;
        }
    }

    async confirm() {
        if (this.isProcessing) {
            return;
        }
        switch (this.methodType) {
            case BalanceAccountType.CUSTOMER:
                this.makeModelCustomerCase();
                break;
            case 'individual':
                this.makeModelIndividualCase();
                break;
            case BalanceAccountType.PARTNER:
                this.makeModelServicerCase();
        }
        if (
            (!this.model.userIds || _.isEmpty(this.model.userIds)) &&
            !this.model.userLevelId &&
            !this.model.groupId &&
            !this.model.teamId
        ) {
            this.messageService.warning(
                this.translateService.instant(
                    'finance.transaction-bonus-forfeit.no-target-validations'
                )
            );
            return;
        }
        if (this.bonusForm.valid) {
            if (this.model.value === 0) {
                this.messageService.warning(
                    this.translateService.instant(
                        'validations-form.moneyAmount.positiveValue'
                    )
                );
                return false;
            }
            if (this.model.value > 100000000000) {
                this.messageService.warning(
                    this.translateService.instant(
                        'validations-form.moneyAmount.too-large-amount'
                    )
                );
                return false;
            }

            this.isProcessing = true;
            const response =
                this.type === BonusForfeit.BONUS
                    ? await this.service.postBonus(this.model)
                    : await this.service.postForfeit(this.model);
            if (response.errorCode === 0) {
                this.onConfirm.emit({ error: response.errorCode });
            }
            this.isProcessing = false;
        }
        CommonHelper.validateForm(this.bonusForm);
        return false;
    }

    removeUserCode(code: string) {
        const index = this.userCodes.findIndex(item => item === code);
        this.userCodes.splice(index, 1);
        if (!this.userCodes.length) {
            this.bonusForm.form.addControl(
                'userCode',
                new FormControl('', Validators.required)
            );
            this.bonusForm.controls['userCode'].markAsDirty();
            this.bonusForm.controls['userCode'].updateValueAndValidity();
        }
    }
}
