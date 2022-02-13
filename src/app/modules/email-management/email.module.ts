import { AdminModule } from '../admin/admin.module';
import { ApiEmailHttpService } from './services/api-email-http.service';
import { AppTranslationModule } from '../app-translation/app-translation.module';
import { ChangePasswordEmailAccountComponent } from './components/modals/change-password-email-account/change-password-email-account.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { CommonModule } from '@angular/common';
import { CreateEmailAccountComponent } from './components/modals/create-email-account/create-email-account.component';
import { CreateEmailTemplateComponent } from './components/modals/create-email-template/create-email-template.component';
import { EmailAccountGridComponent } from './components/email-account-grid/email-account-grid.component';
import { EmailAccountListComponent } from './components/email-account-list/email-account-list.component';
import { EmailAccountService } from './services/email-account.service';
import { EmailTemplateGridComponent } from './components/email-template-grid/email-template-grid.component';
import { EmailTemplateListComponent } from './components/email-template-list/email-template-list.component';
import { EmailTemplateService } from './services/email-template.service';
import { FilterEmailAccountComponent } from './components/filter/filter-email-account/filter-email-account.component';
import { FilterEmailTemplateComponent } from './components/filter/filter-email-template/filter-email-template.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '@/utility/utility.module';

@NgModule({
    imports: [
        AdminModule,
        AppTranslationModule,
        CKEditorModule,
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule,
        UtilityModule,
    ],
    declarations: [
        ChangePasswordEmailAccountComponent,
        CreateEmailAccountComponent,
        CreateEmailTemplateComponent,
        EmailAccountGridComponent,
        EmailAccountListComponent,
        EmailTemplateGridComponent,
        EmailTemplateListComponent,
        FilterEmailAccountComponent,
        FilterEmailTemplateComponent,
    ],
    exports: [
        EmailAccountListComponent,
        EmailTemplateListComponent,
    ],
    entryComponents: [],
    providers: [
        ApiEmailHttpService,
        EmailAccountService,
        EmailTemplateService,
    ]
})
export class EmailModule { }