import * as _ from 'lodash';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MarketingNewsService } from '../../../services/marketing-news.service';
import { NewsCategoryModel } from '@/modules/news/models/news-category.model';
import { NewsCategoryService } from '@/modules/news/services/news-category.service';
import { NewsModel } from '@/modules/news/models/news.model';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'create-modify-news-modal',
  templateUrl: './create-modify-news-modal.component.html',
  styleUrls: ['./create-modify-news-modal.component.less']
})
export class CreateModifyNewsModalComponent implements OnInit, OnChanges {
  _image = [];
  isProcessing: boolean = false;
  model: NewsModel = new NewsModel();
  categoryOptionList: NewsCategoryModel[];

  @Input() newsModel: NewsModel = new NewsModel({ status: true });
  @Input() visible: boolean = false;
  @Output() handleVisible = new EventEmitter();
  @Output() afterSubmit = new EventEmitter();
  @ViewChild('addNewsForm') addNewsForm: NgForm;

  constructor(
    private messageService: NzMessageService,
    private marketingNewsService: MarketingNewsService,
    private translateService: TranslateService,
    private newsCategoryService: NewsCategoryService,
  ) { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(): void {
    if (this.visible) {
      this.init();
    }
  }

  async init() {
    const response = await this.newsCategoryService.filter(new QueryModel({ fields: 'name', status: true }));
    this.categoryOptionList = response.data;

    this._image = [];
    if (this.newsModel) {
      this.model = new NewsModel(this.newsModel);
      if (this.model.image) {
        this._image.push({ url: this.model.image });
      }
    } else {
      this.model = new NewsModel({ status: true });
    }
  }

  handleVisibleModal(flag = true) {
    this.handleVisible.emit(!!flag);
  }

  async submit() {
    if (this.isProcessing) {
      return;
    }
    this.model = this.marketingNewsService.trimData(this.model);
    if (this.addNewsForm.valid) {
      if (!this.model.image) {
        this.messageService.warning(this.translateService.instant('validations-form.image.required'));
        return;
      }
      if (_.isEmpty(this.model.title)) {
        return;
      }
      this.isProcessing = true;
      let response;
      if (this.newsModel) {
        response = await this.marketingNewsService.update(this.model);
      } else {
        response = await this.marketingNewsService.create(this.model);
      }
      this.isProcessing = false;
      if (response.errorCode === 0) {
        this.afterSubmit.emit();
        this.handleVisibleModal(false);
        this.messageService.success(`${this.translateService.instant(`actions.${this.newsModel ? 'update' : 'add'}`)} ${this.translateService.instant('common.successfully').toLowerCase()}`);
        this.reset();
      }
    } else {
      CommonHelper.validateForm(this.addNewsForm);
      this.messageService.warning(this.translateService.instant('common.invalid-data'));
    }
  }

  cancel() {
    this.reset();
    this.handleVisibleModal(false);
  }

  reset() {
    CommonHelper.resetForm(this.addNewsForm);
  }

  updateAvatarImg($event) {
    if ($event.length > 0) {
      this.model.image = $event[0];
    } else {
      this.model.image = null;
    }
  }
}
