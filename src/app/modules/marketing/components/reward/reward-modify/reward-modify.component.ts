import * as _ from 'lodash';
import * as moment from 'moment';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONDITION } from '@/constants/Condition';
import { Condition } from 'app/modules/marketing/models/condition';
import { CONDITIONTYPE } from '../../../../../constants/Condition';
import { CustomerService } from 'app/modules/customer/services/customer.service';
import { DateTimeService } from 'app/modules/utility/services/datetime.service';
import { FilterService } from 'app/modules/utility/services/filter.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Operator } from '@/constants/ConditionOperator';
import { OrderType } from '@/modules/order/constants/OrderType';
import { PaymentMethod } from '@/constants/PaymentMethod';
import { QueryModel } from 'app/models/query.model';
import { RewardCategoryModel } from 'app/modules/marketing/models/reward-category.model';
import { RewardCategoryService } from 'app/modules/marketing/services/reward-category.service';
import { RewardModel } from 'app/modules/marketing/models/reward.model';
import { RewardProviderModel } from 'app/modules/marketing/models/reward-provider.model';
import { RewardProviderService } from 'app/modules/marketing/services/reward-provider.service';
import { RewardService } from 'app/modules/marketing/services/reward.service';
import { ServiceStyle } from '@/modules/price/constants/ServiceStyle';
import { Status } from 'app/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';
import { UserLevelService } from '@/modules/user/services/user-level.service';
import { ViewChild } from '@angular/core';

@Component({
    selector: 'reward-modify',
    templateUrl: 'reward-modify.component.html',
    styleUrls: ['reward-modify.component.less']
})
export class RewardModifyComponent implements OnInit {
    @Input() currentModel = new RewardModel();
    @Input() visibleModal = false;
    @Output() handleVisible = new EventEmitter<boolean>();
    @Output() updated = new EventEmitter<RewardModel>();
    _model = new RewardModel();
    images = [];
    rewardProviders: RewardProviderModel[] = [];
    rewardCategories: RewardCategoryModel[] = [];
    @ViewChild('rewardModifyForm') rewardModifyForm: NgForm;
    effectedDate: Date;
    expiredDate: Date;
    selectedTabIndex = 0;
    conditionList = CONDITION.appliedConditionReward;
    displayConditionList = CONDITION.displayReward;
    appliedCondition = {};
    displayCondition = {};
    selectedAppliedCondition: string;
    selectedDisplayCondition: string;
    appliedConditionOutputData: { [index: string]: any } = {};
    displayConditionOutputData: { [index: string]: any } = {};
    conditionInputData: { [index: string]: any } = {};
    queryModel = new QueryModel();
    conditionType = CONDITIONTYPE;
    promoCodeObject: { [index: string]: any } = {};
    numberMask = createNumberMask({ prefix: '' });
    rewardConditions = { 'appliedCondition': {}, 'displayCondition': {} };
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
    loadDataFirst: boolean = true;

    constructor(
        private rewardService: RewardService,
        private rewardCategoryService: RewardCategoryService,
        private rewardProviderService: RewardProviderService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private customerService: CustomerService,
        private filterService: FilterService,
        private userLevelService: UserLevelService
    ) { }

    get model() {
        return this._model;
    }

    @Input()
    set model(value) {
        if (!value) {
            value = new RewardModel();
        }

        this._model = value;
        if (value.image) {
            this.images.push({
                uid: _.uniqueId(),
                url: value.image,
                status: 'done'
            });
        }
        this.effectedDate = DateTimeService.convertTimestampToDate(value.effectedAt).toDate();
        this.expiredDate = DateTimeService.convertTimestampToDate(value.expiredAt).toDate();
        if (this.loadDataFirst) {
            this.loadDataFirst = false;
            this.loadData();
        }
        if (this.model._id) {
            this.loadConditions();
        }
    }

