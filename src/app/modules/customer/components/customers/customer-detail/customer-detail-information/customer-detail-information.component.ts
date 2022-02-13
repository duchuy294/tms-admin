import * as _ from 'lodash';
import { AccountType } from '@/constants/AccountType';
import { ActivatedRoute } from '@angular/router';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { DefaultAvatar } from '@/constants/default-avatar.enum';
import { UserLevelModel } from '@/modules/user/models/user-level.model';
import { UserLevelService } from '@/modules/user/services/user-level.service';
import { UserType } from '@/constants/UserType';
import { WalletModel } from '@/modules/finance/models/wallet.model';
import { WalletService } from '@/modules/finance/services/wallet.service';
import { CustomerService } from '@/modules/customer/services/customer.service';

@Component({
  selector: 'customer-detail-information',
  templateUrl: './customer-detail-information.component.html',
  styleUrls: ['./customer-detail-information.component.less']
})
export class CustomerDetailInformationComponent implements OnChanges {
  @Input() model: Customer = new Customer();
  @Output() collection = new EventEmitter<any>();
  @Output() modify = new EventEmitter<any>();
  @Output() rating = new EventEmitter();
  @Output() transaction = new EventEmitter();
  userLevel = new UserLevelModel();
  nameEnterprise: Customer = new Customer();
  public wallet = new WalletModel();

  get isStaff() {
    return this.model.type === UserType.STAFF;
  }

  get isOperator() {
    return this.model.type === UserType.OPERATOR;
  }

  get avatarUrl() {
    return this.model && this.model.avatar ? this.model.avatar : DefaultAvatar.user;
  }

  get customerRating() {
    return (this.model && this.model.rate) ? this.model.rate : 5;
  }

  get notRated() {
    if (this.model) {
      if (this.customerRating < 5) {
        return false;
      }
      if (!this.model.rateTimes || this.model.rateTimes === 0) {
        return true;
      }
      return false;
    }
    return true;
  }


  constructor(
    private route: ActivatedRoute,
    private userLevelService: UserLevelService,
    private walletService: WalletService,
    private customerService: CustomerService,
  ) { }

  async ngOnChanges() {
    const userId = this.route.snapshot.paramMap.get('id');
    this.nameEnterprise = await this.customerService.getCustomer(this.model.enterpriseId);
    await this.getUserLevel();
    this.wallet = await this.walletService.get(userId, AccountType.USER);
  }

  async getUserLevel() {
    this.userLevel = await this.userLevelService.get(this.model.userLevelId);
  }

  showTransaction() {
    this.transaction.emit();
  }

  showModify() {
    this.modify.emit();
  }

  showCollectionDebt() {
    this.collection.emit(this.wallet);
  }

  showRating() {
    this.rating.emit();
  }
}
