import { ApiMessengerHttpService } from './api-messenger-http.service';
import { BaseService } from '@/services/base.service';
import { ConversationModel } from './../models/conversation.model';
import { Injectable } from '@angular/core';
import { MessageModel } from './../models/message.model';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from 'app/models/query.model';

@Injectable()
export class MessengerService extends BaseService {
    constructor(private apiService: ApiMessengerHttpService) {
        super();
    }

    public async getConversation(orderId, type, attendeeRole = '') {
        return this.returnObj<ConversationModel>(
            await this.apiService.get(`conversation?orderId=${orderId}&type=${type}${attendeeRole ? `&attendeeRole=${attendeeRole}` : ''}`));
    }

    public async getMessages(conversationId, query = new QueryModel()) {
        return this.returnObj<PagingModel<MessageModel>>(await this.apiService.get(`conversation/${conversationId}/messages/${query.url()}`));
    }

    public async getUnreadMessages(conversationId) {
        return this.returnObj(await this.apiService.get(`conversation/${conversationId}/unread`));
    }

    public async sendMessage(conversationId, message) {
        return await this.apiService.post(`conversation/${conversationId}/message`, message);
    }
}