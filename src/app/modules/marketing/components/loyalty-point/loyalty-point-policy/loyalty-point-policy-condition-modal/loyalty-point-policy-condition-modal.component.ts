import * as _ from 'lodash';
import * as moment from 'moment';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CONDITION, CONDITIONTYPE } from '@/constants/Condition';
import { Condition } from '@/modules/marketing/models/condition';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { FilterService } from '@/utility/services/filter.service';
import { LoyaltyPointConditionModel } from '@/modules/marketing/models/loyalty-policy-condition.model';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Operator } from '@/constants/ConditionOperator';
import { OrderType } from '@/modules/order/constants/OrderType';
import { PaymentMethod } from '@/constants/PaymentMethod';
import { QueryModel } from '@/models/query.model';
import { ServiceStyle } from '@/modules/price/constants/ServiceStyle';
import { TranslateService } from '@ngx-translate/core';
import { UserLevelService } from '@/modules/user/services/user-level.service';

@Component({
    selector: 'loyalty-point-policy-condition-modal',
    templateUrl: './loyalty-point-policy-condition-modal.component.html'
})
export class LoyaltyPointPolicyConditionModalComponent implements OnChanges {
    @Input() visible: boolean = false;
    @Input() conditionOptions = CONDITION.loyaltyPolicyPoint;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() conditionChange = new EventEmitter<Condition>();
    @Output() add = new EventEmitter<any>();
    @ViewChild('addConditionsForm') addConditionsForm: NgForm;
    conditionType = CONDITIONTYPE;
    SERVICESTYLE = [
        ServiceStyle.Delivery,
        ServiceStyle.Installation,
        ServiceStyle.Installation_AddonService,
        ServiceStyle.Delivery_Collection,
        ServiceStyle.Delivery_Porters,
        ServiceStyle.Delivery_ReturnPickPoint,
        ServiceStyle.Delivery_Stopoint,
        ServiceStyle.Delivery_Return
    ];
    queryModel = new QueryModel();
    loyaltyConditionModel: LoyaltyPointConditionModel = new LoyaltyPointConditionModel();
    modalType: string = 'create';

    selectedCondition = null;
    conditionList = {};

    loadDataFirst: boolean = true;
    conditionItemInputData: any = {};
    conditionItemOutputData: any = {};

    handleVisibleModal(flag = false) {
        this.visibleChange.emit(!!flag);
    }

    @Input()
    set loyaltyCondition(value: LoyaltyPointConditionModel) {
        this.modalType = 'create';
        if (value) {
            this.loyaltyConditionModel = value;
            if (value.name) {
                this.modalType = 'update';
            }
        }
    }

    get loyaltyCondition() {
        return this.loyaltyConditionModel;
    }

    constructor(
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private userLevelService: UserLevelService,
        private customerService: CustomerService,
        private filterService: FilterService
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
        if (this.loyaltyCondition && this.loyaltyCondition.conditions) {
            for (const conditionKey in this.loyaltyCondition.conditions) {
                if (this.loyaltyCondition.conditions.hasOwnProperty(conditionKey)) {
                    this.conditionList = { ...this.conditionList, [conditionKey]: {} };
                    await this.getConditionValue(conditionKey);
                }
            }
        }
    }

