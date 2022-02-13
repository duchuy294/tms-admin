import * as _ from 'lodash';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CONDITION } from '@/constants/Condition';
import { ConditionSet, PromotionPolicyControllerModel } from '@/modules/marketing/models/promotion-policy-controller';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PriceFormModel } from '@/modules/price/models/price-form.model';
import { PriceFormService } from '@/modules/price/services/price-form.service';
import { PromotionCodeModel } from 'app/modules/marketing/models/promotion-code';
import { PromotionPolicyModel } from '@/modules/marketing/models/promotion-policy';
import { PromotionPolicyQueryModel } from '@/modules/marketing/models/promotion-policy-query.model';
import { PromotionPolicyService } from '@/modules/marketing/services/promotion-policy.service';
import { QueryModel } from '@/models/query.model';
import { Status } from 'app/constants/status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'detailed-policy',
  templateUrl: './detailed-policy.component.html',
  styleUrls: ['./detailed-policy.component.less']
})
export class DetailedPolicyComponent implements OnInit {
  selectedTabIndex: number = 0;
  visibleModal: boolean = false;
  visiblePromoCodeModal: boolean = false;
  visibleAddConditionsModal: boolean = false;

  priceFormConditionOptions = [...CONDITION.priceForm];
  customerTopUpConditionOptions = [...CONDITION.customerTopUp];
  bonusForCustomerConditionOptions = [...CONDITION.bonusForCustomer];
  partnerTopUpConditionOptions = [...CONDITION.partnerTopUp];
  bonusForPartnerConditionOptions = [...CONDITION.bonusForPartnerBasedOnOrder];
  conditionOptionsForAddConditionModal = [];
  addConditionsTracking: any = {};

  userTopUpWalletType: string = 'main';
  userPromotionWalletType: string = 'main';
  servicerTopUpWalletType: string = 'main';
  servicerPromotionWalletType: string = 'main';
  walletTypeMap = {
    'deposit': 'TopUp',
    'promotion': 'Promotion'
  };
  userTypeMap = {
    'user': 'byCustomer',
    'servicer': 'byServicer'
  };

  currentConditionSet: ConditionSet = new ConditionSet();
  currentKey: string = null;
  promotionPolicyController = new PromotionPolicyControllerModel();

  query = new PromotionPolicyQueryModel();
  policyId: string = '';
  promoCodeQuery: QueryModel;
  data = new PromotionPolicyModel();
  status = [Status.NEW, Status.ACTIVE, Status.SUSPENDED];
  loading: boolean = false;
  currentPromoCode = new PromotionCodeModel();
  userTopUpRadioValue: string = 'byCustomerTopUpAmount';
  userPromotionRadioValue: string = 'byCustomerPromotionAmount';
  servicerTopUpRadioValue: string = 'byServicerTopUpAmount';
  servicerPromotionRadioValue: string = 'byServicerPromotionAmount';

  priceForm: PriceFormModel[] = [];
  promoCodeList = [];

  percentageMask = createNumberMask({ prefix: '' });
  currencyMask = createNumberMask({ prefix: '' });

  constructor(
    private activeRoute: ActivatedRoute,
    private messageService: NzMessageService,
    private promotionPolicyService: PromotionPolicyService,
    private priceFormService: PriceFormService,
    private translateService: TranslateService,
    private router: Router,
    private modalService: NzModalService
  ) {
    this.activeRoute.params.subscribe(params => {
      if (params.id) {
        this.policyId = params.id;
        (async () => {
          await this.loadData();
        })();
      }
    });
  }

  async loadData() {
    this.data = await this.promotionPolicyService.getPromotionPolicy(this.policyId, this.query);
    const getCodeResponse = await this.promotionPolicyService.getPromotionCodes(this.promoCodeQuery);
    this.promoCodeList = getCodeResponse.data;
    this.loadPriceForm();
    if (this.data.priceForms.length || this.data.deposits.length || this.data.promotions.length) {
      await this.prepareEditData();
    }
  }

