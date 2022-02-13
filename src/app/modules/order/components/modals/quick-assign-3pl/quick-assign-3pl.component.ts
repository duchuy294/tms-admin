import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import { OrderService } from '@/modules/order/services/order.service';
import { QueryModel } from '@/models/query.model';
import { UserType } from '@/constants/UserType';
import { PackageModel } from '@/modules/order/models/package.model';
import { OrderStatus } from '@/constants/OrderStatus';
import { OrderModel } from '@/modules/order/models/order.model';
import { PointType } from '@/modules/order/constants/PointType';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { UserStatus } from '@/constants/UserStatus';
import { AdminPermission } from '@/constants/AdminPermissions';

@Component({
    selector: 'quick-assign-3pl',
    templateUrl: 'quick-assign-3pl.component.html',
    styleUrls: ['quick-assign-3pl.component.less']
})
export class QuickAssign3plComponent {
    constructor(
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private orderService: OrderService
    ) {}

    @Input() visibleModal: boolean;
    @Input() scanBySO: boolean;
    @Input() visibleAction: boolean;
    @Input() currentUser: any;
    @ViewChild('fileUpload') fileUpload: ElementRef;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() loadData = new EventEmitter<boolean>();
    @ViewChild('singleScanPack') singleScanPack: ElementRef;
    @ViewChild('modalQuickAssign') modalQuickAssign: NzModalRef;

    loading = false;
    packages: PackageModel[] = [];
    shownPackages: PackageModel[] = [];
    shownPackagesSo: any[];
    packageSos: PackageModel[] = [];
    checkValid = true;
    checkInalid = true;
    state = [true, false];
    customerSearchCondition = {
        type: UserType.ENTERPRISE,
        status: `${UserStatus.NEW},${UserStatus.ACTIVE}`
    };
    firstOptionData = {
        value: 'Supra',
        text: 'Supra'
    };
    uploading = false;
    closeAble = false;
    selectedCustomer: string = null;
    assigning = false;
    AdminPermission = AdminPermission;

    get totalValidPackage() {
        return this.packages.filter(x => x.valid).length;
    }

    handleVisibleModal(flag = false) {
        if (!flag) {
            this.packages = [];
            this.shownPackagesSo = [];
            this.packageSos = [];
            this.loading = false;
            this.uploading = false;
            this.modalQuickAssign.destroy();
            setTimeout(() => {
                this.loadData.emit(true);
            }, 2000);
        }
        this.handleVisible.emit(true);
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

    fileSizeValidation(file: File) {
        let isValid = true;
        const fsize = Math.round(file.size / 1024);

        const fileName = file.name.toLowerCase(),
            regex = new RegExp('(.*?).(xlsx|xls)$');

        if (!regex.test(fileName)) {
            this.messageService.error(
                this.translateService.instant('uploader.file-format-invalid')
            );
            isValid = false;
        } else if (fsize >= 5120) {
            this.messageService.error(
                this.translateService.instant('uploader.upload-size', {
                    size: '5mb'
                })
            );
            isValid = false;
        }
        return isValid;
    }

    clearFileUpload() {
        if (
            this.fileUpload &&
            this.fileUpload.nativeElement &&
            this.fileUpload.nativeElement.value
        )
            this.fileUpload.nativeElement.value = '';
    }

    getFileContent(file: File) {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = this.loadHandler(file);
        reader.onerror = this.errorHandler;
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
            if (scanValue.length < 13 || scanValue.substring(0, 2) !== 'SO') {
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
                    status: `${OrderStatus.FindingServicer},${OrderStatus.PendingReturned}`,
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
        if (so.length > 60) {
            this.messageService.error('Không được tải file có nhiều hơn 60 SO');
            return [];
        }
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
        const orders = (
            await this.orderService.getOrders(
                new QueryModel({
                    externalCodes: so,
                    limit: 100000,
                    status: `${OrderStatus.FindingServicer},${OrderStatus.PendingReturned}`,
                    fields: 'detail,status,packages'
                })
            )
        ).data;
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
    parseExcelToJson(data) {
        const workbook = XLSX.read(data, {
            type: 'binary'
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const result = [];
        const cell = { row: 7, externalCodes: this.scanBySO ? 'C' : 'B' };
        if (worksheet) {
            _.forIn(worksheet, (value: any, key: string) => {
                const rowIndex = parseInt(key.substring(1));
                if (rowIndex >= cell.row) {
                    if (key[0] === cell.externalCodes) {
                        result.push(value.v.toString());
                    }
                }
            });
        }
        return result;
    }

    removeDuplicate(array: string[]) {
        return _.uniq(array);
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
    async assignHandle() {
        if (!this.checkPackages()) {
            this.messageService.error(
                this.translateService.instant('order.package-list-invalid')
            );
            return;
        }
        this.loading = this.assigning = true;
        if (this.selectedCustomer === 'Supra') {
            this.selectedCustomer = null;
        }
        await this.processingAssign3PL(this.packages, this.selectedCustomer);
        this.loading = this.assigning = false;
    }

    async processingAssign3PL(
        packages: PackageModel[],
        clientBranchId: string
    ) {
        const orderIds = [];
        packages.forEach(p => {
            orderIds.push(...p.orders.map(order => order._id));
        });
        const response = await this.orderService.assignOrdersTo3PL(
            orderIds,
            clientBranchId
        );
        if (!response.success) this.messageService.error(response.message);
        else {
            this.messageService.success(
                `${this.translateService.instant(
                    'common.assign-orders'
                )} ${this.translateService.instant('common.successfully')}`
            );
            this.handleVisibleModal(false);
        }
    }

    clearScanPackInput() {
        if (
            this.singleScanPack &&
            this.singleScanPack.nativeElement &&
            this.singleScanPack.nativeElement.value
        )
            this.singleScanPack.nativeElement.value = '';
    }

    closePopup() {
        this.shownPackages = [];
        this.shownPackagesSo = [];
    }

    choosePackageFilter(value) {
        this.state = value;
        this.updateShownPackages();
    }
}
