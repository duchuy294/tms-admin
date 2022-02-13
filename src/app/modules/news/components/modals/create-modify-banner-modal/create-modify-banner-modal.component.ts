import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NewsBannerModel } from '@/modules/news/models/news-banner.model';
import { NewsBannerService } from '@/modules/news/services/news-banner.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'create-modify-banner-modal',
  templateUrl: './create-modify-banner-modal.component.html',
  styleUrls: ['./create-modify-banner-modal.component.less']
})
export class CreateModifyBannerModalComponent implements OnChanges {
  _avatar = [];
  isProcessing: boolean = false;
  model: NewsBannerModel = new NewsBannerModel();

  @Input() bannerModel: NewsBannerModel = new NewsBannerModel();
  @Input() visible: boolean = false;
  @Output() handleVisible = new EventEmitter();
  @Output() afterSubmit = new EventEmitter();
  @ViewChild('addBannerForm') addBannerForm: NgForm;

  constructor(
    private messageService: NzMessageService,
    private newsBannerService: NewsBannerService,
    private translateService: TranslateService,
  ) { }

  ngOnChanges() {
    if (this.visible) {
      this.init();
    }
  }

  init() {
    this._avatar = [];
    if (this.bannerModel) {
      this.model = new NewsBannerModel(this.bannerModel);
      if (this.model.image) {
        this._avatar.push({ url: this.model.image });
      }
    } else {
      this.model = new NewsBannerModel({ active: false });
    }
  }

  handleVisibleModal(flag = true) {
    this.handleVisible.emit(!!flag);
  }

  async submit() {
    if (this.isProcessing) {
      return;
    }
    this.model = this.newsBannerService.trimData(this.model);
    if (this.addBannerForm.valid) {
      if (!this.model.image) {
        this.messageService.warning(this.translateService.instant('validations-form.image.required'));
        return;
      }
      if (_.isEmpty(this.model.title)) {
        return;
      }
      this.isProcessing = true;
      let response;
      if (this.bannerModel) {
        response = await this.newsBannerService.update(this.model);
      } else {
        response = await this.newsBannerService.create(this.model);
      }
      this.isProcessing = false;
      if (response.errorCode === 0) {
        this.afterSubmit.emit();
        this.handleVisibleModal(false);
        this.messageService.success(`${this.translateService.instant(`actions.${this.bannerModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
        this.reset();
      } else {
        this.messageService.error(response.message);
      }
    } else {
      CommonHelper.validateForm(this.addBannerForm);
      this.messageService.warning(this.translateService.instant('common.invalid-data'));
    }
  }

  cancel() {
    this.reset();
    this.handleVisibleModal(false);
  }

  reset() {
    CommonHelper.resetForm(this.addBannerForm);
  }

  updateAvatarImg($event) {
    if ($event.length > 0) {
      this.model.image = $event[0];
    } else {
      this.model.image = null;
    }
  }
}
