import { Actions } from '../../../constants/actions';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { InputCurrencyComponent } from '@/utility/components/currency/input-currency.component';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFileType } from '@/constants/nz-upload-file-type.enum';
import { OrderStatus } from '@/constants/OrderStatus';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';

const maxAmount = 100000000000;

@Component({
  selector: 'warehouse-order-action-modal',
  templateUrl: './warehouse-order-action-modal.component.html',
  styleUrls: ['./warehouse-order-action-modal.component.less']
})
export class WarehouseOrderActionModalComponent implements OnChanges {
  @Input() action: string;
  @Input() title: string;
  @Input() visible: boolean = false;
  @Input() orderId: any;
  @Input() realCost: number;
  @Output() handleVisible = new EventEmitter<boolean>();
  @Output() afterSubmit = new EventEmitter();
  @ViewChild('form') form: NgForm;
  @ViewChild('commission') commission: InputCurrencyComponent;
  @ViewChild('cost') cost: InputCurrencyComponent;
  maxAmount = maxAmount;
  showCommissionError: boolean = false;
  showCostError: boolean = false;
  cancelBy = [OrderStatus.CanceledByRenter, OrderStatus.CanceledByLessor, OrderStatus.CanceledByAdmin];
  _actions = Actions;
  _images = [];
  fileType = `${NzUploadFileType.IMAGE},${NzUploadFileType.VIDEO}`;
  isProcessing: boolean = false;
  model = new QueryModel();

  constructor(
    private messageService: NzMessageService,
    private translateService: TranslateService,
    private warehouseService: WarehouseService,
  ) { }

  ngOnChanges(): void {
    if (this.visible && this.action === this._actions.COMPLETE) {
      this.model.realCost = this.realCost;
    }
  }

  init() {
    this._images = [];
    this.showCommissionError = false;
    this.showCostError = false;
    this.model = new QueryModel();
  }

  handleVisibleModal(flag = false) {
    this.handleVisible.emit(!!flag);
  }

  validationStatus() {
    const valids = [];
    switch (this.action) {
      case Actions.CONFIRM:
        this.showCommissionError = !this.commission.valid();
        valids.push(!this.showCommissionError);
        break;
      case Actions.COMPLETE:
        this.showCommissionError = !this.commission.valid();
        valids.push(!this.showCommissionError);
        this.showCostError = !this.cost.valid();
        valids.push(!this.showCostError);
    }
    let valid = true;
    valids.forEach(item => {
      valid = valid && item;
    });
    return valid;
  }

  prepareModel(): Object {
    const { status, cancelReason, realCost, commission, adminNote, images } = this.model;
    switch (this.action) {
      case Actions.CANCEL:
        return { action: this.action, data: { cancelReason, status } };
      case Actions.CONFIRM:
        return { action: this.action, data: { commission, adminNote } };
      case Actions.COMPLETE:
        return { action: this.action, data: { commission, adminNote, realCost, images } };
    }
    return {};
  }

  async submit() {
    if (this.isProcessing) {
      return;
    }
    const isValidForm = this.form.valid;
    const isValidAmount = this.validationStatus();
    if (isValidForm && isValidAmount) {
      this.isProcessing = true;
      const response = await this.warehouseService.processOrder(this.orderId, this.prepareModel());
      this.isProcessing = false;
      if (response.success) {
        this.messageService.success(this.translateService.instant('common.successfully'));
        this.handleVisibleModal(false);
        this.afterSubmit.emit();
      } else {
        this.messageService.error(response.message);
      }
    } else {
      CommonHelper.validateForm(this.form);
      this.messageService.warning(this.translateService.instant('common.invalid-data'));
    }
  }

  cancel() {
    this.reset();
    this.visible = false;
    this.handleVisibleModal(false);
  }

  reset() {
    this.init();
    CommonHelper.resetForm(this.form);
  }

  updateImg($event, field) {
    if ($event.length > 0) {
      this.model[field] = $event;
    } else {
      this.model[field] = null;
    }
  }
}
