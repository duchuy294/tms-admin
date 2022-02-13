import { BrandService } from '@/modules/warranty-repair/services/brand.service';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { isEmpty, keys, mapKeys } from 'lodash';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductTypeModel } from '../../../models/product-type.model';
import { ProductTypeService } from '../../../services/product-type.service';
import { QueryModel } from '@/models/query.model';
import { Selection } from '@/utility/models/filter.model';

@Component({
    selector: 'create-product-type',
    templateUrl: './create-product-type.component.html'
})
export class CreateProductTypeComponent {
    visibleModal: boolean = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() submit = new EventEmitter<{
        success?: boolean;
        message?: string;
        type?: string;
    }>();
    @ViewChild('productForm') productForm: NgForm;
    modelQuery = new ProductTypeModel();
    brands: Selection[] = [];
    brandsQuery: any;
    brandsSelected: any;
    brand: string;

    image = [];

    @Input()
    set visible(value: boolean) {
        this.visibleModal = value;
        if (this.visibleModal) {
            (async () => {
                await this.loadBrands();
                if (
                    this.modelQuery.brandIds &&
                    this.modelQuery.brandIds.length
                ) {
                    this.modelQuery.brandIds.forEach(brand => {
                        if (
                            !isEmpty(this.brandsQuery) &&
                            this.brandsQuery[brand]
                        ) {
                            this.brandsSelected = {
                                ...this.brandsSelected,
                                [brand]: this.brandsQuery[brand]
                            };
                        }
                    });
                }
            })();
        }
    }
    @Input()
    set model(value) {
        this.modelQuery = value;
        if (this.modelQuery.image) {
            this.image = [
                {
                    url: this.modelQuery.image
                }
            ];
        }
    }
    constructor(
        private messageService: NzMessageService,
        private productTypeService: ProductTypeService,
        private brandService: BrandService
    ) { }

    updateContentImg($event) {
        this.modelQuery.image = $event[0] || '';
    }

    handleVisibleModal(flag = false) {
        this.handleVisible.emit(!!flag);
    }

    async loadBrands() {
        const query = new QueryModel();
        query.limit = 1000;
        this.brands = await this.brandService.getBrandsSelection(query);
        this.brandsQuery = mapKeys(this.brands, '_id');
    }

    async onCreateProduct() {
        if (this.productForm.valid) {
            if (!this.modelQuery.image) {
                this.messageService.warning('Vui lòng chọn ảnh đại diện');
                return;
            }
            if (!isEmpty(this.brandsSelected)) {
                this.modelQuery.brandIds = keys(this.brandsSelected);
            }
            const response = await this.productTypeService[
                this.modelQuery._id ? 'update' : 'create'
            ](this.modelQuery);
            this.submit.emit({
                ...response,
                type: this.modelQuery._id ? 'update' : 'create'
            });
        } else {
            CommonHelper.validateForm(this.productForm);
        }
    }

    removeBrand(brandId: string = null) {
        if (this.brandsSelected[brandId]) {
            delete this.brandsSelected[brandId];
        }
        this.brandsSelected = { ...this.brandsSelected };
    }

    addBrand() {
        if (!this.brand) {
            this.messageService.warning('Vui lòng chọn thương hiệu');
            return;
        }
        this.brandsSelected = {
            ...this.brandsSelected,
            [this.brand]: this.brandsQuery[this.brand]
        };
        this.brand = null;
    }

    reset() {
        this.modelQuery = new ProductTypeModel();
        this.image = [];
        this.brandsSelected = {};
        this.brand = null;
        CommonHelper.resetForm(this.productForm);
    }
}
