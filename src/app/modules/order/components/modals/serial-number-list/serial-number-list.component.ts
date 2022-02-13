import * as _ from 'lodash';
import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderService } from '@/modules/order/services/order.service';
import { ProductModel } from '@/modules/order/models/product.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'serial-number-list',
    templateUrl: './serial-number-list.component.html',
    styleUrls: ['./serial-number-list.component.less']
})

export class SerialNumberListComponent {
    visibleModal: boolean = false;
    orderId: string = '';
    productData: ProductModel[] = [];
    loadingModal: boolean = false;

    @Input()
    set visible(value: boolean) {
        this.visibleModal = value;
    }

    @Input()
    set loading(value: boolean) {
        this.loadingModal = value;
    }

    @Input()
    set products(value: ProductModel[]) {
        this.productData = value;
        let i = 0;
        _.forEach(this.productData, product => {
            product['key'] = ++i;
            product['editable'] = false;
        });
    }

    @Input()
    set order(value: string) {
        this.orderId = value;
    }

    @Output() handleVisible = new EventEmitter<boolean>();

    @Output() handleLoading = new EventEmitter<boolean>();

    @Output() submit = new EventEmitter<{
        response: boolean,
        data: ProductModel[]
    }>();


    constructor(
        private orderService: OrderService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    handleVisibleModal(event) {
        this.handleVisible.emit(!!event);
    }

    handleLoadingModal(event) {
        this.handleLoading.emit(!!event);
    }

    async onUpdateProducts() {
        const emptySerialNumber = this.checkEmptySerialNumber();
        if (emptySerialNumber) {
            this.messageService.error(this.translateService.instant('order.serialNumber-status.empty-serialNumber'));
            return;
        }

        const notPositiveQuantity = this.checkPositiveQuantity();
        if (notPositiveQuantity) {
            this.messageService.error(this.translateService.instant('order.serialNumber-status.quantity-error'));
            return;
        }

        this.handleLoadingModal(true);
        const productData = _.forEach(this.productData, item => {
            delete item['key'];
            delete item['editable'];
        });
        const response = await this.orderService.updateProducts(this.orderId, productData);
        this.submit.emit({ response, data: productData });
    }

    addProduct() {
        const product = new ProductModel();
        if (this.productData.length) {
            const lastElement = this.productData.length - 1;
            if (!this.productData[lastElement].serialNumber || !this.productData[lastElement].quantity) {
                return;
            }
            this.productData[lastElement]['editable'] = false;
        }
        product['key'] = this.productData.length + 1;
        product['editable'] = true;
        this.productData = [...this.productData, product];
    }

    deleteProduct(i: number) {
        const productData = this.productData.filter(product => product['key'] !== i);
        this.productData = productData;
    }

    reset(data: ProductModel[] = []) {
        this.productData = data;
    }

    checkPositiveQuantity() {
        let error = false;
        _.forEach(this.productData, product => {
            if (product.quantity <= 0) {
                error = true;
            }
        });
        return error;
    }

    checkEmptySerialNumber() {
        let error = false;
        _.forEach(this.productData, product => {
            if (!product.serialNumber) {
                error = true;
            }
        });
        return error;
    }
}