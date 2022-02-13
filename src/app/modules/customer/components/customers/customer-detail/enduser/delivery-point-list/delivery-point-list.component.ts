import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DeliveryPointFilterComponent } from './delivery-point-filter/delivery-point-filter.component';
import { DeliveryPointGridComponent } from './delivery-point-grid/delivery-point-grid.component';
import { DeliveryPointModel } from '@/modules/customer/models/delivery-point.model';
import { DeliveryPointService } from '@/modules/customer/services/deliveryPoint.service';
import { EndUser } from '@/modules/customer/models/enduser-detail.model';
import { EndUserService } from '@/modules/customer/services/enduser.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'delivery-point-list',
    templateUrl: './delivery-point-list.component.html'
})
export class DeliveryPointListComponent implements OnInit {
    filterVisible: boolean = false;
    @ViewChild('grid') grid: DeliveryPointGridComponent;
    @ViewChild('filter') filter: DeliveryPointFilterComponent;
    modifyingModel: DeliveryPointModel;
    createModifyModalVisible: boolean = false;
    endUserId = this.route.snapshot.paramMap.get('endUserId');
    enduser: EndUser = null;

    constructor(
        private messageService: NzMessageService,
        private modalService: NzModalService,
        private translateService: TranslateService,
        private deliveryPointService: DeliveryPointService,
        private endUserService: EndUserService,
        private route: ActivatedRoute
    ) { }

    async ngOnInit() {
        this.enduser = await this.endUserService.getEnduser(this.endUserId);
    }

    toggleFilter() {
        this.filterVisible = !this.filterVisible;
    }

    search(query: QueryModel) {
        this.grid.triggerLoadData(query);
    }

    confirmDelete(id: string = null) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.delete(id),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async delete(id: string = null) {
        const response = await this.deliveryPointService.deleteDeliveryPoint(
            id
        );
        if (response.errorCode === 0) {
            this.messageService.success(
                `${this.translateService.instant(
                    'actions.remove'
                )} ${this.translateService
                    .instant('common.successfully')
                    .toLowerCase()}`
            );
        } else {
            this.messageService.error(
                `${this.translateService.instant(
                    'actions.remove'
                )} ${this.translateService
                    .instant('common.failed')
                    .toLowerCase()}`
            );
        }
        this.handleAfterSubmit();
    }

    handleModalVisible(flag = true) {
        this.createModifyModalVisible = !!flag;
    }

    create() {
        this.modifyingModel = null;
        this.handleModalVisible(true);
    }

    async edit(id: string = null) {
        const enduser = await this.deliveryPointService.getDeliveryPoint(id);
        this.modifyingModel = enduser;
        this.handleModalVisible(true);
    }

    handleAfterSubmit() {
        this.grid.loadData();
        this.filter.resetAutoSuggest();
    }
}
