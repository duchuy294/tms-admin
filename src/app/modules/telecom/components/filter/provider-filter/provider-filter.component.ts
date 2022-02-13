import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PROVIDERTYPE } from '@/constants/ProviderType';
import { QueryModel } from '@/models/query.model';
import { Status } from '@/constants/status.enum';

@Component({
  selector: 'provider-filter',
  templateUrl: './provider-filter.component.html'
})
export class ProviderFilterComponent implements OnInit {
  @Output() onReset = new EventEmitter();
  @Output() onSearch = new EventEmitter();
  queryModel = new QueryModel({ status: null });
  statusOptionList: number[] = [Status.NEW, Status.ACTIVE];
  typeOptionList: string[] = [];

  ngOnInit() {
    for (const item in PROVIDERTYPE) {
      if (PROVIDERTYPE.hasOwnProperty(item)) {
        this.typeOptionList.push(PROVIDERTYPE[item]);
      }
    }
  }

  reset() {
    this.queryModel = new QueryModel({ status: null });
    setTimeout(() => {
      this.onReset.emit(this.queryModel);
    }, 100);
  }

  search() {
    this.queryModel.page = 1;
    setTimeout(() => {
      this.onSearch.emit(this.queryModel);
    }, 100);
  }
}
