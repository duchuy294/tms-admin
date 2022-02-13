import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DeliveryPointModel } from '@/modules/customer/models/delivery-point.model';
import { DeliveryPointService } from '@/modules/customer/services/deliveryPoint.service';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { QueryModel } from '@/models/query.model';


@Component({
    selector: 'delivery-point-grid',
    templateUrl: './delivery-point-grid.component.html'
})
export class DeliveryPointGridComponent implements OnInit {
    loadingGrid: boolean = false;
    public tableData = new PagingModel<DeliveryPointModel>();
    queryModel: QueryModel = new QueryModel();
    endUserId = this.route.snapshot.paramMap.get('endUserId');

    @Output() edit = new EventEmitter();
    @Output() delete = new EventEmitter();

    constructor(
        private deliveryPointService: DeliveryPointService,
        private route: ActivatedRoute,
    ) { }

    async ngOnInit() {
        await this.loadData();
    }

    async triggerLoadData(queryModel: QueryModel, pageIndex = 1) {
        await this.loadData(queryModel, pageIndex);
    }

    async loadData(query = null, page = null) {
        if (query) {
            this.queryModel = new QueryModel(query);
        }
        if (page) {
            this.queryModel.page = page;
        }
        if (this.endUserId) {
            this.queryModel.endUserId = this.endUserId;
            this.loadingGrid = true;
            this.tableData = await this.deliveryPointService.getDeliveryPoints(this.queryModel);
            const verifyQuery = this.deliveryPointService.verifyPageQueryModel(this.tableData, this.queryModel);
            if (verifyQuery.error) {
                this.queryModel = verifyQuery.modelQuery;
                this.tableData = await this.deliveryPointService.getDeliveryPoints(this.queryModel);
            }
            this.loadingGrid = false;
        }

    }

    async loadDataByPage($event: number = 1) {
        await this.loadData(null, $event);
    }

    async loadDataByPageSize($event: number = 20) {
        this.queryModel.limit = $event;
        await this.loadData(null, 1);
    }

    handleDelete(id: string = null) {
        this.delete.emit(id);
    }

    handleEdit(id: string = null) {
        this.edit.emit(id);
    }
}
