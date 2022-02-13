import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { DateTimeService } from '@/utility/services/datetime.service';
import { ORDERSTATUS } from '../../constants/OrderStatus';
import { OverViewReportHttpService } from '../../services/overview-report-http.service';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'order-report-chart',
  templateUrl: './order-report-chart.component.html',
  styleUrls: ['./order-report-chart.component.less']
})
export class OrderReportChartComponent implements OnInit {
  categoriesOrder = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart';
  chartOptionsOrder: Highcharts.Options = {
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
        name: '',
        type: 'column',
        color: '#F51D6E',
        colorByPoint: true,
        data: [
          {
            name: ``,
            color: '#F61111',
            y: 0,
            drilldown: ``,
          },
          {
            name: ``,
            color: '#150855',
            y: 0,
            drilldown: ``,
          },
          {
            name: ``,
            color: '#F1BB0A',
            y: 0,
            drilldown: ``,
          },
          {
            name: ``,
            color: '#57F085',
            y: 0,
            drilldown: ``,
          },
          {
            name: ``,
            color: '#08B7C4',
            y: 0,
            drilldown: ``,
          },
        ]
      }
    ],
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
  updateFlag: boolean = false;
  oneToOneFlag: boolean = false;
  runOutsideAngular: boolean = false;
  reportQuery: QueryModel = new QueryModel();
  chartOrder: any;
  dateFrom = null;
  dateTo = null;
  reportLoading: boolean = false;

  constructor(
    private reportService: OverViewReportHttpService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    const currentMonth = moment().month();
    this.dateFrom = moment().date(1).month(currentMonth).toDate();
    this.dateTo = moment().toDate();
  }

  prepareData() {
    delete this.reportQuery.from;
    delete this.reportQuery.to;

    if (this.dateFrom) {
      this.reportQuery.from = DateTimeService.convertDateToTimestamp(this.dateFrom, 'Etc/GMT');
    }

    if (this.dateTo) {
      this.reportQuery.to = DateTimeService.convertDateToTimestamp(this.dateTo, 'Etc/GMT', true);
    }
  }

  async loadReport() {
    this.prepareData();
    this.reportLoading = true;
    const response = await this.reportService.getTotalOrders(this.reportQuery);
    const data = this.chartOptionsOrder.series[0].data;
    for (const item in response.data['order']) {
      if (response.data.order.hasOwnProperty(item)) {
        data[item].y = response.data.order[item];
      }
    }
    this.chartOrder.series[0].setData(data);
    this.reportLoading = false;
  }

  onChangeDate() {
    this.loadReport();
  }

  logChartOrderInstance(chartInstance) {
    this.chartOrder = chartInstance;
    setTimeout(() => {
      const data = this.chartOptionsOrder.series[0].data;
      let i = 0;
      for (const item in ORDERSTATUS) {
        if (ORDERSTATUS.hasOwnProperty(item)) {
          const stringTemplate = `${this.translateService.instant(`statistics.order-report-order-type.${ORDERSTATUS[item]}`)}`;
          this.categoriesOrder.push(stringTemplate);
          const column = this.chartOptionsOrder.series[0].data[i];
          this.chartOptionsOrder.series[0].data[i] = {
            ...column,
            name: stringTemplate,
            drilldown: stringTemplate,
          };
          i++;
        }
      }
      this.chartOrder.xAxis[0].setCategories(this.categoriesOrder, true);
      this.chartOrder.series[0].setData(data);
    }, 500);
    this.loadReport();
  }
}
