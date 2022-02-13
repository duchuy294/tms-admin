import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateHookTypeComponent } from './../modals/create-hook-type/create-hook-type.component';
import { HookTypeGridComponent } from './../hook-type-grid/hook-type-grid.component';
import { HookTypeModel } from './../../models/hook-type.model';
import { HookTypeQueryModel } from './../../models/hook-type-query.model';
import { HookTypeService } from './../../services/hook-type.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from './../../../../models/query.model';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'hook-type-list',
    templateUrl: './hook-type-list.component.html'
})
export class HookTypeListComponent implements OnInit {
    @ViewChild('createHookType') createHookType: CreateHookTypeComponent;
    @ViewChild('hookTypeGrid') hookTypeGrid: HookTypeGridComponent;
    modelQuery: HookTypeQueryModel;
    model = new HookTypeModel();
    loading = false;
    showFilter = true;
    visibleModel = false;
    loadingModel = false;

    constructor(
        private hookTypeService: HookTypeService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        this.modelQuery = new HookTypeQueryModel();
        this.modelQuery.status = `${Status.NEW},${Status.ACTIVE}`;
    }

    async edit(hookTypeId: string = null) {
        this.model = await this.hookTypeService.get(hookTypeId);
        this.handleVisible(true);
    }

    async search(event = new QueryModel()) {
        this.modelQuery = event;
        await this.hookTypeGrid.loadData(this.modelQuery);
    }

    async submit($event) {
        if ($event.success) {
            this.handleVisible(false);
            this.messageService.success(
                this.translateService.instant(
                    $event.type === 'create'
                        ? 'hook.hook-type-status.create-complete'
                        : 'hook.hook-type-status.edit-complete'
                )
            );
            await this.hookTypeGrid.loadData();
        } else {
            this.messageService.error($event.message);
        }
        this.handleLoading(false);
    }

    handleVisible(flag = true) {
        this.visibleModel = !!flag;
        if (!flag) {
            this.createHookType.reset();
        }
    }

    handleLoading(flag = true) {
        this.loadingModel = !!flag;
    }
}
