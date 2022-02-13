import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GetTotalCollectionFeeList } from '@/modules/report/actions/dashboard-statistics.actions';
import { QueryModel } from '@/models/query.model';
import { selectTotalCollectionDebt, selectTotalCollectionDebtLoading } from '@/modules/report/reducers/dashboard-statistics.reducers';
import { Store } from '@ngrx/store';

@Component({
    selector: 'servicers-with-collection-debt',
    templateUrl: './servicers-with-collection-debt.component.html'
})
export class ServicersWithCollectionDebtComponent implements OnInit, OnChanges {
    @Input() visible: boolean;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Input() modelQuery = new QueryModel();
    loading$;
    pageSize: number = 60;
    pageIndex: number = 1;
    totalCollectionDebt$;

    constructor(private store: Store<{}>) { }

    ngOnInit() {
        this.totalCollectionDebt$ = this.store.select(selectTotalCollectionDebt);
        this.loading$ = this.store.select(selectTotalCollectionDebtLoading);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.visible && changes.visible.currentValue) {
            this.store.dispatch(new GetTotalCollectionFeeList(this.modelQuery));
        }

    }

    handleVisibleModal() {
        this.visibleChange.emit(false);
    }

    loadDataByPage($event = 1) {
        this.modelQuery.page = $event;
        this.store.dispatch(new GetTotalCollectionFeeList(this.modelQuery));
    }

    loadDataByPageSize($event = 20) {
        this.modelQuery.limit = $event;
        this.store.dispatch(new GetTotalCollectionFeeList(this.modelQuery));
    }
}
