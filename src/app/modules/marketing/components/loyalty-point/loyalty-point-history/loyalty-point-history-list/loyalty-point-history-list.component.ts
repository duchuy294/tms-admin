import { Component, ViewChild } from '@angular/core';
import { LoyaltyPointHistoryGridComponent } from './../loyalty-point-history-grid/loyalty-point-history-grid.component';
import { LoyaltyPointQueryModel } from 'app/modules/marketing/models/loyalty-point-query.model';

@Component({
    selector: 'loyalty-point-history-list',
    templateUrl: './loyalty-point-history-list.component.html'
})
export class LoyaltyPointHistoryListComponent {
    @ViewChild('grid') grid: LoyaltyPointHistoryGridComponent;
    visibleModal: boolean = false;
    visibleDetailModal: boolean = false;
    visibleFilter: boolean = false;
    loading: boolean = false;
    pageSize: number = 60;
    pageIndex: number = 1;
    fromDate: any;
    toDate: any;
    selectedCode: string;
    itemToShow: any = null;

    onClickCreate() {
        this.handleVisibleModal(true);
    }

    toggleVisibleFilter() {
        this.visibleFilter = !this.visibleFilter;
    }

    handleVisibleModal(flag?: boolean | number | undefined) {
        this.visibleModal = !!flag;
    }

    handleVisibleDetailModal(flag?: boolean | number | undefined) {
        this.visibleDetailModal = !!flag;
    }

    search(query: LoyaltyPointQueryModel) {
        this.grid.triggerLoadData(query);
    }

    onChangeLoyaltyPoint() {
        this.grid.loadData();
    }

    detail(data) {
        this.handleVisibleDetailModal(true);
        this.itemToShow = data;
    }
}
