import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { OrderService } from '@/modules/order/services/order.service';
import { COD } from '@/modules/order/models/cod-comparison.model';

@Component({
    selector: 'check-cod',
    templateUrl: './check-cod.component.html'
})
export class CheckCodComponent {
    closeAble = false;
    @Input() visible: boolean = false;
    @Output() close = new EventEmitter();
    @ViewChild('fileUpload') fileUpload: ElementRef;
    tableData: COD[] = [];
    loading: boolean = false;
    constructor(
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private orderService: OrderService,
    ) {

    }

    hideModal() {
        this.visible = false;
        this.close.emit(false);
    }

    closePopup() {
        // this.visible = false;
        // this.close.emit(false);
    }

    parseExcelToJson(data) {
        const workbook = XLSX.read(data, {
            type: 'binary'
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const result: { externalCode?: string, cod?: number }[] = [];
        const cell = { row: 1, externalCode: 'A', cod: 'C' };
        if (worksheet) {
            _.forIn(worksheet, (value: any, key: string) => {
                const rowIndex = parseInt(key.substring(1));
                if (rowIndex > 1) {
                    if (key[0] === cell.externalCode) {
                        result[rowIndex - 2] = {
                            externalCode: value.v.toString()
                        };
                    }

                    if (key[0] === cell.cod) {
                        result[rowIndex - 2].cod = value.v;
                    }
                }
            });
        }
        return result;
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
            const cods = _this.parseExcelToJson(data);
            const response = await _this.orderService.compare(cods);
            _this.tableData = response.data;
            _this.clearFileUpload();
            _this.loading = false;
        };
    }

    fileSizeValidation(file: File) {
        let isValid = true;
        const fsize = Math.round((file.size / 1024));
        if (fsize >= 5120) {
            this.messageService.error(
                this.translateService.instant('uploader.upload-size', { size: '5mb' })
            );
            isValid = false;
        }
        return isValid;
    }
}
