import { BaseModel } from 'app/models/BaseModel';
import { MultiLanguageString } from '@/models/multi-language/multi-string';

export class MenuItemModel extends BaseModel {
    path: string;
    title = new MultiLanguageString();
    icon: string;
    order: number;
    children: MenuItemModel[];
    parentId: string = '';
    selected = false;
}