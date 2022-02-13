import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { AdminPermission } from '@/constants/AdminPermissions';
import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { Customer } from '@/modules/customer/models/customer-detail.model';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { FilterOrderComponent } from '../filter/filter-order/filter-order.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { OperatorNoteComponent } from './../operator-note/operator-note.component';
import { OrderAction } from '../../models/order-action.model';
import { OrderGridComponent } from './../order-grid/order-grid.component';
import { OrderModel } from './../../models/order.model';
import { OrderQueryModel } from '../../models/order-query.model';
import { OrderService } from '@/modules/order/services/order.service';
import { OrderStatus } from '@/constants/OrderStatus';
import { OrderType } from '../../constants/OrderType';
import { PackageModel } from './../../models/package.model';
import { PointType } from '../../constants/PointType';
import { Profile } from '@/modules/profile/models/profile.model';
import { QueryModel } from '@/models/query.model';
import { ReportService } from 'app/modules/report/services/report.service';
import { SessionService } from '@/modules/utility/services/session.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { WarehouseService } from '@/modules/warehouse/services/warehouse.service';
import * as moment from 'moment';
@Component({
    selector: 'order-list',
    templateUrl: 'order-list.component.html',
    styleUrls: ['./order-list.component.less']
})
export class OrderListComponent implements OnInit, OnDestroy {
    @ViewChild('orderGrid') orderGrid: OrderGridComponent;
    @ViewChild('orderOperatorNote') orderOperatorNote: OperatorNoteComponent;
    @ViewChild('fileUpload') fileUpload: ElementRef;
    @ViewChild('singleScanPack') singleScanPack: ElementRef;
    @ViewChild('modalQuickAssign') modalQuickAssign: NzModalRef;
    @ViewChild(FilterOrderComponent)
    orderFilter: FilterOrderComponent;
    order: OrderModel = null;
    modelQuery: OrderQueryModel;
    currentUser: Profile = null;
    loading = false;
    showFilter = false;
    visibleModel = false;
    loadingModel = false;
    exporting = false;
    exportFields =
        'code,createdAt,serviceType,userCode,userName,userPhone,servicerCode,servicerName,status,userCost,baseUserCost,servicerCost,commission';
    visibleNoteForm: boolean = false;
    loadingNoteForm: boolean = false;
    packages: PackageModel[] = [];
    shownPackages: PackageModel[] = [];
    shownPackagesSo: any[];
    packageSos: PackageModel[] = [];
    visibleModal = false;
    visibleCancelOrder = false;
    visible3PLOrder = false;
    visibleUpdateTotalPackage = false;
    scan3PLBySO = false;
    assigning = false;
    uploading = false;
    closeAble = false;
    selectedServicer: string = null;
    servicerSearchCondition = {};
    checkValid = true;
    checkInalid = true;
    isView = false;
    state = [true, false];
    hubId: string = '';
    hubs: Customer[] = [];
    pageChange$: Subscription;
    AdminPermission = AdminPermission;
    scanBySO = false;
    currentOrder: OrderModel;
    packageTxt = '';
    packageSearch = '';
    clonePackages = {
        totalPackage: 0,
        packageList: []
    };
    get totalValidPackage() {
        return this.packages.filter(x => x.valid).length;
    }

    public actions = [
        new OrderAction({
            name: 'common.detail',
            perform: this.goToOrderDetail.bind(this)
        }),
        new OrderAction({
            name: 'button.processing-timeout',
            visible: (order: OrderModel) => this.checkDisplayTimeout(order),
            perform: this.operateTimeout.bind(this)
        }),
        new OrderAction({
            name: 'button.processed-timeout',
            visible: (order: OrderModel) =>
                this.checkDisplayProcesingTimeout(order),
            perform: this.operatePocessingTimeout.bind(this)
        }),
        new OrderAction({
            name: 'common.convertToDelivery',
            visible: (order: OrderModel) =>
                order.serviceType === OrderType.DELIVERY_INSTALL &&
                [
                    OrderStatus.FindingServicer,
                    OrderStatus.Accepted,
                    OrderStatus.InProgress
                ].includes(order.status),
            perform: this.updateOrderType.bind(this)
        }),
        new OrderAction({
            name: 'button.updatePackage',
            visible: (order: OrderModel) =>
                this.checkDisplayUpdateTotalPackage(order),
            perform: this.showUpdateTotalPackage.bind(this)
        }),
        new OrderAction({
            name: 'button.packageList',
            visible: (order: OrderModel) =>
                order.detail &&
                order.detail.points[1] &&
                order.detail.points[1].scanStore,
            perform: this.viewPackage.bind(this)
        })
    ];

