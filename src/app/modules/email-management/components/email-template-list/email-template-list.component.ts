import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateEmailTemplateComponent } from './../modals/create-email-template/create-email-template.component';
import { EmailTemplateGridComponent } from './../email-template-grid/email-template-grid.component';
import { EmailTemplateModel } from '../../models/email-template.model';
import { EmailTemplateQueryModel } from '../../models/email-template-query.model';
import { EmailTemplateService } from '../../services/email-template.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from './../../../../models/query.model';
import { Status } from '@/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'email-template-list',
    templateUrl: './email-template-list.component.html'
})
export class EmailTemplateListComponent implements OnInit {
    @ViewChild('createEmailTemplate')
    createEmailTemplate: CreateEmailTemplateComponent;
    @ViewChild('emailTemplateGrid') emailTemplateGrid: EmailTemplateGridComponent;
    modelQuery: EmailTemplateQueryModel;
    model: EmailTemplateModel = new EmailTemplateModel();
    loading: boolean = false;
    showFilter: boolean = false;
    visibleModel: boolean = false;
    loadingModel: boolean = false;

    constructor(
        private emailTemplateService: EmailTemplateService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.modelQuery = new EmailTemplateQueryModel();
        this.modelQuery.status = `${Status.NEW},${Status.ACTIVE}`;
    }

    async edit(emailTemplateId: string = null) {
        this.model = await this.emailTemplateService.get(emailTemplateId);
        this.handleVisible(true);
    }

    toggleFilter() {
        this.showFilter = !this.showFilter;
    }

    async search(event = new QueryModel()) {
        this.modelQuery = event;
        await this.emailTemplateGrid.loadData(this.modelQuery);
    }

    async submit($event) {
        if ($event.success) {
            this.handleVisible(false);
            this.messageService.success(
                this.translateService.instant(
                    $event.type === 'create'
                        ? 'email.template.status-create-complete'
                        : 'email.template.status-edit-complete'
                )
            );
            await this.emailTemplateGrid.loadData();
        } else {
            this.messageService.error($event.message);
        }
        this.handleLoading(false);
    }

    handleVisible(flag = true) {
        this.visibleModel = !!flag;
        if (!flag) {
            this.createEmailTemplate.reset();
        }
    }

    handleLoading(flag = true) {
        this.loadingModel = !!flag;
    }
}
