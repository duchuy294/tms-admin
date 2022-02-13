import * as _ from 'lodash';
import { Component } from '@angular/core';
import { GridAction } from 'app/models/grid-action.model';
import { MenuItemModalComponent } from 'app/pages/system-setting-management/components/menu-item-modal/menu-item-modal.component';
import { MenuItemModel } from './../../../../modules/system-setting/models/menu-item.model';
import { MenuService } from './../../../../modules/system-setting/services/menu.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'menu-management',
    templateUrl: 'menu-management.component.html'
})
export class MenuManagementComponent implements OnInit {
    model: MenuItemModel[] = [];
    actions = [
        new GridAction({
            name: 'button.edit',
            perform: this.openModificationModal.bind(this)
        }),
        new GridAction({
            name: 'button.remove',
            perform: this.confirmRemoval.bind(this)
        })
    ];
    modal: NzModalRef<MenuItemModalComponent>;
    lang = 'vi';

    constructor(
        private menuService: MenuService,
        private modalService: NzModalService,
        private translateService: TranslateService
    ) {
        this.lang = translateService.currentLang;
    }

    async ngOnInit() {
        window.scrollTo(0, 0);
        await this._load();
    }

    async _load() {
        this.model = this.convertToTree(await this.menuService.list());
    }

    async openModificationModal(model = new MenuItemModel()) {
        this.modal = this.modalService.create({
            nzWidth: 600,
            nzTitle: this.translateService.instant('common.menu'),
            nzContent: MenuItemModalComponent,
            nzComponentParams: {
                model: _.cloneDeep(model),
                currentModel: _.cloneDeep(model)
            },
            nzOnOk: () => this.confirm(),
            nzOkText: this.translateService.instant('common.save'),
            nzCancelText: this.translateService.instant('button.cancel')
        });
    }

    async confirm() {
        const modalContent = this.modal.getContentComponent();
        this.modal.updateConfig({ nzOkLoading: true });

        modalContent.error = new MenuItemModel();
        const response = modalContent.model._id
            ? await this.menuService.update(modalContent.model)
            : await this.menuService.create(modalContent.model);
        if (response.errorCode === 0) {
            await this._load();
        } else {
            this.handlError(response.data);
            this.modal.updateConfig({ nzOkLoading: true });
            return false;
        }
    }

    handlError(data: { field: string; message: string }[]) {
        const error = this.modal.getContentComponent().error;
        data.forEach(item => {
            error[item.field] = item.message;
        });
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

    async confirmRemoval(item: MenuItemModel) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.removeMenuItem(item),
            nzOkText: this.translateService.instant('button.agree'),
            nzCancelText: this.translateService.instant('button.cancel')
        });
    }

    async removeMenuItem(item = new MenuItemModel()) {
        const response = await this.menuService.delete(item);
        if (response.errorCode === 0) {
            await this._load();
        }
    }
}
