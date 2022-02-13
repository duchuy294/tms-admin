import { Component, ViewChild } from '@angular/core';
import { LoyaltyPointPolicyGridComponent } from '../loyalty-point-policy-grid/loyalty-point-policy-grid.component';
import { QueryModel } from 'app/models/query.model';

@Component({
    selector: 'loyalty-point-policy-list',
    templateUrl: './loyalty-point-policy-list.component.html'
})
export class LoyaltyPointPolicyListComponent {
    @ViewChild('grid') grid: LoyaltyPointPolicyGridComponent;
    visibleModal: boolean = false;
    visibleFilter: boolean = false;
    loading: boolean = false;
    query = new QueryModel();
    fromDate: any;
    toDate: any;
    selectedStatus: number;

    onClickCreate() {
        this.handleVisibleModal(true);
    }

    toggleVisibleFilter() {
        this.visibleFilter = !this.visibleFilter;
    }

    handleVisibleModal(flag?: boolean | number | undefined) {
        this.visibleModal = !!flag;
    }

    search(query: QueryModel) {
        this.grid.triggerLoadData(query);
    }

    handleAfterSubmit() {
        this.grid.loadData();
    }
}
