import * as _ from 'lodash';
import { Component, Input, OnChanges } from '@angular/core';
import { ConversationType } from './../../const/conversation-type.enum';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { DefaultAvatar } from '@/constants/default-avatar.enum';
import { MessengerService } from './../../services/messenger.service';
import { OrderModel } from '@/modules/order/models/order.model';
import { OrderStatus } from '@/constants/OrderStatus';
import { OrderType } from '@/modules/order/constants/OrderType';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'messenger-bar',
    templateUrl: './messenger-bar.component.html',
    styleUrls: ['./messenger-bar.component.less']
})
export class MessengerBarComponent implements OnChanges {
    @Input() order: OrderModel;
    types = [];
    conversations: {
        [type: string]: {
            id: string;
            images: {};
            fullName: string;
            type: string;
        };
    } = {};
    images: { [type: string]: string } = {};
    fullName: { [_id: string]: string } = {};
    blockMessages: { [type: string]: string } = {};
    blockConversation = [
        OrderStatus.CanceledByUser,
        OrderStatus.CanceledByServicer,
        OrderStatus.CanceledByAdmin,
        OrderStatus.Finished,
        OrderStatus.FinishedWithReturn,
        OrderStatus.FailedInstallation
    ];
    nameList: { [_id: string]: string } = {};

    constructor(
        private messengerService: MessengerService,
        private customerService: CustomerService,
        private servicerService: ServicerService,
        private translateService: TranslateService
    ) { }

    async ngOnChanges(changes) {
        if (changes && changes.order) {
            this.order = changes.order.currentValue;
            switch (this.order.serviceType) {
                case OrderType.SHARING_WAREHOUSE:
                    this.types = [
                        ConversationType.HOST,
                        ConversationType.RENTER
                    ];
                    this.init();
                    await this.getProfileWarehouseOrder();
                    await this.getConversationWarehouseOrder();
                    break;

                default:
                    this.types = [];
                    if (this.order.servicerId) {
                        this.types.push(ConversationType.ALL);
                        this.types.push(ConversationType.SERVICER);
                    }
                    this.types.push(ConversationType.USER);
                    this.init();
                    await this.getProfile();
                    await this.checkBlockConversations();
                    await this.getConversations();
                    break;
            }
        }
    }

    async getProfile() {
        if (this.order) {
            const user = await this.customerService.getCustomer(
                this.order.userId
            );
            if (user) {
                this.images[ConversationType.USER] = user.avatar
                    ? user.avatar
                    : DefaultAvatar.user;
                this.fullName[ConversationType.USER] = user.fullName;
                this.nameList[user._id] = user.fullName;
            }
            const servicer = await this.servicerService.get(
                this.order.servicerId
            );
            if (servicer) {
                if (servicer.images) {
                    this.images[ConversationType.SERVICER] = servicer.images[0]
                        ? servicer.images[0]
                        : DefaultAvatar.servicer;
                }
                this.fullName[
                    ConversationType.SERVICER
                ] = servicer.fullName;
                this.nameList[servicer._id] = servicer.fullName;
            } else {
                this.images[ConversationType.SERVICER] = DefaultAvatar.servicer;
            }
        }
    }

    async getConversations() {
        for (const type of this.types) {
            const conversation = await this.messengerService.getConversation(
                this.order._id,
                type
            );
            if (conversation) {
                if (
                    type === ConversationType.USER ||
                    type === ConversationType.SERVICER
                ) {
                    this.conversations[type] = {
                        id: conversation._id,
                        images: {
                            left: this.images[type],
                            right: this.images[ConversationType.ALL]
                        },
                        fullName: this.fullName[type]
                            ? this.fullName[type]
                            : '',
                        type: type
                    };
                }
                if (type === ConversationType.ALL) {
                    this.conversations[type] = {
                        id: conversation._id,
                        images: {
                            left: this.images[ConversationType.USER],
                            right: this.images[ConversationType.SERVICER]
                        },
                        fullName: '',
                        type: type
                    };
                }
            }
        }
    }

    checkBlockConversations() {
        if (this.order) {
            if (!this.order.servicerId) {
                this.blockMessages[
                    ConversationType.SERVICER
                ] = this.translateService.instant(
                    'messenger.block-message.not-receiveOrder'
                );
                this.blockMessages[
                    ConversationType.ALL
                ] = this.translateService.instant(
                    'messenger.block-message.not-receiveOrder'
                );
            } else if (this.blockConversation.includes(this.order.status)) {
                this.blockMessages[
                    ConversationType.ALL
                ] = this.translateService.instant(
                    `messenger.block-message.${this.order.status}`
                );
            }
        }
    }

    init() {
        _.forEach(this.types, type => {
            this.blockMessages[type] = '';
        });
        this.images[ConversationType.ALL] = DefaultAvatar.admin;
    }

    async getProfileWarehouseOrder() {
        if (this.order) {
            const users: Customer[] = _.map(
                (
                    await this.customerService.getCustomers(
                        new QueryModel({
                            userIds: [this.order.userId, this.order.hostId]
                        })
                    )
                ).data,
                item => new Customer(item)
            );
            for (const item of users) {
                switch (item._id) {
                    case this.order.userId:
                        this.images[ConversationType.RENTER] = item.avatar
                            ? item.avatar
                            : DefaultAvatar.user;
                        this.fullName[
                            ConversationType.RENTER
                        ] = item.fullName;
                        this.nameList[item._id] = item.fullName;
                        break;
                    case this.order.hostId:
                        this.images[ConversationType.HOST] = item.avatar
                            ? item.avatar
                            : DefaultAvatar.user;
                        this.fullName[ConversationType.HOST] = item.fullName;
                        this.nameList[item._id] = item.fullName;
                        break;
                }
            }
        }
    }

    async getConversationWarehouseOrder() {
        for (const type of this.types) {
            const conversation = await this.messengerService.getConversation(
                this.order._id,
                ConversationType.USER,
                type
            );
            this.conversations[type] = {
                id: conversation._id,
                images: {
                    left: this.images[type],
                    right: this.images[ConversationType.ALL]
                },
                fullName: this.fullName[type] ? this.fullName[type] : '',
                type: type
            };
        }
    }
}
