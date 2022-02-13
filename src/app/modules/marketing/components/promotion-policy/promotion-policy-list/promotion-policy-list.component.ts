import { Component, OnInit, ViewChild } from '@angular/core';
import { PromotionPolicyGridComponent } from './../promotion-policy-grid/promotion-policy-grid.component';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'promotion-policy-list',
    templateUrl: './promotion-policy-list.component.html'
})
export class PromotionPolicyListComponent implements OnInit {
    @ViewChild('grid') grid: PromotionPolicyGridComponent;
    visibleModal: boolean = false;
    visibleFilter: boolean = false;
    loading: boolean = false;

    ngOnInit() {
        window.scrollTo(0, 0);
    }

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
