import { ActivatedRoute } from '@angular/router';
import {
    Component,
    Input,
    OnDestroy,
    OnInit
    } from '@angular/core';
import { ConversationType } from '../../const/conversation-type.enum';
import { EventBusService } from '@/services/event.bus.service';
import { Location } from '@angular/common';
import { MessengerService } from './../../services/messenger.service';
import { ReceiveMessengerNotification } from '@/modules/notification/actions/notitication.actions';

@Component({
    selector: 'messenger-tab',
    templateUrl: './messenger-tab.component.html',
    styleUrls: ['./messenger-tab.component.less']
})

export class MessengerTabComponent implements OnInit, OnDestroy {
    @Input() conversation: any;
    @Input() order = '';
    @Input() blockMessage = '';
    @Input() name: any;

    ConversationType = ConversationType;
    unreadMessages: number;
    visiblePopup = false;
    watchMessengerNotification$;
    currentOrder = '';

    constructor(
        private messengerService: MessengerService,
        private eventBusService: EventBusService,
        private route: ActivatedRoute,
        private location: Location
    ) { }

    async ngOnInit() {
        this.currentOrder = this.order;
        this.route.params.subscribe((routeParams) => {
            this.location.replaceState(`/pages/order/${routeParams.id}`);
            if (routeParams.conversationId === this.conversation.id) {
                this.handlePopupModel(true);
            }
        });
        await this.getUnreadMessages();
        this.watchMessengerNotification$ = this.eventBusService.on(new ReceiveMessengerNotification(), (notification) => {
            if (this.conversation && this.conversation.id === notification.data.conversationId) {
                this.unreadMessages = notification.data.unread;
            }
        });
    }

    ngOnDestroy() {
        if (this.watchMessengerNotification$) {
            this.watchMessengerNotification$.unsubscribe();
        }
    }

    handlePopupModel(event) {
        this.visiblePopup = !!event;
        if (!this.visiblePopup) {
            this.unreadMessages = 0;
        }
    }

    async getUnreadMessages() {
        if (this.conversation) {
            const response = await this.messengerService.getUnreadMessages(this.conversation.id);
            if (response) {
                this.unreadMessages = response['unread'];
            }
        }
    }
}