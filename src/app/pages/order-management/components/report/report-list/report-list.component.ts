import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '@/modules/report/services/report.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'report-list',
    templateUrl: 'report-list.component.html'
})
export class ReportListComponent implements OnInit {
    @ViewChild('fileUpload') fileUpload: ElementRef;

    constructor(
        private reportService: ReportService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) {}

    reportTable = [
        {
            name: 'common.report-so',
            description: 'common.report-so-description'
        }
    ];
    loading = false;
    visibleModal = false;
    valid = true;
    validRowsError = [];
    listSO = [];
    listSOError = [];
    currentTitle = 'common.report';
    message = '';
    filename = '';
    color = '#f00';
    ngOnInit() {}

    beforeUpload = (file: File) => {
        this.filename = file.name;
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
        reader.onload = this.loadHandler();
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

    clearFileUpload() {
        if (
            this.fileUpload &&
            this.fileUpload.nativeElement &&
            this.fileUpload.nativeElement.value
        )
            this.fileUpload.nativeElement.value = '';
    }

    parseExcelToJson(data) {
        const _validRowsError = [];
        const workbook = XLSX.read(data, {
            type: 'binary'
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const result: string[] = [];
        const cell = { row: 3, col: 'B' };
        if (worksheet) {
            _.forIn(worksheet, (value: any, key: string) => {
                const row = parseInt(key.substring(1));
                if (key[0] === cell.col && row >= cell.row) {
                    const SOString = _.trim(value.v.toString());
                    if (SOString.length < 13) {
                        _validRowsError.push(row);
                    } else {
                        result.push(SOString);
                    }
                }
            });
        }
        return { validRowsError: _validRowsError, SO: result };
    }

    loadHandler() {
        const _this = this;
        this.message = '';
        this.listSOError = [];
        return async function($event) {
            const data = $event.target.result;
            let _SO: string[] = [];
            const result = _this.parseExcelToJson(data);
            _SO = result.SO;
            _SO = _this.removeDuplicate(_SO);
            if (_SO.length && result.validRowsError.length === 0) {
                _this.loading = true;
                await _this.getListSO(_SO);
                _this.loading = false;
            } else {
                _this.valid = false;
                if (result.validRowsError.length > 0) {
                    _this.message = `Lỗi SO dòng ${result.validRowsError.join(
                        ', '
                    )} `;
                } else {
                    _this.messageService.error('Lỗi không có dữ liệu');
                }
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
    async getListSO(SOs) {
        const res = await this.reportService.checkListSO(SOs);
        this.message = res.message;
        if (res.errorCode === 1) {
            this.valid = false;
            this.listSOError = res.data || [];
            this.color = '#f00';
        } else {
            this.valid = true;
            this.listSO = SOs;
            this.color = '#28a745';
        }
    }

    async submit() {
        this.loading = true;
        await this.reportService.downloadSO(this.listSO);
        this.loading = false;
    }
    async downloadSOError() {
        this.loading = true;
        await this.reportService.downloadErrorSO(this.listSOError);
        this.loading = false;
    }

    close() {
        this.message = '';
        this.listSOError = [];
        this.filename = '';
        this.valid = false;
        this.visibleModal = false;
    }
}
