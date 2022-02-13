import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import StockModule from 'highcharts/modules/stock';
import { BehaviorSubject, Observable } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerServiceObservable } from '@/modules/customer/services/customer.service.observable';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OverViewReportHttpService } from '@/modules/report/services/overview-report-http.service';
import { QueryModel } from '@/models/query.model';
import { ReportOverviewQueryModel } from '@/modules/report/models/report-overview-query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { ServicerServiceObservable } from '@/modules/servicer/services/servicer.service.observable';
import { TranslateService } from '@ngx-translate/core';
StockModule(Highcharts);

@Component({
    selector: 'statistic-overview-chart',
    templateUrl: 'statistic-overview-chart.component.html',
    styleUrls: ['statistic-overview-chart.component.less']
})
export class StatisticOverViewChartComponent implements OnInit, OnDestroy {
    serviceTypes = ['delivery', 'deliveryInstallation', 'installation', 'sharingWarehouse', 'warrantyRepair'];
    filterTypes = ['day', 'week', 'month', 'quarter', 'year'];
    orderColor = '#EE8309';
    profitColor = '#F6545F';
    revenueColor = '#4DDFF1';
    Highcharts: typeof Highcharts = Highcharts;
    chartConstructor: string = 'chart';
    orderData = [];
    profitData = [];
    revenueData = [];
    categories = [];
    chartOptions: Highcharts.Options = null;
    updateFlag: boolean = false; // optional boolean
    oneToOneFlag: boolean = false; // optional boolean, defaults to false
    runOutsideAngular: boolean = false; // optional boolean, defaults to false
    chart: any;
    servicerGroups = [];
    overViewQueryModel = new ReportOverviewQueryModel();
    monthFrom = moment().toDate();
    monthTo = moment().toDate();
    yearFrom = moment().toDate();
    yearTo = moment().toDate();
    weekFrom = moment().add(-1, 'week').toDate();
    weekTo = moment().toDate();
    from = moment().startOf('week').toDate();
    to = moment().endOf('week').toDate();
    overviewLoading: boolean = false;
    overViewData;
    totalOrders: number = 0;
    totalProfit: number = 0;
    totalRevenue: number = 0;
    userType: string = 'user';
    isSearching: boolean = true;
    searchChange$ = new BehaviorSubject({ term: '', userType: this.userType });
    optionList = [];
    userSelected = null;
    timeOut = null;
    isLoading: boolean = false;

    constructor(
        private servicerService: ServicerService,
        private overViewReportService: OverViewReportHttpService,
        private messageService: NzMessageService,
        private servicerServiceObservable: ServicerServiceObservable,
        private customerServicerObservable: CustomerServiceObservable,
        private translateService: TranslateService,
    ) { }

