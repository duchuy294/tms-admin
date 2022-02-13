import * as _ from 'lodash';
import * as moment from 'moment';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CommonHelper } from '@/utility/common/common.helper';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Condition, PromotionCodeModel } from '@/modules/marketing/models/promotion-code';
import { CONDITION, CONDITIONTYPE } from '@/constants/Condition';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { FilterService } from '@/utility/services/filter.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Operator } from '@/constants/ConditionOperator';
import { OrderType } from '@/modules/order/constants/OrderType';
import { PagingModel } from '@/modules/utility/components/paging/paging.model';
import { PaymentMethod } from '@/constants/PaymentMethod';
import { PromotionPolicyService } from '@/modules/marketing/services/promotion-policy.service';
import { QueryModel } from '@/models/query.model';
import { ServiceStyle } from '@/modules/price/constants/ServiceStyle';
import { Status } from 'app/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';
import { UserLevelModel } from '@/modules/user/models/user-level.model';
import { UserLevelService } from '@/modules/user/services/user-level.service';

@Component({
  selector: 'create-promocode-modal',
  templateUrl: './create-promocode-modal.component.html',
  styleUrls: ['./create-promocode-modal.component.less']
})
export class CreatePromocodeModalComponent implements OnChanges {
  @Input() data: any;
  @Input() duration: any;
  @Input() modalType: string;
  @Input() policyId: string;
  @Input() promoCodeObject: any;
  @Input() visible: boolean = false;
  @Output() handleVisible = new EventEmitter<boolean>();
  @Output() handleAfterCreated = new EventEmitter<any>();
  @ViewChild('createPromoCodeForm') createPromoCodeForm: NgForm;
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
  status = [Status.NEW, Status.ACTIVE, Status.SUSPENDED];
  conditionList = [...CONDITION.promotionCode];
  queryModel = new QueryModel();
  getDataVariable = new PagingModel<UserLevelModel>();
  conditionInputData: any = {};
  conditionOutputData: any = {};
  conditionType = CONDITIONTYPE;

  model = new PromotionCodeModel();
  modelToSend = null;
  avatar = [];
  selectedCondition = null;
  conditions = {};
  loading: boolean = false;
  loadDataFirst: boolean = true;
  numberMask = createNumberMask({ prefix: '' });
  currencyMask = createNumberMask({ prefix: '', suffix: 'VNĐ' });

  dateInput1: Date;
  dateInput2: Date;

  constructor(
    private customerService: CustomerService,
    private filterService: FilterService,
    private messageService: NzMessageService,
    private promotionPolicyService: PromotionPolicyService,
    private translateService: TranslateService,
    private userLevelService: UserLevelService,
  ) { }

  async loadConditions() {
    if (this.promoCodeObject && this.promoCodeObject.conditions) {
      for (const condition of Object.keys(this.promoCodeObject.conditions)) {
        this.conditions = { ...this.conditions, [condition]: {} };
        await this.getConditionValue(condition);
      }
    }

  }

