import * as _ from 'lodash';
import { AccountType } from '@/constants/AccountType';
import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { InputCurrencyComponent } from '@/utility/components/currency/input-currency.component';
import { QueryModel } from '@/models/query.model';
import { ServicerType } from '@/constants/ServicerType';
import { UserType } from '@/constants/UserType';

@Component({
  selector: 'account-balance-filter',
  templateUrl: './account-balance-filter.component.html'
})
export class AccountBalanceFilterComponent {
  @Input() visible: boolean = true;
  @Output() export: EventEmitter<QueryModel> = new EventEmitter<QueryModel>();
  @Output() search: EventEmitter<QueryModel> = new EventEmitter<QueryModel>();
  @ViewChildren(InputCurrencyComponent) currencyComponent: QueryList<any>;
  baseQueryModel: QueryModel = new QueryModel({});
  customerSearchCondition = {
    type: [UserType.INDIVIDUAL, UserType.ENTERPRISE, UserType.OPERATOR],
    fields: 'fullName,phone,code'
  };
  servicerSearchCondition = {
    type: [ServicerType.Personal, ServicerType.Enterprise, ServicerType.truckHub],
    fields: 'fullName,phone,code'
  };
  _selectedPerson = null;
  model: QueryModel = new QueryModel(this.baseQueryModel);
  targets = [AccountType.USER, AccountType.SERVICER];

  set selectedPerson(value) {
    if (_.isArray(value) || value === null) {
      this._selectedPerson = value;
      this.model.userIds = value;
    }
  }

  get selectedPerson() {
    return this._selectedPerson;
  }

  exportFilter() {
    this.export.emit(this.model);
  }

  searchFilter() {
    this.search.emit(this.model);
  }

  resetFilter() {
    this.model = new QueryModel(this.baseQueryModel);
    this.currencyComponent.forEach(item => {
      item.reset();
    });
    this._selectedPerson = null;
    this.searchFilter();
  }
}
