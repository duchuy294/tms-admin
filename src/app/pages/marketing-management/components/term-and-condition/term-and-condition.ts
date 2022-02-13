import * as _ from 'lodash';
import { AccountType } from 'app/constants/AccountType';
import { Component, OnInit } from '@angular/core';
import { TADModel } from 'app/modules/marketing/models/TAD.model';
import { TADService } from 'app/modules/marketing/services/tad.service';

@Component({
    selector: 'term-and-condition',
    templateUrl: './term-and-condition.html'
})
export class TermAndConditionComponent implements OnInit {
    public userTads: TADModel[] = [];
    public servicerTads: TADModel[] = [];
    selectedTabIndex = 0;
    createModifyModalVisible = false;
    modifyingModel = new TADModel();

    constructor(
        private _tadService: TADService
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        await this._reloadTads();
    }

    async _reloadTads() {
        const tads = await this._tadService.list();
        this.userTads = _.filter(tads, x => x.userType === AccountType.USER);
        this.servicerTads = _.filter(tads, x => x.userType === AccountType.SERVICER);
    }

    async update(tad: TADModel) {
        this.modifyingModel = tad;
        this.handleModelVisible(true);
    }

    async create() {
        this.modifyingModel = null;
        this.handleModelVisible(true);
    }

    handleModelVisible(flag = true) {
        this.createModifyModalVisible = !!flag;
    }
}