    initOptions() {
        this.chartOptions = {
            ...{
                title: {
                    text: this.translateService.instant('common.overview'),
                    align: 'left'
                },
                xAxis: [{
                    categories: this.categories,
                    crosshair: true,
                    max: 10
                }],
                scrollbar: {
                    enabled: true,
                    step: 1
                },
                yAxis: [
                    { // Primary yAxis
                        labels: {
                            format: '{value}',
                            style: {
                                color: this.orderColor
                            }
                        },
                        title: {
                            text: this.translateService.instant('statistics.order-report-numbers'),
                            style: {
                                color: this.orderColor
                            }
                        }

                    }, { // Secondary yAxis
                        gridLineWidth: 0,
                        title: {
                            text: this.translateService.instant('common.profit'),
                            style: {
                                color: this.profitColor
                            }
                        },
                        labels: {
                            format: '{value} VNĐ',
                            style: {
                                color: this.profitColor
                            }
                        },
                        opposite: true

                    }, { // Tertiary yAxis
                        gridLineWidth: 0,
                        title: {
                            text: this.translateService.instant('common.income'),
                            style: {
                                color: this.revenueColor
                            }
                        },
                        labels: {
                            format: '{value} VNĐ',
                            style: {
                                color: this.revenueColor
                            }
                        },
                        opposite: true
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
                series: [{
                    name: this.translateService.instant('statistics.order-report-numbers'),
                    type: 'line',
                    yAxis: 0,
                    data: this.orderData,
                    tooltip: {
                        valueSuffix: ''
                    },
                    color: this.orderColor

                }, {
                    name: this.translateService.instant('common.profit'),
                    type: 'line',
                    yAxis: 1,
                    data: this.profitData,
                    tooltip: {
                        valueSuffix: ' VNĐ'
                    },
                    color: this.profitColor
                }, {
                    name: this.translateService.instant('common.income'),
                    type: 'line',
                    yAxis: 2,
                    data: this.revenueData,
                    tooltip: {
                        valueSuffix: ' VNĐ'
                    },
                    color: this.revenueColor
                }],
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
            } // required
        };
        this.isLoading = false;
    }

    async ngOnInit() {
        this.isLoading = true;
        // tslint:disable-next-line:no-any
        const getMemberList = ({ term, userType = 'user' }) => {
            if (userType === 'servicer') {
                return this.servicerServiceObservable.getServicers(new QueryModel({
                    code: term
                })).pipe(
                    map((res: any) => {
                        return res.data.data;
                    })
                );
            }
            return this.customerServicerObservable.getCustomers(new QueryModel({
                code: term
            })).pipe(
                map((res: any) => {
                    return res.data.data;
                })
            );

        };

        const optionList$: Observable<string[]> = this.searchChange$.asObservable()
            .pipe(
                debounceTime(500),
                switchMap(getMemberList)
            );
        optionList$.subscribe(data => {
            this.optionList = data;
            this.isSearching = false;
        });
        this.loadData();
        this.timeOut = setTimeout(() => { this.initOptions(); }, 1000);
    }

    ngOnDestroy() {
        clearTimeout(this.timeOut);
    }

    onChangeMember($event) {
        if ($event) {
            if (this.userType === 'user') {
                delete this.overViewQueryModel.servicerId;
                this.overViewQueryModel.userId = $event;
            } else {
                delete this.overViewQueryModel.userId;
                this.overViewQueryModel.servicerId = $event;
            }
        } else {
            delete this.overViewQueryModel.servicerId;
            delete this.overViewQueryModel.userId;
        }
        this.loadReportOverview();
    }

    onChangeAccountType($event) {
        this.userSelected = null;
        this.searchChange$.next({ term: '', userType: $event });
    }

    onSearchMember($event) {
        this.isSearching = true;
        this.searchChange$.next({ term: $event, userType: this.userType });
    }

    async loadData() {
        this.servicerGroups = (await this.servicerService.getGroupServicers()).data;
    }

    async loadReportOverview() {
        switch (this.overViewQueryModel.dateType) {
            case 'day':
                if (!this.from) {
                    this.from = moment().startOf('week').toDate();
                }
                if (!this.to) {
                    this.to = moment().endOf('week').toDate();
                }
                this.overViewQueryModel.from = moment(this.from).valueOf();
                this.overViewQueryModel.to = moment(this.to).valueOf();
                this.overViewQueryModel = _.omit(this.overViewQueryModel, ['monthFrom', 'monthTo', 'yearFrom', 'yearTo', 'quarterFrom', 'quarterTo', 'weekFrom', 'weekTo']) as ReportOverviewQueryModel;

                break;
            case 'week':
                if (!this.weekFrom) {
                    this.weekFrom = moment().add(-1, 'week').toDate();
                }
                if (!this.weekTo) {
                    this.weekTo = moment().toDate();
                }
                this.overViewQueryModel.weekFrom = moment(this.weekFrom).isoWeek();
                this.overViewQueryModel.weekTo = moment(this.weekTo).isoWeek();
                this.overViewQueryModel.yearFrom = moment(this.weekFrom).year();
                this.overViewQueryModel.yearTo = moment(this.weekTo).year();
                this.overViewQueryModel = _.omit(this.overViewQueryModel, ['monthFrom', 'monthTo', 'quarterFrom', 'quarterTo', 'to', 'from']) as ReportOverviewQueryModel;
                break;
            case 'quarter':
                if (!this.overViewQueryModel.quarterFrom || !this.overViewQueryModel.quarterTo) {
                    this.messageService.warning(this.translateService.instant('date.validation.start-end-quarter-required'));
                    return;
                }
                this.overViewQueryModel = _.omit(this.overViewQueryModel, ['monthFrom', 'monthTo', 'weekFrom', 'weekTo', 'from', 'to']) as ReportOverviewQueryModel;
                break;
            case 'month':
                if (!this.monthFrom) {
                    this.overViewQueryModel.monthFrom = moment().month() + 1;
                } else {
                    this.overViewQueryModel.monthFrom = moment(this.monthFrom).month() + 1;
                }
                if (!this.monthTo) {
                    this.overViewQueryModel.monthTo = moment().month() + 1;
                } else {
                    this.overViewQueryModel.monthTo = moment(this.monthTo).month() + 1;
                }
                this.overViewQueryModel = _.omit(this.overViewQueryModel, ['weekFrom', 'weekTo', 'quarterFrom', 'quarterTo', 'from', 'to']) as ReportOverviewQueryModel;
                break;
            case 'year':
                if (!this.yearFrom) {
                    this.overViewQueryModel.yearFrom = moment().year();
                }
                if (!this.yearTo) {
                    this.overViewQueryModel.yearTo = moment().year();
                }
                break;
        }

        this.overViewQueryModel = new ReportOverviewQueryModel({ ...this.overViewQueryModel });

        await this.getReportOverViewData();
    }

    async onChangeMonthFrom($event) {
        if (!$event) {
            this.messageService.warning(this.translateService.instant(`date.validation.start-${this.overViewQueryModel.dateType}-required`));
            return;
        }
        this.overViewQueryModel.monthFrom = moment($event).month() + 1;
        this.overViewQueryModel.yearFrom = moment($event).year();
        this.getReportOverViewData();
    }

    async onChangeMonthTo($event) {
        if (!$event) {
            this.messageService.warning(this.translateService.instant(`date.validation.end-${this.overViewQueryModel.dateType}-required`));
            return;
        }
        this.overViewQueryModel.monthTo = moment($event).month() + 1;
        this.overViewQueryModel.yearTo = moment($event).year();
        this.getReportOverViewData();
    }

    async getReportOverViewData() {
        this.overviewLoading = true;
        this.overViewData = await this.overViewReportService.getOverViewReport(this.overViewQueryModel);
        this.overviewLoading = false;
        this.processReportData();
    }

    async logChartInstance(chartInstance) {
        this.chart = chartInstance;
        await this.loadReportOverview();
    }

    processReportData() {
        this.totalOrders = 0;
        this.totalProfit = 0;
        this.totalRevenue = 0;

        if (this.overViewData && this.overViewData.data) {
            this.overViewData.data.forEach(overViewItem => {
                this.totalOrders += overViewItem.totalOrders;
                this.totalProfit += overViewItem.totalProfit;
                this.totalRevenue += overViewItem.totalRevenue;
            });
            this.overViewData.data = this.overViewData.data.map(data => {
                return { ...data, day: moment(data.day).startOf('day').valueOf() };
            });
        }

        let groupDataBy = null;
        let groupDataByYear = null;
        let groupDataByYearMonth = null;

        this.categories = [];
        this.orderData = [];
        this.profitData = [];
        this.revenueData = [];
        switch (this.overViewQueryModel.dateType) {
            case 'day':
            case 'week':
            case 'month':
                groupDataBy = _.groupBy(_.sortBy(this.overViewData.data, 'day'), 'day');
                _.forEach(groupDataBy, (groupItem, day) => {
                    this.categories.push(moment(parseInt(day)).format('DD/MM'));
                    const totalResult = _.reduce(groupItem, (result, item: any) => {
                        result.totalOrder += item.totalOrders;
                        result.totalProfit += item.totalProfit;
                        result.totalRevenue += item.totalRevenue;
                        return result;
                    }, {
                        totalOrder: 0,
                        totalProfit: 0,
                        totalRevenue: 0
                    });
                    this.orderData.push(totalResult.totalOrder);
                    this.profitData.push(totalResult.totalProfit);
                    this.revenueData.push(totalResult.totalRevenue);
                });
                break;
            case 'quarter':
            case 'year':
                groupDataBy = this.overViewData.data.map(groupItem => {
                    return {
                        ...groupItem,
                        month: moment(parseInt(groupItem.day)).month() + 1,
                        year: moment(parseInt(groupItem.day)).year()
                    };
                });
                groupDataByYear = _.groupBy(_.sortBy(groupDataBy, 'day'), 'year');
                _.forEach(groupDataByYear, (groupyYearItem, year) => {
                    groupDataByYearMonth = _.groupBy(groupyYearItem, 'month');
                    _.forEach(groupDataByYearMonth, (groupItem, month) => {
                        this.categories.push(`${month}/${year}`);
                        const totalResult = _.reduce(groupItem, (result, item: any) => {
                            result.totalOrder += item.totalOrders;
                            result.totalProfit += item.totalProfit;
                            result.totalRevenue += item.totalRevenue;
                            return result;
                        }, {
                            totalOrder: 0,
                            totalProfit: 0,
                            totalRevenue: 0
                        });
                        this.orderData.push(totalResult.totalOrder);
                        this.profitData.push(totalResult.totalProfit);
                        this.revenueData.push(totalResult.totalRevenue);
                    });

                });

                break;
        }

        this.chart.series[0].setData(this.orderData, false);
        this.chart.series[1].setData(this.profitData, false);
        this.chart.series[2].setData(this.revenueData);
        this.chart.xAxis[0].setCategories(this.categories);
        this.chart.xAxis[0].setExtremes(0, 10);

    }
}
