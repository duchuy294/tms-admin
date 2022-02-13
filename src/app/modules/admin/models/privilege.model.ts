import { BaseModel } from 'app/models/BaseModel';
import { MenuItemModel } from '@/modules/system-setting/models/menu-item.model';

export class PrivilegeModel extends BaseModel {
    groupId: string;
    menuItems: MenuItemModel[] = [];
    menuItemIds: string[] = [];

    constructor(item = null) {
        super();
        this.mapFields(item);
    }
}
