import { BaseModel } from 'app/models/BaseModel';

export class NewsModel extends BaseModel {
    code?: string;
    title?: string;
    status?: boolean;
    catIds?: string[];
    order?: string;
    description?: string;
    content?: string;
    image?: string;
    featured?: boolean;
    targets?: string[];
    notiContent?: string;

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
