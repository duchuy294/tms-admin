import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateHookLinkComponent } from './../modals/create-hook-link/create-hook-link.component';
import { HookLinkGridComponent } from './../hook-link-grid/hook-link-grid.component';
import { HookLinkModel } from './../../models/hook-link.model';
import { HookLinkQueryModel } from './../../models/hook-link-query.model';
import { HookLinkService } from './../../services/hook-link.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from './../../../../models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'hook-link-list',
    templateUrl: './hook-link-list.component.html'
})
export class HookLinkListComponent implements OnInit {
    @ViewChild('createHookLink') createHookLink: CreateHookLinkComponent;
    @ViewChild('hookLinkGrid') hookLinkGrid: HookLinkGridComponent;
    modelQuery: HookLinkQueryModel;
    model = new HookLinkModel();
    loading = false;
    showFilter = true;
    visibleModel = false;
    loadingModel = false;

    constructor(
        private hookLinkService: HookLinkService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        this.modelQuery = new HookLinkQueryModel();
    }

    async edit(hookLinkId: string = null) {
        this.model = await this.hookLinkService.get(hookLinkId);
        this.handleVisible(true);
    }

    async search(event = new QueryModel()) {
        this.modelQuery = event;
        await this.hookLinkGrid.loadData(this.modelQuery);
    }

    async submit($event) {
        if ($event.success) {
            this.handleVisible(false);
            this.messageService.success(
                this.translateService.instant(
                    $event.type === 'create'
                        ? 'hook.link-status.create-complete'
                        : 'hook.link-status.edit-complete'
                )
            );
            await this.hookLinkGrid.loadData();
        } else {
            this.messageService.error($event.message);
        }
        this.handleLoading(false);
    }

    handleVisible(flag = true) {
        this.visibleModel = !!flag;
        if (!flag) {
            this.createHookLink.reset();
        }
    }

    handleLoading(flag = true) {
        this.loadingModel = !!flag;
    }
}