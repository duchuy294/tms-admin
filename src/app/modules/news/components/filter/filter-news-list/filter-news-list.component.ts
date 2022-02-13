import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { NewsCategoryModel } from '@/modules/news/models/news-category.model';
import { NewsCategoryService } from '@/modules/news/services/news-category.service';
import { NgForm } from '@angular/forms';
import { QueryModel } from '@/models/query.model';

@Component({
  selector: 'filter-news-list',
  templateUrl: './filter-news-list.component.html',
})
export class FilterNewsListComponent implements OnInit {
  @Output() onSearch = new EventEmitter<QueryModel>();
  @Output() onReset = new EventEmitter<QueryModel>();
  @ViewChild('filterNewsListForm') filterNewsListForm: NgForm;
  queryModel = new QueryModel({ catId: null, status: null });
  categoryOptionList: NewsCategoryModel[];
  isLoading = false;
  startTime: Date;
  endTime: Date;

  constructor(
    private newsCategoryService: NewsCategoryService
  ) { }

  async ngOnInit() {
    const response = await this.newsCategoryService.filter(new QueryModel({ fields: 'name', status: true }));
    this.categoryOptionList = response.data;
  }

  reset() {
    this.queryModel = new QueryModel({ catId: null, status: null });
    this.startTime = null;
    this.endTime = null;
    CommonHelper.resetForm(this.filterNewsListForm);
    this.onReset.emit(this.queryModel);
  }

  search() {
    if (this.startTime) {
      this.queryModel.startTime = DateTimeService.convertDateToTimestamp(this.startTime);
    } else {
      delete this.queryModel.startTime;
    }
    if (this.endTime) {
      this.queryModel.endTime = DateTimeService.convertDateToTimestamp(this.endTime, null, true);
    } else {
      delete this.queryModel.endTime;
    }
    this.queryModel.page = 1;
    this.onSearch.emit(this.queryModel);
  }
}
