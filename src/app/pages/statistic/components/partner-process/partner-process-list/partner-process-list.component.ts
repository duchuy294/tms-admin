import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import * as moment from 'moment';

import { Component, Input, OnInit } from '@angular/core';

import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { PartnerProcesService } from '@/pages/statistic/services/partner-process.service';
import { PartnerProcessModel } from '@/pages/statistic/models/partner-process.model';
import { PartnerProcessQueryModel } from '@/pages/statistic/models/parner-process-query.model';
import { QueryModel } from '@/models/query.model';
import { ServicerService } from '@/modules/servicer/services/servicer.service';

@Component({
    selector: 'partner-process-list',
    templateUrl: './partner-process-list.component.html',
    styleUrls: ['./partner-process-list.component.less']
})
export class PartnerProcessListComponent implements OnInit {
    @Input() model: PartnerProcessQueryModel = new PartnerProcessQueryModel();
    tableData = new PagingModel<PartnerProcessModel>();
    loading = false;
    servicers = {};
    groups = {};
    constructor(private partnerProcesService: PartnerProcesService, private servicerService: ServicerService) { }

    async ngOnInit() {
        await this.loadData();
    }

    async loadDataByPage(event) {
        this.model.page = event;
        await this.loadData();
    }

    async loadDataByPageSize(event) {
        this.model.limit = event;
        await this.loadData();
    }

    async loadData(modelQuery: PartnerProcessQueryModel = null) {
        this.loading = true;
        const servicerIds = [];
        if (modelQuery) {
            this.model = modelQuery;
        }
        this.tableData = await this.partnerProcesService.workings(this.model);
        _.forEach(this.tableData.data, (item) => {
            servicerIds.push(item.servicerId);
        });
        if (_.uniq(servicerIds).length > 0) {
            this.servicers = _.groupBy((await this.servicerService.getServicers(new QueryModel({ limit: 1000, servicerIds: _.uniq(servicerIds).join(',') }))).data, x => x._id);
        }
        const result = await this.servicerService.getGroupServicers(new QueryModel({ limit: 1000 }));
        this.groups = _.groupBy(result.data, item => item._id);
        this.loading = false;
    }

    fortmat(num) {
        if (Number.isInteger(num)) {
            return num + ' %';
        }
        return parseFloat(num).toFixed(1) + ' %';
    }

    async export(modelQuery: PartnerProcessQueryModel = null) {
        const exportQuey = new PartnerProcessQueryModel(modelQuery);
        exportQuey.limit = 1000;
        const exportProcess = await this.partnerProcesService.workings(exportQuey);
        const servicerIds = [];

        _.forEach(exportProcess, (item) => {
            servicerIds.push(item.servicerId);
        });
        if (_.uniq(servicerIds).length > 0) {
            this.servicers = _.groupBy((await this.servicerService.getServicers(new QueryModel({ limit: 1000, servicerIds: _.uniq(servicerIds).join(',') }))).data, x => x._id);
        }
        const data = [];
        const total = _.sumBy(exportProcess.data, item => item.total);
        const completed = _.sumBy(exportProcess.data, item => item.completed);
        let percent = '';
        let tpm = completed/total;
        if(_.isInteger(tpm)) {
            percent = `${tpm}%`;
        } else {
            percent = `${tpm.toFixed(1)}%`;

        }
        var ws = XLSX.utils.json_to_sheet([
        { A: '', B: `Thời gian xuất : ${moment().format('HH:mm DD/MM/YYYY')}`, C: '', D: '', E: '', F: ''},
        { A: '', B: '', C: 'Total', D: total, E: completed, F: percent},
        ], {header: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], skipHeader: true});
        
        _.each(exportProcess.data, (row, index) => {
            data.push({
                'STT': index + 1,
                'Đối tác': this.servicers[row.servicerId] ? this.servicers[row.servicerId][0].fullName : '',
                'Nhóm': this.groups[row.groupId] ? this.groups[row.groupId][0].name : '',
                'Tổng số đơn': row.total,
                'Đơn thành công': row.completed,
                'Tỉ lệ hoàn thành': row.completed,
            });
        });
        XLSX.utils.sheet_add_json(ws, data, {skipHeader: false, origin: -1});
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Đối tác`);
        XLSX.writeFile(wb, `Hoạt động đối tác-${moment().format('HHmmssDDMMYYYY')}.xlsx`);
    }

}