  async prepareEditData() {
    this.promotionPolicyController = new PromotionPolicyControllerModel();
    if (this.data.priceForms.length) {
      this.data.priceForms.forEach(priceFormItem => {
        this.promotionPolicyController.priceForms = {
          ...this.promotionPolicyController.priceForms,
          [_.uniqueId('priceForm')]: this.getConditionSetFromData(priceFormItem),
        };
      });

    }

    if (this.data.promotions.length) {
      this.promotionPolicyController.promotions = {};
      this.data.promotions.forEach(promotionItem => {
        if (promotionItem.amount) {
          this.promotionPolicyController.promotions = {
            ...this.promotionPolicyController.promotions,
            ['amount']: {
              ...this.promotionPolicyController.promotions.amount,
              [_.uniqueId('promotion')]: this.getConditionSetFromData(promotionItem)
            }
          };
        } else if (promotionItem.percent) {
          this.promotionPolicyController.promotions = {
            ...this.promotionPolicyController.promotions,
            ['percent']: {
              ...this.promotionPolicyController.promotions.percent,
              [_.uniqueId('promotion')]: this.getConditionSetFromData(promotionItem)
            }
          };
        }
        this[`${promotionItem.userType}PromotionRadioValue`] = `${this.userTypeMap[promotionItem.userType]}Promotion${promotionItem.amount ? 'Amount' : 'Percent'}`;
      });

    }

    if (this.data.deposits.length) {
      this.promotionPolicyController.deposits = {};
      this.data.deposits.forEach(promotionItem => {
        if (promotionItem.amount) {
          this.promotionPolicyController.deposits = {
            ...this.promotionPolicyController.deposits,
            ['amount']: {
              ...this.promotionPolicyController.deposits.amount,
              [_.uniqueId('deposit')]: this.getConditionSetFromData(promotionItem)
            }
          };
        } else if (promotionItem.percent) {
          this.promotionPolicyController.deposits = {
            ...this.promotionPolicyController.deposits,
            ['percent']: {
              ...this.promotionPolicyController.deposits.percent,
              [_.uniqueId('deposit')]: this.getConditionSetFromData(promotionItem)
            }
          };
        }
        this[`${promotionItem.userType}TopUpRadioValue`] = `${this.userTypeMap[promotionItem.userType]}TopUp${promotionItem.amount ? 'Amount' : 'Percent'}`;
      });
    }
  }

  getConditionSetFromData(promotionItem, walletType = 'deposit') {
    const conditionSet = new ConditionSet();
    conditionSet.name = promotionItem.name;
    if (promotionItem.priceFormId) {
      conditionSet.priceFormId = promotionItem.priceFormId;
    }
    if (promotionItem.percent) {
      conditionSet.percent = promotionItem.percent;
    }
    if (promotionItem.amount) {
      conditionSet.amount = promotionItem.amount;
    }
    if (promotionItem.userType) {
      conditionSet.userType = promotionItem.userType;
    }
    if (promotionItem.userType && promotionItem.receivedBalanceType && this.walletTypeMap[walletType]) {
      this[`${promotionItem.userType}${this.walletTypeMap[walletType]}WalletType`] = promotionItem.receivedBalanceType;
    }
    conditionSet.conditions = { ...promotionItem.conditions };
    return conditionSet;
  }

  async loadPriceForm() {
    const response = await this.priceFormService.filter(new QueryModel({ limit: 1000 }));
    this.priceForm = response.data;
  }

  onClickUpdatePromoCode(promoCode) {
    this.currentPromoCode = { ...promoCode };
    this.handleVisiblePromoCodeModal();
  }

  async handleAfterCreatePromoCode() {
    await this.loadData();
  }

  async handleAfterUpdatePromoCode() {
    await this.loadData();
  }

  async ngOnInit() {
    this.promoCodeQuery = new QueryModel({ limit: 1000, policyId: this.policyId });

  }

  handleCreatePromotionCode() {
    this.currentPromoCode = new PromotionCodeModel();
    this.handleVisiblePromoCodeModal();
  }

  handleAddConditions(userType: string, numberType: string, walletType: string, actionType: string, conditionOptions) {
    this.conditionOptionsForAddConditionModal = [...conditionOptions];
    this.currentConditionSet = new ConditionSet();
    this.currentKey = null;
    this.handleVisibleAddConditionsModal();
    if (this.visibleAddConditionsModal) {
      this.addConditionsTracking = {
        userType,
        numberType,
        walletType,
        actionType
      };
    }
  }

  handleEditConditions(item, conditionOptions?, actionType?, numberType?, userType?) {
    this.conditionOptionsForAddConditionModal = [...conditionOptions];
    this.handleVisibleAddConditionsModal();
    if (this.visibleAddConditionsModal) {
      this.addConditionsTracking = {
        userType,
        numberType,
        actionType
      };
    }
    this.currentConditionSet = _.cloneDeep(item.value);
    this.currentKey = item.key;
  }

  onClickModify() {
    this.handleVisibleModal();
  }

