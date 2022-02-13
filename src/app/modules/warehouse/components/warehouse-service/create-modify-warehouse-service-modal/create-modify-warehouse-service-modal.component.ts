import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseService } from '../../../services/warehouse.service';
import { WarehouseServiceModel } from '../../../models/warehouseService.model';

@Component({
  selector: 'create-modify-warehouse-service-modal',
  templateUrl: './create-modify-warehouse-service-modal.component.html',
  styleUrls: ['./create-modify-warehouse-service-modal.component.less']
})
export class CreateModifyWarehouseServiceModalComponent implements OnChanges {
  @Input() modifyingModel: WarehouseServiceModel = null;
  @Input() visible: boolean = false;
  @Output() handleVisible = new EventEmitter<boolean>();
  @Output() afterSubmit = new EventEmitter();
  @ViewChild('createModifyForm') createModifyForm: NgForm;
  isProcessing: boolean = false;
  model: WarehouseServiceModel = new WarehouseServiceModel({ status: Status.NEW });
  statusList = [Status.NEW, Status.ACTIVE];

  constructor(
    private messageService: NzMessageService,
    private translateService: TranslateService,
    private warehouseService: WarehouseService,
  ) { }

  ngOnChanges() {
    if (this.visible) {
      this.init();
    }
  }

  handleVisibleModal(flag = false) {
    this.handleVisible.emit(!!flag);
  }

  init() {
    if (this.modifyingModel) {
      this.model = _.cloneDeep(this.modifyingModel);
    } else {
      this.model = new WarehouseServiceModel({ status: Status.NEW });
    }
  }

  async submit() {
    if (this.isProcessing) {
      return;
    }
    this.warehouseService.trimData(this.model);
    if (this.createModifyForm.valid && !_.isEmpty(this.model.name)) {
      this.isProcessing = true;
      let response;
      if (this.modifyingModel) {
        response = await this.warehouseService.updateService(this.model);
      } else {
        response = await this.warehouseService.createService(this.model);
      }
      this.isProcessing = false;
      if (response.errorCode === 0) {
        this.afterSubmit.emit();
        this.handleVisibleModal(false);
        this.messageService.success(`${this.translateService.instant(`actions.${this.modifyingModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
        this.reset();
      } else {
        this.messageService.error(response.message);
      }
    } else {
      CommonHelper.validateForm(this.createModifyForm);
      this.messageService.warning(this.translateService.instant('common.invalid-data'));
    }
  }

  cancel() {
    this.reset();
    this.handleVisibleModal(false);
  }

  reset() {
    this.init();
    CommonHelper.resetForm(this.createModifyForm);
  }
}
