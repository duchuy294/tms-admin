import * as _ from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupServicerDetail } from './../../../../../modules/servicer/models/group-servicer/group-servicer-detail.model';
import { GroupServicerFilterComponent } from './../group-servicer-filter/group-servicer-filter.component';
import { GroupServicerGridComponent } from './../group-servicer-grid/group-servicer-grid.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryModel } from './../../../../../models/query.model';
import { ServicerService } from 'app/modules/servicer/services/servicer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'group-servicer-management',
    templateUrl: 'group-servicer-management.component.html'
})
export class GroupServicerManagementComponent implements OnInit {
    public displayFilter: boolean = false;
    public displayCreate: boolean = false;
    createModifyModalVisible = false;
    modifyingModel = new GroupServicerDetail();
    @ViewChild('groupServicerGrid')
    groupServicerGrid: GroupServicerGridComponent;
    @ViewChild('groupServicerFilter')
    groupServicerFilter: GroupServicerFilterComponent;
    constructor(
        private service: ServicerService,
        private modalService: NzModalService,
        private translateService: TranslateService,
        private messageService: NzMessageService
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);
    }

    async search(query: QueryModel = new QueryModel({ fields: 'numberOfOrders' })) {
        this.groupServicerGrid.loadData(query);
    }

    handleModelVisible(flag = true) {
        this.createModifyModalVisible = !!flag;
    }

    handleAfterSubmit(loading = false) {
        if (loading) {
            const query = new QueryModel({ fields: 'numberOfOrders' });
            this.groupServicerGrid.loadData(query);
            this.groupServicerFilter.reset();
        } else {
            this.groupServicerGrid.loadData();
        }
    }

    create() {
        this.modifyingModel = null;
        this.handleModelVisible(true);
    }

    confirmDelete(id: string) {
        this.modalService.confirm({
            nzTitle: this.translateService.instant('common.confirmDelete'),
            nzOnOk: () => this.delete(id),
            nzCancelText: this.translateService.instant('actions.cancel'),
            nzOkText: this.translateService.instant('common.delete')
        });
    }

    async delete(id: string) {
        const response = await this.service.deleteGroupServicer(id);
        if (response) {
            this.messageService.success(this.translateService.instant('common.sucessful-delete')
            );
            await this.groupServicerGrid.loadData();
        } else {
            this.messageService.error(this.translateService.instant('common.sucessful-delete')
            );
        }
    }
}