  async onClickUpdatePromotionPolicy() {
    this.data.priceForms = [];
    this.data.deposits = [];
    this.data.promotions = [];
    let checkInputDataInvalid = false;
    if (this.promotionPolicyController.priceForms) {
      const { priceForms } = this.promotionPolicyController;
      for (const key in priceForms) {
        if (priceForms.hasOwnProperty(key)) {
          if (typeof priceForms[key].priceFormId !== 'undefined') {
            const item = {
              name: priceForms[key].name,
              priceFormId: priceForms[key].priceFormId,
              conditions: {
                ...priceForms[key].conditions
              }
            };
            this.data.priceForms.push(item);
          } else {
            checkInputDataInvalid = true;
          }
        }
      }
    }

    for (const actionType of [{ action: 'deposit', actionName: 'TopUp' }, { action: 'promotion', actionName: 'Promotion' }]) {
      const { action, actionName } = actionType;
      if (this.promotionPolicyController[`${action}s`]) {
        for (const userType of [{ user: 'user', userName: 'Customer' }, { user: 'servicer', userName: 'Servicer' }]) {
          const { user, userName } = userType;
          for (const numberType of [{ type: 'amount', name: 'Amount' }, { type: 'percent', name: 'Percent' }]) {
            const { type, name } = numberType;
            if (this.promotionPolicyController[`${action}s`][type] && this[`${user}${actionName}RadioValue`] === `by${userName}${actionName}${name}`) {
              for (const key in this.promotionPolicyController[`${action}s`][type]) {
                if (this.promotionPolicyController[`${action}s`][type].hasOwnProperty(key) && this.promotionPolicyController[`${action}s`][type][key].userType === user) {
                  const data = this.promotionPolicyController[`${action}s`][type][key];
                  if (typeof data[type] !== 'undefined') {
                    const item = {
                      name: data.name,
                      userType: user,
                      [type]: data[type],
                      receivedBalanceType: this[`${user}${actionName}WalletType`],
                      conditions: {
                        ...data.conditions
                      }
                    };
                    this.data[`${action}s`].push(item);
                  } else {
                    checkInputDataInvalid = true;
                  }

                }
              }
            }
          }
        }
      }
    }

    if (checkInputDataInvalid) {
      this.modalService.confirm({
        nzTitle: '<i>Thông báo dữ liệu không hợp lệ?</i>',
        nzContent: `Một số trường thiếu thông tin dữ liệu, <br/>
      - Không chọn bảng giá<br/>
      - Không nhập giá trị số lượng cho điều kiện tương ứng<br/>
      Bấm <b>'tiếp tục'</b> nếu bạn vẫn muốn lưu dữ liệu, các trường không hợp lệ sẽ được bỏ qua`,
        nzOkText: this.translateService.instant('actions.continue'),
        nzOnOk: () => {
          this.onUpdatePolicy();
        },
        nzCancelText: this.translateService.instant('actions.close'),
      });
    } else {
      await this.onUpdatePolicy();
    }
  }

  async onUpdatePolicy() {
    const response = await this.promotionPolicyService.updatePromotionPolicy(this.data);
    if (!response.errorCode) {
      this.messageService.success(this.translateService.instant('marketing.promotion-policy.success-update'));
      this.router.navigate(['/pages/marketing/promotion-policy']);
    } else {
      this.messageService.error(response.message);
    }
  }

  handleVisibleModal(flag = true) {
    this.visibleModal = flag;
  }

  handleVisiblePromoCodeModal(flag = true) {
    this.visiblePromoCodeModal = !!flag;
  }

  handleVisibleAddConditionsModal(flag = true) {
    this.visibleAddConditionsModal = !!flag;
  }

  handleAfterModified() {
    this.loadData();
  }

  addOneConditionSet(conditionSet: ConditionSet) {
    const { actionType, numberType, userType } = this.addConditionsTracking;
    conditionSet.userType = userType;
    switch (actionType) {
      case 'priceForm':
        if (!this.promotionPolicyController.hasOwnProperty(`${actionType}s`)) {
          this.promotionPolicyController[`${actionType}s`] = {};
        }
        this.promotionPolicyController[`${actionType}s`] = {
          ...this.promotionPolicyController[`${actionType}s`],
          [this.currentKey || _.uniqueId(actionType)]: conditionSet,
        };
        break;
      default:
        if (!this.promotionPolicyController.hasOwnProperty(`${actionType}s`)) {
          this.promotionPolicyController[`${actionType}s`] = {};
        }
        if (!this.promotionPolicyController[`${actionType}s`].hasOwnProperty(numberType)) {
          this.promotionPolicyController[`${actionType}s`][numberType] = {};
        }
        this.promotionPolicyController[`${actionType}s`][numberType] = {
          ...this.promotionPolicyController[`${actionType}s`][numberType],
          [this.currentKey || _.uniqueId(actionType)]: conditionSet,
        };
    }
  }

  removeOneConditionSet(id, actionType, numberType) {
    switch (actionType) {
      case 'priceForm':
        delete this.promotionPolicyController[`${actionType}s`][id];
        this.promotionPolicyController[`${actionType}s`] = { ...this.promotionPolicyController[`${actionType}s`] };
        break;
      default:
        delete this.promotionPolicyController[`${actionType}s`][numberType][id];
        this.promotionPolicyController[`${actionType}s`][numberType] = { ...this.promotionPolicyController[`${actionType}s`][numberType] };
    }
  }
}
