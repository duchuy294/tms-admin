import * as _ from 'lodash';
import { ActivityService } from '@/modules/activity/services/activity.service';
import { ActivityType } from '@/modules/activity/constants/activity-type.enum';
import { Component, OnInit } from '@angular/core';
import { EventBusService } from '@/services/event.bus.service';
import { GlobalState } from './../../../../global.state';
import { LogoutStart } from '@/pages/login/actions';
import { QueryModel } from '@/models/query.model';
import { ReceiveMessengerNotification, ReceiveNotification, SeenNotification } from '@/modules/notification/actions/notitication.actions';
import { SessionService } from '@/utility/services/session.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'ba-page-top',
    templateUrl: './baPageTop.html',
    styleUrls: ['./baPageTop.scss', './baPageTop.less']
})
export class BaPageTopComponent implements OnInit {
    public isScrolled: boolean = false;
    public isMenuCollapsed: boolean = false;
    profile: any;

    notifications$ = [];
    notificationPages: number;
    notificationPage = 1;
    notificationTypes = [
        ActivityType.HAPPEN_INCIDENT,
        ActivityType.RESPONSE,
        ActivityType.WITHDRAWAL_REQUEST,
        ActivityType.NEW_WAREHOUSE,
        ActivityType.WAREHOUSE_CONTACT_REQUEST,
        ActivityType.CONFIRM_COMPLETE_REQUEST
    ];
    existedNotification: { [id: string]: boolean } = {};
    watchNotification$;

    messenger$ = [];
    messengerPages: number;
    messengerPage = 1;
    existedMessenger: { [id: string]: boolean } = {};
    watchMessengerNotification$;

    totalUnreadMessenger = 0;
    totalUnreadNotification = 0;
    handleReadNotification$;

    isLoadingNotification = false;

    constructor(
        private _state: GlobalState,
        private eventBusService: EventBusService,
        private sessionService: SessionService,
        private translateService: TranslateService,
        private activityService: ActivityService
    ) {
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
    }

    async ngOnInit() {
        this.profile = this.sessionService.getCurrentUser();
        await this.updateUnread();

        this.watchNotification$ = this.eventBusService.on(new ReceiveNotification(), async () => {
            await this.loadUnreadNotification();
        });

        this.watchMessengerNotification$ = this.eventBusService.on(new ReceiveMessengerNotification(), async () => {
            await this.loadUnreadMessenger();
        });

        this.handleReadNotification$ = this.eventBusService.on(new SeenNotification(), async () => {
            await this.updateUnread();
        });
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    public scrolledChanged(isScrolled) {
        this.isScrolled = isScrolled;
    }

    public signout() {
        this.eventBusService.emit(new LogoutStart());
    }

    public changeLanguage(language: string, region: string) {
        this.translateService.use(language);
        localStorage.setItem('language', language);
        localStorage.setItem('region', region);
        window.location.reload();
    }

    async loadNotifications(isFirstLoad = true) {
        this.isLoadingNotification = true;
        if (isFirstLoad) {
            this.notificationPage = 1;
            this.notifications$ = [];
            this.existedNotification = {};
        }
        const response = await this.activityService.filter(new QueryModel({
            'page': this.notificationPage,
            'limit': 10,
            'type': this.notificationTypes
        }));
        this.notificationPages = response.pages;
        if (this.notificationPage < this.notificationPages) {
            this.notificationPage++;
        }
        _.forEach(response.data, item => {
            if (!this.existedNotification[item._id]) {
                this.notifications$.push(item);
                this.existedNotification[item._id] = true;
            }
        });
        this.isLoadingNotification = false;
    }

    async loadMessenger(isFirstLoad = true) {
        this.isLoadingNotification = true;
        if (isFirstLoad) {
            this.messengerPage = 1;
            this.messenger$ = [];
            this.existedMessenger = {};
        }
        const response = await this.activityService.filter(new QueryModel({
            'page': this.messengerPage,
            'limit': 10,
            'type': ActivityType.NEW_MESSAGE
        }));
        this.messengerPages = response.pages;
        if (this.messengerPage < this.messengerPages) {
            this.messengerPage++;
        }
        _.forEach(response.data, item => {
            if (!this.existedMessenger[item._id]) {
                this.messenger$.push(item);
                this.existedMessenger[item._id] = true;
            }
        });
        this.isLoadingNotification = true;
    }

    async updateUnread() {
        await this.loadUnreadNotification();
        await this.loadUnreadMessenger();
    }

    async loadUnreadMessenger() {
        const messengerResponse = await this.activityService.getTotalUnseen(new QueryModel({ type: ActivityType.NEW_MESSAGE }));
        this.totalUnreadMessenger = (messengerResponse && messengerResponse.data && messengerResponse.data.unseen) ? messengerResponse.data.unseen : 0;
    }

    async loadUnreadNotification() {
        const notificationResponse = await this.activityService.getTotalUnseen(new QueryModel({ type: this.notificationTypes }));
        this.totalUnreadNotification = (notificationResponse && notificationResponse.data && notificationResponse.data.unseen) ? notificationResponse.data.unseen : 0;
    }

    async seen(item) {
        if (!item.seen) {
            item.seen = true;
            if (this.notificationTypes.includes(item.type)) {
                this.totalUnreadNotification = this.totalUnreadNotification ? this.totalUnreadNotification - 1 : 0;
            } else {
                this.totalUnreadMessenger = this.totalUnreadMessenger ? this.totalUnreadMessenger - 1 : 0;
            }
        }
        await this.activityService.seen(item._id);
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
