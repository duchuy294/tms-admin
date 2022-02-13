import { BaMenuService } from '../modules/theme';
import { Component, OnInit } from '@angular/core';
import { PrivilegeService } from './../modules/admin/services/privilege.service';

@Component({
    selector: 'pages',
    template: `
      <ba-sidebar></ba-sidebar>
      <ba-page-top></ba-page-top>
      <div class='al-main'>
        <div class='al-content'>
          <router-outlet></router-outlet>
        </div>
      </div>
      <ba-back-top position='200'></ba-back-top>`
})
export class PagesComponent implements OnInit {
    constructor(
        private _menuService: BaMenuService,
        private readonly privilegeService: PrivilegeService) { }

    public async ngOnInit() {
        const privilege = await this.privilegeService.get();
        this._menuService.updateMenuByRoutes(privilege.menuItems);
    }
}
