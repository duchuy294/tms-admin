import { ApiReasonTemplateHttpService } from './services/api-reason-template-http.service';
import { AppTranslationModule } from '@/modules/app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { CreateReasonTemplateComponent } from './components/modals/create-reason-template/create-reason-template.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { ReasonTemplateGridComponent } from './components/reason-template-grid/reason-template-grid.component';
import { ReasonTemplateListComponent } from './components/reason-template-list/reason-template-list.component';
import { ReasonTemplateService } from './services/reason-template.service';
import { ReasonTemplateTabComponent } from './components/reason-template-tab/reason-template-tab.component';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '@/utility/utility.module';

@NgModule({
    imports: [
        AppTranslationModule,
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule,
        UtilityModule,
    ],
    declarations: [
        CreateReasonTemplateComponent,
        ReasonTemplateGridComponent,
        ReasonTemplateListComponent,
        ReasonTemplateTabComponent,
    ],
    exports: [
        ReasonTemplateTabComponent,
    ],
    entryComponents: [],
    providers: [
        ApiReasonTemplateHttpService,
        ReasonTemplateService,
    ]
})

export class ReasonTemplateModule { }