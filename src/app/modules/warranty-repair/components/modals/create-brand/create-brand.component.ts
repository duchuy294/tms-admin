import { BrandModel } from '../../../models/brand.model';
import { BrandService } from '../../../services/brand.service';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { isEmpty, keys, mapKeys } from 'lodash';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductTypeService } from '@/modules/warranty-repair/services/product-type.service';
import { QueryModel } from '@/models/query.model';
import { Selection } from '@/utility/models/filter.model';

@Component({
    selector: 'create-brand',
    templateUrl: './create-brand.component.html'
})
export class CreateBrandComponent {
    visibleModal: boolean = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() submit = new EventEmitter<{
        success?: boolean;
        message?: string;
        type?: string;
    }>();
    @ViewChild('brandForm') brandForm: NgForm;
    modelQuery = new BrandModel();
    image = [];
    productType: string = '';
    productTypes: Selection[] = [];
    productTypesQuery: any;
    productTypesSelected: any;

    @Input()
    set visible(value: boolean) {
        this.visibleModal = value;
        if (this.visibleModal) {
            (async () => {
                await this.loadProductTypes();
                if (
                    this.modelQuery.productTypeIds &&
                    this.modelQuery.productTypeIds.length
                ) {
                    this.modelQuery.productTypeIds.forEach(productType => {
                        if (
                            !isEmpty(this.productTypesQuery) &&
                            this.productTypesQuery[productType]
                        ) {
                            this.productTypesSelected = {
                                ...this.productTypesSelected,
                                [productType]: this.productTypesQuery[
                                    productType
                                ]
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
        private brandService: BrandService,
        private productTypeService: ProductTypeService
    ) { }

    updateContentImg($event) {
        this.modelQuery.image = $event[0] || '';
    }

    handleVisibleModal(flag = false) {
        this.handleVisible.emit(!!flag);
    }

    async loadProductTypes() {
        const query = new QueryModel();
        query.limit = 1000;
        this.productTypes = await this.productTypeService.getProductTypesSelection(
            query
        );
        this.productTypesQuery = mapKeys(this.productTypes, '_id');
    }

    async onCreateBrand() {
        if (this.brandForm.valid) {
            if (!this.modelQuery.image) {
                this.messageService.warning('Vui lòng chọn ảnh đại diện');
                return;
            }
            if (!isEmpty(this.productTypesSelected)) {
                this.modelQuery.productTypeIds = keys(
                    this.productTypesSelected
                );
            }
            const response = await this.brandService[
                this.modelQuery._id ? 'update' : 'create'
            ](this.modelQuery);
            this.submit.emit({
                ...response,
                type: this.modelQuery._id ? 'update' : 'create'
            });
        } else {
            CommonHelper.validateForm(this.brandForm);
        }
    }

    removeProductType(productTypeId: string = null) {
        if (this.productTypesSelected[productTypeId]) {
            delete this.productTypesSelected[productTypeId];
        }
        this.productTypesSelected = { ...this.productTypesSelected };
    }

    addProductType() {
        if (!this.productType) {
            this.messageService.warning('Vui lòng chọn sản phẩm');
            return;
        }
        this.productTypesSelected = {
            ...this.productTypesSelected,
            [this.productType]: this.productTypesQuery[this.productType]
        };
        this.productType = null;
    }
    reset() {
        this.modelQuery = new BrandModel();
        this.image = [];
        this.productTypesSelected = {};
        this.productType = null;
        CommonHelper.resetForm(this.brandForm);
    }
}
