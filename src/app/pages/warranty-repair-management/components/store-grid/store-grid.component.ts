import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeleteStore, LoadStores } from '@/modules/warranty-repair/actions/store.actions';
import { getDeletedStoreSelector, getStoresState } from '@/modules/warranty-repair/reducers';
import { map } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Store } from '@ngrx/store';
import { StoreQueryModel } from '@/modules/warranty-repair/models/store-query.model';
import { StoreService } from '@/modules/warranty-repair/services/store.service';

@Component({
    selector: 'store-grid',
    templateUrl: './store-grid.component.html'
})
export class StoreGridComponent implements OnInit {
    @Output() modelChange = new EventEmitter();
    @Output() detail = new EventEmitter<string>();
    modelQuery = new StoreQueryModel();
    loading$;
    pageSize: number = 60;
    pageIndex: number = 1;
    stores$;
    @Input()
    set model(value: StoreQueryModel) {
        this.modelQuery = value;
    }

    get model() {
        return this.modelQuery;
    }

    constructor(
        public storeService: StoreService,
        private messageService: NzMessageService,
        private modalService: NzModalService,
        private store: Store<{}>
    ) { }

    async ngOnInit() {
        this.stores$ = this.store
            .select(getStoresState)
            .pipe(map(store => store.stores));
        this.loading$ = this.store
            .select(getStoresState)
            .pipe(map(store => store.loading));

        this.store.select(getDeletedStoreSelector).subscribe(val => {
            if (['success', 'error'].includes(val)) {
                this.messageService[val](
                    val === 'success' ? 'Xoá trung tâm thành công' : 'Có lỗi khi xoá trung tâm'
                );
                if (val === 'success') {
                    this.loadData();
                }
            }

        });

        this.modelQuery.limit = this.pageSize;
        this.loadData();
    }

    loadDataByPage($event) {
        this.modelQuery.page = $event;
        this.modelChange.emit(this.modelQuery);
        this.loadData();
    }

    loadDataByPageSize($event) {
        this.modelQuery.limit = $event;
        this.modelChange.emit(this.modelQuery);
        this.loadData();
    }

    showDetail(storeId: string) {
        this.detail.emit(storeId);
    }

    delete(storeId: string) {
        this.modalService.confirm({
            nzTitle: 'Bạn có chắc là muốn xoá trung tâm này?',
            nzOnOk: () => this.deleteConfirm(storeId),
            nzCancelText: 'Huỷ',
            nzOkText: 'Xoá'
        });
    }

    deleteConfirm(storeId) {
        this.store.dispatch(new DeleteStore(storeId));
    }

    async loadData() {
        this.store.dispatch(new LoadStores(this.modelQuery));
    }
}
