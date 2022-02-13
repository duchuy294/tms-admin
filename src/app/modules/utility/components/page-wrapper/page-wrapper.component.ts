import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'page-wrapper',
  templateUrl: './page-wrapper.component.html',
  styleUrls: ['./page-wrapper.component.less']
})
export class PageWrapperComponent {
  private _title: string | TemplateRef<void>;
  public isTitleString: boolean;
  private _loading: boolean = false;

  @Input()
  set nzTitle(value: string | TemplateRef<void>) {
    this.isTitleString = !(value instanceof TemplateRef);
    this._title = value;
  }

  get nzTitle(): string | TemplateRef<void> {
    return this._title;
  }

  @Input()
  set nzLoading(value: boolean) {
    this._loading = value;
  }

  get nzLoading() {
    return this._loading;
  }
}