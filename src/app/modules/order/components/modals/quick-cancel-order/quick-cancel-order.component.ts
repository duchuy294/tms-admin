import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestCod } from '@/constants/RequestCod';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import { CanceOrderlModel } from '@/modules/order/models/cancel-order.model';
import { OrderService } from '@/modules/order/services/order.service';
import { QueryModel } from '@/models/query.model';

@Component({
    selector: 'quick-cancel-order',
    templateUrl: 'quick-cancel-order.component.html',
    styleUrls: ['quick-cancel-order.component.less']
})
export class QuickCancelOrderComponent implements OnInit  {

    constructor(
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private orderService: OrderService,


    ) { }

    @Input() visibleModal: boolean;
    @Input() visibleAction: boolean;
    @ViewChild('fileUpload') fileUpload: ElementRef;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() loadData = new EventEmitter<boolean>();
    requestCod = RequestCod;
    loading = false;
    showData: CanceOrderlModel[] = [];
    allData: CanceOrderlModel[] = [];
    checkValid = true;
    checkInalid = true;
    state = [true, false];
    cancelReason = '';

    async ngOnInit() {
    }

    handleVisibleModal(flag = false) {
        if (!flag) {
            this.showData = [];
            this.allData = [];
            this.loading = false;
            this.loadData.emit(true);
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
        const fsize = Math.round((file.size / 1024));

        const fileName = file.name.toLowerCase(),
            regex = new RegExp('(.*?)\.(xlsx|xls)$');

        if (!(regex.test(fileName))) {
            this.messageService.error(
                this.translateService.instant('uploader.file-format-invalid')
            );
            isValid = false;
        } else if (fsize >= 5120) {
            this.messageService.error(
                this.translateService.instant('uploader.upload-size', { size: '5mb' })
            );
            isValid = false;
        }
        return isValid;
    }

    clearFileUpload() {
        if (this.fileUpload &&
            this.fileUpload.nativeElement &&
            this.fileUpload.nativeElement.value)
            this.fileUpload.nativeElement.value = '';
    }

    async getFileContent(file: File) {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = await this.loadHandler();
    }

    async loadHandler() {
        const _this = this;
        _this.loading = true;
        return async function ($event) {
            const data = $event.target.result;
            const excelData = _this.parseExcelToJson(data);
            if (_.isEmpty(excelData)) {
                _this.messageService.error(
                    _this.translateService.instant('collectionTab.formError.fileImport.invalid')
                );
                _this.loading = false;
                return;
            }
            const response = await _this.orderService.getOrders(new QueryModel({ externalCodes: excelData, limit: 500 }));
            if (response.data) {
                _this.showData = response.data.map(item => {
                    return new CanceOrderlModel({ _id: item._id, externalCode: item.externalCode, orderCode: item.code, statusLabel: item.statusLabel, valid: [2,3].includes(item.status) });
                });
                _this.allData = _this.showData;
            }
            _this.clearFileUpload();
            _this.loading = false;
        };
    }

    parseExcelToJson(data) {
        const workbook = XLSX.read(data, {
            type: 'binary'
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const result = [];
        const cell = { row: 2, externalCodes: 'A' };
        if (worksheet) {
            _.forIn(worksheet, (value: any, key: string) => {
                const rowIndex = parseInt(key.substring(1));
                if (rowIndex >= cell.row) {
                    if (key[0] === cell.externalCodes) {
                        result.push(value.v.toString()) ;
                    }
                }
            });
        }
        return result;
    }

    choosePackageFilter(value) {
        this.state = value;
        this.updateShow();
    }

    updateShow() {
        this.showData = this.allData.filter(x => this.state.indexOf(!!x.valid) !== -1);
    }

    delete(id: string) {
        this.allData = this.allData.filter(x => x._id !== id);
        this.updateShow();
    }

    async submitOrderCancel() {
        if (this.totalInValid === 0) {
            if (this.cancelReason === '') {
                this.messageService.error(
                    this.translateService.instant('order.error-reason')
                );
                return;
            }
            const data = {
                cancelReason: this.cancelReason,
                orderIds: this.allData.map(x => x._id)
            };
            
            const res = await this.orderService.fastCancellation(data);
            if (res) {
                this.messageService.success(
                    this.translateService.instant('common.successfully')
                    );
                }
                this.cancelReason = '';
                setTimeout(() => {
                    this.handleVisibleModal(false);
                }, 500);
                
        }
    }

    get totalValid() {
        return this.allData.filter(x => x.valid).length || 0;
    }

    get totalInValid() {
        return this.allData.filter(x => !x.valid).length || 0;
    }

}