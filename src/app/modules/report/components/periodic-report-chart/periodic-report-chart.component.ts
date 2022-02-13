import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import Data from 'highcharts/modules/data';
import Exporting from 'highcharts/modules/exporting';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { OverViewReportHttpService } from '../../services/overview-report-http.service';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

Data(Highcharts);
Exporting(Highcharts);

@Component({
  selector: 'periodic-report-chart',
  templateUrl: './periodic-report-chart.component.html',
  styleUrls: ['./periodic-report-chart.component.less']
})
export class PeriodicReportChartComponent implements OnInit, OnDestroy {
  categoriesOrder = [];
  categories = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart';
  chartOptions: Highcharts.Options = null;

  chartOptionsOrder: Highcharts.Options = null;
  updateFlag: boolean = false;
  oneToOneFlag: boolean = false;
  runOutsideAngular: boolean = false;
  reportQuery: QueryModel = new QueryModel();
  chartOrder: any;
  chart: any;
  monthFrom;
  monthTo;
  reportLoading: boolean = false;
  timeOut = null;

  constructor(
    private reportService: OverViewReportHttpService,
    private translateService: TranslateService
  ) { }

  initOptions() {
    this.categories = [
      this.translateService.instant('common.income'),
      this.translateService.instant('common.profit')
    ];
    this.categoriesOrder = [
      this.translateService.instant('common.order'),
      this.translateService.instant('common.servicer'),
      this.translateService.instant('common.customer')
    ];
    this.chartOptions = {
      title: {
        text: '',
        align: 'left'
      },
      yAxis: [{
        title: {
          text: ''
        }
      }],
      xAxis: [{
        categories: this.categories,
        crosshair: true
      }],
      tooltip: {
        shared: true
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        backgroundColor: 'rgba(255,255,255,0.25)'
      },
      series: [
        {
          name: this.translateService.instant('date.previous-period'),
          type: 'column',
          color: '#F51D6E',
          data: []
        }, {
          name: this.translateService.instant('date.later-period'),
          type: 'column',
          color: '#051E58',
          data: []
        }
      ]
      ,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              floating: false,
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
              x: 0,
              y: 0
            }
          }
        }]
      }
    };
    this.chartOptionsOrder = {
      title: {
        text: '',
        align: 'left'
      },
      yAxis: [{
        title: {
          text: ''
        }
      }],
      xAxis: [{
        categories: this.categoriesOrder,
        crosshair: true
      }],
      tooltip: {
        shared: true
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        backgroundColor: 'rgba(255,255,255,0.25)'
      },
      series: [
        {
          name: this.translateService.instant('date.previous-period'),
          type: 'column',
          color: '#F51D6E',
          data: []
        }, {
          name: this.translateService.instant('date.later-period'),
          type: 'column',
          color: '#051E58',
          data: []
        }
      ]
      ,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              floating: false,
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
              x: 0,
              y: 0
            }
          }
        }]
      }
    };
  }

  ngOnInit() {
    const currentMonth = moment().month();
    this.monthFrom = moment().month(currentMonth - 1).toDate();
    this.monthTo = moment().month(currentMonth).toDate();
    this.timeOut = setTimeout(() => { this.initOptions(); }, 1000);
  }

  ngOnDestroy() {
    clearTimeout(this.timeOut);
  }

  prepareData() {
    if (!this.monthFrom && !this.monthTo) {
      const currentMonth = moment().month();
      this.monthFrom = moment().month(currentMonth - 1).toDate();
      this.monthTo = moment().month(currentMonth).toDate();
    }
    this.reportQuery.monthFrom = moment(this.monthFrom).month() + 1;
    this.reportQuery.yearFrom = moment(this.monthFrom).year();
    this.reportQuery.monthTo = moment(this.monthTo).month() + 1;
    this.reportQuery.yearTo = moment(this.monthTo).year();
  }

  async loadReport() {
    this.prepareData();
    this.reportLoading = true;
    const response = await this.reportService.getPeriodicOrder(this.reportQuery);
    const periodicFirst = [],
      periodicLast = [],
      periodicOrderFirst = [],
      periodicOrderLast = [];
    if (response.data) {
      periodicOrderFirst.push(response.data.orders[0]);
      periodicFirst.push(response.data.revenue[0]);
      periodicFirst.push(response.data.profit[0]);

      periodicOrderLast.push(response.data.orders[1]);
      periodicLast.push(response.data.revenue[1]);
      periodicLast.push(response.data.profit[1]);
      const totalServicers = await this.reportService.getPeriodicTotalServicers(this.reportQuery);
      const totalUsers = await this.reportService.getPeriodicTotalUsers(this.reportQuery);
      periodicOrderFirst.push(totalServicers.data.servicer[0]);
      periodicOrderFirst.push(totalUsers.data.user[0]);

      periodicOrderLast.push(totalServicers.data.servicer[1]);
      periodicOrderLast.push(totalUsers.data.user[1]);

      this.chartOrder.series[0].setData(periodicOrderFirst, false);
      this.chartOrder.series[1].setData(periodicOrderLast);

      this.chart.series[0].setData(periodicFirst, false);
      this.chart.series[1].setData(periodicLast);
    }
    this.reportLoading = false;
  }

  onChangeMonth() {
    this.loadReport();
  }

  logChartInstance(chartInstance) {
    this.chart = chartInstance;
    this.loadReport();
  }

  logChartOrderInstance(chartInstance) {
    this.chartOrder = chartInstance;
    this.loadReport();
  }
}
