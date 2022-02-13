import { ApiMarketingHttpService } from '../marketing/services/api-marketing-http.service';
import { AppTranslationModule } from '../app-translation/app-translation.module';
import { ArticleContentTabComponent } from './components/modals/create-modify-referral-policy-modal/article-content-tab/article-content-tab.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { CommonModule } from '@angular/common';
import { CreateModifyReferralPolicyModalComponent } from './components/modals/create-modify-referral-policy-modal/create-modify-referral-policy-modal.component';
import { FAQService } from '../marketing/services/faq.service';
import { FilterReferralHistoryComponent } from './components/filter/filter-referral-history/filter-referral-history.component';
import { FormsModule } from '@angular/forms';
import { MarketingModule } from '../marketing/marketing.module';
import { NgModule } from '@angular/core';
import { ReferralContentTabComponent } from './components/modals/create-modify-referral-policy-modal/referral-content-tab/referral-content-tab.component';
import { ReferralDetailComponent } from './components/referral-detail/referral-detail.component';
import { ReferralHistoryComponent } from './components/referral-history/referral-history.component';
import { ReferralHistoryGridComponent } from './components/referral-history-grid/referral-history-grid.component';
import { ReferralHistoryStatisticComponent } from './components/referral-history-statistic/referral-history-statistic.component';
import { ReferralPolicyDetailComponent } from './components/referral-policy-detail/referral-policy-detail.component';
import { ReferralpolicyFilterComponent } from './components/filter/referral-policy-filter/referral-policy-filter.component';
import { ReferralPolicyGridComponent } from './components/referral-policy-grid/referral-policy-grid.component';
import { ReferralPolicyListComponent } from './components/referral-policy-list/referral-policy-list.component';
import { ReferralPolicyService } from './services/referral-policy.service';
import { ReferralService } from './services/referral.service';
import { ReferrerContentTabComponent } from './components/modals/create-modify-referral-policy-modal/referrer-content-tab/referrer-content-tab.component';
import { RouterModule } from '@angular/router';
import { TADService } from '../marketing/services/tad.service';
import { TextMaskModule } from 'angular2-text-mask';
import { UtilityModule } from '@/utility/utility.module';


@NgModule({
    imports: [
        AppTranslationModule,
        CKEditorModule,
        CommonModule,
        FormsModule,
        MarketingModule,
        RouterModule,
        TextMaskModule,
        UtilityModule,
    ],
    providers: [
        ApiMarketingHttpService,
        FAQService,
        ReferralPolicyService,
        ReferralService,
        TADService,
    ],
    declarations: [
        ArticleContentTabComponent,
        CreateModifyReferralPolicyModalComponent,
        FilterReferralHistoryComponent,
        ReferralContentTabComponent,
        ReferralDetailComponent,
        ReferralHistoryComponent,
        ReferralHistoryGridComponent,
        ReferralHistoryStatisticComponent,
        ReferralPolicyDetailComponent,
        ReferralPolicyGridComponent,
        ReferralPolicyListComponent,
        ReferralpolicyFilterComponent,
        ReferrerContentTabComponent,
    ],
    exports: [
        ReferralPolicyListComponent,
    ],
    entryComponents: []
})
export class ReferralModule { }