  async getConditionValue(key) {
    switch (key) {
      case 'userId':
        for (const userId of this.promoCodeObject.conditions[key].value) {
          if (!this.conditionOutputData[key] || !this.conditionOutputData[key].hasOwnProperty(userId) || this.conditionOutputData[key][userId].exist !== true) {
            const response = await this.customerService.getCustomer(userId);
            this.conditionOutputData = {
              ...this.conditionOutputData,
              [key]: {
                ...this.conditionOutputData[key],
                [userId]: { value: response._id, name: response.code, exist: true, }
              }
            };
          }
        }
        for (const userId in this.conditionOutputData[key]) {
          if (this.conditionOutputData[key].hasOwnProperty(userId)) {
            if (this.conditionOutputData[key][userId].exist !== true) {
              delete this.conditionOutputData[key][userId];
            }
          }
        }
        break;
      case 'userLevelId':
      case 'orderType':
      case 'service':
      case 'paymentMethod':
        if (this.promoCodeObject.conditions[key].value) {
          this.promoCodeObject.conditions[key].value.forEach(value => {
            if (this.conditionInputData[`${key}Query`][value]) {
              this.conditionOutputData = {
                ...this.conditionOutputData,
                [key]: {
                  ...this.conditionOutputData[key],
                  [value]: { ...this.conditionInputData[`${key}Query`][value] }
                }
              };
            }
          });
        }
        break;
      case 'location':
        if (this.promoCodeObject.conditions.location.value) {
          for (const value of Object.keys(this.promoCodeObject.conditions.location.value)) {
            if (this.conditionInputData.location.cityQuery[value]) {
              this.conditionOutputData = {
                ...this.conditionOutputData,
                location: {
                  ...this.conditionOutputData.location,
                  [value]: { ...this.conditionInputData.location.cityQuery[value], value: {} }
                }
              };

              if (this.promoCodeObject.conditions.location.value[value].length) {
                for (const districtId of this.promoCodeObject.conditions.location.value[value]) {
                  if (!this.conditionInputData.location.districtQuery || !this.conditionInputData.location.districtQuery[districtId]) {
                    await this.loadDistricts(value);

                  }
                  this.conditionOutputData = {
                    ...this.conditionOutputData,
                    location: {
                      ...this.conditionOutputData.location,
                      [value]: {
                        ...this.conditionOutputData.location[value],
                        value: {
                          ...this.conditionOutputData.location[value].value,
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
        this.conditionOutputData = {
          ...this.conditionOutputData,
          [key]: {
            startTime: moment().utc().startOf('day').add(parseInt(this.promoCodeObject.conditions.dayPeriod.value[0]), 'ms').valueOf(),
            endTime: moment().utc().startOf('day').add(parseInt(this.promoCodeObject.conditions.dayPeriod.value[1]), 'ms').valueOf()
          }
        };
        break;
      default:
        this.conditionOutputData = {
          ...this.conditionOutputData,
          [key]: {
            ...this.promoCodeObject.conditions[key]
          }
        };
    }
  }


  loadModifyingData() {
    this.model = this.promoCodeObject;
    if (this.promoCodeObject.effectedAt) {
      this.dateInput1 = new Date(this.promoCodeObject.effectedAt);
    }
    if (this.promoCodeObject.expiredAt) {
      this.dateInput2 = new Date(this.promoCodeObject.expiredAt);
    }


    if (this.promoCodeObject && this.promoCodeObject.image) {
      this.avatar = [{ url: this.promoCodeObject.image, status: 'done', uid: 1 }];
    }
    this.loadConditions();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.promoCodeObject &&
      changes.promoCodeObject.currentValue &&
      changes.promoCodeObject.previousValue &&
      changes.promoCodeObject.currentValue._id !== changes.promoCodeObject.previousValue._id) {
      this.conditionOutputData = {};
    }
    if (changes.visible && changes.visible.currentValue) {
      if (this.loadDataFirst) {
        this.loadDataFirst = false;
        await this.loadData();
        this.dateInput1 = new Date(this.duration.effectedAt);
        this.dateInput2 = new Date(this.duration.expiredAt);
        this.modalType = 'create';
      }
      if (this.promoCodeObject._id) {
        this.modalType = 'modify';
        this.loadModifyingData();
      }
    }
  }

  async loadData() {
    this.getDataVariable = await this.userLevelService.getUserLevels(this.queryModel);
    this.conditionInputData = {
      ...this.conditionInputData,
      userLevelId: this.getDataVariable.data,
      userLevelIdQuery: _.mapKeys(this.getDataVariable.data, '_id')
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
    this.conditionInputData = { ...this.conditionInputData, location };
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

  parseNumberData(data: any[]) {
    return data.map(v => parseInt(v));
  }

  dataProcessing() {
    this.model.conditions = new Condition();
    if (this.conditionOutputData.hasOwnProperty('userId')) {
      const value = [];
      const data = this.conditionOutputData['userId'];
      for (const item in data) {
        if (data.hasOwnProperty(item)) {
          value.push(data[item].value);
        }
      }
      this.model.conditions = { ...this.model.conditions, userId: { operator: Operator.IN, value: [...value] } };
    }
    if (this.conditionOutputData.hasOwnProperty('userLevelId')) {
      this.model.conditions = { ...this.model.conditions, userLevelId: { operator: Operator.IN, value: Object.keys(this.conditionOutputData.userLevelId) } };
    }
    if (this.conditionOutputData.hasOwnProperty('orderType')) {
      this.model.conditions = { ...this.model.conditions, orderType: { operator: Operator.IN, value: Object.keys(this.conditionOutputData.orderType) } };
    }
    if (this.conditionOutputData.hasOwnProperty('createdAt')) {
      let data = this.conditionOutputData['createdAt'];
      if (!data.operator) {
        data = { ...data, operator: '' };
      }
      if (!data.value) {
        data = { ...data, value: [] };
      }
      this.model.conditions = { ...this.model.conditions, createdAt: { operator: data.operator, value: this.parseNumberData(data.value) } };
    }
    if (this.conditionOutputData.hasOwnProperty('dayPeriod')) {
      const data = this.conditionOutputData['dayPeriod'];
      data.startTime = moment(parseInt(data.startTime)).utc().valueOf() - moment().utc().startOf('day').valueOf();
      data.endTime = moment(parseInt(data.endTime)).utc().valueOf() - moment().utc().startOf('day').valueOf();
      this.model.conditions = { ...this.model.conditions, dayPeriod: { operator: Operator.BETWEEN, value: this.parseNumberData([data.startTime, data.endTime]) } };
    }
    if (this.conditionOutputData.hasOwnProperty('location')) {
      let locationValue = {};
      const data = this.conditionOutputData['location'];
      for (const cityId in data) {
        if (data.hasOwnProperty(cityId)) {
          locationValue = { ...locationValue, [cityId]: Object.keys(data[cityId].value) };
        }
      }
      this.model.conditions = { ...this.model.conditions, location: { value: { ...locationValue } } };
    }
    if (this.conditionOutputData.hasOwnProperty('service')) {
      this.model.conditions = { ...this.model.conditions, service: { operator: Operator.CONTAIN, value: Object.keys(this.conditionOutputData.service) } };
    }
    if (this.conditionOutputData.hasOwnProperty('paymentMethod')) {
      this.model.conditions = { ...this.model.conditions, paymentMethod: { operator: Operator.IN, value: Object.keys(this.conditionOutputData.paymentMethod) } };
    }
    if (this.conditionOutputData.hasOwnProperty('baseUserCost')) {
      let data = this.conditionOutputData['baseUserCost'];
      if (!data.value) {
        data = { ...data, value: [] };
      }
      if (!data.operator) {
        data = { ...data, operator: '' };
      }
      this.model.conditions = { ...this.model.conditions, baseUserCost: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
    }
    if (this.conditionOutputData.hasOwnProperty('limitedQuantityByDayAndUser')) {
      const data = this.conditionOutputData['limitedQuantityByDayAndUser'];
      this.model.conditions = { ...this.model.conditions, limitedQuantityByDayAndUser: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
    }

    if (this.conditionOutputData.hasOwnProperty('limitedQuantityByWeekAndUser')) {
      const data = this.conditionOutputData['limitedQuantityByWeekAndUser'];
      this.model.conditions = { ...this.model.conditions, limitedQuantityByWeekAndUser: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
    }

    if (this.conditionOutputData.hasOwnProperty('limitedQuantityByMonthAndUser')) {
      const data = this.conditionOutputData['limitedQuantityByMonthAndUser'];
      this.model.conditions = { ...this.model.conditions, limitedQuantityByMonthAndUser: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
    }

    if (this.conditionOutputData.hasOwnProperty('limitedQuantityByUser')) {
      const data = this.conditionOutputData['limitedQuantityByUser'];
      this.model.conditions = { ...this.model.conditions, limitedQuantityByUser: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
    }

    if (this.conditionOutputData.hasOwnProperty('limitedQuantityByDay')) {
      const data = this.conditionOutputData['limitedQuantityByDay'];
      this.model.conditions = { ...this.model.conditions, limitedQuantityByDay: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
    }

    if (this.conditionOutputData.hasOwnProperty('limitedQuantityByWeek')) {
      const data = this.conditionOutputData['limitedQuantityByWeek'];
      this.model.conditions = { ...this.model.conditions, limitedQuantityByWeek: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
    }

    if (this.conditionOutputData.hasOwnProperty('limitedQuantityByMonth')) {
      const data = this.conditionOutputData['limitedQuantityByMonth'];
      this.model.conditions = { ...this.model.conditions, limitedQuantityByMonth: { operator: data.operator, value: this.parseNumberData([...data.value]) } };
    }
    if (!this.model.effectedAt && this.duration && this.duration.effectedAt) {
      this.model.effectedAt = moment(this.duration.effectedAt).startOf('day').valueOf();
    }
    if (!this.model.expiredAt && this.duration && this.duration.expiredAt) {
      this.model.expiredAt = moment(this.duration.expiredAt).endOf('day').valueOf();
    }

    this.model.policyId = this.policyId;
    this.modelToSend = new PromotionCodeModel(this.model);
    this.modelToSend.code = this.modelToSend.code.toUpperCase();
    if (this.modelToSend.discType === 'amount') {
      this.modelToSend.discPercent = 0;
      this.modelToSend.discMaximumAmount = 0;
      this.modelToSend.discSamePrice = 0;
      this.modelToSend.discAmount = CommonHelper.parseS2N(this.modelToSend.discAmount);
    } else if (this.modelToSend.discType === 'percent') {
      this.modelToSend.discAmount = 0;
      this.modelToSend.discSamePrice = 0;
      this.modelToSend.discPercent = CommonHelper.parseS2N(this.modelToSend.discPercent);
      this.modelToSend.discMaximumAmount = CommonHelper.parseS2N(this.modelToSend.discMaximumAmount);
    } else if (this.modelToSend.discType === 'samePrice') {
      this.modelToSend.discAmount = 0;
      this.modelToSend.discPercent = 0;
      this.modelToSend.discMaximumAmount = 0;
      this.modelToSend.discSamePrice = CommonHelper.parseS2N(this.modelToSend.discSamePrice);
    }
  }

  checkImageValid() {
    if (!this.model.image || _.isEmpty(this.model.image)) {
      return false;
    }
    return true;
  }

  checkDiscountValid() {
    if (this.model.discType === 'amount' && this.model.discAmount <= 0) {
      this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.invalid-discAmount'));
      return false;
    } else if (this.model.discType === 'percent') {
      if (this.model.discPercent <= 0 || this.model.discPercent > 100) {
        this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.invalid-discPercent'));
        return false;
      }
      if (this.model.discMaximumAmount < 0) {
        this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.invalid-discMaximumAmount'));
        return false;
      }
    } else if (this.model.discType === 'samePrice') {
      if (this.model.discSamePrice <= 0) {
        this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.invalid-discSamePrice'));
        return false;
      }
    }
    return true;
  }

  async onConfirmModal() {
    if (this.createPromoCodeForm.valid) {
      if (!this.checkImageValid()) {
        this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.image.missing'));
        CommonHelper.validateForm(this.createPromoCodeForm);
      } else if (!this.checkDiscountValid()) {
        CommonHelper.validateForm(this.createPromoCodeForm);
      } else {
        this.loading = true;
        this.dataProcessing();
        let response;
        if (!this.model._id) {
          response = await this.promotionPolicyService.createPromotionCode(this.modelToSend);
        } else {
          response = await this.promotionPolicyService.updatePromotionCode(this.modelToSend);
        }
        this.loading = false;
        if (response.errorCode === 0) {
          this.messageService.success(this.translateService.instant(`marketing.promotion-policy-warning.${this.modalType === 'create' ? 'created' : 'modified'}.success`));
          this.handleAfterCreated.emit();
          this.reset();
          this.handleVisibleModal(false);
        } else {
          this.messageService.error(CommonHelper.errorMessage(response, `Có lỗi khi ${this.model._id ? 'cập nhật' : 'thêm'} mã khuyến mãi`));
        }
      }
    } else {
      this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.invalid-data'));
      CommonHelper.validateForm(this.createPromoCodeForm);
    }
  }

  onCancelModal() {
    this.reset();
    this.handleVisibleModal(false);
  }

  handleVisibleModal(flag?) {
    this.handleVisible.emit(!!flag);
  }

  updateContentImg($event) {
    if ($event.length > 0) {
      this.model.image = $event[0];
    } else {
      this.model.image = null;
    }
  }

  addOneCondition(item: string) {
    if (!item) {
      this.messageService.warning(this.translateService.instant('marketing.promotion-policy-warning.notChosen-condition'));
      return;
    }
    if (!this.conditions[item]) {
      this.conditions = { ...this.conditions, [item]: {} };
      if (item === 'location') {
        this.conditionOutputData = { ...this.conditionOutputData, [item]: [] };
      } else {
        this.conditionOutputData = { ...this.conditionOutputData, [item]: {} };
      }
    }
    this.selectedCondition = null;
  }

  addAllCondition() {
    this.conditionList.forEach(item => {
      this.addOneCondition(item);
    });
  }

  removeCondition(item) {
    if (item && this.conditions[item]) {
      delete this.conditions[item];
      delete this.conditionOutputData[item];
      this.conditions = { ...this.conditions };
      this.conditionOutputData = { ...this.conditionOutputData };
    }
  }

  async onAddingConditionChildren({ type, currentValue, conditionName, value }) {
    this.conditionOutputData = { ...this.conditionOutputData, [conditionName]: { ...value } };

    if (type && type === 'city') {
      await this.loadDistricts(currentValue._id);
    }
  }

  adjustDate(date, hh, mm, ss, ml) {
    date.setHours(hh);
    date.setMinutes(mm);
    date.setSeconds(ss);
    date.setMilliseconds(ml);
  }

  changeAffectedDate($event) {
    if (Number(moment($event).format('x')) < this.duration.effectedAt) {
      this.messageService.warning(this.translateService.instant('validations-form.effectedAt.promotion-invalid'));
      this.dateInput1 = this.modalType === 'create' ? new Date(this.duration.effectedAt) : new Date(this.model.effectedAt);
      return;
    }
    if (Number(moment($event).format('x')) > Number(moment(this.dateInput2).format('x'))) {
      this.messageService.warning(this.translateService.instant('validations-form.effectedAt.invalidRange'));
      this.dateInput1 = this.dateInput2;
    }
    const date = new Date(this.dateInput1);
    this.adjustDate(date, 0, 0, 0, 0);
    this.model.effectedAt = Number(moment(date).format('x'));
  }

  changeExpiredDate($event) {
    if (Number(moment($event).format('x')) > this.duration.expiredAt) {
      this.messageService.warning(this.translateService.instant('validations-form.expiredAt.promotion-invalid'));
      this.dateInput2 = this.modalType === 'create' ? new Date(this.duration.expiredAt) : new Date(this.model.expiredAt);
      return;
    }
    if (Number(moment($event).format('x')) < Number(moment(this.dateInput1).format('x'))) {
      this.messageService.warning(this.translateService.instant('validations-form.effectedAt.invalidRange'));
      this.dateInput2 = this.dateInput1;
    }
    const date = new Date(this.dateInput2);
    this.adjustDate(date, 23, 59, 59, 999);
    this.model.expiredAt = Number(moment(date).format('x'));
  }

  reset() {
    this.avatar = [];
    this.conditions = {};
    this.conditionOutputData = {};
    this.model = new PromotionCodeModel();
    this.promoCodeObject = new PromotionCodeModel();
    this.queryModel = new QueryModel();
    this.selectedCondition = null;
    this.dateInput1 = new Date(this.duration.effectedAt);
    this.dateInput2 = new Date(this.duration.expiredAt);
    CommonHelper.resetForm(this.createPromoCodeForm);
  }
}
