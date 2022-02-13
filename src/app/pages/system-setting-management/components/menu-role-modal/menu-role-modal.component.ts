import * as _ from 'lodash';
import { AccountGroupModel } from 'app/modules/admin/models/account-group.model';
import { AdminService } from './../../../../modules/admin/services/admin.service';
import { Component, OnInit } from '@angular/core';
import { MenuItemModel } from './../../../../modules/system-setting/models/menu-item.model';
import { MenuService } from './../../../../modules/system-setting/services/menu.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'menu-role-modal',
    templateUrl: 'menu-role-modal.component.html'
})
export class MenuRoleModalComponent implements OnInit {
    public groups: AccountGroupModel[] = [];
    public groupId: string;
    public menuItems: MenuItemModel[] = [];
    public initMenuItems: MenuItemModel[] = [];

    constructor(public accountService: AdminService, public activeModal: NgbActiveModal, public menuService: MenuService) { }

    async ngOnInit() {
        this.groups = (await this.accountService.getGroupAdmins()).data;
        this.groupId = this.groups[0]._id;
        this.menuItems = await this.menuService.list();
        this.initMenuItems = _.cloneDeep(this.menuItems);
        await this.loadRoles();
    }

    async loadRoles() {
        const menuItemIds = await this.accountService.getMenuItems(this.groupId);
        _.forEach(this.menuItems, item => {
            item.selected = menuItemIds.includes(item._id);
        });
    }

    async confirm() {
        await this.accountService.updateMenuItems(this.groupId, _.filter(this.menuItems, x => x.selected).map(x => x._id));
    }
}