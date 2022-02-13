import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { BalanceService } from '@/modules/finance/services/balance.service';
import { BankModel } from '@/modules/finance/models/bank.model';
import { BankService } from '@/modules/finance/services/bank.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerServiceObservable } from '@/modules/customer/services/customer.service.observable';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { ServicerServiceObservable } from '@/modules/servicer/services/servicer.service.observable';
import { ServicerType } from '@/constants/ServicerType';
import { Status } from '@/constants/status.enum';
import { TransactionModel } from '@/modules/finance/models/transaction.model';
import { TransactionType } from '@/modules/finance/const/transaction.const';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'adjust-deposit',
  templateUrl: './adjust-deposit.component.html',
  styleUrls: ['./adjust-deposit.component.less']
})
export class AdjustDepositComponent implements OnInit {
  bankList: BankModel[];
  depositType: string;
  isProcessing: boolean = false;
  isSearching: boolean = false;
  method: string;
  methodList = [TransactionType.CASH, TransactionType.BANK];
  model: TransactionModel = new TransactionModel();
  numberMask = createNumberMask({ prefix: '' });
  private _value: string;
  userType: string = 'user';
  searchChange$ = new BehaviorSubject({ term: '', userType: this.userType });
  selectedUser = null;
  userOptionList = [];

  @ViewChild('adjustDepositForm') adjustDepositForm: NgForm;

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.model.value = CommonHelper.parseS2N(val);
  }

  constructor(
    private balanceService: BalanceService,
    private bankService: BankService,
    private customerServiceObservable: CustomerServiceObservable,
    private messageService: NzMessageService,
    private servicerServiceObservable: ServicerServiceObservable,
    private translateService: TranslateService,
  ) { }

  async ngOnInit() {
    this.init();
    const response = await this.bankService.filter(new QueryModel({ limit: 1000, status: `${Status.NEW},${Status.ACTIVE}` }));
    this.bankList = response.data;

    const getCustomerList = ({ term }) => {
      return this.customerServiceObservable.getCustomers(new QueryModel({
        code: term
      })).pipe(
        map((res: any) => {
          const customers = res.data.data.map(item => ({ ...item, userType: 'user' }));
          return { customers, term };
        })
      );
    };

    const getServicerList = ({ term, customers }) => {
      return this.servicerServiceObservable.getServicers(new QueryModel({
        code: term
      })).pipe(
        map((res: any) => {
          const servicers = res.data.data.map(item => ({ ...item, userType: 'servicer' }));
          return [...servicers, ...customers];
        })
      );
    };

    const userOptionList$: Observable<string[]> = this.searchChange$.asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(getCustomerList))
      .pipe(switchMap(getServicerList));
    userOptionList$.subscribe(data => {
      this.userOptionList = data;
      this.isSearching = false;
    });
  }

  init() {
    this.depositType = 'topup';
    this.method = TransactionType.BANK;
    this.model = new TransactionModel();
    this.selectedUser = null;
    this._value = null;
  }

  reset() {
    this.init();
    CommonHelper.resetForm(this.adjustDepositForm);
  }

  async confirm() {
    if (this.isProcessing) {
      return;
    }
    if (this.depositType === 'topup') {
      this.model.from = this.method;
      if (this.model.to) {
        delete this.model.to;
      }
    } else {
      this.model.to = this.method;
      if (this.model.from) {
        delete this.model.from;
      }
    }

    if (this.method === TransactionType.CASH && this.model.bankId) {
      delete this.model.bankId;
    }

    if (this.adjustDepositForm.valid) {
      if (this.model.value === 0) {
        this.messageService.warning(this.translateService.instant('validations-form.moneyAmount.positiveValue'));
        return false;
      }
      if (this.model.value > 100000000000) {
        this.messageService.warning(this.translateService.instant('validations-form.moneyAmount.too-large-amount'));
        return false;
      }
      if (this.model.value % 1000) {
        this.messageService.warning(this.translateService.instant('validations-form.moneyAmount.invalid-thousand'));
        return false;
      }
      if (this.selectedUser.type === ServicerType.EnterpriseStaff) {
        this.messageService.error(`${this.translateService.instant(`finance.transaction-adjust-deposit.adjustDepositOfEnterpriseStaff`)}`);
        return false;
      }
      this.model.userId = this.selectedUser._id;
      this.model.userType = this.selectedUser.userType;
      this.isProcessing = true;
      const response = await this.balanceService.adjustDeposit(this.model);
      this.isProcessing = false;
      if (response.errorCode === 0) {
        this.messageService.success(`${this.translateService.instant(`actions.${this.depositType}`)} ${this.translateService.instant('finance.transaction-action.adjust-deposit').toLowerCase()} ${this.translateService.instant('finance.transaction-adjust-deposit.successfully').toLowerCase()}`);
        return true;
      } else {
        this.messageService.error(response.message);
        this.messageService.error(`${this.translateService.instant(`actions.${this.depositType}`)} ${this.translateService.instant('finance.transaction-action.adjust-deposit').toLowerCase()} ${this.translateService.instant('finance.transaction-adjust-deposit.failed').toLowerCase()}`);
      }
    }
    CommonHelper.validateForm(this.adjustDepositForm);
    return false;
  }

  onSearchUser($event) {
    this.isSearching = true;
    this.searchChange$.next({ term: $event, userType: this.userType });
  }
}
