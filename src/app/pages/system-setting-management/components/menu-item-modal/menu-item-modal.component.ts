import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { FormType } from './../../../../modules/utility/models/form-type';
import { MenuItemModel } from './../../../../modules/system-setting/models/menu-item.model';
import { MenuService } from 'app/modules/system-setting/services/menu.service';
import { NzUploadFileType } from '@/constants/nz-upload-file-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'menu-item-modal',
    templateUrl: 'menu-item-modal.component.html'
})
export class MenuItemModalComponent implements OnInit {
    public formType: FormType = FormType.Create;
    public model = new MenuItemModel();
    public currentModel = new MenuItemModel();
    error = new MenuItemModel();
    updated: () => void;
    menuItems: MenuItemModel[] = [];
    images = [];
    fileType = NzUploadFileType.IMAGE;
    langs = this.translateService.getLangs();
    lang = this.translateService.currentLang;

    constructor(private service: MenuService, private readonly translateService: TranslateService) { }

    async ngOnInit() {
        const menuItems = await this.service.list();
        this.menuItems = _.filter(menuItems, x => !x.parentId && (!this.model._id || x.parentId !== this.model._id));
        if (this.model.icon) {
            this.images = [{ url: this.model.icon }];
        }
    }
}
