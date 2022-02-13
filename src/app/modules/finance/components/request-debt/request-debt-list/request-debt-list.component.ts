import * as _ from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Notification } from '@/modules/finance/models/notification.model';
import { QueryModel } from '@/models/query.model';
import { RequestDebtGridComponent } from './../request-debt-gird/request-debt-gird.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'request-debt-list',
    templateUrl: './request-debt-list.component.html'
})
export class RequestDebtListComponent implements OnInit {
    public displayFilter: boolean;
    public notification = new Notification();
    public query = new QueryModel({ userType: 'servicer', hasConfirmedCOD: null});
    public translateData: any;
    public visibleModalQickConfirm = false;
    @ViewChild('grid') grid: RequestDebtGridComponent;

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

    handelVisibleModalQickConfirm(flag = true) {
        this.visibleModalQickConfirm = !!flag;
    }

}
