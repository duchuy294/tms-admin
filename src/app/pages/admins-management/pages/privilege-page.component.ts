import * as _ from 'lodash';
import { AccountGroupModel } from './../../../modules/admin/models/account-group.model';
import { AdminService } from 'app/modules/admin/services/admin.service';
import { Component, OnInit } from '@angular/core';
import { MenuItemModel } from './../../../modules/system-setting/models/menu-item.model';
import { MenuService } from 'app/modules/system-setting/services/menu.service';
import { PrivilegeModel } from './../../../modules/admin/models/privilege.model';
import { PrivilegeService } from './../../../modules/admin/services/privilege.service';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'privilege-page',
    templateUrl: 'privilege-page.component.html'
})
export class PrivilegePageComponent implements OnInit {
    groups: AccountGroupModel[] = [];
    group: AccountGroupModel;
    menuItems: MenuItemModel[] = [];
    lang = this.translateService.currentLang;

    constructor(
        private readonly service: AdminService,
        private readonly menuService: MenuService,
        private readonly translateService: TranslateService,
        private readonly privilegeService: PrivilegeService
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.groups = (await this.service.getGroupAdmins(new QueryModel({ limit: 1000, fields: 'name,menuItemIds' }))).data;
        if (this.groups.length) {
            this.group = this.groups[0];
        }
        const menuItems = await this.menuService.list();
        this.menuItems = this.convertToTree(menuItems);
    }

    async save(menuItemIds: string[]) {
        await this.privilegeService.update(new PrivilegeModel({ groupId: this.group._id, menuItemIds }));
    }

    convertToTree(items: MenuItemModel[]) {
        const parentItems = _.filter(items, item => !item.parentId).sort(
            x => x.order
        );
        _.forEach(parentItems, item => {
            item.children = _.filter(
                items,
                child => child.parentId === item._id
            );
        });

        return parentItems;
    }
}