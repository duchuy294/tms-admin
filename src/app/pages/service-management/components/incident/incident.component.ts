import { ChangeServicerModalComponent } from './change-servicer/change-servicer-modal.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderAction } from './../../../../modules/order/models/order-action.model';
import { OrderGridComponent } from './../../../../modules/order/components/order-grid/order-grid.component';
import { OrderModel } from '../../../../modules/order/models/order.model';
import { OrderService } from './../../../../modules/order/services/order.service';
import { OrderStatus } from './../../../../constants/OrderStatus';
import { PagingModel } from '../../../../modules/utility/components/paging/paging.model';
import { QueryModel } from '../../../../models/query.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'incident',
    templateUrl: 'incident.component.html'
})
export class IncidentComponent implements OnInit {
    @ViewChild('orderGrid') orderGrid: OrderGridComponent;
    public pagingModel = new PagingModel<OrderModel>();
    public displayFilter = false;
    public orderActions: OrderAction[] = [];
    public query = new QueryModel({ hasIncident: 1 });

    constructor(
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private orderService: OrderService,
        private router: Router,
        private ngbModal: NgbModal) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.orderActions = [new OrderAction({
            name: 'common.detail',
            perform: this.goToOrderDetail.bind(this)
        }), new OrderAction({
            name: 'service.incident.requestProcessing',
            visible: (order: OrderModel) => order.status !== OrderStatus.Finished && order.status !== OrderStatus.FinishedWithReturn,
            perform: this.sendingProcessingIncident.bind(this)
        }),
        new OrderAction({
            name: 'service.incident.changeServicer',
            visible: (order: OrderModel) => order.status !== OrderStatus.Finished && order.status !== OrderStatus.FinishedWithReturn,
            perform: this.openChangeServicerModal.bind(this)
        })];
    }

    async sendingProcessingIncident(order: OrderModel = null) {
        const response = await this.orderService.requestProcessingIncident(order);
        if (response) {
            this.messageService.success(`${this.translateService.instant('incident.successfully')}`);
        } else {
            this.messageService.error(`${this.translateService.instant('incident.failed')}`);
        }

    }

    async search(query: QueryModel) {
        this.query = query;
        this.query.hasIncident = 1;
        await this._reload();
    }

    async pageChange() {
        await this._reload();
    }

    openChangeServicerModal(order: OrderModel) {
        const modal = this.ngbModal.open(ChangeServicerModalComponent)
            .componentInstance as ChangeServicerModalComponent;
        modal.order = order;
        modal.maxMoney = order.cod ? order.cod.remaining : 0;
        modal.completed = this._reload.bind(this);
    }

    async _reload() {
        this.query.page = this.pagingModel.page;
        this.query.limit = this.pagingModel.limit;
        this.orderGrid.loadData(this.query);
    }

    goToOrderDetail(order: OrderModel) {
        this.router.navigateByUrl(`pages/order/${order._id}`);
    }
}