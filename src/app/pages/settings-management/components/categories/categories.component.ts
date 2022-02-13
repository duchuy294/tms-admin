import * as _ from 'lodash';
import { CategoriesService } from './../../services/categories.service';
import { CategoryModel } from './../../../../modules/categories/model/category.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'categories',
    templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
    @Output() modelChange = new EventEmitter();
    @Output() detail = new EventEmitter<string>();
    loading: boolean = false;
    tableModel: CategoryModel[] = [];
    visibleModal: boolean = false;
    modalModel: CategoryModel = new CategoryModel();
    checked: boolean = true;
    lang = this.translateService.currentLang;

    constructor(
        public categoriesService: CategoriesService,
        public modalService: NzModalService,
        public translateService: TranslateService
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        this.tableModel = await this.categoriesService.get();
        this.loading = false;
    }

    onUpdate() {
        this.loadData();
    }

    async deleteItem(id: string) {
        if (await this.categoriesService.delete(id)) {
            await this.loadData();
        }
    }

    onDelete(id: string) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant(
                'form.categories.delete-title'
            ),
            nzContent: this.translateService.instant(
                'form.categories.delete-content'
            ),
            nzOkText: this.translateService.instant('button.agree'),
            nzOkType: 'danger',
            nzOnOk: () => this.deleteItem(id),
            nzCancelText: this.translateService.instant('button.no'),
            nzOnCancel: null
        });
    }

    addCategory() {
        this.modalModel = new CategoryModel();
        this.visibleModal = true;
    }

    async onEdit(vehicleType: CategoryModel) {
        this.modalModel = _.cloneDeep(vehicleType);
        this.visibleModal = true;
    }
}
