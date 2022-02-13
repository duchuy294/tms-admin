import { AdminModule } from './../../modules/admin/admin.module';
import { AppTranslationModule } from './../../modules/app-translation/app-translation.module';
import { CKEditorModule } from 'ngx-ckeditor';
import { CommonModule } from '@angular/common';
import { CustomerModule } from './../../modules/customer/customer.module';
import { DetailedPolicyComponent } from '@/modules/marketing/components/promotion-policy/detailed-policy/detailed-policy.component';
import { FAQComponent } from 'app/pages/marketing-management/components/faq/faq.component';
import { FAQModalComponent } from 'app/pages/marketing-management/components/faq/faq-modal.component';
import { FilterComponent } from './components/filter/filter.component';
import { FormsModule } from '@angular/forms';
import { LoyaltyPointManagementComponent } from './components/loyalty-point-management-component/loyalty-point-management.component';
import { LoyaltyPointPolicyDetailComponent } from '@/modules/marketing/components/loyalty-point/loyalty-point-policy/loyalty-point-policy-detail/loyalty-point-policy-detail.component';
import { MarketingModule } from '../../modules/marketing/marketing.module';
import { NewsManagementComponent } from './components/news-management-component/news-management.component';
import { NewsModule } from '@/modules/news/news.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { OrderModule } from '@/modules/order/order.module';
import { PriceModule } from '@/modules/price/price.module';
import { PromotionPolicyManagementComponent } from './components/promotion-policy-management/promotion-policy-management.component';
import { ReferralManagementComponent } from './components/referral-management/referral-management.component';
import { ReferralModule } from '@/modules/referral/referral.module';
import { ReferralPolicyDetailComponent } from '@/modules/referral/components/referral-policy-detail/referral-policy-detail.component';
import { ResponseComponent } from './components/response-management/response-management.component';
import { RewardManagementComponent } from './components/reward-management/reward-management.component';
import { RouterModule, Routes } from '@angular/router';
import { ServicerModule } from './../../modules/servicer/servicer.module';
import { TADModalComponent } from 'app/pages/marketing-management/components/term-and-condition/tad-modal.component';
import { TermAndConditionComponent } from 'app/pages/marketing-management/components/term-and-condition/term-and-condition';
import { TextMaskModule } from 'angular2-text-mask';
import { UserModule } from '@/modules/user/user.module';
import { UtilityModule } from '../../modules/utility/utility.module';

const routes: Routes = [
    { path: 'faq', component: FAQComponent },
    { path: 'loyalty-point', component: LoyaltyPointManagementComponent },
    { path: 'loyalty-point/:id', component: LoyaltyPointPolicyDetailComponent },
    { path: 'news', component: NewsManagementComponent },
    { path: 'promotion-policy', component: PromotionPolicyManagementComponent },
    { path: 'promotion-policy/:id', component: DetailedPolicyComponent },
    { path: 'referral-policies', component: ReferralManagementComponent },
    { path: 'referral-policies/:id', component: ReferralPolicyDetailComponent },
    { path: 'response', component: ResponseComponent },
    { path: 'reward-management', component: RewardManagementComponent },
    { path: 'term-and-condition', component: TermAndConditionComponent },
];

@NgModule({
    imports: [
        AdminModule,
        AppTranslationModule,
        CKEditorModule,
        CommonModule,
        CustomerModule,
        FormsModule,
        MarketingModule,
        NewsModule,
        NgbModule,
        OrderModule,
        PriceModule,
        ReferralModule,
        RouterModule.forChild(routes),
        ServicerModule,
        TextMaskModule,
        UserModule,
        UtilityModule,
    ],
    declarations: [
        FAQComponent,
        FAQModalComponent,
        FilterComponent,
        LoyaltyPointManagementComponent,
        NewsManagementComponent,
        PromotionPolicyManagementComponent,
        ReferralManagementComponent,
        ResponseComponent,
        RewardManagementComponent,
        TADModalComponent,
        TermAndConditionComponent,
    ],
    entryComponents: [
        FAQModalComponent,
        TADModalComponent,
    ]
})
export class MarketingManagementModule { }