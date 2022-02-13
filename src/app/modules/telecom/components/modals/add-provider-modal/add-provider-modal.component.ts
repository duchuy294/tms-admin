import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProviderModel } from '@/modules/telecom/models/provider.model';
import { ProviderService } from '@/modules/telecom/services/provider.service';
import { PROVIDERTYPE } from '@/constants/ProviderType';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'add-provider-modal',
  templateUrl: './add-provider-modal.component.html',
  styleUrls: ['./add-provider-modal.component.less']
})
export class AddProviderModalComponent implements OnChanges, OnInit {
  @Input() providerModel: ProviderModel = new ProviderModel();
  @Input() visible: boolean = false;
  @Output() afterSubmit = new EventEmitter();
  @Output() handleVisible = new EventEmitter();
  @ViewChild('addProviderForm') addProviderForm: NgForm;
  firstReset: boolean = true;
  isProcessing: boolean = false;
  model: ProviderModel = new ProviderModel();
  typeOptionList: string[] = [];
  visiblePassword: boolean = false;
  modalType: string;

  constructor(
    private messageService: NzMessageService,
    private translateService: TranslateService,
    private providerService: ProviderService
  ) { }

  ngOnInit() {
    for (const item in PROVIDERTYPE) {
      if (PROVIDERTYPE.hasOwnProperty(item)) {
        this.typeOptionList.push(PROVIDERTYPE[item]);
      }
    }
  }

  ngOnChanges() {
    if (this.visible) {
      if (this.firstReset) {
        CommonHelper.resetForm(this.addProviderForm);
        this.firstReset = false;
      }
      this.modalType = (this.providerModel) ? 'modifu' : 'create';
      this.model = new ProviderModel(this.providerModel);
    }
  }

  init() {
    if (this.providerModel) {
      this.model = new ProviderModel(this.providerModel);
    } else {
      this.model = new ProviderModel();
    }
  }

  handleVisibleModal(flag = true) {
    this.handleVisible.emit(!!flag);
  }

  async submit() {
    if (this.isProcessing) {
      return;
    }
    this.model = this.providerService.trimData(this.model);
    if (this.modalType === 'create' && this.model.pwd !== this.model.confirmPwd) {
      return;
    }
    const { from, name, pwd, u, url } = this.model;
    if (_.isEmpty(from) || _.isEmpty(name) || _.isEmpty(pwd) || _.isEmpty(u) || _.isEmpty(url)) {
      CommonHelper.validateForm(this.addProviderForm);
      return;
    }
    if (this.addProviderForm.valid) {
      this.isProcessing = true;
      let response;
      if (this.providerModel) {
        response = await this.providerService.update(this.model);
      } else {
        response = await this.providerService.create(this.model);
      }
      this.isProcessing = false;
      if (response.errorCode === 0) {
        this.afterSubmit.emit();
        this.handleVisibleModal(false);
        this.messageService.success(`${this.translateService.instant(`actions.${this.providerModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
        this.reset();
      } else {
        this.messageService.error(response.message);
      }
    } else {
      CommonHelper.validateForm(this.addProviderForm);
    }
  }

  cancel() {
    this.reset();
    this.handleVisibleModal(false);
  }

  reset() {
    this.init();
    CommonHelper.resetForm(this.addProviderForm);
  }
}
