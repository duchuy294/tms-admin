import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderModel } from '@/modules/order/models/order.model';
import { OrderService } from '@/modules/order/services/order.service';
import { OrderType } from '@/modules/order/constants/OrderType';

@Component({
    selector: 'order-detail-controller',
    templateUrl: './order-detail-controller.component.html'
})
export class OrderDetailControllerComponent implements OnInit, OnDestroy {
    order: OrderModel = null;
    orderChangeRef$: any;
    orderId = this.route.snapshot.paramMap.get('id');
    OrderType = OrderType;

    constructor(
        private route: ActivatedRoute,
        private db: AngularFireDatabase,
        private orderService: OrderService
    ) { }

    async ngOnInit() {
        this.route.params.subscribe(() => {
            this.loadData();
        });

        this.orderChangeRef$ = this.db.database.ref(`order/${this.route.snapshot.paramMap.get('id')}`);
        this.orderChangeRef$.on('child_changed', this.loadData.bind(this));
        this.orderChangeRef$.on('child_removed', this.loadData.bind(this));
    }

    ngOnDestroy() {
        if (this.orderChangeRef$) {
            this.orderChangeRef$.off('child_changed', this.loadData.bind(this));
            this.orderChangeRef$.off('child_removed', this.loadData.bind(this));
        }
    }

    async loadData() {
        this.orderId = this.route.snapshot.paramMap.get('id');
        this.order = await this.orderService.get(this.orderId);
    }
}