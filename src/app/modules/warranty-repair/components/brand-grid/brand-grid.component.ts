import * as _ from 'lodash';
import { BrandModel } from '@/modules/warranty-repair/models/brand.model';
import { BrandService } from '../../services/brand.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CreateBrandComponent } from './../modals/create-brand/create-brand.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'brand-grid',
    templateUrl: './brand-grid.component.html',
    styleUrls: ['../default.less']
})
export class BrandGridComponent implements OnInit {
    @ViewChild('createBrand') createBrand: CreateBrandComponent;
    modelQuery = new QueryModel();
    model = new BrandModel();
    loading: boolean = false;
    pageSize: number = 20;
    pageIndex: number = 1;
    searchValue: string;
    visibleModel: boolean = false;
    @Output() delete = new EventEmitter<string>();

    public tableData = new PagingModel<BrandModel>();

    constructor(
        private brandService: BrandService,
        private messageService: NzMessageService
    ) { }

    private onLoad = _.debounce(() => {
        this.loadData();
    }, 500);

    async ngOnInit() {
        this.modelQuery.limit = this.pageSize;
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        this.tableData = await this.brandService.getBrands(this.modelQuery);
        this.loading = false;
    }

    handleVisible(flag = false) {
        this.visibleModel = !!flag;
        if (!flag) {
            this.createBrand.reset();
        }
    }

    loadDataByPage($event: number = 1) {
        this.modelQuery.page = $event;
        this.loadData();
    }

    loadDataByPageSize($event = 20) {
        this.modelQuery.limit = $event;
        this.loadData();
    }

    handleDelete(id: string = null) {
        this.delete.emit(id);
    }

    async edit(brandId: string = null) {
        this.model = await this.brandService.get(brandId);
        this.handleVisible(true);
    }

    async submit($event) {
        if ($event.success) {
            this.messageService.success(
                `${
                $event.type === 'create' ? 'Thêm' : 'Cập nhật'
                } thương hiệu thành công`
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
}
