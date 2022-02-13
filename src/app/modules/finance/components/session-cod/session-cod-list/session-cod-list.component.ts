import * as _ from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GetBalanceQueryModel } from '@/modules/finance/models/query.model';
import { Notification } from '@/modules/finance/models/notification.model';
import { SessionCodGridComponent } from './../session-cod-gird/session-cod-gird.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'session-cod-list',
    templateUrl: './session-cod-list.component.html'
})
export class SessionCodListComponent implements OnInit {
    public displayFilter: boolean;
    public notification = new Notification();
    public query = new GetBalanceQueryModel();
    public translateData: any;
    public exporting = false;
    @ViewChild('grid') grid: SessionCodGridComponent;

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

    async search(query: GetBalanceQueryModel) {
        this.grid.triggerLoadData(query);
    }

    async loadData() {
        this.grid.loadData();
    }

    async exPortData() {
        this.grid.exPortData();
    }

}
