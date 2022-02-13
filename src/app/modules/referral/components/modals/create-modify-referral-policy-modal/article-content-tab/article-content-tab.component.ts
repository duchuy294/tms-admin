import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'article-content-tab',
  templateUrl: './article-content-tab.component.html',
  styleUrls: ['./article-content-tab.component.less']
})
export class ArticleContentTabComponent {
  @Input() content: string = '';
  @Output() contentChange: EventEmitter<string> = new EventEmitter();
  @Input() sharing: string = '';
  @Output() sharingChange: EventEmitter<string> = new EventEmitter();
  @ViewChild('articleForm') articleForm: NgForm;

  get _content() {
    return this.content ? this.content : '';
  }

  set _content(value) {
    this.content = value;
    this.contentChange.emit(value);
  }

  get _sharing() {
    return this.sharing ? this.sharing : '';
  }

  set _sharing(value) {
    this.sharing = value;
    this.sharingChange.emit(value);
  }

  valid(): boolean {
    return this.articleForm.valid;
  }

  validateForm() {
    CommonHelper.validateForm(this.articleForm);
  }

  resetForm() {
    CommonHelper.resetForm(this.articleForm);
  }
}
