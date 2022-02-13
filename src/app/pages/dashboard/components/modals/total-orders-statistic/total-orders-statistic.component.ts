import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GetTotalOrdersList } from '@/modules/report/actions/dashboard-statistics.actions';
import { QueryModel } from '@/models/query.model';
import { selectOrdersList, selectOrdersLoading } from '@/modules/report/reducers/dashboard-statistics.reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'total-orders-statistic',
  templateUrl: './total-orders-statistic.component.html'
})
export class TotalOrdersStatisticComponent implements OnInit, OnChanges {

  @Input() visible: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() queryModel = new QueryModel();
  loading$;
  pageSize: number = 60;
  pageIndex: number = 1;
  totalOrders$;

  constructor(private store: Store<{}>) { }

  ngOnInit() {
    this.totalOrders$ = this.store.select(selectOrdersList);
    this.loading$ = this.store.select(selectOrdersLoading);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.visible && changes.visible.currentValue) {
      this.store.dispatch(new GetTotalOrdersList(this.queryModel));
    }

  }

  handleVisibleModal() {
    this.visibleChange.emit(false);
  }

  loadDataByPage($event = 1) {
    this.queryModel.page = $event;
    this.store.dispatch(new GetTotalOrdersList(this.queryModel));
  }

  loadDataByPageSize($event = 20) {
    this.queryModel.limit = $event;
    this.store.dispatch(new GetTotalOrdersList(this.queryModel));
  }

  cancelOb() {
    this.store.dispatch(new GetTotalOrdersList('cancel'));
  }
}
