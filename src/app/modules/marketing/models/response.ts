import { BaseModel } from 'app/models/BaseModel';


class Reply {
    title: string;
    content: string;
    repliedBy: string;
    repliedAt: number;
}

export class ResponseModel extends BaseModel {
    code: string;
    email: string;
    phone: string;
    orderCode: string;
    comment: string;
    userId: string;
    userType: string;
    reply: Reply = new Reply();
}

export class ReplyModel {
    responseId: string;
    title: string = '';
    content: string = '';
}