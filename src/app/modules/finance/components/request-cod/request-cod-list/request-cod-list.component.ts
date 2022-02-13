import * as _ from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Notification } from '@/modules/finance/models/notification.model';
import { QueryModel } from '@/models/query.model';
import { RequestCodGridComponent } from './../request-cod-gird/request-cod-gird.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'request-cod-list',
    templateUrl: './request-cod-list.component.html'
})
export class RequestCodListComponent implements OnInit {
    public displayFilter: boolean;
    public notification = new Notification();
    public query = new QueryModel();
    public translateData: any;
    public exporting = false;
    public visibleModalQickConfirm = false;
    @ViewChild('grid') grid: RequestCodGridComponent;

    constructor(
        private translate: TranslateService,
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.translate
            .get(['button.reset', 'button.yes', 'button.cancel'])
            .subscribe(val => {
                this.translateData = val;
            });
    }

    async search(query: QueryModel) {
        this.grid.triggerLoadData(query);
    }

    async loadData() {
        this.grid.loadData();
    }

    async exPortData() {
        this.grid.exPortData();
    }

    handelVisibleModalQickConfirm(flag = true) {
        this.visibleModalQickConfirm = !!flag;
    }

}