    async ngOnInit() {
        this.rewardProviders = (await this.rewardProviderService.filter(new QueryModel({ limit: 1000, status: Status.ACTIVE, fields: 'name' }))).data;
        this.rewardCategories = (await this.rewardCategoryService.filter(new QueryModel({ limit: 1000, status: Status.ACTIVE, fields: 'name' }))).data;
    }

    async loadData() {
        const userLevelData = await this.userLevelService.getUserLevels(this.queryModel);
        this.conditionInputData = {
            ...this.conditionInputData,
            userLevelId: userLevelData.data,
            userLevelIdQuery: _.mapKeys(userLevelData.data, '_id')
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
        this.conditionInputData = {
            ...this.conditionInputData,
            orderType,
            orderTypeQuery: _.mapKeys(orderType, '_id')
        };

        const paymentMethod = [];
        for (const item in PaymentMethod) {
            if (PaymentMethod.hasOwnProperty(item)) {
                paymentMethod.push({
                    _id: PaymentMethod[item],
                    name: this.translateService.instant(`finance.paymentMethod.${PaymentMethod[item]}`),
                });
            }
        }
        this.conditionInputData = {
            ...this.conditionInputData,
            paymentMethod,
            paymentMethodQuery: _.mapKeys(paymentMethod, '_id')
        };

        const service = [];
        this.SERVICESTYLE.forEach(item => {
            service.push({
                _id: item,
                name: this.translateService.instant(`order.service-style${item}.text`),
            });
        });
        this.conditionInputData = {
            ...this.conditionInputData,
            service,
            serviceQuery: _.mapKeys(service, '_id')
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
        this.conditionInputData = { ...this.conditionInputData, baseUserCost };

        const createdAt = [...baseUserCost];
        this.conditionInputData = { ...this.conditionInputData, createdAt };

        const displayedAt = [...baseUserCost];
        this.conditionInputData = { ...this.conditionInputData, displayedAt };

        await this.loadCities();
    }

    updateImage($event) {
        this.model.image = $event ? $event[0] : null;
    }

    dataProcessingAppliedCondition() {
        this.model.appliedCondition = new Condition();
        if (this.appliedConditionOutputData.hasOwnProperty('userId')) {
            const value = [];
            const data = this.appliedConditionOutputData['userId'];
            for (const item in data) {
                if (data.hasOwnProperty(item)) {
                    value.push(data[item].value);
                }
            }
            this.model.appliedCondition = { ...this.model.appliedCondition, userId: { operator: Operator.IN, value: [...value] } };
        }
        if (this.appliedConditionOutputData.hasOwnProperty('userLevelId')) {
            this.model.appliedCondition = { ...this.model.appliedCondition, userLevelId: { operator: Operator.IN, value: Object.keys(this.appliedConditionOutputData.userLevelId) } };
        }
        if (this.appliedConditionOutputData.hasOwnProperty('orderType')) {
            this.model.appliedCondition = { ...this.model.appliedCondition, orderType: { operator: Operator.IN, value: Object.keys(this.appliedConditionOutputData.orderType) } };
        }
        if (this.appliedConditionOutputData.hasOwnProperty('createdAt')) {
            let data = this.appliedConditionOutputData['createdAt'];
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            if (!data.value) {
                data = { ...data, value: [] };
            }
            this.model.appliedCondition = { ...this.model.appliedCondition, createdAt: { operator: data.operator, value: this.parseNumberData(data.value) } };
        }
        if (this.appliedConditionOutputData.hasOwnProperty('displayedAt')) {
            let data = this.appliedConditionOutputData['displayedAt'];
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            if (!data.value) {
                data = { ...data, value: [] };
            }
            this.model.appliedCondition = { ...this.model.appliedCondition, displayedAt: { operator: data.operator, value: this.parseNumberData(data.value) } };
        }
        if (this.appliedConditionOutputData.hasOwnProperty('dayPeriod')) {
            const data = this.appliedConditionOutputData['dayPeriod'];
            data.startTime = moment(parseInt(data.startTime)).utc().valueOf() - moment().utc().startOf('day').valueOf();
            data.endTime = moment(parseInt(data.endTime)).utc().valueOf() - moment().utc().startOf('day').valueOf();
            this.model.appliedCondition = { ...this.model.appliedCondition, dayPeriod: { operator: Operator.BETWEEN, value: this.parseNumberData([data.startTime, data.endTime]) } };
        }

        if (this.appliedConditionOutputData.hasOwnProperty('location')) {
            let locationValue = {};
            const data = this.appliedConditionOutputData['location'];
            for (const cityId in data) {
                if (data.hasOwnProperty(cityId)) {
                    locationValue = { ...locationValue, [cityId]: Object.keys(data[cityId].value) };
                }
            }
            this.model.appliedCondition = { ...this.model.appliedCondition, location: { value: { ...locationValue } } };
        }
        if (this.appliedConditionOutputData.hasOwnProperty('service')) {
            this.model.appliedCondition = { ...this.model.appliedCondition, service: { operator: Operator.CONTAIN, value: Object.keys(this.appliedConditionOutputData.service) } };
        }
        if (this.appliedConditionOutputData.hasOwnProperty('paymentMethod')) {
            this.model.appliedCondition = { ...this.model.appliedCondition, paymentMethod: { operator: Operator.IN, value: Object.keys(this.appliedConditionOutputData.paymentMethod) } };
        }
        if (this.appliedConditionOutputData.hasOwnProperty('baseUserCost')) {
            let data = this.appliedConditionOutputData['baseUserCost'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.model.appliedCondition = { ...this.model.appliedCondition, baseUserCost: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.appliedConditionOutputData.hasOwnProperty('limitedQuantityByDayAndUser')) {
            const data = this.appliedConditionOutputData['limitedQuantityByDayAndUser'];
            this.model.appliedCondition = { ...this.model.appliedCondition, limitedQuantityByDayAndUser: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.appliedConditionOutputData.hasOwnProperty('limitedQuantityByWeekAndUser')) {
            const data = this.appliedConditionOutputData['limitedQuantityByWeekAndUser'];
            this.model.appliedCondition = { ...this.model.appliedCondition, limitedQuantityByWeekAndUser: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.appliedConditionOutputData.hasOwnProperty('limitedQuantityByMonthAndUser')) {
            const data = this.appliedConditionOutputData['limitedQuantityByMonthAndUser'];
            this.model.appliedCondition = { ...this.model.appliedCondition, limitedQuantityByMonthAndUser: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.appliedConditionOutputData.hasOwnProperty('limitedQuantityByUser')) {
            const data = this.appliedConditionOutputData['limitedQuantityByUser'];
            this.model.appliedCondition = { ...this.model.appliedCondition, limitedQuantityByUser: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.appliedConditionOutputData.hasOwnProperty('limitedQuantityByDay')) {
            const data = this.appliedConditionOutputData['limitedQuantityByDay'];
            this.model.appliedCondition = { ...this.model.appliedCondition, limitedQuantityByDay: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.appliedConditionOutputData.hasOwnProperty('limitedQuantityByWeek')) {
            const data = this.appliedConditionOutputData['limitedQuantityByWeek'];
            this.model.appliedCondition = { ...this.model.appliedCondition, limitedQuantityByWeek: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.appliedConditionOutputData.hasOwnProperty('limitedQuantityByMonth')) {
            const data = this.appliedConditionOutputData['limitedQuantityByMonth'];
            this.model.appliedCondition = { ...this.model.appliedCondition, limitedQuantityByMonth: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

    }

    dataProcessingDisplayCondition() {
        this.model.displayCondition = new Condition();
        if (this.displayConditionOutputData.hasOwnProperty('userId')) {
            const value = [];
            const data = this.displayConditionOutputData['userId'];
            for (const item in data) {
                if (data.hasOwnProperty(item)) {
                    value.push(data[item].value);
                }
            }
            this.model.displayCondition = { ...this.model.displayCondition, userId: { operator: Operator.IN, value: [...value] } };
        }
        if (this.displayConditionOutputData.hasOwnProperty('userLevelId')) {
            this.model.displayCondition = { ...this.model.displayCondition, userLevelId: { operator: Operator.IN, value: Object.keys(this.displayConditionOutputData.userLevelId) } };
        }
        if (this.displayConditionOutputData.hasOwnProperty('orderType')) {
            this.model.displayCondition = { ...this.model.displayCondition, orderType: { operator: Operator.IN, value: Object.keys(this.displayConditionOutputData.orderType) } };
        }
        if (this.displayConditionOutputData.hasOwnProperty('createdAt')) {
            let data = this.displayConditionOutputData['createdAt'];
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            if (!data.value) {
                data = { ...data, value: [] };
            }
            this.model.displayCondition = { ...this.model.displayCondition, createdAt: { operator: data.operator, value: this.parseNumberData(data.value) } };
        }
        if (this.displayConditionOutputData.hasOwnProperty('displayedAt')) {
            let data = this.displayConditionOutputData['displayedAt'];
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            if (!data.value) {
                data = { ...data, value: [] };
            }
            this.model.displayCondition = { ...this.model.displayCondition, displayedAt: { operator: data.operator, value: this.parseNumberData(data.value) } };
        }
        if (this.displayConditionOutputData.hasOwnProperty('dayPeriod')) {
            const data = this.displayConditionOutputData['dayPeriod'];
            data.startTime = moment(parseInt(data.startTime)).utc().valueOf() - moment().utc().startOf('day').valueOf();
            data.endTime = moment(parseInt(data.endTime)).utc().valueOf() - moment().utc().startOf('day').valueOf();
            this.model.displayCondition = { ...this.model.displayCondition, dayPeriod: { operator: Operator.BETWEEN, value: this.parseNumberData([data.startTime, data.endTime]) } };
        }

        if (this.displayConditionOutputData.hasOwnProperty('location')) {
            let locationValue = {};
            const data = this.displayConditionOutputData['location'];
            for (const cityId in data) {
                if (data.hasOwnProperty(cityId)) {
                    locationValue = { ...locationValue, [cityId]: Object.keys(data[cityId].value) };
                }
            }
            this.model.displayCondition = { ...this.model.displayCondition, location: { value: { ...locationValue } } };
        }
        if (this.displayConditionOutputData.hasOwnProperty('service')) {
            this.model.displayCondition = { ...this.model.displayCondition, service: { operator: Operator.CONTAIN, value: Object.keys(this.displayConditionOutputData.service) } };
        }
        if (this.displayConditionOutputData.hasOwnProperty('paymentMethod')) {
            this.model.displayCondition = { ...this.model.displayCondition, paymentMethod: { operator: Operator.IN, value: Object.keys(this.displayConditionOutputData.paymentMethod) } };
        }
        if (this.displayConditionOutputData.hasOwnProperty('baseUserCost')) {
            let data = this.displayConditionOutputData['baseUserCost'];
            if (!data.value) {
                data = { ...data, value: [] };
            }
            if (!data.operator) {
                data = { ...data, operator: '' };
            }
            this.model.displayCondition = { ...this.model.displayCondition, baseUserCost: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.displayConditionOutputData.hasOwnProperty('limitedQuantityByDayAndUser')) {
            const data = this.displayConditionOutputData['limitedQuantityByDayAndUser'];
            this.model.displayCondition = { ...this.model.displayCondition, limitedQuantityByDayAndUser: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.displayConditionOutputData.hasOwnProperty('limitedQuantityByWeekAndUser')) {
            const data = this.displayConditionOutputData['limitedQuantityByWeekAndUser'];
            this.model.displayCondition = { ...this.model.displayCondition, limitedQuantityByWeekAndUser: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.displayConditionOutputData.hasOwnProperty('limitedQuantityByMonthAndUser')) {
            const data = this.displayConditionOutputData['limitedQuantityByMonthAndUser'];
            this.model.displayCondition = { ...this.model.displayCondition, limitedQuantityByMonthAndUser: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.displayConditionOutputData.hasOwnProperty('limitedQuantityByUser')) {
            const data = this.displayConditionOutputData['limitedQuantityByUser'];
            this.model.displayCondition = { ...this.model.displayCondition, limitedQuantityByUser: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.displayConditionOutputData.hasOwnProperty('limitedQuantityByDay')) {
            const data = this.displayConditionOutputData['limitedQuantityByDay'];
            this.model.displayCondition = { ...this.model.displayCondition, limitedQuantityByDay: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.displayConditionOutputData.hasOwnProperty('limitedQuantityByWeek')) {
            const data = this.displayConditionOutputData['limitedQuantityByWeek'];
            this.model.displayCondition = { ...this.model.displayCondition, limitedQuantityByWeek: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }

        if (this.displayConditionOutputData.hasOwnProperty('limitedQuantityByMonth')) {
            const data = this.displayConditionOutputData['limitedQuantityByMonth'];
            this.model.displayCondition = { ...this.model.displayCondition, limitedQuantityByMonth: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
        }
    }

    parseNumberData(data: any[]) {
        return data.map(value => parseInt(value));
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
        this.conditionInputData = { ...this.conditionInputData, location };
    }

    async confirm() {
        if (this.rewardModifyForm.valid) {
            if (this.model.effectedAt > this.model.expiredAt) {
                this.messageService.warning(this.translateService.instant('validations-form.expiredAt.invalidRange'));
                return;
            }
            this.dataProcessingDisplayCondition();
            if (this.model.type === 'promoCode') {
                this.dataProcessingAppliedCondition();
            } else {
                delete this.model.appliedCondition;
            }
            if (this.model.promotions.discType === 'amount') {
                this.model.promotions.discPercent = 0;
                this.model.promotions.discMaximumAmount = 0;
                this.model.promotions.discSamePrice = 0;
                this.model.promotions.discAmount = CommonHelper.parseS2N(this.model.promotions.discAmount);
            } else if (this.model.promotions.discType === 'percent') {
                this.model.promotions.discAmount = 0;
                this.model.promotions.discSamePrice = 0;
                this.model.promotions.discPercent = CommonHelper.parseS2N(this.model.promotions.discPercent);
                this.model.promotions.discMaximumAmount = CommonHelper.parseS2N(this.model.promotions.discMaximumAmount);
            } else if (this.model.promotions.discType === 'samePrice') {
                this.model.promotions.discAmount = 0;
                this.model.promotions.discPercent = 0;
                this.model.promotions.discMaximumAmount = 0;
                this.model.promotions.discSamePrice = CommonHelper.parseS2N(this.model.promotions.discSamePrice);
            }
            if (this.model.promotions.discAmount) {
                this.model.promotions.discAmount = CommonHelper.parseS2N(this.model.promotions.discAmount);
            }
            if (this.model.promotions.discSamePrice) {
                this.model.promotions.discSamePrice = CommonHelper.parseS2N(this.model.promotions.discSamePrice);
            }

            const result = this.model._id
                ? await this.rewardService.update(this.model)
                : await this.rewardService.create(this.model);
            if (result.errorCode === 0) {
                this.messageService.success(`${this.model._id ? 'Cập nhật' : 'Thêm'} đổi thưởng thành công`);
                if (this.updated) {
                    this.updated.emit(this.model);
                }
                this.handleVisibleModal(false);
            } else {
                this.messageService.error(CommonHelper.errorMessage(result, `Có lỗi khi ${this.model._id ? 'cập nhật' : 'tạo'} đổi thưởng. Vui lòng thử lại`));
            }
        } else {
            this.selectedTabIndex = 0;
            CommonHelper.validateForm(this.rewardModifyForm);
        }
    }

    handleVisibleModal(flag = true) {
        this.handleVisible.emit(!!flag);
        if (!flag) {
            this.reset();
        }
    }

    onChangeAffectingDate(date: Date) {
        if (DateTimeService.convertDateToTimestamp(date) > this.model.expiredAt) {
            this.effectedDate = DateTimeService.convertTimestampToDate(this.model.effectedAt).toDate();
            this.messageService.warning(this.translateService.instant('validations-form.effectedAt.invalid'));
            return;
        }
        this.model.effectedAt = DateTimeService.convertDateToTimestamp(date);
    }

    onChangeExpirationDate(date: Date) {
        if (this.model.effectedAt > DateTimeService.convertDateToTimestamp(date)) {
            this.expiredDate = DateTimeService.convertTimestampToDate(this.model.expiredAt).toDate();
            this.messageService.warning(this.translateService.instant('validations-form.expiredAt.invalid'));
            return;
        }
        this.model.expiredAt = DateTimeService.convertDateToTimestamp(date);
    }

    addOneCondition(item: string) {
        if (!item) {
            this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.notChosen-condition'));
            return;
        }
        if (!this.appliedCondition[item]) {
            this.appliedCondition = { ...this.appliedCondition, [item]: {} };
            if (item === 'location') {
                this.appliedConditionOutputData = { ...this.appliedConditionOutputData, [item]: [] };
            } else {
                this.appliedConditionOutputData = { ...this.appliedConditionOutputData, [item]: {} };
            }
        }
        this.selectedAppliedCondition = null;
    }

    addOneDisplayCondition(item: string) {
        if (!item) {
            this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.notChosen-condition'));
            return;
        }
        if (!this.displayCondition[item]) {
            this.displayCondition = { ...this.displayCondition, [item]: {} };
            if (item === 'location') {
                this.displayConditionOutputData = { ...this.displayConditionOutputData, [item]: [] };
            } else {
                this.displayConditionOutputData = { ...this.displayConditionOutputData, [item]: {} };
            }
        }
        this.selectedDisplayCondition = null;
    }

    addAllCondition() {
        this.conditionList.forEach(item => {
            this.addOneCondition(item);
        });
    }

    addAllDisplayCondition() {
        this.displayConditionList.forEach(item => {
            this.addOneDisplayCondition(item);
        });
    }


    removeCondition(item) {
        if (item && !_.isEmpty(this.appliedCondition) && this.appliedCondition[item]) {
            delete this.appliedCondition[item];
            delete this.appliedConditionOutputData[item];
            this.appliedCondition = { ...this.appliedCondition };
            this.appliedConditionOutputData = { ...this.appliedConditionOutputData };
        }
    }

    removeDisplayCondition(item) {
        if (item && !_.isEmpty(this.displayCondition) && this.displayCondition[item]) {
            delete this.displayCondition[item];
            delete this.displayConditionOutputData[item];
            this.displayCondition = { ...this.displayCondition };
            this.displayConditionOutputData = { ...this.displayConditionOutputData };
        }
    }

    async onAddingConditionChildren({ type, currentValue, conditionName, value }) {
        this.appliedConditionOutputData = { ...this.appliedConditionOutputData, [conditionName]: { ...value } };
        if (type && type === 'city') {
            await this.loadDistricts(currentValue._id);
        }
    }

    async onAddingDisplayConditionChildren({ type, currentValue, conditionName, value }) {
        this.displayConditionOutputData = { ...this.displayConditionOutputData, [conditionName]: { ...value } };
        if (type && type === 'city') {
            await this.loadDistricts(currentValue._id);
        }
    }

    async loadConditions() {
        if (this.model && this.model.appliedCondition) {
            for (const condition in this.model.appliedCondition) {
                if (this.model.appliedCondition.hasOwnProperty(condition)) {
                    this.appliedCondition = { ...this.appliedCondition, [condition]: {} };
                    await this.getAppliedConditionValue(condition);
                }
            }
        }
        if (this.model && this.model.displayCondition) {
            for (const condition in this.model.displayCondition) {
                if (this.model.displayCondition.hasOwnProperty(condition)) {
                    this.displayCondition = { ...this.displayCondition, [condition]: {} };
                    await this.getDisplayConditionValue(condition);
                }
            }
        }
    }

    async getAppliedConditionValue(key) {
        switch (key) {
            case 'userId':
                for (const userId of this.model.appliedCondition[key].value) {
                    if (!this.appliedConditionOutputData[key] || !this.appliedConditionOutputData[key].hasOwnProperty(userId) || this.appliedConditionOutputData[key][userId].exist !== true) {
                        const response = await this.customerService.getCustomer(userId);
                        this.appliedConditionOutputData = {
                            ...this.appliedConditionOutputData,
                            [key]: {
                                ...this.appliedConditionOutputData[key],
                                [userId]: { value: response._id, name: response.code, exist: true, }
                            }
                        };
                    }
                }
                for (const userId in this.appliedConditionOutputData[key]) {
                    if (this.appliedConditionOutputData[key].hasOwnProperty(userId)) {
                        if (this.appliedConditionOutputData[key][userId].exist !== true) {
                            delete this.appliedConditionOutputData[key][userId];
                        }
                    }
                }
                break;
            case 'userLevelId':
            case 'orderType':
            case 'service':
            case 'paymentMethod':
                if (this.model.appliedCondition[key].value) {
                    this.model.appliedCondition[key].value.forEach(value => {
                        if (this.conditionInputData[`${key}Query`][value]) {
                            this.appliedConditionOutputData = {
                                ...this.appliedConditionOutputData,
                                [key]: {
                                    ...this.appliedConditionOutputData[key],
                                    [value]: { ...this.conditionInputData[`${key}Query`][value] }
                                }
                            };
                        }
                    });
                }
                break;
            case 'location':
                if (this.model.appliedCondition.location.value) {
                    for (const value of Object.keys(this.model.appliedCondition.location.value)) {
                        if (this.conditionInputData.location.cityQuery[value]) {
                            this.appliedConditionOutputData = {
                                ...this.appliedConditionOutputData,
                                location: {
                                    ...this.appliedConditionOutputData.location,
                                    [value]: { ...this.conditionInputData.location.cityQuery[value], value: {} }
                                }
                            };

                            if (this.model.appliedCondition.location.value[value].length) {
                                for (const districtId of this.model.appliedCondition.location.value[value]) {
                                    if (!this.conditionInputData.location.districtQuery || !this.conditionInputData.location.districtQuery[districtId]) {
                                        await this.loadDistricts(value);

                                    }
                                    this.appliedConditionOutputData = {
                                        ...this.appliedConditionOutputData,
                                        location: {
                                            ...this.appliedConditionOutputData.location,
                                            [value]: {
                                                ...this.appliedConditionOutputData.location[value],
                                                value: {
                                                    ...this.appliedConditionOutputData.location[value].value,
                                                    [districtId]: {
                                                        name: this.conditionInputData.location.districtQuery[districtId].name,
                                                        value: this.conditionInputData.location.districtQuery[districtId]._id
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
            case 'dayPeriod':
                this.appliedConditionOutputData = {
                    ...this.appliedConditionOutputData,
                    [key]: {
                        startTime: moment().utc().startOf('day').add(parseInt(this.model.appliedCondition.dayPeriod.value[0]), 'ms').valueOf(),
                        endTime: moment().utc().startOf('day').add(parseInt(this.model.appliedCondition.dayPeriod.value[1]), 'ms').valueOf()
                    }
                };
                break;
            default:
                this.appliedConditionOutputData = {
                    ...this.appliedConditionOutputData,
                    [key]: {
                        ...this.model.appliedCondition[key]
                    }
                };
        }
    }

    async getDisplayConditionValue(key) {
        switch (key) {
            case 'userId':
                for (const userId of this.model.displayCondition[key].value) {
                    if (!this.displayConditionOutputData[key] || !this.displayConditionOutputData[key].hasOwnProperty(userId) || this.displayConditionOutputData[key][userId].exist !== true) {
                        const response = await this.customerService.getCustomer(userId);
                        this.displayConditionOutputData = {
                            ...this.displayConditionOutputData,
                            [key]: {
                                ...this.displayConditionOutputData[key],
                                [userId]: { value: response._id, name: response.code, exist: true, }
                            }
                        };
                    }
                }
                for (const userId in this.displayConditionOutputData[key]) {
                    if (this.displayConditionOutputData[key].hasOwnProperty(userId)) {
                        if (this.displayConditionOutputData[key][userId].exist !== true) {
                            delete this.displayConditionOutputData[key][userId];
                        }
                    }
                }
                break;
            case 'userLevelId':
            case 'orderType':
            case 'service':
            case 'paymentMethod':
                if (this.model.displayCondition[key].value) {
                    this.model.displayCondition[key].value.forEach(value => {
                        if (this.conditionInputData[`${key}Query`][value]) {
                            this.displayConditionOutputData = {
                                ...this.displayConditionOutputData,
                                [key]: {
                                    ...this.displayConditionOutputData[key],
                                    [value]: { ...this.conditionInputData[`${key}Query`][value] }
                                }
                            };
                        }
                    });
                }
                break;
            case 'location':
                if (this.model.displayCondition.location.value) {
                    for (const value of Object.keys(this.model.displayCondition.location.value)) {
                        if (this.conditionInputData.location.cityQuery[value]) {
                            this.displayConditionOutputData = {
                                ...this.displayConditionOutputData,
                                location: {
                                    ...this.displayConditionOutputData.location,
                                    [value]: { ...this.conditionInputData.location.cityQuery[value], value: {} }
                                }
                            };

                            if (this.model.displayCondition.location.value[value].length) {
                                for (const districtId of this.model.displayCondition.location.value[value]) {
                                    if (!this.conditionInputData.location.districtQuery || !this.conditionInputData.location.districtQuery[districtId]) {
                                        await this.loadDistricts(value);

                                    }
                                    this.displayConditionOutputData = {
                                        ...this.displayConditionOutputData,
                                        location: {
                                            ...this.displayConditionOutputData.location,
                                            [value]: {
                                                ...this.displayConditionOutputData.location[value],
                                                value: {
                                                    ...this.displayConditionOutputData.location[value].value,
                                                    [districtId]: {
                                                        name: this.conditionInputData.location.districtQuery[districtId].name,
                                                        value: this.conditionInputData.location.districtQuery[districtId]._id
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
            case 'dayPeriod':
                this.displayConditionOutputData = {
                    ...this.displayConditionOutputData,
                    [key]: {
                        startTime: moment().utc().startOf('day').add(parseInt(this.model.displayCondition.dayPeriod.value[0]), 'ms').valueOf(),
                        endTime: moment().utc().startOf('day').add(parseInt(this.model.displayCondition.dayPeriod.value[1]), 'ms').valueOf()
                    }
                };
                break;
            default:
                this.displayConditionOutputData = {
                    ...this.displayConditionOutputData,
                    [key]: {
                        ...this.model.displayCondition[key]
                    }
                };
        }
    }


    async loadDistricts(cityId) {
        if (!this.conditionInputData.location.districtQuery[cityId]) {
            let districtList = [];
            const districts = await this.filterService.getDistricts(cityId);
            districtList = districts.map(district => ({
                _id: district._id,
                name: district.name
            }));
            this.conditionInputData = {
                ...this.conditionInputData, location: {
                    ...this.conditionInputData.location,
                    districtQuery: {
                        ...this.conditionInputData.location.districtQuery,
                        ..._.mapKeys(districtList, '_id')
                    },
                    district: {
                        ...this.conditionInputData.location.district,
                        [cityId]: [
                            ...(this.conditionInputData.location.district[cityId] ? this.conditionInputData.location.district[cityId] : []), ...districtList
                        ]
                    }
                }
            };
        }
    }

    reset() {
        this.selectedTabIndex = 0;
        this.images = [];
        this.model = new RewardModel();
        this.appliedCondition = {};
        this.displayCondition = {};
        this.selectedAppliedCondition = null;
        this.selectedDisplayCondition = null;
        this.appliedConditionOutputData = {};
        this.displayConditionOutputData = {};
    }
}