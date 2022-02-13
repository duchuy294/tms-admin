import * as _ from 'lodash';
import { AccountType } from 'app/constants/AccountType';
import { Component, OnInit } from '@angular/core';
import { FAQModalComponent } from './faq-modal.component';
import { FAQModel } from 'app/modules/marketing/models/FAQ.model';
import { FAQService } from 'app/modules/marketing/services/faq.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'faq',
    templateUrl: './faq.component.html'
})
export class FAQComponent implements OnInit {
    public userTads: FAQModel[] = [];
    public servicerTads: FAQModel[] = [];
    selectedTabIndex = 0;

    constructor(
        private _modalService: NgbModal,
        private _faqService: FAQService
    ) { }

    async ngOnInit() {
        await this._reloadTads();
    }

    async _reloadTads() {
        const faqs = await this._faqService.list();
        this.userTads = _.filter(faqs, x => x.userType === AccountType.USER);
        this.servicerTads = _.filter(faqs, x => x.userType === AccountType.SERVICER);
    }

    async update(faq: FAQModel) {
        const modal = this._modalService.open(FAQModalComponent, { size: 'lg' })
            .componentInstance as FAQModalComponent;
        modal.model = _.cloneDeep(faq);
        modal.callback = this._reloadTads.bind(this);
    }

    async create() {
        const modal = this._modalService.open(FAQModalComponent, { size: 'lg' })
            .componentInstance as FAQModalComponent;
        modal.callback = this._reloadTads.bind(this);
    }
}
