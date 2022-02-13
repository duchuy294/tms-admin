import { AddConditionsModalComponent } from './components/promotion-policy/add-conditions-modal/add-conditions-modal.component';
import { ApiMarketingHttpService } from './services/api-marketing-http.service';
import { ApiMarketingHttpServiceObservable } from './services/api-marketing-http.service.observable';
import { AppliedModelComponent } from './components/promotion-policy/applied-model/applied-model.component';
import { AppTranslationModule } from '@/modules/app-translation/app-translation.module';
import { CKEditorModule } from 'ngx-ckeditor';
import { CommonModule } from '@angular/common';
import { CreatePromocodeModalComponent } from './components/promotion-policy/create-promocode-modal/create-promocode-modal.component';
import { CreatePromotionModalComponent } from './components/promotion-policy/create-promotion-modal/create-promotion-modal.component';
import { DetailedLoyaltyPointModalComponent } from './components/loyalty-point/detailed-loyalty-point-modal/detailed-loyalty-point-modal.component';
import { DetailedPolicyComponent } from './components/promotion-policy/detailed-policy/detailed-policy.component';
import { FAQService } from 'app/modules/marketing/services/faq.service';
import { FormsModule } from '@angular/forms';
import { LoyaltyPointHistoryFilterComponent } from './components/loyalty-point/loyalty-point-history/loyalty-point-history-filter/loyalty-point-history-filter.component';
import { LoyaltyPointHistoryGridComponent } from './components/loyalty-point/loyalty-point-history/loyalty-point-history-grid/loyalty-point-history-grid.component';
import { LoyaltyPointHistoryListComponent } from './components/loyalty-point/loyalty-point-history/loyalty-point-history-list/loyalty-point-history-list.component';
import { LoyaltyPointPolicyConditionModalComponent } from '@/modules/marketing/components/loyalty-point/loyalty-point-policy/loyalty-point-policy-condition-modal/loyalty-point-policy-condition-modal.component';
import { LoyaltyPointPolicyDetailComponent } from '@/modules/marketing/components/loyalty-point/loyalty-point-policy/loyalty-point-policy-detail/loyalty-point-policy-detail.component';
import { LoyaltyPointPolicyFilterComponent } from './components/loyalty-point/loyalty-point-policy/loyalty-point-policy-filter/loyalty-point-policy-filter.component';
import { LoyaltyPointPolicyGridComponent } from './components/loyalty-point/loyalty-point-policy/loyalty-point-policy-grid/loyalty-point-policy-grid.component';
import { LoyaltyPointPolicyListComponent } from '@/modules/marketing/components/loyalty-point/loyalty-point-policy/loyalty-point-policy-list/loyalty-point-policy-list.component';
import { LoyaltyPointPolicyModificationModalComponent } from '@/modules/marketing/components/loyalty-point/loyalty-point-policy/loyalty-point-policy-modification-modal/loyalty-point-policy-modification-modal.component';
import { LoyaltyPointPolicyService } from 'app/modules/marketing/services/loyalty-point-policy.service';
import { LoyaltyPointService } from './services/loyalty-point.service';
import { ModifyLoyaltyPointModalComponent } from './components/loyalty-point/modals/modify-loyalty-point-modal/modify-loyalty-point-modal.component';
import { NgModule } from '@angular/core';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { PromotionCodeHistoryFilterComponent } from './components/promotion-code/promotion-code-history-filter/promotion-code-history-filter.component';
import { PromotionCodeHistoryGridComponent } from './components/promotion-code/promotion-code-history-grid/promotion-code-history-grid.component';
import { PromotionCodeHistoryListComponent } from './components/promotion-code/promotion-code-history-list/promotion-code-history-list.component';
import { PromotionCodeHistoryService } from './services/promotion-code-history.service';
import { PromotionPolicyFilterComponent } from './components/promotion-policy/promotion-policy-filter/promotion-policy-filter.component';
import { PromotionPolicyGridComponent } from './components/promotion-policy/promotion-policy-grid/promotion-policy-grid.component';
import { PromotionPolicyListComponent } from './components/promotion-policy/promotion-policy-list/promotion-policy-list.component';
import { PromotionPolicyService } from './services/promotion-policy.service';
import { RedeemedRewardComponent } from './components/reward/redeemed-reward/redeemed-reward.component';
import { RedeemedRewardService } from 'app/modules/marketing/services/redeemed-reward.service';
import { ReplyModalComponent } from './components/response/modals/reply-modal/reply-modal.component';
import { ResponseFilterComponent } from './components/response/filter/response-filter/response-filter.component';
import { ResponseGridComponent } from './components/response/response-grid/response-grid.component';
import { ResponseListComponent } from './components/response/response-list/response-list.component';
import { ResponseReplyListComponent } from './components/response/modals/response-reply-list/response-reply-list.component';
import { ResponseService } from './services/response.service';
import { RewardCategoryFilterComponent } from './components/reward/reward-category/reward-category-filter/reward-category-filter.component';
import { RewardCategoryGridComponent } from '@/modules/marketing/components/reward/reward-category/reward-category-grid/reward-category-grid.component';
import { RewardCategoryListComponent } from '@/modules/marketing/components/reward/reward-category/reward-category-list/reward-category-list.component';
import { RewardCategoryModifyComponent } from '@/modules/marketing/components/reward/reward-category/reward-category-modify/reward-category-modify.component';
import { RewardCategoryService } from 'app/modules/marketing/services/reward-category.service';
import { RewardGridComponent } from '@/modules/marketing/components/reward/reward-grid/reward-grid.component';
import { RewardListComponent } from './components/reward/reward-list/reward-list.component';
import { RewardModalComponent } from '@/modules/marketing/components/reward/reward-modal/reward-modal.component';
import { RewardModifyComponent } from '@/modules/marketing/components/reward/reward-modify/reward-modify.component';
import { RewardProviderFilterComponent } from './components/reward/reward-provider/reward-provider-filter/reward-provider-filter.component';
import { RewardProviderGridComponent } from './components/reward/reward-provider/reward-provider-grid/reward-provider-grid.component';
import { RewardProviderListComponent } from './components/reward/reward-provider/reward-provider-list/reward-provider-list.component';
import { RewardProviderModifyComponent } from '@/modules/marketing/components/reward/reward-provider/reward-provider-modify/reward-provider-modify.component';
import { RewardProviderService } from 'app/modules/marketing/services/reward-provider.service';
import { RewardSearchComponent } from './components/reward/reward-search/reward-search.component';
import { RewardService } from 'app/modules/marketing/services/reward.service';
import { RewardServiceObservable } from './services/reward.service.observable';
import { RouterModule } from '@angular/router';
import { SendRewardModalComponent } from './components/reward/send-reward-modal/send-reward-modal.component';
import { ServicerModule } from '../servicer/servicer.module';
import { TADService } from 'app/modules/marketing/services/tad.service';
import { TextMaskModule } from 'angular2-text-mask';
import { UtilityModule } from 'app/modules/utility/utility.module';

