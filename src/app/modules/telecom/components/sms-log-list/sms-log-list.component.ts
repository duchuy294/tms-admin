import { Component, ViewChild } from '@angular/core';
import { QueryModel } from '@/models/query.model';
import { SmsLogGridComponent } from './../sms-log-grid/sms-log-grid.component';
import { SmsLogModel } from '../../models/sms-log.model';

@Component({
    selector: 'sms-log-list',
    templateUrl: './sms-log-list.component.html'
})
export class SmsLogListComponent {
    @ViewChild('smsLogGrid') smsLogGrid: SmsLogGridComponent;
    smsLogDetailModalVisible: boolean = null;
    smsLogToShow: SmsLogModel = null;

    handleSmsLogDetailModalVisible(flag = true) {
        this.smsLogDetailModalVisible = !!flag;
    }

    handleViewDetail(log) {
        this.smsLogToShow = log;
        this.handleSmsLogDetailModalVisible();
    }

    async handleSearch(queryModel: QueryModel) {
        await this.smsLogGrid.triggerLoadData(queryModel, 1);
    }

    async handleReset(queryModel: QueryModel) {
        await this.smsLogGrid.triggerLoadData(queryModel, 1);
    }
}
