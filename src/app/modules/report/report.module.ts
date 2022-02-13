import { ApiReportHttpService } from './services/api-report-http.service';
import { ApiReportHttpServiceObservable } from './services/api-report-http.service.observable';
import { AppTranslationModule } from '../app-translation/app-translation.module';
import { CommonModule } from '@angular/common';
import { CustomerModule } from '../customer/customer.module';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgModule } from '@angular/core';
import { OrderReportChartComponent } from './components/order-report-chart/order-report-chart.component';
import { OverViewReportHttpService } from './services/overview-report-http.service';
import { PeriodicReportChartComponent } from './components/periodic-report-chart/periodic-report-chart.component';
import { ReportService } from 'app/modules/report/services/report.service';
import { ReportServiceObservable } from './services/report.service.observable';
import { ServicerModule } from '../servicer/servicer.module';
import { StatisticOverViewChartComponent } from './components/statistic-overview-chart/statistic-overview-chart.component';
import { UtilityModule } from '@/utility/utility.module';

@NgModule({
    imports: [
        AppTranslationModule,
        CommonModule,
        CustomerModule,
        FormsModule,
        HighchartsChartModule,
        ServicerModule,
        UtilityModule,
    ],
    providers: [
        ApiReportHttpService,
        ApiReportHttpServiceObservable,
        OverViewReportHttpService,
        ReportService,
        ReportServiceObservable,
    ],
    declarations: [
        OrderReportChartComponent,
        PeriodicReportChartComponent,
        StatisticOverViewChartComponent,
    ],
    exports: [
        OrderReportChartComponent,
        PeriodicReportChartComponent,
        StatisticOverViewChartComponent,
    ]
})
export class ReportModule { }