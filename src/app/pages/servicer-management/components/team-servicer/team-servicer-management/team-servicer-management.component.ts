import * as _ from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryModel } from '../../../../../models/query.model';
import { ServicerService } from './../../../../../modules/servicer/services/servicer.service';
import { TeamServicer } from './../../../../../modules/servicer/models/team-servicer/team-servicer.model';
import { TeamServicerFilterComponent } from './../team-servicer-filter/team-servicer-filter.component';
import { TeamServicerGridComponent } from './../team-servicer-grid/team-servicer-grid.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'team-servicer-management',
    templateUrl: 'team-servicer-management.component.html'
})
export class TeamServicerManagementComponent implements OnInit {
    public displayFilter: boolean = false;
    @ViewChild('teamServicerGrid')
    teamServicerGrid: TeamServicerGridComponent;
    @ViewChild('teamServicerFilter')
    teamServicerFilter: TeamServicerFilterComponent;
    createModifyModalVisible = false;
    modifyingModel = new TeamServicer();

    constructor(
        private modalService: NzModalService,
        private translateService: TranslateService,
        private messageService: NzMessageService,
        private service: ServicerService
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);
    }

    async search(query: QueryModel) {
        this.teamServicerGrid.triggerLoadData(query);
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
        const response = await this.service.deleteTeamServicer(id);
        if (response) {
            this.messageService.success(
                this.translateService.instant('common.sucessful-delete')
            );
            await this.teamServicerGrid.loadData();
        } else {
            this.messageService.error(
                this.translateService.instant('common.unsucessful-delete')
            );
        }
    }

    handleModelVisible(flag = true) {
        this.createModifyModalVisible = !!flag;
    }

    handleAfterSubmit() {
        this.teamServicerGrid.triggerLoadData();
        this.teamServicerFilter.reset();
    }
    create() {
        this.modifyingModel = null;
        this.handleModelVisible(true);
    }
}