@NgModule({
    imports: [
        AppTranslationModule,
        CKEditorModule,
        CommonModule,
        FormsModule,
        RouterModule,
        ServicerModule,
        TextMaskModule,
        UtilityModule,
        NzPaginationModule,
    ],
    providers: [
        ApiMarketingHttpService,
        ApiMarketingHttpServiceObservable,
        FAQService,
        LoyaltyPointPolicyService,
        LoyaltyPointService,
        PromotionCodeHistoryService,
        PromotionPolicyService,
        RedeemedRewardService,
        ResponseService,
        RewardCategoryService,
        RewardProviderService,
        RewardService,
        RewardServiceObservable,
        TADService,
    ],
    declarations: [
        AddConditionsModalComponent,
        AppliedModelComponent,
        CreatePromocodeModalComponent,
        CreatePromotionModalComponent,
        DetailedLoyaltyPointModalComponent,
        DetailedPolicyComponent,
        LoyaltyPointHistoryFilterComponent,
        LoyaltyPointHistoryGridComponent,
        LoyaltyPointHistoryListComponent,
        LoyaltyPointPolicyConditionModalComponent,
        LoyaltyPointPolicyDetailComponent,
        LoyaltyPointPolicyFilterComponent,
        LoyaltyPointPolicyGridComponent,
        LoyaltyPointPolicyListComponent,
        LoyaltyPointPolicyModificationModalComponent,
        ModifyLoyaltyPointModalComponent,
        PromotionCodeHistoryFilterComponent,
        PromotionCodeHistoryGridComponent,
        PromotionCodeHistoryListComponent,
        PromotionPolicyFilterComponent,
        PromotionPolicyGridComponent,
        PromotionPolicyListComponent,
        RedeemedRewardComponent,
        ReplyModalComponent,
        ResponseFilterComponent,
        ResponseGridComponent,
        ResponseListComponent,
        ResponseReplyListComponent,
        RewardCategoryGridComponent,
        RewardCategoryListComponent,
        RewardCategoryModifyComponent,
        RewardGridComponent,
        RewardListComponent,
        RewardModalComponent,
        RewardModifyComponent,
        RewardProviderListComponent,
        RewardProviderModifyComponent,
        RewardSearchComponent,
        SendRewardModalComponent,
        RewardCategoryFilterComponent,
        RewardProviderFilterComponent,
        RewardProviderGridComponent
    ],
    exports: [
        CreatePromotionModalComponent,
        LoyaltyPointHistoryListComponent,
        LoyaltyPointPolicyListComponent,
        PromotionCodeHistoryGridComponent,
        PromotionCodeHistoryListComponent,
        PromotionPolicyListComponent,
        RedeemedRewardComponent,
        ResponseListComponent,
        RewardCategoryListComponent,
        RewardGridComponent,
        RewardListComponent,
        RewardProviderListComponent,
        RewardSearchComponent,
    ],
    entryComponents: [
        RewardCategoryModifyComponent,
        RewardProviderModifyComponent,
    ]
})
export class MarketingModule { }
