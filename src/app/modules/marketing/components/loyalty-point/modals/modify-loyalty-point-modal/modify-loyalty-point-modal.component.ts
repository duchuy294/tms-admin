import { BehaviorSubject, Observable } from 'rxjs';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomerServiceObservable } from '@/modules/customer/services/customer.service.observable';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { LoyaltyPointAdjustModel } from '@/modules/marketing/models/loyalty-point-adjust.model.';
import { LoyaltyPointService } from '@/modules/marketing/services/loyalty-point.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { ServicerServiceObservable } from '@/modules/servicer/services/servicer.service.observable';

@Component({
  selector: 'modify-loyalty-point-modal',
  templateUrl: './modify-loyalty-point-modal.component.html',
  styleUrls: ['./modify-loyalty-point-modal.component.less']
})
export class ModifyLoyaltyPointModalComponent implements OnInit {
  @ViewChild('pointAdjust') pointAdjust: NgForm;
  @Input() visible: boolean = false;
  @Output() handleVisible = new EventEmitter<boolean>();
  @Output() change = new EventEmitter();
  model: LoyaltyPointAdjustModel = new LoyaltyPointAdjustModel();
  isSearching: boolean = false;
  isProcessing: boolean = false;
  userType: string = 'user';
  searchChange$ = new BehaviorSubject({ term: '', userType: this.userType });
  selectedUser = null;
  userOptionList = [];

  constructor(
    private customerServicerObservable: CustomerServiceObservable,
    private loyalService: LoyaltyPointService,
    private message: NzMessageService,
    private servicerServiceObservable: ServicerServiceObservable,
  ) { }

  async ngOnInit() {
    this.model = new LoyaltyPointAdjustModel();

    const getCustomerList = ({ term }) => {
      return this.customerServicerObservable.getCustomers(new QueryModel({
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

  onSearchUser($event) {
    this.isSearching = true;
    this.searchChange$.next({ term: $event, userType: this.userType });
  }

  async onConfirmModal() {
    if (this.pointAdjust.valid) {
      this.model.userCode = this.selectedUser.code;
      this.model.userType = this.selectedUser.userType;
      this.isProcessing = true;
      const result = await this.loyalService.pointAdjust(this.model);
      this.isProcessing = false;
      if (!result.errorCode) {
        this.handleVisibleModal(false);
        this.onReset();
        this.change.emit();
        this.message.success('Điều chỉnh điểm thành công');
      } else {
        this.message.error(result.message || 'Điều chỉnh điểm thất bại');
      }
    } else {
      CommonHelper.validateForm(this.pointAdjust);
    }

  }

  onReset() {
    this.model = new LoyaltyPointAdjustModel();
    CommonHelper.resetForm(this.pointAdjust);
    this.selectedUser = null;
  }

  onCancelModal() {
    this.handleVisibleModal(false);
    this.onReset();
  }

  handleVisibleModal(flag?) {
    this.handleVisible.emit(!!flag);
  }

}
