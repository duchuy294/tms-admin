import * as _ from 'lodash';
import * as moment from 'moment';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Condition } from '@/modules/marketing/models/condition';
import { ConditionSet } from '@/modules/marketing/models/promotion-policy-controller';
import { CONDITIONTYPE } from '@/constants/Condition';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Operator } from '@/constants/ConditionOperator';
import { OrderType } from '@/modules/order/constants/OrderType';
import { QueryModel } from '@/models/query.model';
import { TranslateService } from '@ngx-translate/core';
import { UserLevelService } from '@/modules/user/services/user-level.service';

@Component({
    selector: 'add-conditions-modal',
    templateUrl: './add-conditions-modal.component.html'
})
export class AddConditionsModalComponent implements OnChanges {
    @Input() visible: boolean = false;
    @Input() trackingDetail: any = {};
    @Input() conditionOptions: any;
    @Output() conditionSetChange = new EventEmitter<ConditionSet>();
    @Output() handleVisible = new EventEmitter<boolean>();
    @ViewChild('addConditionsForm') addConditionsForm: NgForm;
    @Output() add = new EventEmitter<any>();
    conditionType = CONDITIONTYPE;
    queryModel = new QueryModel();
    condition: Condition;
    conditionSetModel = new ConditionSet();
    modalType: string = 'create';

    selectedCondition = null;
    conditionList = {};

    loadDataFirst: boolean = true;
    conditionItemInputData: any = {};
    conditionItemOutputData: any = {};

    @Input()
    set conditionSet(value) {
        this.modalType = 'create';
        if (value && value.name) {
            this.modalType = 'update';
        }
        this.conditionSetModel = value;
    }

    get conditionSet() {
        return this.conditionSetModel;
    }

