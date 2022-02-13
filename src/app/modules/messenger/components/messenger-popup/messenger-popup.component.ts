import * as _ from 'lodash';
import * as Ws from '@adonisjs/websocket-client';
import { AccountType } from './../../../../constants/AccountType';
import { CloudService } from './../../../utility/services/cloud.service';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConversationType } from '../../const/conversation-type.enum';
import { DefaultAvatar } from '@/constants/default-avatar.enum';
import { environment } from 'environments/environment';
import { MessageModel } from './../../models/message.model';
import { MessageStatus } from './../../const/message-status.enum';
import { MessengerService } from './../../services/messenger.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFileType } from '@/constants/nz-upload-file-type.enum';
import { QueryModel } from './../../../../models/query.model';
import { SessionService } from '@/utility/services/session.service';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
    selector: 'messenger-popup',
    templateUrl: './messenger-popup.component.html',
    styleUrls: ['./messenger-popup.component.less']
})

export class MessengerPopupComponent implements OnInit, OnDestroy, OnChanges {
    @Input() conversation: any;
    @Input() order: string = '';
    @Input() blockMessage = '';
    @Input() visible = false;
    @Input() name: any;

    @ViewChild('messengerConversation') messengerConversation: ElementRef;

    @Output() handlePopup = new EventEmitter<boolean>();

    messages: MessageModel[] = [];
    text = '';
    images: string[] = [];
    websocket = null;
    isConnected = false;
    channel = null;
    defaultAvatar = DefaultAvatar;
    admin = this.sessionService.getCurrentUser();
    isSending = false;
    messageStatuses: { [_id: string]: string } = {};
    existedMessages: { [_id: string]: boolean } = {};
    localMessages = [];
    isUploading = false;
    isShift = false;
    scrollToBottom = true;
    isLoading = false;
    uploadFile: File;
    duration: number;
    orderChange = false;
    ConversationType = ConversationType;

    constructor(
        private messengerService: MessengerService,
        private sessionService: SessionService,
        private messageService: NzMessageService,
        private translateSerivce: TranslateService,
        private cloudService: CloudService
    ) { }

    async ngOnInit() {
        $('textarea').keypress(function (e) {
            if ((e.keyCode === 13 || e.which === 13) && !e.shiftKey) {
                e.preventDefault();
            }
        });
        await this.getMessages();
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (!this.visible || this.blockMessage) {
            this.closeSocket();
        }
        if (changes.order) {
            this.orderChange = true;
        }
        if (this.orderChange && changes.conversation) {
            this.closeSocket();
            this.messages = [];
            await this.getMessages();
            this.orderChange = false;
        }
    }

    ngOnDestroy() {
        this.closeSocket();
    }

    async getMessages() {
        if (this.conversation && this.conversation.id) {
            this.isLoading = true;
            const messages = await this.messengerService.getMessages(
                this.conversation.id,
                new QueryModel({ limit: 20, way: 'old', startTime: Date.now() })
            );
            if (messages) {
                this.messages = messages.data;
                this.updateMessageStatuses(this.messages);
                this.updateExistedMessages(this.messages);
            }
            if (!this.blockMessage && !this.websocket) {
                this.connectSocket();
            }
            this.isLoading = false;
        }
    }

    closeSocket() {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
    }

    messagePosition(index) {
        if (this.isNotSameAccountTypeMessage(index) || this.messages[index].fileUrl || this.messages[index].imageUrl) {
            return (this.messages[index].userType === AccountType.ADMIN) ? 'right' : 'left';
        }
        return (this.messages[index].userType === AccountType.ADMIN) ? 'right center' : 'left center';
    }

    isNotSameAccountTypeMessage(index) {
        return ((this.messages[index - 1] && this.messages[index].userType !== this.messages[index - 1].userType)
            || !this.messages[index - 1]);
    }

    messageDate(index) {
        if (index === 0) {
            return true;
        }
        const pastDate = new Date(this.messages[index - 1].createdAt);
        const currentDate = new Date(this.messages[index].createdAt);
        if ((pastDate.getFullYear() < currentDate.getFullYear())
            || (pastDate.getFullYear() === currentDate.getFullYear() && pastDate.getMonth() < currentDate.getMonth())
            || (pastDate.getFullYear() === currentDate.getFullYear() && pastDate.getMonth() === currentDate.getMonth() && pastDate.getDate() < currentDate.getDate())) {
            return true;
        }
        return false;
    }

    messageAvatar(index) {
        if (this.isNotSameAccountTypeMessage(index)) {
            if (this.messages[index].userType === AccountType.ADMIN) {
                return DefaultAvatar.admin;
            } else {
                return this.messages[index].avatar ? this.messages[index].avatar : DefaultAvatar[this.messages[index].userType];
            }
        } else {
            return '';
        }
    }

    updateMessageStatuses(messages, status = null) {
        messages.forEach(message => {
            if (message.userType === AccountType.ADMIN) {
                this.updateMessageStatus(message, status);
            }
        });
    }

