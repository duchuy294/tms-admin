import * as _ from 'lodash';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CreateProductTypeComponent } from './../modals/create-product-type/create-product-type.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { ProductTypeModel } from '../../models/product-type.model';
import { ProductTypeService } from '../../services/product-type.service';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'product-type-grid',
    templateUrl: './product-type-grid.component.html',
    styleUrls: ['../default.less']
})
export class ProductTypeGridComponent implements OnInit {
    @ViewChild('createProductType') createProductType: CreateProductTypeComponent;
    modelQuery = new QueryModel();
    model = new ProductTypeModel();
    loading: boolean = false;
    pageSize: number = 20;
    pageIndex: number = 1;
    visibleModel: boolean = false;
    searchValue: string = '';
    @Output() delete = new EventEmitter<string>();

    public tableData = new PagingModel<ProductTypeModel>();

    constructor(
        private productTypeService: ProductTypeService,
        private messageService: NzMessageService
    ) { }

    private onLoad = _.debounce(() => {
        this.loadData();
    }, 500);

    async ngOnInit() {
        this.modelQuery.limit = this.pageSize;
        await this.loadData();
    }

    loadDataByPage($event: number = 1) {
        this.modelQuery.page = $event;
        this.loadData();
    }

    loadDataByPageSize($event: number = 20) {
        this.modelQuery.limit = $event;
        this.loadData();
    }

    async loadData() {
        this.loading = true;
        this.tableData = await this.productTypeService.getProductTypes(
            this.modelQuery
        );
        this.loading = false;
    }

    handleVisible(flag = false) {
        this.visibleModel = !!flag;
        if (!flag) {
            this.createProductType.reset();
        }
    }

    async edit(productTypeId: string = null) {
        this.model = await this.productTypeService.get(productTypeId);
        this.handleVisible(true);
    }

    async submit($event) {
        if ($event.success) {
            this.messageService.success(
                `${
                $event.type === 'create' ? 'Thêm' : 'Cập nhật'
                } sản phẩm thành công`
            );
            this.loadData();
            this.handleVisible();
        } else {
            this.messageService.error($event.message);
        }
    }

    async onFind(event: string = null) {
        this.modelQuery.name = event;
        this.pageIndex = 1;
        this.modelQuery.page = 1;
        this.onLoad();
    }

    handleDelete(id: string = null) {
        this.delete.emit(id);
    }
}