    async getConditionValue(key: string = null) {
        switch (key) {
            case 'userId':
                for (const userId of this.loyaltyCondition.conditions[key].value) {
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
                if (this.loyaltyCondition.conditions[key].value) {
                    this.loyaltyCondition.conditions[key].value.forEach(value => {
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
            case 'dayPeriod':
                this.conditionItemOutputData = {
                    ...this.conditionItemOutputData,
                    [key]: {
                        startTime: moment().utc().startOf('day').add(parseInt(this.loyaltyCondition.conditions.dayPeriod.value[0]), 'ms').valueOf(),
                        endTime: moment().utc().startOf('day').add(parseInt(this.loyaltyCondition.conditions.dayPeriod.value[1]), 'ms').valueOf()
                    }
                };
                break;
            case 'location':
                if (this.loyaltyCondition.conditions.location.value) {
                    for (const value of Object.keys(this.loyaltyCondition.conditions.location.value)) {
                        if (this.conditionItemInputData.location.cityQuery[value]) {
                            this.conditionItemOutputData = {
                                ...this.conditionItemOutputData,
                                location: {
                                    ...this.conditionItemOutputData.location,
                                    [value]: { ...this.conditionItemInputData.location.cityQuery[value], value: {} }
                                }
                            };

                            if (this.loyaltyCondition.conditions.location.value[value].length) {
                                for (const districtId of this.loyaltyCondition.conditions.location.value[value]) {
                                    if (!this.conditionItemInputData.location.districtQuery || !this.conditionItemInputData.location.districtQuery[districtId]) {
                                        await this.loadDistricts(value);

                                    }
                                    this.conditionItemOutputData = {
                                        ...this.conditionItemOutputData,
                                        location: {
                                            ...this.conditionItemOutputData.location,
                                            [value]: {
                                                ...this.conditionItemOutputData.location[value],
                                                value: {
                                                    ...this.conditionItemOutputData.location[value].value,
                                                    [districtId]: {
                                                        name: this.conditionItemInputData.location.districtQuery[districtId].name,
                                                        value: this.conditionItemInputData.location.districtQuery[districtId]._id
                                                    }
                                                }
                                            }
                                        }
                                    };
                                }
                            }
                        }
                    }
                }
                break;
            default:
                this.conditionItemOutputData = {
                    ...this.conditionItemOutputData,
                    [key]: {
                        ...this.loyaltyCondition.conditions[key]
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

        const service = [];
        this.SERVICESTYLE.forEach(item => {
            service.push({
                _id: item,
                name: this.translateService.instant(`order.service-style${item}.text`),
            });
        });
        this.conditionItemInputData = {
            ...this.conditionItemInputData,
            service,
            serviceQuery: _.mapKeys(service, '_id')
        };

        const baseUserCost = [];
        for (const x in Operator) {
            if (Operator.hasOwnProperty(x)) {
                baseUserCost.push(Operator[x]);
            }
        }

        const paymentMethod = [];
        for (const item in PaymentMethod) {
            if (PaymentMethod.hasOwnProperty(item)) {
                paymentMethod.push({
                    _id: PaymentMethod[item],
                    name: this.translateService.instant(`finance.paymentMethod.${PaymentMethod[item]}`),
                });
            }
        }
        this.conditionItemInputData = {
            ...this.conditionItemInputData,
            paymentMethod,
            paymentMethodQuery: _.mapKeys(paymentMethod, '_id')
        };

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
        await this.loadCities();

    }

    async loadCities() {
        let cityList = [];
        const cities = await this.filterService.getCities();
        if (cities.length) {
            cityList = cities.map(city => ({
                _id: city._id,
                name: city.name
            }));
        }
        const location = {
            city: [...cityList],
            cityQuery: _.mapKeys(cityList, '_id'),
            district: {},
            districtQuery: {}
        };
        this.conditionItemInputData = { ...this.conditionItemInputData, location };
    }

    async loadDistricts(cityId: string = null) {
        if (!this.conditionItemInputData.location.districtQuery[cityId]) {
            let districtList = [];
            const districts = await this.filterService.getDistricts(cityId);
            districtList = districts.map(district => ({
                _id: district._id,
                name: district.name
            }));
            this.conditionItemInputData = {
                ...this.conditionItemInputData, location: {
                    ...this.conditionItemInputData.location,
                    districtQuery: {
                        ...this.conditionItemInputData.location.districtQuery,
                        ..._.mapKeys(districtList, '_id')
                    },
                    district: {
                        ...this.conditionItemInputData.location.district,
                        [cityId]: [
                            ...(this.conditionItemInputData.location.district[cityId] ? this.conditionItemInputData.location.district[cityId] : []), ...districtList
                        ]
                    }
                }
            };
        }
    }

    onConfirmModal() {
        if (this.addConditionsForm.valid) {
            if (!this.processDataChange()) {
                return;
            }
            this.conditionChange.emit(this.loyaltyCondition);
            this.handleVisibleModal(false);
            this.reset();
        } else {
            this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.invalid-data'));
            CommonHelper.validateForm(this.addConditionsForm);
        }
    }

    onCancelModal() {
        this.handleVisibleModal();
        this.reset();
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

    async onAddingConditionChildren({ type, currentValue, conditionName, value }) {
        this.conditionItemOutputData = { ...this.conditionItemOutputData, [conditionName]: { ...value } };
        if (type && type === 'city') {
            await this.loadDistricts(currentValue._id);
        }
    }


    processDataChange() {
        if (_.isEmpty(this.conditionItemOutputData)) {
            this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.invalid-data'));
            return false;
        }
        this.loyaltyCondition.conditions = {};
        if (this.conditionItemOutputData.hasOwnProperty('userId')) {
            const value = [];
            const data = this.conditionItemOutputData['userId'];
            for (const item in data) {
                if (data.hasOwnProperty(item)) {
                    value.push(data[item].value);
                }
            }
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, userId: { operator: Operator.IN, value: [...value] } };
        }
        if (this.conditionItemOutputData.hasOwnProperty('userLevelId')) {
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, userLevelId: { operator: Operator.IN, value: Object.keys(this.conditionItemOutputData.userLevelId) } };
        }
        if (this.conditionItemOutputData.hasOwnProperty('service')) {
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, service: { operator: Operator.CONTAIN, value: Object.keys(this.conditionItemOutputData.service) } };
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
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, createdAt: { operator: data.operator, value: [...value] } };
        }
        if (this.conditionItemOutputData.hasOwnProperty('orderType')) {
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, orderType: { operator: Operator.IN, value: Object.keys(this.conditionItemOutputData.orderType) } };
        }
        if (this.conditionItemOutputData.hasOwnProperty('depositAmount')) {
            let data = this.conditionItemOutputData['depositAmount'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, depositAmount: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('depositTime')) {
            let data = this.conditionItemOutputData['depositTime'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, depositTime: { operator: data.operator, value: [...data.value] } };
        }
        if (this.conditionItemOutputData.hasOwnProperty('dayPeriod')) {
            const data = this.conditionItemOutputData['dayPeriod'];
            data.startTime = moment(parseInt(data.startTime)).utc().valueOf() - moment().utc().startOf('day').valueOf();
            data.endTime = moment(parseInt(data.endTime)).utc().valueOf() - moment().utc().startOf('day').valueOf();
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, dayPeriod: { operator: Operator.BETWEEN, value: [data.startTime, data.endTime].map(x => parseInt(x)) } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('location')) {
            let locationValue = {};
            const data = this.conditionItemOutputData['location'];
            for (const cityId in data) {
                if (data.hasOwnProperty(cityId)) {
                    locationValue = { ...locationValue, [cityId]: Object.keys(data[cityId].value) };
                }
            }
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, location: { value: { ...locationValue } } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('paymentMethod')) {
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, paymentMethod: { operator: Operator.IN, value: Object.keys(this.conditionItemOutputData.paymentMethod) } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('baseUserCost')) {
            let data = this.conditionItemOutputData['baseUserCost'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, baseUserCost: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('servicerCost')) {
            let data = this.conditionItemOutputData['servicerCost'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, servicerCost: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('numberOfOrder')) {
            let data = this.conditionItemOutputData['numberOfOrder'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, numberOfOrder: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('numberOfWorkingDay')) {
            let data = this.conditionItemOutputData['numberOfWorkingDay'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, numberOfWorkingDay: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('incomeAmount')) {
            let data = this.conditionItemOutputData['incomeAmount'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, incomeAmount: { operator: data.operator, value: [...data.value] } };
        }

        if (this.conditionItemOutputData.hasOwnProperty('servicerRating')) {
            let data = this.conditionItemOutputData['servicerRating'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            this.loyaltyCondition.conditions = { ...this.loyaltyCondition.conditions, servicerRating: { operator: data.operator, value: [...data.value] } };
        }
        return true;
    }

    reset() {
        this.conditionItemOutputData = {};
        this.conditionList = {};
        this.loyaltyCondition = new LoyaltyPointConditionModel();
        this.queryModel = new QueryModel();
        CommonHelper.resetForm(this.addConditionsForm);
    }
}