    updateMessageStatus(message, status = null) {
        if (!status) {
            this.messageStatuses[message._id] = (message.seenAt) ? MessageStatus.SEEN : MessageStatus.SEND;
        } else {
            this.messageStatuses[message._id] = status;
        }
    }

    updateExistedMessages(messages) {
        messages.forEach(message => {
            this.existedMessages[message._id] = true;
        });
    }

    handlePopupModel(value) {
        this.handlePopup.emit(!!value);
        if (this.websocket && !value) {
            this.websocket.close();
            this.websocket = null;
        }
    }

    async onScrollUp() {
        this.scrollToBottom = false;
        const currentTime = (this.messages[0]) ? this.messages[0].createdAt : Date.now();
        const messagesPaging = await this.messengerService.getMessages(this.conversation.id, new QueryModel({ limit: 20, way: 'old', startTime: currentTime }));
        const messages = messagesPaging.data;
        messages.pop();
        this.updateMessageStatuses(messages);
        this.updateExistedMessages(messages);
        this.messages = [...messages, ...this.messages];
    }

    connectSocket() {
        this.websocket = Ws(environment.socketUrl, {
            path: 'messenger',
            query: {
                jwt_token: this.sessionService.getToken()
            }
        });
        this.websocket.connect();
        this.websocket.on('open', () => {
            if (this.visible) {
                this.subscribeChannel();
                this.isConnected = true;
            }
        });

        this.websocket.on('error', () => {
            this.isConnected = false;
        });
    }

    subscribeChannel() {
        this.channel = this.websocket.subscribe(`chat:${this.conversation.id}`);

        this.channel.on('error', () => {
            this.isConnected = false;
        });

        this.channel.on('message', (message) => {
            if (!this.existedMessages[message._id]) {
                this.messages.push(message);
                this.existedMessages[message._id] = true;
            }
            if (message.userType === AccountType.ADMIN) {
                this.updateMessageStatus(message);
            }
        });
    }

    async sendMessage() {
        this.isSending = true;
        $('textarea').keypress(function (e) {
            if ((e.keyCode === 13 || e.which === 13) && !e.shiftKey) {
                e.preventDefault();
            }
        });
        if (this.text && this.isConnected && !this.isUploading && !this.isShift) {
            const input = this.text.trim();
            if (input) {
                this.scrollToBottom = true;
                this.localMessages.push(this.messages.length);
                const randomId = _.uniqueId('message');
                this.messages.push(new MessageModel({
                    _id: randomId,
                    text: input,
                    userType: AccountType.ADMIN,
                    avatar: (this.admin.avatar) ? this.admin.avatar : DefaultAvatar.admin,
                    createdAt: Date.now()
                }));
                this.updateMessageStatus(_.last(this.messages), MessageStatus.WAITING);
                this.text = '';
                this.isSending = false;
                const response = await this.messengerService.sendMessage(this.conversation.id, { text: input });
                if (response.errorCode === 0) {
                    delete this.messageStatuses[randomId];
                    this.messages[this.localMessages.shift()]._id = response.data._id;
                    this.updateMessageStatus(response.data);
                    this.existedMessages[response.data._id] = true;
                } else {
                    this.messageStatuses[randomId] = MessageStatus.ERROR;
                }
            }
        }
        this.isSending = false;
    }

    beforeUpload = (file: File) => {
        this.uploadFile = file;
        if (file.type && NzUploadFileType.IMAGE.includes(file.type)) {
            this.handleUpload();
        } else if (file.type && NzUploadFileType.VIDEO.includes(file.type)) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                this.duration = video.duration;
                this.handleUpload();
            };
            video.src = URL.createObjectURL(this.uploadFile);
        } else {
            this.messageService.warning(this.translateSerivce.instant('uploader.file-format-invalid'));
        }
        return false;
    }

    async handleUpload() {
        if (NzUploadFileType.VIDEO.includes(this.uploadFile.type)) {
            if (this.duration > 30) {
                this.messageService.warning(this.translateSerivce.instant('uploader.video-duration', { limit: 30 }));
                return;
            }
        }
        this.isUploading = true;
        const result = await this.cloudService.uploadFile(this.uploadFile, 'messenger');
        if (result.data.length) {
            this.scrollToBottom = true;
            this.isUploading = false;
            this.localMessages.push(this.messages.length);
            this.messages.push(new MessageModel({
                id: '',
                imageUrl: result.data[0].fullPath,
                userType: AccountType.ADMIN,
                avatar: (this.admin.avatar) ? this.admin.avatar : DefaultAvatar.admin,
                createdAt: Date.now()
            }));
            this.isUploading = false;
            const response = await this.messengerService.sendMessage(this.conversation.id, { imageUrl: result.data[0].fullPath });
            if (response.errorCode === 0) {
                this.messages[this.localMessages.shift()]._id = response.data._id;
                this.updateMessageStatus(response.data);
                this.existedMessages[response.data._id] = true;
            } else {
                this.messageService.error(response.message);
            }
        }
    }
}