import { MultiLanguageString } from '@/models/multi-language/multi-string';

export class CategoryModel {
    _id?: string;
    name?: MultiLanguageString = new MultiLanguageString();
    order: number;
}
