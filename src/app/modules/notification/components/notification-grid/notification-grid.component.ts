import * as _ from 'lodash';
import { ActivityModel } from '@/modules/activity/models/activity.model';
import { ActivityService } from '@/modules/activity/services/activity.service';
import { ActivityType } from '@/modules/activity/constants/activity-type.enum';
import { Component, Input, OnInit } from '@angular/core';
import { EventBusService } from '@/services/event.bus.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';
import { ReceiveMessengerNotification, ReceiveNotification, SeenNotification } from '../../actions/notitication.actions';

@Component({
    selector: 'notification-grid',
    templateUrl: './notification-grid.component.html',
    styleUrls: ['./notification-grid.component.less']
})

export class NotificationGridComponent implements OnInit {
    @Input() model: QueryModel = new QueryModel();

    notificationTypes = [
        ActivityType.HAPPEN_INCIDENT,
        ActivityType.RESPONSE,
        ActivityType.WITHDRAWAL_REQUEST,
        ActivityType.NEW_MESSAGE,
        ActivityType.NEW_WAREHOUSE,
        ActivityType.WAREHOUSE_CONTACT_REQUEST,
        ActivityType.CONFIRM_COMPLETE_REQUEST
    ];

    loading: boolean = false;
    totalSelected = 0;
    watchNotification$;
    isAllDisplayDataChecked = false;
    isIndeterminate = false;
    mapOfCheckedId: { [key: string]: boolean } = {};

    public tableData = new PagingModel<ActivityModel>();

    constructor(
        private activityService: ActivityService,
        private eventBusService: EventBusService,
    ) { }

    async ngOnInit() {
        await this.loadData();

        this.watchNotification$ = this.eventBusService.on([new ReceiveNotification(), new ReceiveMessengerNotification()], async () => {
            await this.loadData();
        });
    }

    async loadData(modelQuery: QueryModel = null) {
        this.loading = true;

        if (modelQuery) {
            this.model = modelQuery;
        }
        this.tableData = await this.activityService.filter(
            this.model.type ? this.model
                : new QueryModel({ ...this.model, type: this.notificationTypes }));

        this.loading = false;
    }

    async loadDataByPage(event) {
        this.model.page = event;
        this.reset();
        await this.loadData();
    }

    async loadDataByPageSize(event) {
        this.model.limit = event;
        this.reset();
        await this.loadData();
    }

    async seenAll(activityIds = null) {
        await this.activityService.seenAll(activityIds);
        await this.loadData();
        this.eventBusService.emit(new SeenNotification());
        this.reset();
    }

    reset() {
        this.isAllDisplayDataChecked = false;
        this.isIndeterminate = false;
        this.mapOfCheckedId = {};
        this.totalSelected = 0;
    }

    refreshStatus(): void {
        this.isAllDisplayDataChecked = this.tableData.data
            .every(item => this.mapOfCheckedId[item._id]);
        this.isIndeterminate =
            this.tableData.data.some(item => this.mapOfCheckedId[item._id]) &&
            !this.isAllDisplayDataChecked;
        this.totalSelected = this.tableData.data.filter(item => this.mapOfCheckedId[item._id]).length;
    }

    checkAll(value: boolean): void {
        this.tableData.data.forEach(item => (this.mapOfCheckedId[item._id] = value));
        this.refreshStatus();
    }

    async seenMany() {
        await this.seenAll({ activityIds: _.keys(_.pickBy(this.mapOfCheckedId, item => item)) });
    }

    async seen(id: string) {
        await this.activityService.seen(id);
        this.eventBusService.emit(new SeenNotification());
    }

    setRouterLink(item) {
        switch (item.type) {
            case ActivityType.CREATED:
            case ActivityType.HAPPEN_INCIDENT:
            case ActivityType.CONFIRM_COMPLETE_REQUEST:
                return ['/pages/order', item.orderId];
            case ActivityType.NEW_MESSAGE:
                return ['/pages/order', item.orderId, item.conversationId];
            case ActivityType.RESPONSE:
                return ['pages/marketing/response'];
            case ActivityType.WITHDRAWAL_REQUEST:
                return ['/pages/finance/digital-wallet'];
            case ActivityType.NEW_WAREHOUSE:
                return ['/pages/warehouse/detail', item.warehouseId];
            case ActivityType.WAREHOUSE_CONTACT_REQUEST:
                return ['/pages/order/contact', item.contactId];
        }
        return [];
    }
}