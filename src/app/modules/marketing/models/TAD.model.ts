import { BaseModel } from 'app/models/BaseModel';

export class TADModel extends BaseModel {
    title: string;
    content: string;
    userType: string = 'user';
    order: number = 0;
    type: string;
}
