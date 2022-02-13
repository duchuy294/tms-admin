import * as _ from 'lodash';

import { Component, OnInit, ViewChild } from '@angular/core';

import { PartnerProcessListComponent } from '../partner-process-list/partner-process-list.component';
import { ServicerService } from '@/modules/servicer/services/servicer.service';

@Component({
    selector: 'partner-process',
    templateUrl: './partner-process.component.html',
    styleUrls: ['./partner-process.component.less']
})
export class PartnerProcessComponent implements OnInit {

    @ViewChild(PartnerProcessListComponent) partnerProcessList: PartnerProcessListComponent;

    constructor(public servierService: ServicerService,) { }

    ngOnInit(): void {
    }

    async onSearch(event) {
        await this.partnerProcessList.loadData(event);
    }

    async onExport(event) {
        await this.partnerProcessList.export(event);
    }

}
