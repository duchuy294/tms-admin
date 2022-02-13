import { BaseModel } from '@/models/BaseModel';
export class MessageModel extends BaseModel {
    _id?: string;
    text?: string;
    userId?: string;
    userType?: string;
    conversationId?: string;
    seenAt?: string;
    receivedAt?: string;
    avatar?: string;
    userName?: string;
    imageUrl?: string;
    fileUrl?: string;
}