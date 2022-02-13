import { BaseModel } from 'app/models/BaseModel';
export class NewsBannerModel extends BaseModel {
    title: string;
    image: string;
    active: boolean;
}