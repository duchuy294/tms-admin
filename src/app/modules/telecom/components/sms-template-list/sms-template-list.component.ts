import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateSmsTemplateComponent } from './../modals/create-sms-template/create-sms-template.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SmsTemplateGridComponent } from './../sms-template-grid/sms-template-grid.component';
import { SmsTemplateModel } from '../../models/sms-template.model';
import { SmsTemplateQueryModel } from '../../models/sms-template-query.model';
import { SmsTemplateService } from '../../services/sms-template.service';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'sms-template-list',
    templateUrl: './sms-template-list.component.html'
})
export class SmsTemplateListComponent implements OnInit {
    @ViewChild('createSmsTemplate') createSmsTemplate: CreateSmsTemplateComponent;
    @ViewChild('smsTemplateGrid') smsTemplateGrid: SmsTemplateGridComponent;
    loading: boolean = false;
    loadingModel: boolean = false;
    model: SmsTemplateModel = new SmsTemplateModel();
    modelQuery: SmsTemplateQueryModel;
    showFilter: boolean = true;
    visibleModel: boolean = false;

    constructor(
        private smsTemplateService: SmsTemplateService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        this.modelQuery = new SmsTemplateQueryModel();
        this.modelQuery.status = `${Status.NEW},${Status.ACTIVE}`;
    }

    async edit(smsTemplateId) {
        this.model = await this.smsTemplateService.get(smsTemplateId);
        this.handleVisible(true);
    }

    toggleFilter() {
        this.showFilter = !this.showFilter;
    }

    async search(event) {
        this.modelQuery = event;
        await this.smsTemplateGrid.loadData(this.modelQuery);
    }

    async submit($event) {
        if ($event.success) {
            this.handleVisible(false);
            this.messageService.success(
                this.translateService.instant(
                    $event.type === 'create'
                        ? 'telecom.sms-template.status.create-complete'
                        : 'telecom.sms-template.status.edit-complete'
                )
            );
            await this.smsTemplateGrid.loadData();
        } else {
            this.messageService.error($event.message);
        }
        this.handleLoading(false);
    }

    handleVisible(flag = true) {
        this.visibleModel = !!flag;
        if (!flag) {
            this.createSmsTemplate.reset();
        }
    }

    handleLoading(flag = true) {
        this.loadingModel = !!flag;
    }
}
