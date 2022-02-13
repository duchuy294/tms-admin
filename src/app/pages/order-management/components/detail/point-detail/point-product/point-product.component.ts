import * as _ from 'lodash';
import { Component, Input } from '@angular/core';
import { ContactModel } from '@/models/contact.model';
import { PointModel } from 'app/modules/order/models/point.model';
import { PointType } from '@/modules/order/constants/PointType';
import { ProductModel } from '@/modules/order/models/product.model';

@Component({
    selector: 'point-product',
    templateUrl: 'point-product.component.html',
    styleUrls: ['point-product.component.less']
})
export class PointProductComponent {
    private _point: PointModel;
    PointType = PointType;
    @Input() pickPointProducts: PointModel[] = [];
    @Input() groupReturnProducts: {
        pointId: string, products: ProductModel[], externalCode?: string, contact?: ContactModel
    }[] = null;
    @Input()
    set point(value: PointModel) {
        this._point = value;
    }
    get point() {
        return this._point;
    }

    getProductsForType(type: number = 1) {
        if (type === PointType.PickUp) {
            return this.pickPointProducts;
        } else {
            return this.groupReturnProducts;
        }
    }

    checkExistProducts(pointProducts) {
        if (pointProducts) {
            for (const item of pointProducts) {
                if (!_.isEmpty(item.products)) {
                    return true;
                }
            }
        }
        return false;
    }

    get checkDisplayingInformationProducts() {
        return (this.point.type === PointType.PickUp && this.checkExistProducts(this.pickPointProducts)) ||
            (this.point.type === PointType.Delivery && this.point && !_.isEmpty(this.point.products)) ||
            (this.point.type === PointType.Return && this.checkExistProducts(this.groupReturnProducts));
    }
}