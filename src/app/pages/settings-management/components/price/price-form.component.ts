import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PagingModel } from '@/utility/components/paging/paging.model';
import { PriceFormModel } from 'app/modules/price/models/price-form.model';
import { PriceFormService } from 'app/modules/price/services/price-form.service';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'price-form',
    templateUrl: './price-form.component.html'
})
export class PriceFormComponent implements OnInit {
    @Output() modelChange = new EventEmitter();
    @Output() detail = new EventEmitter<string>();
    createModifyModalVisible = false;
    modifyingModel = new PriceFormModel();
    modelQuery = new QueryModel();
    loading: boolean = false;
    public tableData = new PagingModel<PriceFormModel>();
    visibleModal: boolean = false;
    refId = null;
    checked: boolean = true;
    flagCopy = false;

    @Input()
    set model(value: QueryModel) {
        this.modelQuery = value;
    }

    get model() {
        return this.modelQuery;
    }
    constructor(
        private priceFormService: PriceFormService,
        private messageService: NzMessageService,
        private translateService: TranslateService
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        await this.loadData();
    }

    loadDataByPage($event = 1) {
        this.modelQuery.page = $event;
        this.loadData();
    }

    loadDataByPageSize($event = 20) {
        this.modelQuery.limit = $event;
        this.loadData();
    }

    async loadData(query: QueryModel = null) {
        if (query) {
            this.modelQuery = query;
        }
        this.loading = true;
        this.tableData = await this.priceFormService.filter(
            this.modelQuery
        );
        this.loading = false;
    }

    onUpdate() {
        this.loadData();
    }

    async onCopy(priceFormId = null) {
        if (!priceFormId) {
            const defaultPriceForm = this.tableData.data.find(x => x.default);
            priceFormId = defaultPriceForm._id;
        }
        const name = prompt(this.translateService.instant('prompt-enter-name', `PriceForm_${Date.now()}`));
        if (name) {
            const response = await this.priceFormService.create(priceFormId, new PriceFormModel({ name }));
            if (response.errorCode !== 0) {
                this.messageService.error(response.message);
            } else {
                await this.loadData();
            }
        }
    }

    create(priceFormId = null) {
        if (!priceFormId) {
            const defaultPriceForm = this.tableData.data.find(x => x.default);
            this.refId = defaultPriceForm._id;
        } else {
            this.flagCopy = true;
            this.refId = priceFormId;
        }
        this.modifyingModel = null;
        this.handleModelVisible(true);
    }

    async onSetDefault(priceFormId = null) {
        const response = await this.priceFormService.setDefault(priceFormId);
        if (response.errorCode !== 0) {
            this.messageService.error(response.message);
        } else {
            await this.loadData();
        }
    }

    handleModelVisible(flag = true) {
        this.createModifyModalVisible = !!flag;
    }

    handleAfterSubmit(loading = false) {
        if (!loading) {
            this.loadData();
        } else {
            const queryModel = new QueryModel();
            this.loadData(queryModel);
        }
    }
}