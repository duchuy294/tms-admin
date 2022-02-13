import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { SmsLogModel } from '../../models/sms-log.model';
import { SmsLogService } from '../../services/sms-log.service';

@Component({
    selector: 'sms-log-grid',
    templateUrl: './sms-log-grid.component.html'
})
export class SmsLogGridComponent implements OnInit {
    @Output() view: EventEmitter<any> = new EventEmitter<any>();
    loadingGrid: boolean = false;
    public tableData = new PagingModel<SmsLogModel>();
    queryModel: QueryModel = new QueryModel();

    constructor(
        private smsLogService: SmsLogService,
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async triggerLoadData(queryModel: QueryModel, pageIndex?) {
        await this.loadData(queryModel, pageIndex);
    }

    async loadData(query = null, page = 1) {
        if (query) {
            this.queryModel = new QueryModel(query);
        }
        this.queryModel.page = page;
        this.loadingGrid = true;
        this.tableData = await this.smsLogService.filter(this.queryModel);
        this.loadingGrid = false;
    }

    async loadDataByPage($event) {
        await this.loadData(null, $event);
    }

    async loadDataByPageSize($event) {
        this.queryModel.limit = $event;
        await this.loadData(null, 1);
    }

    onClickViewDetail(log: SmsLogModel) {
        this.view.emit(log);
    }
}
