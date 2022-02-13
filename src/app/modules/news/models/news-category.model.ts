import { BaseModel } from 'app/models/BaseModel';

export class NewsCategoryModel extends BaseModel {
    name: string;
    image: string;
    status: boolean;
    featured: boolean;
    order: number;
    targets: string[];
}