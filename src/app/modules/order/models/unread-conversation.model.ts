import { BaseModel } from '@/models/BaseModel';
export class UnreadConversationModel extends BaseModel {
    conversationId?: string;
    conversationType?: string;
    unread?: number = 0;
    userType?: string;
}