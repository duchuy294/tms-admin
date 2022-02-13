import * as _ from 'lodash';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CommonHelper } from '@/utility/common/common.helper';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { WalletEditModel } from '@/modules/finance/models/wallet-edit.model';
import { WalletService } from '@/modules/finance/services/wallet.service';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'update-wallet',
  templateUrl: './update-wallet.component.html'
})
export class UpdateWalletComponent implements OnChanges {
  error = new WalletEditModel();
  banks: string[] = [];
  isProcessing: boolean = false;
  model: WalletEditModel = new WalletEditModel();
  modalVisible: boolean = false;
  numberMask = createNumberMask({ prefix: '' });

  get minWithdrawValue() {
    if (!this.model.minWithdraw) {
      return 0;
    }
    return this.model.minWithdraw;
  }

  set minWithdrawValue(val) {
    this.model.minWithdraw = CommonHelper.parseS2N(val);
  }

  get maxWithdrawValue() {
    if (!this.model.maxWithdraw) {
      return 0;
    }
    return this.model.maxWithdraw;
  }

  set maxWithdrawValue(val) {
    this.model.maxWithdraw = CommonHelper.parseS2N(val);
  }

  get minRemainingValue() {
    if (!this.model.minRemaining) {
      return 0;
    }
    return this.model.minRemaining;
  }

  set minRemainingValue(val) {
    this.model.minRemaining = CommonHelper.parseS2N(val);
  }

  @Input()
  set visible(value: boolean) {
    this.modalVisible = value;
  }

  @Input() walletToModify: WalletEditModel = null;
  @Output() afterSuccess = new EventEmitter();
  @Output() handleVisible = new EventEmitter<boolean>();
  @ViewChild('remainingForm') remainingForm: NgForm;

  constructor(
    private messageService: NzMessageService,
    private translateService: TranslateService,
    private walletService: WalletService
  ) { }

  async ngOnChanges() {
    if (this.modalVisible) {
      this.isProcessing = true;
      this.init();
      this.isProcessing = false;
    }
  }

  init() {
    if (this.walletToModify) {
      this.model = new WalletEditModel(this.walletToModify);
    } else {
      this.model = new WalletEditModel();
    }
  }

  reset() {
    this.init();
    CommonHelper.resetForm(this.remainingForm);
  }

  async confirm() {
    if (this.isProcessing) {
      return;
    }
    this.model = this.walletService.trimData(this.model);
    if (this.remainingForm.valid) {
      this.isProcessing = true;
      const response = await this.walletService.updateWallet(this.model._id, this.model);
      this.isProcessing = false;
      if (response.errorCode === 0) {
        this.afterSuccess.emit();
        this.messageService.success(this.translateService.instant('common.successfully'));
        this.onCancel();
      } else {
        this.messageService.error(response.message);
      }
    } else {
      CommonHelper.validateForm(this.remainingForm);
      this.messageService.warning(this.translateService.instant('common.invalid-data'));
    }
  }

  onCancel() {
    this.handleVisible.emit(false);
    this.reset();
  }
}
