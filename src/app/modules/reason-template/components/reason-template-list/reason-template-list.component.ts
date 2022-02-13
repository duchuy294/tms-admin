import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CreateReasonTemplateComponent } from './../modals/create-reason-template/create-reason-template.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from 'app/models/query.model';
import { ReasonTemplateGridComponent } from './../reason-template-grid/reason-template-grid.component';
import { ReasonTemplateModel } from '../../models/reason-template.model';
import { ReasonTemplateService } from '../../services/reason-template.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'reason-template-list',
    templateUrl: './reason-template-list.component.html'
})
export class ReasonTemplateListComponent implements OnInit {
    @ViewChild('reasonTemplateGrid') reasonTemplateGrid: ReasonTemplateGridComponent;
    @ViewChild('createReasonTemplate')
    createReasonTemplate: CreateReasonTemplateComponent;

    @Input()
    set type(value: string) {
        this.modelType = value;
    }

    modelQuery: QueryModel = new QueryModel();
    model: ReasonTemplateModel = new ReasonTemplateModel();
    loading: boolean = false;
    showFilter: boolean = false;
    visibleModel: boolean = false;
    loadingModel: boolean = false;
    modelType: string = '';

    constructor(
        private reasonTemplateService: ReasonTemplateService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        this.modelQuery['type'] = this.modelType;
        this.modelQuery.fields = 'name,image,selectedImage,order';
    }

    async edit(reasonTemplateId) {
        this.model = await this.reasonTemplateService.get(reasonTemplateId);
        this.handleVisible(true);
    }

    async submit($event) {
        if ($event.success) {
            this.handleVisible(false);
            this.messageService.success(
                this.translateService.instant(
                    $event.type === 'create'
                        ? 'settings.reason-template-status.create-complete'
                        : 'settings.reason-template-status.edit-complete'
                )
            );
            await this.reasonTemplateGrid.loadData();
        } else {
            this.messageService.error($event.message);
        }
        this.handleLoading(false);
    }

    handleVisible(flag = true) {
        this.visibleModel = !!flag;
        if (!flag) {
            this.createReasonTemplate.reset();
        }
    }

    handleLoading(flag = true) {
        this.loadingModel = !!flag;
    }
}
