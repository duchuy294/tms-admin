import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AppTranslationModule } from '../../modules/app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { DashboardEffects } from '@/modules/report/effects/dashboard-statistics.effect';
import { DashboardSummaryComponent } from 'app/pages/dashboard/components/dashboard-summary/dashboard-summary.component';
import { DashboardV2Component } from './components/dashboard-v2/dashboard-v2.component';
import { DeliveryModule } from './../../modules/delivery/delivery.module';
import { EffectsModule } from '@ngrx/effects';
import { FinanceModule } from 'app/modules/finance/finance.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LocationModule } from './../../modules/location/location.module';
import { NgModule } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { OrderModule } from '../../modules/order/order.module';
import { reducer as reportReducer } from '@/modules/report/reducers/dashboard-statistics.reducers';
import { reducers } from '@/modules/servicer/reducers';
import { ReportModule } from '@/modules/report/report.module';
import { RouterModule, Routes } from '@angular/router';
import { ServicerModule } from '@/modules/servicer/servicer.module';
import { ServicerProfileComponent } from './components/modals/servicer-profile/servicer-profile.component';
import { ServicersComponent } from './components/servicers/servicers.component';
import { ServicersWithCollectionDebtComponent } from './components/modals/servicers-with-collection-debt/servicers-with-collection-debt.component';
import { StoreModule } from '@ngrx/store';
import { TeamEffects } from '@/modules/servicer/effects/team.effect';
import { TotalOrdersStatisticComponent } from './components/modals/total-orders-statistic/total-orders-statistic.component';
import { TotalServicerEffects } from '@/modules/servicer/effects/total-servicer.effect';
import { UtilityModule } from './../../modules/utility/utility.module';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PermissionDenyComponent } from './components/permission-deny/permission-deny.component';

const EFFECTS = [TeamEffects, DashboardEffects, TotalServicerEffects];

const routes: Routes = [
    { path: '', component: DashboardV2Component },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'permission-deny', component: PermissionDenyComponent }
];

@NgModule({
    imports: [
        AgmCoreModule,
        AgmDirectionModule,
        AgmSnazzyInfoWindowModule,
        AppTranslationModule,
        CommonModule,
        DeliveryModule,
        EffectsModule.forFeature(EFFECTS),
        FinanceModule,
        FormsModule,
        InfiniteScrollModule,
        LocationModule,
        OrderModule,
        ReportModule,
        RouterModule.forChild(routes),
        ServicerModule,
        StoreModule.forFeature('report', reportReducer),
        StoreModule.forFeature('servicer', reducers),
        UtilityModule,
        NzAvatarModule,
    ],
    declarations: [
        DashboardSummaryComponent,
        DashboardV2Component,
        ServicersComponent,
        ServicersWithCollectionDebtComponent,
        TotalOrdersStatisticComponent,
        ServicerProfileComponent,
        WelcomeComponent
    ]
})
export class DashboardModule { }
