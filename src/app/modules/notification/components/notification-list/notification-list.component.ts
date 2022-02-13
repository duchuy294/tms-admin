import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationGridComponent } from './../notification-grid/notification-grid.component';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'notification-list',
    templateUrl: './notification-list.component.html'
})
export class NotificationListComponent implements OnInit {
    @ViewChild('notificationGrid') notificationGrid: NotificationGridComponent;
    modelQuery = new QueryModel();
    showFilter = false;

    ngOnInit() {
        window.scrollTo(0, 0);
    }

    async search(event) {
        this.modelQuery = event;
        await this.notificationGrid.loadData(this.modelQuery);
    }

    toggleFilter() {
        this.showFilter = !this.showFilter;
    }
}
