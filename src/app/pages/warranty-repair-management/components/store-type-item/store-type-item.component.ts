import { mapKeys } from 'lodash';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Selection } from '@/utility/models/filter.model';
import { BrandModel } from '@/modules/warranty-repair/models/brand.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'store-type-item',
    templateUrl: './store-type-item.component.html',
    styleUrls: ['./store-type-item.component.less']
})
export class StoreTypeItemComponent {
    productTypes: any;
    productTypesArr: Selection[];
    @Input() brand: BrandModel;
    @Input() productIds: string[];
    @Output() remove = new EventEmitter<string>();
    @Output() onAddProductType = new EventEmitter<{
        brand: string;
        productType: string;
    }>();
    @Output() onRemoveProductType = new EventEmitter<{
        brand: string;
        productType: string;
    }>();

    productType: string;

    constructor(private messageService: NzMessageService) { }

    removeBrand() {
        this.remove.emit(this.brand._id);
    }

    removeProductType(productId) {
        this.onRemoveProductType.emit({
            brand: this.brand._id,
            productType: productId
        });
    }

    addProductType() {
        if (!this.productType) {
            this.messageService.warning('Vui lòng chọn sản phẩm');
            return;
        }

        this.onAddProductType.emit({
            brand: this.brand._id,
            productType: this.productType
        });
        this.productType = null;
    }

    @Input()
    set nzProductTypes(value: Selection[]) {
        if (value.length) {
            this.productTypesArr = value;
            this.productTypes = mapKeys(value, '_id');
        }
    }
}