    constructor(
        private reportService: ReportService,
        private warehouseService: WarehouseService,
        private sessionService: SessionService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private orderService: OrderService,
        private customerService: CustomerService
    ) {}

    ngOnInit() {
        this.modelQuery = new OrderQueryModel({
            status: null,
            serviceType: [
                OrderType.INSTALL,
                OrderType.DELIVERY_INSTALL,
                OrderType.DELIVERY,
                OrderType.WARRANTY_REPAIR
            ],
            limit: 20,
            fields:
                'code,createdAt,userId,status,progress,services,userCost,baseUserCost,servicerCost,payment,servicerId,serviceType,costDetail,prePaid,processedBy,adminNote,externalCode,detail,deliveryType,clientBranchId,packages,clientHandoverCode'
        });
        this.currentUser = this.sessionService.getCurrentUser();
        this.customerService
            .getCustomers(new QueryModel({ isHub: true }))
            .then(customerPaging => {
                this.hubs.push(...customerPaging.data);
            });
        this.activatedRoute.queryParams.subscribe(params => {
            if (params) {
                const _params = { ...params };
                if (_params.startTime) {
                    _params.startTime = parseInt(_params.startTime);
                }
                if (_params.endTime) {
                    _params.endTime = parseInt(_params.endTime);
                }
                if (_params.finishedStart) {
                    _params.finishedStart = parseInt(_params.finishedStart);
                }
                if (_params.finishedEnd) {
                    _params.finishedEnd = parseInt(_params.finishedEnd);
                }
                this.modelQuery = new OrderQueryModel({
                    fields: this.modelQuery.fields,
                    ..._params
                });
            }
        });
        this.pageChange$ = this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.search(this.modelQuery);
            }
        });
    }

    async updateOrderType(order: OrderModel) {
        const result = await this.orderService.update(
            order._id,
            new OrderModel({ serviceType: OrderType.DELIVERY })
        );
        if (result) {
            this.search();
        }
    }

    updateShownPackages() {
        this.packageSos = [];
        this.shownPackages = this.packages.filter(
            x => this.state.indexOf(x.valid) !== -1
        );
        this.packages.forEach(item => {
            this.packageSos.push(item);
        });
        this.shownPackagesSo = [];
        if (this.packageSos.length > 0) {
            const groupSo = _.groupBy(this.packageSos, item => item.soCode);
            this.shownPackagesSo = _.keys(groupSo).map(so => {
                return {
                    soCode: so,
                    valid: _.sumBy(groupSo[so], item =>
                        item.valid ? item.totalPackage : 0
                    ),
                    inValid: _.sumBy(groupSo[so], item =>
                        !item.valid ? item.totalPackage : 0
                    ),
                    totalPackage: _.sumBy(
                        groupSo[so],
                        item => item.totalPackage
                    )
                };
            });
        }
    }

    async search(event = this.modelQuery) {
        this.modelQuery = event;
        await this.orderGrid.loadData(this.modelQuery);
    }

    async export() {
        let query = this.modelQuery;
        if (this.showFilter) {
            query = this.orderFilter.getQuery();
            query.fields = this.exportFields;
        }
        if (!this.checkDaysReport(query)) {
            return;
        }
        this.exporting = true;
        await this.reportService.exportOrders(query);
        this.exporting = false;
    }

    async exportForUser() {
        let query = this.modelQuery;
        if (this.showFilter) {
            query = this.orderFilter.getQuery();
        }
        if (!this.checkDaysReport(query)) {
            return;
        }
        this.exporting = true;
        await this.reportService.exportOrdersForUser(query);
        this.exporting = false;
    }
    async exportForSo() {
        let query = this.modelQuery;
        if (this.showFilter) {
            query = this.orderFilter.getQuery();
        }
        if (!this.checkDaysReport(query)) {
            return;
        }
        this.exporting = true;
        await this.reportService.exportForSo(query);
        this.exporting = false;
    }

    async exportDistance() {
        let query = this.modelQuery;
        if (this.showFilter) {
            query = this.orderFilter.getQuery();
        }
        if (!this.checkDaysReport(query)) {
            return;
        }
        this.exporting = true;
        await this.reportService.exportDistanceByOrder(query);
        this.exporting = false;
    }

    checkDaysReport(query) {
        let diff = 0;
        if (!query.groupId) {
            if (query.endTime && query.startTime) {
                const end = moment(query.endTime);
                const start = moment(query.startTime);

                diff = moment.duration(end.diff(start)).asDays();
                if (_.round(diff) > 7) {
                    this.messageService.error(
                        'Vui lòng giới hạn xuất báo cáo ngày tạo không quá 7 ngày'
                    );
                    return false;
                }
            }
        }

        if (query.finishedEnd && query.finishedStart) {
            const end = moment(query.finishedEnd);
            const start = moment(query.finishedStart);

            diff = moment.duration(end.diff(start)).asDays();
            if (_.round(diff) > 7) {
                this.messageService.error(
                    'Vui lòng giới hạn xuất báo cáo ngày hoàn thành không quá 7 ngày'
                );
                return false;
            }
        }
        if (query.assignedEnd && query.assignedStart) {
            const end = moment(query.assignedEnd);
            const start = moment(query.assignedStart);

            diff = moment.duration(end.diff(start)).asDays();
            if (_.round(diff) > 7) {
                this.messageService.error(
                    'Vui lòng giới hạn xuất báo cáo ngày gán đơn không quá 7 ngày'
                );
                return false;
            }
        }
        if (!query.userId) {
            this.messageService.error(
                'Vui lòng chọn khách hàng để xuất dữ liệu'
            );
            return false;
        }

        if (!query.userId) {
            this.messageService.error(
                'Vui lòng chọn khách hàng để xuất dữ liệu'
            );
            return false;
        }
        if (_.isArray(query.servicerId)) {
            if (query.servicerId && query.servicerId.length > 20) {
                this.messageService.error(
                    'Vui lòng không chọn nhiều hơn 20 đối tác'
                );
                return false;
            }
        } else if (
            query.servicerId &&
            query.servicerId.split(',').length > 20
        ) {
            this.messageService.error(
                'Vui lòng không chọn nhiều hơn 20 đối tác'
            );
            return false;
        }
        return true;
    }

    clearFileUpload() {
        if (
            this.fileUpload &&
            this.fileUpload.nativeElement &&
            this.fileUpload.nativeElement.value
        )
            this.fileUpload.nativeElement.value = '';
    }

    clearScanPackInput() {
        if (
            this.singleScanPack &&
            this.singleScanPack.nativeElement &&
            this.singleScanPack.nativeElement.value
        )
            this.singleScanPack.nativeElement.value = '';
    }

    resetInputForm(reloadData = false) {
        this.packages = [];
        this.hubId = '';
        this.clearFileUpload();
        this.clearScanPackInput();
        this.selectedServicer = null;
        this.modalQuickAssign.destroy();
        if (reloadData) {
            this.search();
        }
    }

    showModalAssign(scanBySO = false) {
        this.scanBySO = scanBySO;
        this.visibleModal = true;
    }

    showModalQuickCancelOrder() {
        this.visibleCancelOrder = true;
    }

    showModal3PLOrder(scanBySO = false) {
        this.scan3PLBySO = scanBySO;
        this.visible3PLOrder = true;
    }

    hideModalAssign() {
        this.visibleModal = false;
        this.resetInputForm();
    }

    hideModalQuickCancelOrder() {
        this.visibleCancelOrder = false;
    }

    hideModalQuick3PLOrder() {
        this.visible3PLOrder = false;
    }

    beforeUpload = (file: File) => {
        if (!FileReader) {
            this.messageService.error(
                this.translateService.instant('common.file-reader-not-support')
            );
            return;
        }
        if (!this.fileSizeValidation(file)) {
            this.clearFileUpload();
            return;
        }
        this.getFileContent(file);
    }

    getFileContent(file: File) {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = this.loadHandler(file);
        reader.onerror = this.errorHandler;
    }

    fileSizeValidation(file: File) {
        let isValid = true;
        const fsize = Math.round(file.size / 1024);
        if (fsize >= 5120) {
            this.messageService.error(
                this.translateService.instant('uploader.upload-size', {
                    size: '5mb'
                })
            );
            isValid = false;
        }
        return isValid;
    }

    removeDuplicate(array: string[]) {
        return _.uniq(array);
    }

    parseExcelToJson(data) {
        const workbook = XLSX.read(data, {
            type: 'binary'
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const result: string[] = [];
        const cell = { row: 7, col: this.scanBySO ? 'C' : 'B' };
        if (worksheet) {
            _.forIn(worksheet, (value: any, key: string) => {
                if (
                    key[0] === cell.col &&
                    parseInt(key.substring(1)) >= cell.row
                ) {
                    result.push(_.trim(value.v.toString()));
                }
            });
        }
        return result;
    }

    loadHandler(file: File) {
        const _this = this;
        return async function($event) {
            const data = $event.target.result;
            let _packages: string[] = [];
            _packages = _this.parseExcelToJson(data);
            _packages = _this.removeDuplicate(_packages);
            if (_packages.length) {
                _this.loading = true;
                _this.uploading = true;
                if (_this.scanBySO) {
                    _this.packages = await _this.getListPackageBySO(_packages);
                } else {
                    _this.packages = await _this.getListPackage(_packages);
                }
                _this.updateShownPackages();
                _this.loading = false;
                _this.uploading = false;
            } else {
                this.messageService.error(
                    this.translateService.instant('common.no-file-content', {
                        fileName: file.name
                    })
                );
            }
            _this.clearFileUpload();
        };
    }

    errorHandler($event) {
        if ($event.target.error.name === 'NotReadableError') {
            this.messageService.error(
                this.translateService.instant('common.unable-read-file')
            );
        }
    }

    checkPackages() {
        return this.packages.length && _.some(this.packages, p => p.valid);
    }

    isExistedInPackages(value: string) {
        return this.scanBySO
            ? _.some(this.packages, p => p.soCode === value)
            : _.some(this.packages, p => p.packageNo === value);
    }

    async handleScan($event) {
        if ($event.key === 'Enter' && $event.target.value) {
            const scanValue = $event.target.value;
            if (
                this.scanBySO &&
                (scanValue.length < 13 || scanValue.substring(0, 2) !== 'SO')
            ) {
                this.messageService.error('Mã SO không hợp lệ');
                return false;
            }
            const audioYes = new Audio('/assets/mp3/Co.mp3');
            const audioNo = new Audio('/assets/mp3/KhongCo.mp3');

            if (scanValue) {
                if (!this.isExistedInPackages(scanValue)) {
                    this.loading = true;
                    const packages = this.scanBySO
                        ? await this.getListPackageBySO([scanValue], true)
                        : await this.getListPackage([scanValue]);
                    this.packages = packages.concat(this.packages);
                    if (packages.some(p => !p.valid)) {
                        audioNo.play();
                    } else {
                        audioYes.play();
                    }
                    this.updateShownPackages();
                    this.loading = false;
                } else {
                    this.messageService.error(
                        this.translateService.instant('common.existed-packages')
                    );
                }
                this.singleScanPack.nativeElement.value = '';
                setTimeout(() => {
                    this.singleScanPack.nativeElement.focus();
                }, 200);
            } else {
                this.messageService.error(
                    this.translateService.instant('common.input-package-code')
                );
            }
        }
    }

    async removePackage(item: PackageModel) {
        this.packages = this.packages.filter(
            x => x.packageNo !== item.packageNo
        );
        this.updateShownPackages();
    }
    async removePackageSo(soCode: string) {
        this.packages = this.packages.filter(x => x.soCode !== soCode);
        this.updateShownPackages();
    }

    async getListPackage(packageNos: string[]) {
        const orders = (
            await this.orderService.getOrders(
                new QueryModel({
                    externalCodes: packageNos.map(x => `_${x}`),
                    limit: 100000,
                    status: `${OrderStatus.FindingServicer},${OrderStatus.Accepted},${OrderStatus.PendingReturned}`,
                    fields: 'detail'
                })
            )
        ).data;

        return packageNos.map((packageNo: string) => {
            const packageOrders = orders.filter(order =>
                order.detail.points.some(point =>
                    _.includes(_.split(point.externalCode, '_'), packageNo)
                )
            );
            return new PackageModel({
                packageNo,
                orders: packageOrders,
                valid: packageOrders.length > 0,
                soCode: this.getSOCode(packageNo, packageOrders)
            });
        });
    }

    async getListPackageBySO(so: string[], scanCode = false) {
        const soFail = [];
        let index = 1;
        for (const row of so) {
            if (row.length < 13 || row.substring(0, 2) !== 'SO') {
                soFail.push({
                    index,
                    SO: row
                });
            }
            index++;
        }

        if (soFail.length > 0 && !scanCode) {
            this.loading = false;
            const mes = soFail.map(row => {
                return `Lỗi SO (${row.SO}) dòng ${row.index + 6}`;
            });
            this.messageService.error(mes.join('<br />'), {
                nzDuration: 15000
            });
            return [];
        }
        const qrs = {
            externalCodes: so,
            limit: 100000,
            fields: 'detail,status,packages',
            status: `${OrderStatus.New},${OrderStatus.FindingServicer},${OrderStatus.Accepted},${OrderStatus.ProcessedTimeout},${OrderStatus.PendingReturned}`
        };
        if (!scanCode) {
            qrs['limitDays'] = 15;
        }
        const orders = (await this.orderService.getOrders(new QueryModel(qrs)))
            .data;
        const listOrder = orders.map(order => {
            const point = order.detail.points.find(
                p => p.type === PointType.Delivery
            );
            return new PackageModel({
                packageNo: point.externalCode.split('_')[1],
                orders: [order],
                totalPackage: order.packages ? order.packages.totalPackage : 1,
                valid: [
                    OrderStatus.FindingServicer,
                    OrderStatus.Accepted,
                    OrderStatus.PendingReturned
                ].includes(order.status),
                soCode: point.externalCode.split('_')[0]
            });
        });
        const listSO = listOrder.map(item => item.soCode);
        for (const item of so) {
            if (!_.includes(listSO, item)) {
                listOrder.push(
                    new PackageModel({
                        packageNo: null,
                        orders: [],
                        valid: false,
                        soCode: item,
                        totalPackage: 1
                    })
                );
            }
        }
        return listOrder;
    }

    getSOCode(packageNo: string, orders: OrderModel[]) {
        const point = orders.length
            ? orders[0].detail.points.find(p =>
                  _.includes(_.split(p.externalCode, '_'), packageNo)
              )
            : null;
        return point ? point.externalCode.split('_')[0] : null;
    }

    totalPackages(rows) {
        return _.sumBy(rows, (item: any) => item.totalPackage);
    }

    totalInvalidPackage(rows) {
        return _.sumBy(rows, (item: any) => item.inValid);
    }

    async assignHandle() {
        if (!this.checkPackages()) {
            this.messageService.error(
                this.translateService.instant('order.package-list-invalid')
            );
            return;
        }
        if (this.selectedServicer === null) {
            this.messageService.error(
                this.translateService.instant('order.validate-assign-partner')
            );
            return;
        }
        this.loading = this.assigning = true;

        await this.processingAssignPartner(
            this.packages,
            this.selectedServicer
        );
        this.loading = this.assigning = false;
        setTimeout(async () => {
            await this.orderGrid.loadData(this.modelQuery);
        }, 1000);
    }

    async processingAssignPartner(
        packages: PackageModel[],
        servicerId: string
    ) {
        const orderIds = [];
        packages.forEach(p => {
            orderIds.push(...p.orders.map(order => order._id));
        });
        const hub = _.find(this.hubs, h => h._id === this.hubId);
        const response = await this.orderService.assignOrdersToPartner(
            orderIds,
            servicerId,
            hub ? hub.location : null
        );
        if (!response.success) this.messageService.error(response.message);
        else {
            this.resetInputForm();
            this.messageService.success(
                `${this.translateService.instant(
                    'common.assign-orders'
                )} ${this.translateService.instant('common.successfully')}`
            );
        }
    }

    async processOrder(order: OrderModel) {
        await this.warehouseService.processOrder(order._id, {
            action: 'process'
        });
        await this.orderGrid.loadData(this.modelQuery);
    }

    handleVisible(flag = true) {
        this.visibleNoteForm = !!flag;
        if (!flag) {
            this.orderOperatorNote.reset();
        }
    }

    handleLoading(flag = true) {
        this.loadingNoteForm = !!flag;
    }

    submit($event) {
        if ($event.success) {
            this.handleVisible(false);
            this.messageService.success(
                this.translateService.instant(
                    'warehouse.warehouse-order.successful-edit-operator'
                )
            );
            if (this.order) {
                this.order.adminNote = $event.data;
            }
        } else {
            this.messageService.error('');
        }
        this.handleLoading(false);
    }

    dataNoteOrder($event) {
        this.order = $event;
    }

    displayNoteAdmin() {
        this.handleVisible(true);
    }

    goToOrderDetail(order: OrderModel) {
        this.router.navigateByUrl(`pages/order/${order._id}`);
    }

    async operateTimeout(order: OrderModel) {
        const response = await this.orderService.processOrder(order._id, {
            action: OrderStatus.ProcessingTimeout
        });
        if (response.success) {
            this.messageService.success(
                this.translateService.instant('common.successfully')
            );
            await this.orderGrid.loadData();
        } else {
            this.messageService.error(
                this.translateService.instant('common.failed')
            );
        }
    }

    async operatePocessingTimeout(order: OrderModel) {
        const response = await this.orderService.processOrder(order._id, {
            action: OrderStatus.ProcessedTimeout
        });
        if (response.success) {
            this.messageService.success(
                this.translateService.instant('common.successfully')
            );
            await this.orderGrid.loadData();
        } else {
            this.messageService.error(
                this.translateService.instant('common.failed')
            );
        }
    }

    checkDisplayTimeout(order: OrderModel = null) {
        return (
            order &&
            this.currentUser &&
            this.currentUser._id === order.processedBy &&
            order.status === OrderStatus.Timeout
        );
    }

    checkDisplayProcesingTimeout(order: OrderModel = null) {
        return (
            order &&
            this.currentUser &&
            this.currentUser._id === order.processedBy &&
            order.status === OrderStatus.ProcessingTimeout
        );
    }
    choosePackageFilter(value) {
        this.state = value;
        this.updateShownPackages();
    }

    closePopup() {
        this.shownPackages = [];
        this.shownPackagesSo = [];
    }

    ngOnDestroy() {
        this.pageChange$.unsubscribe();
    }

    checkDisplayUpdateTotalPackage(order: OrderModel) {
        return (
            order.detail &&
            order.detail.points[1] &&
            order.detail.points[1].scanStore &&
            this.currentUser.roles.includes(
                AdminPermission.UPDATE_TOTAL_PACKAGE
            )
        );
    }

    showUpdateTotalPackage(order: OrderModel) {
        this.currentOrder = _.cloneDeep(order);
        if (this.currentOrder.packages) {
            this.clonePackages = _.cloneDeep(this.currentOrder.packages);
        }
        this.visibleUpdateTotalPackage = true;
    }

    viewPackage(order: OrderModel) {
        this.currentOrder = _.cloneDeep(order);
        if (this.currentOrder.packages) {
            this.clonePackages = _.cloneDeep(this.currentOrder.packages);
        }
        this.visibleUpdateTotalPackage = true;
        this.isView = true;
    }

    hideModalTotalPackage() {
        this.currentOrder = new OrderModel({});
        this.clonePackages = {
            totalPackage: 0,
            packageList: []
        };
        this.visibleUpdateTotalPackage = false;
        this.packageSearch = '';
        this.packageTxt = '';
        this.isView = false;
    }

    async updateTotalPackage() {
        this.loading = true;
        const response = await this.orderService.updateTotalPackage(
            this.currentOrder._id,
            this.currentOrder?.packages?.packageList
        );
        if (response.success) {
            this.messageService.success(
                this.translateService.instant('common.successfully')
            );
            this.hideModalTotalPackage();
            setTimeout(async () => {
                await this.orderGrid.loadData(this.modelQuery);
            }, 1000);
        } else {
            this.messageService.error(
                this.translateService.instant('common.failed')
            );
        }
        this.loading = false;
    }

    closePopupUpdateTotalPackage() {
        this.hideModalTotalPackage();
    }

    addPackage() {
        let packageList = this.currentOrder.packages.packageList;

        if (_.includes(packageList, this.packageTxt)) {
            this.messageService.error(
                this.translateService.instant('common.packageIsExited')
            );
            return;
        }
        if (this.packageTxt) {
            packageList = [...packageList, this.packageTxt];
            this.currentOrder.packages.packageList = packageList;
            this.clonePackages.packageList = packageList;
        }
        this.packageTxt = '';
    }

    removePackageList(pkg) {
        const packageList = this.currentOrder.packages.packageList;
        this.currentOrder.packages.packageList = _.filter(packageList, item => {
            return pkg !== item;
        });
        this.clonePackages.packageList = this.currentOrder.packages.packageList;
    }

    filterPackage() {
        const packageList = this.currentOrder.packages.packageList;
        if (!this.packageSearch) {
            this.clonePackages.packageList = packageList;
            return;
        }
        this.clonePackages.packageList = _.filter(packageList, item => {
            return item.indexOf(this.packageSearch) !== -1;
        });
    }
}
