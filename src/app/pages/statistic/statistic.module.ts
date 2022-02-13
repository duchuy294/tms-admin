import { AppHttpModule } from '@/modules/http/app-http.module';
import { AppTranslationModule } from '@/modules/app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { OverviewComponent } from './components/overview/overview.component';
import { ReportModule } from '@/modules/report/report.module';
import { RouterModule, Routes } from '@angular/router';
import { ServicerModule } from '@/modules/servicer/servicer.module';
import { UtilityModule } from '@/modules/utility/utility.module';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { PartnerProcessComponent } from './components/partner-process/partner-process/partner-process.component';
import { PartnerProcessFiltersComponent } from './components/partner-process/partner-process-filters/partner-process-filters.component';
import { PartnerProcessFiltersDetailComponent } from './components/partner-process/partner-process-filters-detail/partner-process-filters-detail.component';
import { PartnerProcessListComponent } from './components/partner-process/partner-process-list/partner-process-list.component';
import { PartnerProcessDetailComponent } from './components/partner-process/partner-process-detail/partner-process-detail.component';

const routes: Routes = [
    { path: 'overview', component: OverviewComponent },
    { path: 'partner-process', component: PartnerProcessComponent },
    { path: 'partner-process/:servicerId', component: PartnerProcessDetailComponent }
];

@NgModule({
    imports: [
        AppHttpModule,
        AppTranslationModule,
        CommonModule,
        FormsModule,
        HighchartsChartModule,
        NgbModule,
        ReportModule,
        RouterModule.forChild(routes),
        ServicerModule,
        UtilityModule,
        NzTimelineModule,
        NzProgressModule
    ],
    declarations: [
        OverviewComponent,
        PartnerProcessComponent,
        PartnerProcessFiltersComponent,
        PartnerProcessListComponent,
        PartnerProcessDetailComponent,
        PartnerProcessFiltersDetailComponent,
    ],
    exports: [
        PartnerProcessListComponent
    ]
})
export class StatisticModule { }
