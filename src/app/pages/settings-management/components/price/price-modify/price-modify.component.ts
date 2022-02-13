import * as _ from 'lodash';
import { CommonHelper } from './../../../../../modules/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PriceFormModel } from './../../../../../modules/price/models/price-form.model';
import { PriceFormService } from './../../../../../modules/price/services/price-form.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'price-modify',
  templateUrl: './price-modify.component.html'
})
export class PriceModifyComponent implements OnChanges {
  @Input() modifyingModel: PriceFormModel = null;
  @Input() refId: string = null;
  @Input() visible: boolean = false;
  @Output() handleVisible = new EventEmitter<boolean>();
  @Output() afterSubmit = new EventEmitter();
  @Input() flagCopyPrice = false;
  @ViewChild('createModifyForm') createModifyForm: NgForm;
  isProcessing: boolean = false;
  model = new PriceFormModel();
  constructor(
    private priceFormService: PriceFormService,
    private messageService: NzMessageService,
    private translateService: TranslateService
  ) { }

  ngOnChanges() {
    if (this.visible) {
      this.init();
    }
  }

  handleVisibleModel(flag = false) {
    this.handleVisible.emit(!!flag);
  }

  init() {
    if (this.modifyingModel) {
      this.model = _.cloneDeep(this.modifyingModel);
    } else {
      this.model = new PriceFormModel();
    }
  }

  async submit() {
    if (this.isProcessing) {
      return;
    }
    this.priceFormService.trimData(this.model);
    if (this.createModifyForm.valid && !_.isEmpty(this.model.name)) {
      this.isProcessing = true;
      let response;
      if (this.modifyingModel) {
        response = await this.priceFormService.update(this.model);
      } else {
        response = await this.priceFormService.create(this.refId, this.model);
      }
      this.isProcessing = false;
      if (response.errorCode === 0) {
        this.afterSubmit.emit();
        this.handleVisibleModel(false);
        this.messageService.success(`${this.translateService.instant(`actions.${this.modifyingModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
        this.reset();
      } else {
        this.messageService.error(response.message);
        this.messageService.warning(this.translateService.instant('common.invalid-data'));
      }
    } else {
      CommonHelper.validateForm(this.createModifyForm);
      this.messageService.warning(this.translateService.instant('common.invalid-data'));
    }
  }

  cancel() {
    this.reset();
    this.handleVisibleModel(false);
  }

  reset() {
    this.init();
    CommonHelper.resetForm(this.createModifyForm);
  }
}
