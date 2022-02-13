import { AddProviderModalComponent } from './components/modals/add-provider-modal/add-provider-modal.component';
import { AdminModule } from '../admin/admin.module';
import { ApiTelecomHttpService } from './services/api-telecom-http.service';
import { AppTranslationModule } from '../app-translation/app-translation.module';
import { ChangeProviderPasswordComponent } from './components/modals/change-provider-password/change-provider-password.component';
import { CommonModule } from '@angular/common';
import { CreateSmsTemplateComponent } from './components/modals/create-sms-template/create-sms-template.component';
import { FilterSmsTemplateComponent } from './components/filter/filter-sms-template/filter-sms-template.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { ProviderFilterComponent } from './components/filter/provider-filter/provider-filter.component';
import { ProviderGridComponent } from './components/provider-grid/provider-grid.component';
import { ProviderListComponent } from './components/provider-list/provider-list.component';
import { ProviderService } from './services/provider.service';
import { RouterModule } from '@angular/router';
import { SmsLogDetailComponent } from './components/modals/sms-log-detail/sms-log-detail.component';
import { SmsLogFilterComponent } from './components/filter/sms-log-filter/sms-log-filter.component';
import { SmsLogGridComponent } from './components/sms-log-grid/sms-log-grid.component';
import { SmsLogListComponent } from './components/sms-log-list/sms-log-list.component';
import { SmsLogService } from './services/sms-log.service';
import { SmsTemplateGridComponent } from './components/sms-template-grid/sms-template-grid.component';
import { SmsTemplateListComponent } from './components/sms-template-list/sms-template-list.component';
import { SmsTemplateService } from './services/sms-template.service';
import { UtilityModule } from 'app/modules/utility/utility.module';

@NgModule({
    imports: [
        AdminModule,
        AppTranslationModule,
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule,
        UtilityModule,
    ],
    declarations: [
        AddProviderModalComponent,
        ChangeProviderPasswordComponent,
        CreateSmsTemplateComponent,
        FilterSmsTemplateComponent,
        ProviderFilterComponent,
        ProviderGridComponent,
        ProviderListComponent,
        SmsLogDetailComponent,
        SmsLogFilterComponent,
        SmsLogGridComponent,
        SmsLogListComponent,
        SmsTemplateGridComponent,
        SmsTemplateListComponent,
    ],
    exports: [
        ProviderListComponent,
        SmsLogListComponent,
        SmsTemplateListComponent,
    ],
    entryComponents: [],
    providers: [
        ApiTelecomHttpService,
        ProviderService,
        SmsLogService,
        SmsTemplateService,
    ]
})

export class TelecomModule { }