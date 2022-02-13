import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { CodBank, RequestCodListModel } from '@/modules/finance/models/request-cod-list.model';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';
import { RequestCod } from '@/constants/RequestCod';
import { RequestCodService } from '@/modules/finance/services/request-cod.service';
import { ServicerService } from '@/modules/servicer/services/servicer.service';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';

@Component({
    selector: 'request-cod-quick-confirm',
    templateUrl: 'request-cod-quick-confirm.component.html',
    styleUrls: ['request-cod-quick-confirm.component.less']
})
export class RequestCodQuickConfirmComponent implements OnInit  {

    constructor(
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private requestCodService: RequestCodService,
        private serviceService: ServicerService,


    ) { }

    @Input() model: RequestCodListModel;
    @Input() visibleModal: boolean;
    @Input() visibleAction: boolean;
    @ViewChild('fileUpload') fileUpload: ElementRef;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() loadData = new EventEmitter<boolean>();
    requestCod = RequestCod;
    loading = false;
    showData: RequestCodListModel[] = [];
    banks: CodBank[];
    bank: string = null;
    allRequest: RequestCodListModel[] = [];
    checkValid = true;
    checkInalid = true;
    state = [true, false];
    servicerGroups = {};

    async ngOnInit() {
        this.banks = await this.requestCodService.getBank();
        if (this.bank === null && this.banks) {
            this.bank = this.banks[0].code;
        }
    }

    handleVisibleModal(flag = false) {
        if (!flag) {
            this.showData = [];
            this.allRequest = [];
            this.loading = false;
            this.loadData.emit(true);
        }
        this.handleVisible.emit(!!flag);
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
            const transactions = _this.parseExcelToJson(data);
            if (_.isEmpty(transactions)) {
                _this.messageService.error(
                    _this.translateService.instant('collectionTab.formError.fileImport.invalid')
                );
                _this.loading = false;
                return;
            }
            const response = await _this.requestCodService.compare({
                bank: _this.bank,
                transactions,
            });
            _this.showData  = response.data;
           _this.allRequest  = response.data;
            const servicerIds = [];
            _.forEach(_this.showData, (item) => {
                servicerIds.push(item.servicerId);
            });
            if (_.uniq(servicerIds).length > 0) {
                _this.servicerGroups = _.groupBy((await _this.serviceService.getServicers(new QueryModel({ limit: 1000, servicerIds: _.uniq(servicerIds).join(',') }))).data, x => x._id);
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
        const result: { transCode?: string, confirmedPaid?: number, note?: string }[] = [];
        const cell = { row: 10, note: 'C', confirmedPaid: 'E', transCode: 'H' };
        if (worksheet) {
            _.forIn(worksheet, (value: any, key: string) => {
                const rowIndex = parseInt(key.substring(1));
                if (rowIndex >= cell.row) {
                    const row = rowIndex - cell.row;
                    if (key[0] === cell.note) {
                        result[row] = { ...result[row], note: value.v.toString() };
                    }
                    if (key[0] === cell.confirmedPaid) {
                        result[row] = { ...result[row], confirmedPaid:  this.formatMoney(value.v)};
                    }
                    if (key[0] === cell.transCode) {
                        result[row] = { ...result[row], transCode: value.v.toString() };
                    }
                }
            });
        }
        return result;
    }

    formatMoney(value) {
        if (_.isNumber(value)) {
            return value;
        }
        return parseInt(value.replaceAll(/,/g, ''));
    }

    choosePackageFilter(value) {
        this.state = value;
        this.updateShown();
    }

    updateShown() {
        this.showData = this.allRequest.filter(x => this.state.indexOf(!!x.transCode) !== -1);
    }

    get totalValid() {
        return this.allRequest.filter(x => x.transCode).length || 0;
    }

    downloadExcel() {
        const data = [];
        _.each(this.showData, (row, index) => {
            data.push({
                'STT': index + 1,
                'Mã phiên': row.code,
                'Mã đối tác': this.servicerGroups[row.servicerId] ? this.servicerGroups[row.servicerId][0].code : '' ,
                'Đối tác': this.servicerGroups[row.servicerId] ? this.servicerGroups[row.servicerId][0].fullName : '',
                'Số tiền thực nộp (VNĐ)': row.amount,
                'Mã giao dịch': row.transCode,
                'Trạng thái': row.transCode ? 'Hợp lệ' : 'Không hợp lệ'
            });
        });
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Presidents');
        XLSX.writeFile(wb, 'Export phiên khi import.xlsx');
    }

}