    constructor(
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private userLevelService: UserLevelService,
        private customerService: CustomerService
    ) { }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes.visible && changes.visible.currentValue) {
            if (this.loadDataFirst) {
                this.loadDataFirst = false;
                await this.loadConditionItemInputData();
            }
            if (this.modalType === 'update') {
                this.loadConditions();
            }
        }
    }

    async loadConditions() {
        if (this.conditionSet && this.conditionSet.conditions) {
            for (const condition in this.conditionSet.conditions) {
                if (this.conditionSet.conditions.hasOwnProperty(condition)) {
                    this.conditionList = { ...this.conditionList, [condition]: {} };
                    await this.getConditionValue(condition);
                }
            }
        }
    }

    async getConditionValue(key: string = null) {
        switch (key) {
            case 'userId':
                for (const userId of this.conditionSet.conditions[key].value) {
                    if (!this.conditionItemOutputData[key] || !this.conditionItemOutputData[key].hasOwnProperty(userId) || this.conditionItemOutputData[key][userId].exist !== true) {
                        const response = await this.customerService.getCustomer(userId);
                        this.conditionItemOutputData = {
                            ...this.conditionItemOutputData,
                            [key]: {
                                ...this.conditionItemOutputData[key],
                                [userId]: { value: response._id, name: response.code, exist: true, }
                            }
                        };
                    }
                }
                for (const userId in this.conditionItemOutputData[key]) {
                    if (this.conditionItemOutputData[key].hasOwnProperty(userId)) {
                        if (this.conditionItemOutputData[key][userId].exist !== true) {
                            delete this.conditionItemOutputData[key][userId];
                        }
                    }
                }
                break;
            case 'userLevelId':
            case 'orderType':
            case 'service':
            case 'paymentMethod':
                if (this.conditionSet.conditions[key].value) {
                    this.conditionSet.conditions[key].value.forEach(value => {
                        if (this.conditionItemInputData[`${key}Query`][value]) {
                            this.conditionItemOutputData = {
                                ...this.conditionItemOutputData,
                                [key]: {
                                    ...this.conditionItemOutputData[key],
                                    [value]: { ...this.conditionItemInputData[`${key}Query`][value] }
                                }
                            };
                        }
                    });
                }
                break;
            default:
                this.conditionItemOutputData = {
                    ...this.conditionItemOutputData,
                    [key]: {
                        ...this.conditionSet.conditions[key]
                    }
                };
        }
    }

    async loadConditionItemInputData() {
        const response = await this.userLevelService.getUserLevels(this.queryModel);
        this.conditionItemInputData = {
            ...this.conditionItemInputData,
            userLevelId: response.data,
            userLevelIdQuery: _.mapKeys(response.data, '_id')
        };

        const orderType = [];
        for (const item in OrderType) {
            if (OrderType.hasOwnProperty(item)) {
                orderType.push({
                    _id: OrderType[item],
                    name: this.translateService.instant(`order.type.${OrderType[item]}`),
                });
            }
        }
        this.conditionItemInputData = {
            ...this.conditionItemInputData,
            orderType,
            orderTypeQuery: _.mapKeys(orderType, '_id')
        };

        const baseUserCost = [
            Operator.GREATER,
            Operator.LESS,
            Operator.EQUAL,
            Operator.BETWEEN,
            Operator.GREATER_OR_EQUAL,
            Operator.LESS_OR_EQUAL,
            Operator.DIFF
        ];
        this.conditionItemInputData = { ...this.conditionItemInputData, baseUserCost };

        const servicerCost = [...baseUserCost];
        this.conditionItemInputData = { ...this.conditionItemInputData, servicerCost };

        const createdAt = [...baseUserCost];
        this.conditionItemInputData = { ...this.conditionItemInputData, createdAt };

        const depositAmount = [...baseUserCost];
        this.conditionItemInputData = { ...this.conditionItemInputData, depositAmount };

        const depositTime = [...baseUserCost];
        this.conditionItemInputData = { ...this.conditionItemInputData, depositTime };

        const numberOfOrder = [...baseUserCost];
        this.conditionItemInputData = { ...this.conditionItemInputData, numberOfOrder };

        const numberOfWorkingDay = [...baseUserCost];
        this.conditionItemInputData = { ...this.conditionItemInputData, numberOfWorkingDay };

        const incomeAmount = [...baseUserCost];
        this.conditionItemInputData = { ...this.conditionItemInputData, incomeAmount };
    }

    onConfirmModal() {
        if (this.addConditionsForm.valid) {
            this.fromDataToController();
            this.conditionSetChange.emit(this.conditionSet);
            this.handleVisibleThisModal(false);
            this.reset();
        } else {
            this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.invalid-data'));
            CommonHelper.validateForm(this.addConditionsForm);
        }
    }

    onCancelModal() {
        this.handleVisibleThisModal(false);
        this.reset();
    }

    handleVisibleThisModal(flag?) {
        this.handleVisible.emit(!!flag);
    }

    addOneCondition(item: string) {
        if (!item) {
            this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.notChosen-condition'));
            return;
        }
        if (!this.conditionList[item]) {
            this.conditionList = { ...this.conditionList, [item]: {} };
            if (item === 'location') {
                this.conditionItemOutputData = { ...this.conditionItemOutputData, [item]: [] };
            } else {
                this.conditionItemOutputData = { ...this.conditionItemOutputData, [item]: {} };
            }
        }
        this.selectedCondition = null;
    }

    addAllCondition() {
        this.conditionOptions.forEach(item => {
            this.addOneCondition(item);
        });
    }

    removeCondition(item) {
        if (item && !_.isEmpty(this.conditionList) && this.conditionList[item]) {
            delete this.conditionList[item];
            delete this.conditionItemOutputData[item];
            this.conditionList = { ...this.conditionList };
            this.conditionItemOutputData = { ...this.conditionItemOutputData };
        }
    }

    async onAddingConditionChildren({ conditionName, value }) {
        this.conditionItemOutputData = { ...this.conditionItemOutputData, [conditionName]: { ...value } };
    }

    fromDataToController() {
        this.conditionSet.conditions = {};
        if (this.conditionItemOutputData.hasOwnProperty('userId')) {
            const value = [];
            const data = this.conditionItemOutputData['userId'];
            for (const item in data) {
                if (data.hasOwnProperty(item)) {
                    value.push(data[item].value);
                }
            }

            this.conditionSet.conditions = { ...this.conditionSet.conditions, userId: { operator: Operator.IN, value: [...value] } };
        }
        if (this.conditionItemOutputData.hasOwnProperty('userLevelId')) {
            this.conditionSet.conditions = { ...this.conditionSet.conditions, userLevelId: { operator: Operator.IN, value: Object.keys(this.conditionItemOutputData.userLevelId) } };
        }
        if (this.conditionItemOutputData.hasOwnProperty('createdAt')) {
            let data = this.conditionItemOutputData['createdAt'];
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            if (!data.value) {
                data = { ...data, value: [] };
            }
            const value = data.value.map(x => Number(moment(x).format('x')));
            this.conditionSet.conditions = { ...this.conditionSet.conditions, createdAt: { operator: data.operator, value: [...value] } };
        }
        if (this.conditionItemOutputData.hasOwnProperty('orderType')) {
            this.conditionSet.conditions = { ...this.conditionSet.conditions, orderType: { operator: Operator.IN, value: Object.keys(this.conditionItemOutputData.orderType) } };
        }
        if (this.conditionItemOutputData.hasOwnProperty('depositAmount')) {
            let data = this.conditionItemOutputData['depositAmount'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.conditionSet.conditions = { ...this.conditionSet.conditions, depositAmount: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('depositTime')) {
            let data = this.conditionItemOutputData['depositTime'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.conditionSet.conditions = { ...this.conditionSet.conditions, depositTime: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('baseUserCost')) {
            let data = this.conditionItemOutputData['baseUserCost'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.conditionSet.conditions = { ...this.conditionSet.conditions, baseUserCost: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('servicerCost')) {
            let data = this.conditionItemOutputData['servicerCost'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.conditionSet.conditions = { ...this.conditionSet.conditions, servicerCost: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('numberOfOrder')) {
            let data = this.conditionItemOutputData['numberOfOrder'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.conditionSet.conditions = { ...this.conditionSet.conditions, numberOfOrder: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('numberOfWorkingDay')) {
            let data = this.conditionItemOutputData['numberOfWorkingDay'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.conditionSet.conditions = { ...this.conditionSet.conditions, numberOfWorkingDay: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('incomeAmount')) {
            let data = this.conditionItemOutputData['incomeAmount'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.conditionSet.conditions = { ...this.conditionSet.conditions, incomeAmount: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('servicerRating')) {
            let data = this.conditionItemOutputData['servicerRating'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            this.conditionSet.conditions = { ...this.conditionSet.conditions, servicerRating: { operator: data.operator, value: [...data.value] } };
        }
    }

    reset() {
        this.conditionSet = new ConditionSet();
        this.conditionItemOutputData = {};
        this.conditionList = {};
        this.queryModel = new QueryModel();
        CommonHelper.resetForm(this.addConditionsForm);
    }
}
