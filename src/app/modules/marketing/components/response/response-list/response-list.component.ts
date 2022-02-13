import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryModel } from '@/models/query.model';
import { ResponseGridComponent } from './../response-grid/response-grid.component';

@Component({
    selector: 'response-list',
    templateUrl: './response-list.component.html'
})
export class ResponseListComponent implements OnInit {
    filterVisible: boolean = false;
    replyModalVisible: boolean = false;
    responseReplyListVisible: boolean = false;
    selectedResponse = null;

    @ViewChild('responseGrid') responseGrid: ResponseGridComponent;

    ngOnInit() {
        window.scrollTo(0, 0);
    }

    toggleFilterVisible() {
        this.filterVisible = !this.filterVisible;
    }

    async search(queryModel: QueryModel) {
        await this.responseGrid.triggerLoadData(queryModel, 1);
    }

    async reset(queryModel: QueryModel) {
        await this.responseGrid.triggerLoadData(queryModel, 1);
    }

    handleResponseReplyListVisible(flag = true) {
        this.responseReplyListVisible = !!flag;
    }

    clickResponse() {
        this.handleResponseReplyListVisible();
    }

    handleReplyModalVisible(flag = true) {
        this.replyModalVisible = !!flag;
    }

    clickToShowReplyModal() {
        this.handleReplyModalVisible();
    }

    handleAfterReply() {
        this.responseGrid.loadData();
    }
}
